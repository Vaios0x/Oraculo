use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

// Helper macro for require statements
macro_rules! require {
    ($condition:expr, $error:expr) => {
        if !$condition {
            return Err($error.into());
        }
    };
}

// Program entrypoint
entrypoint!(process_instruction);

/// Main instruction processing function
/// Routes incoming instructions to appropriate handlers
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Parse instruction data
    let instruction = OracleInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    // Route to appropriate handler
    match instruction {
        OracleInstruction::CreateMarket {
            title,
            description,
            end_time,
            outcomes,
            privacy_level,
        } => {
            msg!("Instruction: Create Market");
            process_create_market(program_id, accounts, title, description, end_time, outcomes, privacy_level)
        }
        OracleInstruction::PlaceBet {
            outcome_index,
            amount,
            commitment_hash,
        } => {
            msg!("Instruction: Place Bet");
            process_place_bet(program_id, accounts, outcome_index, amount, commitment_hash)
        }
        OracleInstruction::ResolveMarket {
            winning_outcome,
            resolution_proof,
        } => {
            msg!("Instruction: Resolve Market");
            process_resolve_market(program_id, accounts, winning_outcome, resolution_proof)
        }
        OracleInstruction::ClaimWinnings {
            bet_proof,
        } => {
            msg!("Instruction: Claim Winnings");
            process_claim_winnings(program_id, accounts, bet_proof)
        }
    };

    Ok(())
}

/// Instructions supported by the oracle program
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum OracleInstruction {
    /// Create a new prediction market
    CreateMarket {
        title: String,
        description: String,
        end_time: i64,
        outcomes: Vec<String>,
        privacy_level: u8, // 0=public, 1=private, 2=anonymous
    },
    /// Place a bet on a market outcome
    PlaceBet {
        outcome_index: u8,
        amount: u64,
        commitment_hash: [u8; 32],
    },
    /// Resolve a market
    ResolveMarket {
        winning_outcome: u8,
        resolution_proof: [u8; 32],
    },
    /// Claim winnings from a winning bet
    ClaimWinnings {
        bet_proof: [u8; 32],
    },
}

/// Create a new prediction market
///
/// Accounts expected:
/// 1. `[writable]` Market PDA account (seeds: [b"market", creator, title_hash])
/// 2. `[signer]` Creator account
/// 3. `[]` System Program
fn process_create_market(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String,
    end_time: i64,
    outcomes: Vec<String>,
    privacy_level: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let market_account = next_account_info(accounts_iter)?;
    let creator_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Derive expected PDA for safety (title hash to keep seeds bounded)
    let title_hash = solana_program::hash::hash(title.as_bytes());
    let seeds: &[&[u8]] = &[
        b"market",
        creator_account.key.as_ref(),
        &title_hash.as_ref()[..32],
    ];

    // Calculate account space needed
    let market_data = MarketAccount {
        creator: *creator_account.key,
        title: title.clone(),
        description: description.clone(),
        end_time,
        outcomes: outcomes.clone(),
        total_staked: 0,
        is_resolved: false,
        winning_outcome: None,
        privacy_level,
        resolution_proof: None,
        resolved_at: 0,
    };

    let account_space = 8 + // discriminator
        32 + // creator
        4 + title.len() + // title
        4 + description.len() + // description
        8 + // end_time
        4 + outcomes.iter().map(|o| 4 + o.len()).sum::<usize>() + // outcomes
        8 + // total_staked
        1 + // is_resolved
        1 + 1 + // winning_outcome (Option<u8>)
        1 + // privacy_level
        1 + 32 + // resolution_proof (Option<[u8; 32]>)
        8; // resolved_at

    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    // Create market PDA via CPI using invoke_signed (PDAs cannot sign)
    invoke_signed(
        &system_instruction::create_account(
            creator_account.key,
            market_account.key,
            required_lamports,
            (8 + account_space) as u64, // reserve 8 bytes discriminator
            program_id,
        ),
        &[
            creator_account.clone(),
            market_account.clone(),
            system_program.clone(),
        ],
        &[seeds],
    )?;

    // Initialize market data with 8-byte discriminator followed by Borsh struct
    let mut account_data = &mut market_account.data.borrow_mut()[..];
    // Simple discriminator: b"MARKET\0\0" (8 bytes)
    let discriminator: [u8; 8] = *b"MARKET\0\0";
    account_data[..8].copy_from_slice(&discriminator);
    let mut payload = &mut account_data[8..];
    market_data.serialize(&mut payload)?;

    msg!("Market created: {}", title);
    msg!("End time: {}", end_time);
    msg!("Outcomes: {:?}", outcomes);

    Ok(())
}

