use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("11111111111111111111111111111111");

#[program]
mod hello_anchor {
    use super::*;
    
    /// Initialize a new account with data
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Changed data to: {}!", data); // Message will show up in the tx logs
        Ok(())
    }

    /// Update the data in an existing account
    pub fn update_data(ctx: Context<UpdateData>, new_data: u64) -> Result<()> {
        ctx.accounts.account.data = new_data;
        msg!("Updated data to: {}!", new_data);
        Ok(())
    }

    /// Get the current data from an account
    pub fn get_data(ctx: Context<GetData>) -> Result<u64> {
        let data = ctx.accounts.account.data;
        msg!("Current data is: {}!", data);
        Ok(data)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // We must specify the space in order to initialize an account.
    // First 8 bytes are default account discriminator,
    // next 8 bytes come from NewAccount.data being type u64.
    // (u64 = 64 bits unsigned integer = 8 bytes)
    #[account(
      init,
      payer = signer,
      space = 8 + 8
    )]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateData<'info> {
    #[account(mut)]
    pub account: Account<'info, NewAccount>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetData<'info> {
    pub account: Account<'info, NewAccount>,
}

#[account]
pub struct NewAccount {
    data: u64
}
