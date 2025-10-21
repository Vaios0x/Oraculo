use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("8KPzbM2Cwn4Yjak7QYAEH9wyoQh86NcBicaLuzPaejdw");

#[program]
pub mod cpi_messenger {
    use super::*;

    /// Create a new message account with PDA
    pub fn create(ctx: Context<Create>, message: String) -> Result<()> {
        msg!("Create Message: {}", message);
        let account_data = &mut ctx.accounts.message_account;
        account_data.user = ctx.accounts.user.key();
        account_data.message = message;
        account_data.bump = ctx.bumps.message_account;
        Ok(())
    }

    /// Update an existing message account with payment
    pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
        msg!("Update Message: {}", message);
        
        // Transfer 0.001 SOL (1,000,000 lamports) from user to vault
        let transfer_accounts = Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
        };

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_accounts,
        );

        transfer(cpi_context, 1_000_000)?; // 0.001 SOL

        // Update the message
        let account_data = &mut ctx.accounts.message_account;
        account_data.message = message;
        
        msg!("Payment received: 0.001 SOL");
        Ok(())
    }

    /// Delete a message account and refund payment
    pub fn delete(ctx: Context<Delete>) -> Result<()> {
        msg!("Delete Message");
        
        let user_key = ctx.accounts.user.key();
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"vault",
            user_key.as_ref(),
            &[ctx.bumps.vault_account]
        ]];

        // Transfer all SOL from vault back to user
        let transfer_accounts = Transfer {
            from: ctx.accounts.vault_account.to_account_info(),
            to: ctx.accounts.user.to_account_info(),
        };

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_accounts,
        ).with_signer(signer_seeds);

        let vault_balance = ctx.accounts.vault_account.lamports();
        transfer(cpi_context, vault_balance)?;
        
        msg!("Refund sent: {} lamports", vault_balance);
        Ok(())
    }

    /// Get message data (view function)
    pub fn get_message(ctx: Context<GetMessage>) -> Result<String> {
        let account_data = &ctx.accounts.message_account;
        Ok(account_data.message.clone())
    }

    /// Get vault balance (view function)
    pub fn get_vault_balance(ctx: Context<GetVaultBalance>) -> Result<u64> {
        Ok(ctx.accounts.vault_account.lamports())
    }

    /// Transfer SOL from vault to another account (CPI example)
    pub fn transfer_from_vault(
        ctx: Context<TransferFromVault>, 
        amount: u64,
        destination: Pubkey
    ) -> Result<()> {
        let user_key = ctx.accounts.user.key();
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"vault",
            user_key.as_ref(),
            &[ctx.bumps.vault_account]
        ]];

        let transfer_accounts = Transfer {
            from: ctx.accounts.vault_account.to_account_info(),
            to: ctx.accounts.destination.to_account_info(),
        };

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_accounts,
        ).with_signer(signer_seeds);

        transfer(cpi_context, amount)?;
        
        msg!("Transferred {} lamports to {}", amount, destination);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(message: String)]
pub struct Create<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        seeds = [b"message", user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + 32 + 4 + message.len() + 1
    )]
    pub message_account: Account<'info, MessageAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(message: String)]
pub struct Update<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        realloc = 8 + 32 + 4 + message.len() + 1,
        realloc::payer = user,
        realloc::zero = true,
    )]
    pub message_account: Account<'info, MessageAccount>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump,
    )]
    pub vault_account: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        close = user,
    )]
    pub message_account: Account<'info, MessageAccount>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump,
    )]
    pub vault_account: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetMessage<'info> {
    pub message_account: Account<'info, MessageAccount>,
}

#[derive(Accounts)]
pub struct GetVaultBalance<'info> {
    pub vault_account: SystemAccount<'info>,
}

#[derive(Accounts)]
pub struct TransferFromVault<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump,
    )]
    pub vault_account: SystemAccount<'info>,

    #[account(mut)]
    pub destination: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MessageAccount {
    pub user: Pubkey,
    pub message: String,
    pub bump: u8,
}