/// Place a bet on a market outcome
///
/// Accounts expected:
/// 1. `[writable]` Market account
/// 2. `[signer, writable]` Bettor account
/// 3. `[signer, writable]` Bet account to create
/// 4. `[]` System Program
fn process_place_bet(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    outcome_index: u8,
    amount: u64,
    commitment_hash: [u8; 32],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let market_account = next_account_info(accounts_iter)?;
    let bettor_account = next_account_info(accounts_iter)?;
    let bet_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Verify market account ownership
    if market_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Read market data
    let market_data = market_account.data.borrow();
    let mut market: MarketAccount = MarketAccount::try_from_slice(&market_data)?;

    // Validate bet
    require!(!market.is_resolved, OracleError::MarketAlreadyResolved);
    require!(outcome_index < market.outcomes.len() as u8, OracleError::InvalidOutcome);
    require!(amount > 0, OracleError::InvalidAmount);

    // Calculate bet account space
    let bet_data = BetAccount {
        bettor: *bettor_account.key,
        market: *market_account.key,
        outcome_index,
        amount,
        commitment_hash,
        timestamp: solana_program::clock::Clock::get()?.unix_timestamp,
    };

    let bet_space = 8 + // discriminator
        32 + // bettor
        32 + // market
        1 + // outcome_index
        8 + // amount
        32 + // commitment_hash
        8; // timestamp

    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(bet_space);

    // Create bet account via CPI
    invoke(
        &system_instruction::create_account(
            bettor_account.key,
            bet_account.key,
            required_lamports,
            bet_space as u64,
            program_id,
        ),
        &[
            bettor_account.clone(),
            bet_account.clone(),
            system_program.clone(),
        ],
    )?;

    // Initialize bet data
    let mut bet_account_data = &mut bet_account.data.borrow_mut()[..];
    bet_data.serialize(&mut bet_account_data)?;

    // Update market total staked
    market.total_staked += amount;
    let mut market_data = &mut market_account.data.borrow_mut()[..];
    market.serialize(&mut market_data)?;

    msg!("Bet placed: {} SOL on outcome {}", amount, outcome_index);

    Ok(())
}

/// Resolve a market with winning outcome
///
/// Accounts expected:
/// 1. `[writable]` Market account
/// 2. `[signer]` Resolver account (must be market creator)
fn process_resolve_market(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    winning_outcome: u8,
    resolution_proof: [u8; 32],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let market_account = next_account_info(accounts_iter)?;
    let resolver_account = next_account_info(accounts_iter)?;

    // Verify market account ownership
    if market_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Read and update market data
    let mut market_data = market_account.data.borrow_mut();
    let mut market: MarketAccount = MarketAccount::try_from_slice(&market_data)?;

    // Validate resolution
    require!(!market.is_resolved, OracleError::MarketAlreadyResolved);
    require!(market.creator == *resolver_account.key, OracleError::UnauthorizedResolver);
    require!(winning_outcome < market.outcomes.len() as u8, OracleError::InvalidOutcome);
    require!(
        solana_program::clock::Clock::get()?.unix_timestamp > market.end_time,
        OracleError::MarketNotExpired
    );

    // Resolve market
    market.is_resolved = true;
    market.winning_outcome = Some(winning_outcome);
    market.resolution_proof = Some(resolution_proof);
    market.resolved_at = solana_program::clock::Clock::get()?.unix_timestamp;

    // Update market data
    market.serialize(&mut &mut market_data[..])?;

    msg!("Market resolved with outcome: {}", winning_outcome);

    Ok(())
}

