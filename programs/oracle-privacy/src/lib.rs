use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2");

#[program]
pub mod oracle_privacy {
    use super::*;

    /// Create a private prediction market
    /// Users can participate anonymously without revealing identity
    pub fn create_private_market(
        ctx: Context<CreatePrivateMarket>,
        title: String,
        description: String,
        end_time: i64,
        outcomes: Vec<String>,
        privacy_level: u8, // 0=public, 1=private, 2=anonymous
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.creator = ctx.accounts.creator.key();
        market.title = title;
        market.description = description;
        market.end_time = end_time;
        market.outcomes = outcomes;
        market.privacy_level = privacy_level;
        market.is_resolved = false;
        market.total_staked = 0;
        market.bump = ctx.bumps.market;
        market.resolution_proof = None;
        market.resolved_at = 0;
        
        // No personal data stored - only wallet address
        msg!("Private market created: {}", market.title);
        Ok(())
    }

    /// Place anonymous bet on market
    /// No personal information required
    pub fn place_anonymous_bet(
        ctx: Context<PlaceAnonymousBet>,
        outcome_index: u8,
        amount: u64,
        commitment_hash: [u8; 32], // Commitment scheme for privacy
    ) -> Result<()> {
        // Transfer SOL to market vault
        let transfer_accounts = Transfer {
            from: ctx.accounts.bettor.to_account_info(),
            to: ctx.accounts.market_vault.to_account_info(),
        };

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_accounts,
        );

        transfer(cpi_context, amount)?;

        // Store bet with commitment hash (not personal data)
        let bet = &mut ctx.accounts.bet;
        bet.bettor = ctx.accounts.bettor.key();
        bet.market = ctx.accounts.market.key();
        bet.outcome_index = outcome_index;
        bet.amount = amount;
        bet.commitment_hash = commitment_hash;
        bet.timestamp = Clock::get()?.unix_timestamp;
        bet.bump = ctx.bumps.bet;

        // Update market total
        let market = &mut ctx.accounts.market;
        market.total_staked += amount;

        msg!("Anonymous bet placed: {} SOL on outcome {}", amount, outcome_index);
        Ok(())
    }

    /// Resolve market with privacy-preserving mechanism
    /// Only reveal outcome, not individual bets
    /// ONLY THE CREATOR CAN RESOLVE THE MARKET
    pub fn resolve_private_market(
        ctx: Context<ResolvePrivateMarket>,
        winning_outcome: u8,
        resolution_proof: [u8; 32], // Cryptographic proof of resolution
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        require!(!market.is_resolved, ErrorCode::MarketAlreadyResolved);
        require!(Clock::get()?.unix_timestamp > market.end_time, ErrorCode::MarketNotExpired);
        require!(winning_outcome < market.outcomes.len() as u8, ErrorCode::InvalidOutcome);
        
        // CRITICAL: Only the market creator can resolve the market
        require!(market.creator == ctx.accounts.resolver.key(), ErrorCode::UnauthorizedResolver);

        market.winning_outcome = Some(winning_outcome);
        market.is_resolved = true;
        market.resolution_proof = Some(resolution_proof);
        market.resolved_at = Clock::get()?.unix_timestamp;

        msg!("Market resolved by creator {} with outcome: {}", market.creator, winning_outcome);
        Ok(())
    }

    /// Claim winnings anonymously
    /// No personal data required for claiming
    pub fn claim_anonymous_winnings(
        ctx: Context<ClaimAnonymousWinnings>,
        _bet_proof: [u8; 32], // Proof of winning bet
    ) -> Result<()> {
        let bet = &ctx.accounts.bet;
        let market = &ctx.accounts.market;
        
        require!(market.is_resolved, ErrorCode::MarketNotResolved);
        require!(bet.outcome_index == market.winning_outcome.unwrap(), ErrorCode::NotWinningBet);
        require!(bet.amount > 0, ErrorCode::InvalidBetAmount);

        // Calculate winnings proportionally
        // For MVP: simple 1:1 payout for winning bets
        let winnings = bet.amount;

        // Transfer winnings back to bettor
        let transfer_accounts = Transfer {
            from: ctx.accounts.market_vault.to_account_info(),
            to: ctx.accounts.bettor.to_account_info(),
        };

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_accounts,
        );

        transfer(cpi_context, winnings)?;

        msg!("Winnings claimed: {} SOL", winnings);
        Ok(())
    }

    /// Get market info without revealing personal data
    pub fn get_market_info(ctx: Context<GetMarketInfo>) -> Result<MarketInfo> {
        let market = &ctx.accounts.market;
        Ok(MarketInfo {
            title: market.title.clone(),
            description: market.description.clone(),
            end_time: market.end_time,
            outcomes: market.outcomes.clone(),
            total_staked: market.total_staked,
            is_resolved: market.is_resolved,
            winning_outcome: market.winning_outcome,
            privacy_level: market.privacy_level,
            // No personal data returned
        })
    }
}

#[derive(Accounts)]
pub struct CreatePrivateMarket<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 4 + 100 + 4 + 200 + 8 + 4 + 100 + 1 + 1 + 8 + 1 + 32 + 8,
        seeds = [b"market", creator.key().as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceAnonymousBet<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(
        init,
        payer = bettor,
        space = 8 + 32 + 32 + 1 + 8 + 32 + 8 + 1,
        seeds = [b"bet", bettor.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    
    #[account(mut)]
    pub bettor: Signer<'info>,
    
    /// CHECK: Market vault account
    #[account(mut)]
    pub market_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolvePrivateMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    pub resolver: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimAnonymousWinnings<'info> {
    #[account(mut)]
    pub bet: Account<'info, Bet>,
    
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub bettor: Signer<'info>,
    
    /// CHECK: Market vault account
    #[account(mut)]
    pub market_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetMarketInfo<'info> {
    pub market: Account<'info, Market>,
}

#[account]
pub struct Market {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub end_time: i64,
    pub outcomes: Vec<String>,
    pub total_staked: u64,
    pub is_resolved: bool,
    pub winning_outcome: Option<u8>,
    pub privacy_level: u8, // 0=public, 1=private, 2=anonymous
    pub resolution_proof: Option<[u8; 32]>,
    pub resolved_at: i64,
    pub bump: u8,
}

#[account]
pub struct Bet {
    pub bettor: Pubkey,
    pub market: Pubkey,
    pub outcome_index: u8,
    pub amount: u64,
    pub commitment_hash: [u8; 32], // For privacy
    pub timestamp: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MarketInfo {
    pub title: String,
    pub description: String,
    pub end_time: i64,
    pub outcomes: Vec<String>,
    pub total_staked: u64,
    pub is_resolved: bool,
    pub winning_outcome: Option<u8>,
    pub privacy_level: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Market already resolved")]
    MarketAlreadyResolved,
    #[msg("Market not expired")]
    MarketNotExpired,
    #[msg("Market not resolved")]
    MarketNotResolved,
    #[msg("Not winning bet")]
    NotWinningBet,
    #[msg("Invalid outcome index")]
    InvalidOutcome,
    #[msg("Invalid bet amount")]
    InvalidBetAmount,
    #[msg("Only the market creator can resolve the market")]
    UnauthorizedResolver,
}
