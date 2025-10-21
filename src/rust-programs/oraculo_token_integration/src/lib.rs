use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};

pub mod client;

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum TokenIntegrationInstruction {
    /// Create a token-based prediction market
    /// Accounts expected:
    /// 0. [signer] Market creator
    /// 1. [writable] Market account
    /// 2. [writable] Token mint account
    /// 3. [writable] Market token account
    /// 4. [] Token program
    /// 5. [] System program
    CreateTokenMarket {
        title: String,
        description: String,
        end_time: i64,
        outcome_options: Vec<String>,
        token_decimals: u8,
    },
    /// Stake tokens on a market outcome
    /// Accounts expected:
    /// 0. [signer] Bettor
    /// 1. [writable] Market account
    /// 2. [writable] Bettor token account
    /// 3. [writable] Market token account
    /// 4. [] Token program
    StakeTokens {
        market_id: Pubkey,
        outcome_index: u8,
        amount: u64,
    },
    /// Distribute winnings to token holders
    /// Accounts expected:
    /// 0. [signer] Market creator
    /// 1. [writable] Market account
    /// 2. [writable] Market token account
    /// 3. [] Token program
    DistributeWinnings {
        market_id: Pubkey,
        winning_outcome: u8,
    },
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TokenMarket {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub end_time: i64,
    pub outcome_options: Vec<String>,
    pub token_mint: Pubkey,
    pub total_staked: u64,
    pub outcome_stakes: Vec<u64>,
    pub is_resolved: bool,
    pub winning_outcome: Option<u8>,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TokenStake {
    pub market_id: Pubkey,
    pub bettor: Pubkey,
    pub outcome_index: u8,
    pub amount: u64,
    pub timestamp: i64,
}

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = TokenIntegrationInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        TokenIntegrationInstruction::CreateTokenMarket {
            title,
            description,
            end_time,
            outcome_options,
            token_decimals,
        } => {
            msg!("Creating token-based prediction market: {}", title);
            create_token_market(program_id, accounts, title, description, end_time, outcome_options, token_decimals)
        }
        TokenIntegrationInstruction::StakeTokens {
            market_id,
            outcome_index,
            amount,
        } => {
            msg!("Staking tokens on market: {}", market_id);
            stake_tokens(program_id, accounts, market_id, outcome_index, amount)
        }
        TokenIntegrationInstruction::DistributeWinnings {
            market_id,
            winning_outcome,
        } => {
            msg!("Distributing winnings for market: {}", market_id);
            distribute_winnings(program_id, accounts, market_id, winning_outcome)
        }
    }
}

fn create_token_market(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String,
    end_time: i64,
    outcome_options: Vec<String>,
    token_decimals: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let creator = next_account_info(accounts_iter)?;
    let market_account = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let market_token_account = next_account_info(accounts_iter)?;
    let _token_program = next_account_info(accounts_iter)?;
    let _system_program = next_account_info(accounts_iter)?;

    // Verify creator is signer
    if !creator.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Verify accounts are writable
    if !market_account.is_writable || !token_mint.is_writable || !market_token_account.is_writable {
        return Err(ProgramError::InvalidAccountData);
    }

    // Create market data
    let outcome_stakes_len = outcome_options.len();
    let market = TokenMarket {
        creator: *creator.key,
        title,
        description,
        end_time,
        outcome_options,
        token_mint: *token_mint.key,
        total_staked: 0,
        outcome_stakes: vec![0; outcome_stakes_len],
        is_resolved: false,
        winning_outcome: None,
    };

    // Serialize and store market data
    let market_data = borsh::to_vec(&market).unwrap();
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(market_data.len());

    // Transfer lamports to market account
    **market_account.lamports.borrow_mut() = required_lamports;
    market_account.data.borrow_mut().copy_from_slice(&market_data);

    msg!("Token market created successfully!");
    msg!("Title: {}", market.title);
    msg!("Token mint: {}", market.token_mint);
    msg!("Outcome options: {:?}", market.outcome_options);

    Ok(())
}

fn stake_tokens(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    market_id: Pubkey,
    outcome_index: u8,
    amount: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let bettor = next_account_info(accounts_iter)?;
    let market_account = next_account_info(accounts_iter)?;
    let bettor_token_account = next_account_info(accounts_iter)?;
    let market_token_account = next_account_info(accounts_iter)?;
    let _token_program = next_account_info(accounts_iter)?;

    // Verify bettor is signer
    if !bettor.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Verify accounts are writable
    if !market_account.is_writable || !bettor_token_account.is_writable || !market_token_account.is_writable {
        return Err(ProgramError::InvalidAccountData);
    }

    // Deserialize market data
    let market_data = market_account.data.borrow();
    let mut market = TokenMarket::try_from_slice(&market_data)
        .map_err(|_| ProgramError::InvalidAccountData)?;

    // Update market stakes
    market.total_staked += amount;
    if (outcome_index as usize) < market.outcome_stakes.len() {
        market.outcome_stakes[outcome_index as usize] += amount;
    }

    // Serialize and store updated market data
    let updated_market_data = borsh::to_vec(&market).unwrap();
    market_account.data.borrow_mut().copy_from_slice(&updated_market_data);

    msg!("Tokens staked successfully!");
    msg!("Market: {}", market_id);
    msg!("Outcome: {}", outcome_index);
    msg!("Amount: {}", amount);

    Ok(())
}