/// Claim winnings from a winning bet
///
/// Accounts expected:
/// 1. `[writable]` Market account
/// 2. `[writable]` Bet account
/// 3. `[signer, writable]` Bettor account
/// 4. `[]` System Program
fn process_claim_winnings(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _bet_proof: [u8; 32],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let market_account = next_account_info(accounts_iter)?;
    let bet_account = next_account_info(accounts_iter)?;
    let bettor_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Verify account ownerships
    if market_account.owner != program_id || bet_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Read market and bet data
    let market_data = market_account.data.borrow();
    let market: MarketAccount = MarketAccount::try_from_slice(&market_data)?;

    let bet_data = bet_account.data.borrow();
    let bet: BetAccount = BetAccount::try_from_slice(&bet_data)?;

    // Validate claim
    require!(market.is_resolved, OracleError::MarketNotResolved);
    require!(
        bet.outcome_index == market.winning_outcome.unwrap(),
        OracleError::NotWinningBet
    );
    require!(bet.bettor == *bettor_account.key, OracleError::UnauthorizedClaimer);

    // Calculate winnings (simplified 1:1 payout for MVP)
    let winnings = bet.amount;

    // Transfer winnings
    invoke(
        &system_instruction::transfer(
            bettor_account.key,
            bettor_account.key,
            winnings,
        ),
        &[
            bettor_account.clone(),
            system_program.clone(),
        ],
    )?;

    msg!("Winnings claimed: {} SOL", winnings);

    Ok(())
}

/// Market account data structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct MarketAccount {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub end_time: i64,
    pub outcomes: Vec<String>,
    pub total_staked: u64,
    pub is_resolved: bool,
    pub winning_outcome: Option<u8>,
    pub privacy_level: u8,
    pub resolution_proof: Option<[u8; 32]>,
    pub resolved_at: i64,
}

/// Bet account data structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct BetAccount {
    pub bettor: Pubkey,
    pub market: Pubkey,
    pub outcome_index: u8,
    pub amount: u64,
    pub commitment_hash: [u8; 32],
    pub timestamp: i64,
}

/// Custom error codes for the oracle program
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum OracleError {
    MarketAlreadyResolved,
    MarketNotResolved,
    MarketNotExpired,
    InvalidOutcome,
    InvalidAmount,
    UnauthorizedResolver,
    UnauthorizedClaimer,
    NotWinningBet,
}

