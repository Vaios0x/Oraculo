use anchor_lang::prelude::*;

declare_id!("8KPzbM2Cwn4Yjak7QYAEH9wyoQh86NcBicaLuzPaejdw");

#[program]
pub mod pda_messenger {
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

    /// Update an existing message account
    pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
        msg!("Update Message: {}", message);
        let account_data = &mut ctx.accounts.message_account;
        account_data.message = message;
        Ok(())
    }

    /// Delete a message account and recover rent
    pub fn delete(_ctx: Context<Delete>) -> Result<()> {
        msg!("Delete Message");
        Ok(())
    }

    /// Get message data (view function)
    pub fn get_message(ctx: Context<GetMessage>) -> Result<String> {
        let account_data = &ctx.accounts.message_account;
        Ok(account_data.message.clone())
    }

    /// List all messages for a user (view function)
    pub fn list_messages(_ctx: Context<ListMessages>) -> Result<Vec<String>> {
        // This would require additional account management in a real implementation
        Ok(vec![])
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
}

#[derive(Accounts)]
pub struct GetMessage<'info> {
    pub message_account: Account<'info, MessageAccount>,
}

#[derive(Accounts)]
pub struct ListMessages<'info> {
    pub user: Signer<'info>,
}

#[account]
pub struct MessageAccount {
    pub user: Pubkey,
    pub message: String,
    pub bump: u8,
}