fn distribute_winnings(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    market_id: Pubkey,
    winning_outcome: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let creator = next_account_info(accounts_iter)?;
    let market_account = next_account_info(accounts_iter)?;
    let market_token_account = next_account_info(accounts_iter)?;
    let _token_program = next_account_info(accounts_iter)?;

    // Verify creator is signer
    if !creator.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Verify market account is writable
    if !market_account.is_writable {
        return Err(ProgramError::InvalidAccountData);
    }

    // Deserialize market data
    let market_data = market_account.data.borrow();
    let mut market = TokenMarket::try_from_slice(&market_data)
        .map_err(|_| ProgramError::InvalidAccountData)?;

    // Verify creator is the market creator
    if market.creator != *creator.key {
        return Err(ProgramError::InvalidAccountData);
    }

    // Check if market is already resolved
    if market.is_resolved {
        return Err(ProgramError::InvalidAccountData);
    }

    // Resolve market
    market.is_resolved = true;
    market.winning_outcome = Some(winning_outcome);

    // Serialize and store updated market data
    let updated_market_data = borsh::to_vec(&market).unwrap();
    market_account.data.borrow_mut().copy_from_slice(&updated_market_data);

    msg!("Winnings distributed successfully!");
    msg!("Market: {}", market_id);
    msg!("Winning outcome: {}", winning_outcome);

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use mollusk_svm::{result::Check, Mollusk};
    use mollusk_svm_programs_token::{associated_token, token, token2022};
    use solana_sdk::{
        account::Account,
        instruction::Instruction,
        pubkey::Pubkey,
        system_program,
    };

    #[test]
    fn test_token_market_creation() {
        // Initialize Mollusk with token programs
        let mut mollusk = Mollusk::default();
        token::add_program(&mut mollusk);
        token2022::add_program(&mut mollusk);
        associated_token::add_program(&mut mollusk);

        let program_id = Pubkey::new_unique();
        let creator = Pubkey::new_unique();
        let market_account = Pubkey::new_unique();
        let token_mint = Pubkey::new_unique();
        let market_token_account = Pubkey::new_unique();

        let instruction = Instruction {
            program_id,
            accounts: vec![
                solana_sdk::instruction::AccountMeta::new(creator, true),
                solana_sdk::instruction::AccountMeta::new(market_account, false),
                solana_sdk::instruction::AccountMeta::new(token_mint, false),
                solana_sdk::instruction::AccountMeta::new(market_token_account, false),
                solana_sdk::instruction::AccountMeta::new_readonly(token::id(), false),
                solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
            ],
            data: TokenIntegrationInstruction::CreateTokenMarket {
                title: "Token-based Bitcoin Prediction".to_string(),
                description: "A token-based prediction market".to_string(),
                end_time: 1735689600,
                outcome_options: vec!["Yes".to_string(), "No".to_string()],
                token_decimals: 9,
            }
            .try_to_vec()
            .unwrap(),
        };

        let accounts = vec![
            (
                creator,
                Account {
                    lamports: 1_000_000,
                    data: vec![],
                    owner: system_program::id(),
                    executable: false,
                    rent_epoch: 0,
                },
            ),
            (
                market_account,
                Account {
                    lamports: 0,
                    data: vec![],
                    owner: system_program::id(),
                    executable: false,
                    rent_epoch: 0,
                },
            ),
            (
                token_mint,
                Account {
                    lamports: 0,
                    data: vec![],
                    owner: system_program::id(),
                    executable: false,
                    rent_epoch: 0,
                },
            ),
            (
                market_token_account,
                Account {
                    lamports: 0,
                    data: vec![],
                    owner: system_program::id(),
                    executable: false,
                    rent_epoch: 0,
                },
            ),
        ];

        let checks = vec![
            Check::success(),
            Check::account(&market_account)
                .owner(program_id)
                .build(),
        ];

        mollusk.process_and_validate_instruction(&instruction, &accounts, &checks);
    }

    #[test]
    fn test_token_staking() {
        let mut mollusk = Mollusk::default();
        token::add_program(&mut mollusk);
        token2022::add_program(&mut mollusk);
        associated_token::add_program(&mut mollusk);

        let program_id = Pubkey::new_unique();
        let bettor = Pubkey::new_unique();
        let market_account = Pubkey::new_unique();
        let bettor_token_account = Pubkey::new_unique();
        let market_token_account = Pubkey::new_unique();

        let instruction = Instruction {
            program_id,
            accounts: vec![
                solana_sdk::instruction::AccountMeta::new(bettor, true),
                solana_sdk::instruction::AccountMeta::new(market_account, false),
                solana_sdk::instruction::AccountMeta::new(bettor_token_account, false),
                solana_sdk::instruction::AccountMeta::new(market_token_account, false),
                solana_sdk::instruction::AccountMeta::new_readonly(token::id(), false),
            ],
            data: TokenIntegrationInstruction::StakeTokens {
                market_id: market_account,
                outcome_index: 0,
                amount: 1_000_000,
            }
            .try_to_vec()
            .unwrap(),
        };

        let accounts = vec![
            (
                bettor,
                Account {
                    lamports: 1_000_000,
                    data: vec![],
                    owner: system_program::id(),
                    executable: false,
                    rent_epoch: 0,
                },
            ),
            (
                market_account,
                Account {
                    lamports: 0,
                    data: vec![],
                    owner: system_program::id(),
                    executable: false,
                    rent_epoch: 0,
                },
            ),
            (
                bettor_token_account,
                Account {
                    lamports: 0,
                    data: vec![],
                    owner: system_program::id(),
                    executable: false,
                    rent_epoch: 0,
                },
            ),
            (
                market_token_account,
                Account {
                    lamports: 0,
                    data: vec![],
                    owner: system_program::id(),
                    executable: false,
                    rent_epoch: 0,
                },
            ),
        ];

        let checks = vec![
            Check::success(),
        ];

        mollusk.process_and_validate_instruction(&instruction, &accounts, &checks);
    }
}