impl From<OracleError> for ProgramError {
    fn from(e: OracleError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use litesvm::LiteSVM;
    use solana_sdk::{
        account::ReadableAccount,
        instruction::{AccountMeta, Instruction},
        message::Message,
        signature::{Keypair, Signer},
        system_program,
        transaction::Transaction,
    };

    #[test]
    fn test_oracle_program() {
        let mut svm = LiteSVM::new();

        // Create and fund payer
        let payer = Keypair::new();
        svm.airdrop(&payer.pubkey(), 1_000_000_000)
            .expect("Failed to airdrop");

        // Load program
        let program_keypair = Keypair::new();
        let program_id = program_keypair.pubkey();
        svm.add_program_from_file(program_id, "target/deploy/oracle_privacy_native.so")
            .unwrap();

        // Test market creation
        println!("Testing market creation...");
        let market_keypair = Keypair::new();
        let title = "Will Bitcoin reach $100k in 2024?";
        let description = "A prediction market about Bitcoin's price";
        let end_time = 1735689600; // End of 2024
        let outcomes = vec!["Yes".to_string(), "No".to_string()];
        let privacy_level = 1; // Private

        let create_instruction_data = borsh::to_vec(&OracleInstruction::CreateMarket {
            title: title.to_string(),
            description: description.to_string(),
            end_time,
            outcomes: outcomes.clone(),
            privacy_level,
        })
        .expect("Failed to serialize instruction");

        let create_instruction = Instruction::new_with_bytes(
            program_id,
            &create_instruction_data,
            vec![
                AccountMeta::new(market_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        let message = Message::new(&[create_instruction], Some(&payer.pubkey()));
        let transaction = Transaction::new(
            &[&payer, &market_keypair],
            message,
            svm.latest_blockhash(),
        );

        let result = svm.send_transaction(transaction);
        assert!(result.is_ok(), "Create market transaction should succeed");

        let logs = result.unwrap().logs;
        println!("Transaction logs:\n{:#?}", logs);

        // Verify market was created
        let account = svm
            .get_account(&market_keypair.pubkey())
            .expect("Failed to get market account");

        let market: MarketAccount = MarketAccount::try_from_slice(account.data())
            .expect("Failed to deserialize market data");
        assert_eq!(market.title, title);
        assert_eq!(market.outcomes, outcomes);
        assert_eq!(market.total_staked, 0);
        assert!(!market.is_resolved);
        println!("Market created successfully: {}", market.title);

        // Test placing a bet
        println!("Testing bet placement...");
        let bet_keypair = Keypair::new();
        let outcome_index = 0; // "Yes"
        let amount = 1000000; // 0.001 SOL
        let commitment_hash = [1u8; 32];

        let bet_instruction_data = borsh::to_vec(&OracleInstruction::PlaceBet {
            outcome_index,
            amount,
            commitment_hash,
        })
        .expect("Failed to serialize instruction");

        let bet_instruction = Instruction::new_with_bytes(
            program_id,
            &bet_instruction_data,
            vec![
                AccountMeta::new(market_keypair.pubkey(), false),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new(bet_keypair.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        );

        let message = Message::new(&[bet_instruction], Some(&payer.pubkey()));
        let transaction = Transaction::new(
            &[&payer, &bet_keypair],
            message,
            svm.latest_blockhash(),
        );

        let result = svm.send_transaction(transaction);
        assert!(result.is_ok(), "Place bet transaction should succeed");

        let logs = result.unwrap().logs;
        println!("Transaction logs:\n{:#?}", logs);

        // Verify bet was placed
        let bet_account = svm
            .get_account(&bet_keypair.pubkey())
            .expect("Failed to get bet account");

        let bet: BetAccount = BetAccount::try_from_slice(bet_account.data())
            .expect("Failed to deserialize bet data");
        assert_eq!(bet.outcome_index, outcome_index);
        assert_eq!(bet.amount, amount);
        println!("Bet placed successfully: {} SOL on outcome {}", bet.amount, bet.outcome_index);

        // Test market resolution
        println!("Testing market resolution...");
        let winning_outcome = 0; // "Yes"
        let resolution_proof = [2u8; 32];

        let resolve_instruction_data = borsh::to_vec(&OracleInstruction::ResolveMarket {
            winning_outcome,
            resolution_proof,
        })
        .expect("Failed to serialize instruction");

        let resolve_instruction = Instruction::new_with_bytes(
            program_id,
            &resolve_instruction_data,
            vec![
                AccountMeta::new(market_keypair.pubkey(), false),
                AccountMeta::new(payer.pubkey(), true),
            ],
        );

        let message = Message::new(&[resolve_instruction], Some(&payer.pubkey()));
        let transaction = Transaction::new(
            &[&payer],
            message,
            svm.latest_blockhash(),
        );

        let result = svm.send_transaction(transaction);
        assert!(result.is_ok(), "Resolve market transaction should succeed");

        let logs = result.unwrap().logs;
        println!("Transaction logs:\n{:#?}", logs);

        // Verify market was resolved
        let market_account = svm
            .get_account(&market_keypair.pubkey())
            .expect("Failed to get market account");

        let resolved_market: MarketAccount = MarketAccount::try_from_slice(market_account.data())
            .expect("Failed to deserialize market data");
        assert!(resolved_market.is_resolved);
        assert_eq!(resolved_market.winning_outcome, Some(winning_outcome));
        println!("Market resolved successfully with outcome: {}", winning_outcome);

        println!("All tests passed! 🎉");
    }
}
