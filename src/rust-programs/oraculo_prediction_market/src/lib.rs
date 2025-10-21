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

// Define the program's entrypoint
entrypoint!(process_instruction);

// Define instruction types
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum PredictionMarketInstruction {
    /// Create a new prediction market
    /// Accounts expected:
    /// 0. [signer] Market creator
    /// 1. [writable] Market account
    /// 2. [] System program
    CreateMarket {
        title: String,
        description: String,
        end_time: i64,
        outcome_options: Vec<String>,
    },
    /// Place a bet on a market outcome
    /// Accounts expected:
    /// 0. [signer] Bettor
    /// 1. [writable] Market account
    /// 2. [writable] Bet account
    /// 3. [] System program
    PlaceBet {
        market_id: Pubkey,
        outcome_index: u8,
        amount: u64,
    },
    /// Resolve a market and distribute winnings
    /// Accounts expected:
    /// 0. [signer] Market creator
    /// 1. [writable] Market account
    /// 2. [] System program
    ResolveMarket {
        market_id: Pubkey,
        winning_outcome: u8,
    },
}

// Define market account structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PredictionMarket {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub end_time: i64,
    pub outcome_options: Vec<String>,
    pub total_pool: u64,
    pub is_resolved: bool,
    pub winning_outcome: Option<u8>,
    pub bets: Vec<Bet>,
}

// Define bet structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Bet {
    pub bettor: Pubkey,
    pub outcome_index: u8,
    pub amount: u64,
    pub timestamp: i64,
}

// Define bet account structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct BetAccount {
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
    let instruction = PredictionMarketInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        PredictionMarketInstruction::CreateMarket {
            title,
            description,
            end_time,
            outcome_options,
        } => {
            msg!("Creating prediction market: {}", title);
            create_market(program_id, accounts, title, description, end_time, outcome_options)
        }
        PredictionMarketInstruction::PlaceBet {
            market_id,
            outcome_index,
            amount,
        } => {
            msg!("Placing bet on market: {}", market_id);
            place_bet(program_id, accounts, market_id, outcome_index, amount)
        }
        PredictionMarketInstruction::ResolveMarket {
            market_id,
            winning_outcome,
        } => {
            msg!("Resolving market: {}", market_id);
            resolve_market(program_id, accounts, market_id, winning_outcome)
        }
    }
}

fn create_market(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String,
    end_time: i64,
    outcome_options: Vec<String>,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let creator = next_account_info(accounts_iter)?;
    let market_account = next_account_info(accounts_iter)?;
    let _system_program = next_account_info(accounts_iter)?;

    // Verify creator is signer
    if !creator.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Verify market account is writable
    if !market_account.is_writable {
        return Err(ProgramError::InvalidAccountData);
    }

    // Create market data
    let market = PredictionMarket {
        creator: *creator.key,
        title,
        description,
        end_time,
        outcome_options,
        total_pool: 0,
        is_resolved: false,
        winning_outcome: None,
        bets: Vec::new(),
    };

    // Serialize and store market data
    let mut market_data = market.try_to_vec().unwrap();
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(market_data.len());

    // Transfer lamports to market account
    **market_account.lamports.borrow_mut() = required_lamports;
    **market_account.data.borrow_mut() = market_data;
    **market_account.owner.borrow_mut() = *program_id;

    msg!("Market created successfully!");
    msg!("Title: {}", market.title);
    msg!("End time: {}", market.end_time);
    msg!("Outcome options: {:?}", market.outcome_options);

    Ok(())
}

fn place_bet(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    market_id: Pubkey,
    outcome_index: u8,
    amount: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let bettor = next_account_info(accounts_iter)?;
    let market_account = next_account_info(accounts_iter)?;
    let bet_account = next_account_info(accounts_iter)?;
    let _system_program = next_account_info(accounts_iter)?;

    // Verify bettor is signer
    if !bettor.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Verify accounts are writable
    if !market_account.is_writable || !bet_account.is_writable {
        return Err(ProgramError::InvalidAccountData);
    }

    // Create bet data
    let bet = BetAccount {
        market_id,
        bettor: *bettor.key,
        outcome_index,
        amount,
        timestamp: solana_program::clock::Clock::get()?.unix_timestamp,
    };

    // Serialize and store bet data
    let mut bet_data = bet.try_to_vec().unwrap();
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(bet_data.len());

    // Transfer lamports to bet account
    **bet_account.lamports.borrow_mut() = required_lamports;
    **bet_account.data.borrow_mut() = bet_data;
    **bet_account.owner.borrow_mut() = *program_id;

    msg!("Bet placed successfully!");
    msg!("Market: {}", market_id);
    msg!("Outcome: {}", outcome_index);
    msg!("Amount: {}", amount);

    Ok(())
}

fn resolve_market(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    market_id: Pubkey,
    winning_outcome: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let creator = next_account_info(accounts_iter)?;
    let market_account = next_account_info(accounts_iter)?;
    let _system_program = next_account_info(accounts_iter)?;

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
    let mut market = PredictionMarket::try_from_slice(&market_data)
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
    let updated_market_data = market.try_to_vec().unwrap();
    **market_account.data.borrow_mut() = updated_market_data;

    msg!("Market resolved successfully!");
    msg!("Market: {}", market_id);
    msg!("Winning outcome: {}", winning_outcome);

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use mollusk_svm::{result::Check, Mollusk};
    use solana_sdk::{
        account::Account,
        instruction::Instruction,
        pubkey::Pubkey,
        system_program,
    };

    #[test]
    fn test_create_market() {
        let program_id = Pubkey::new_unique();
        let mollusk = Mollusk::new(&program_id, "target/deploy/oraculo_prediction_market");

        let creator = Pubkey::new_unique();
        let market_account = Pubkey::new_unique();

        let instruction = Instruction {
            program_id,
            accounts: vec![
                solana_sdk::instruction::AccountMeta::new(creator, true),
                solana_sdk::instruction::AccountMeta::new(market_account, false),
                solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
            ],
            data: PredictionMarketInstruction::CreateMarket {
                title: "Will Bitcoin reach $100k?".to_string(),
                description: "A prediction market about Bitcoin's price".to_string(),
                end_time: 1735689600, // End of 2024
                outcome_options: vec!["Yes".to_string(), "No".to_string()],
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
    fn test_place_bet() {
        let program_id = Pubkey::new_unique();
        let mollusk = Mollusk::new(&program_id, "target/deploy/oraculo_prediction_market");

        let bettor = Pubkey::new_unique();
        let market_account = Pubkey::new_unique();
        let bet_account = Pubkey::new_unique();

        let instruction = Instruction {
            program_id,
            accounts: vec![
                solana_sdk::instruction::AccountMeta::new(bettor, true),
                solana_sdk::instruction::AccountMeta::new(market_account, false),
                solana_sdk::instruction::AccountMeta::new(bet_account, false),
                solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
            ],
            data: PredictionMarketInstruction::PlaceBet {
                market_id: market_account,
                outcome_index: 0,
                amount: 100_000,
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
                bet_account,
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
            Check::account(&bet_account)
                .owner(program_id)
                .build(),
        ];

        mollusk.process_and_validate_instruction(&instruction, &accounts, &checks);
    }

    #[test]
    fn test_resolve_market() {
        let program_id = Pubkey::new_unique();
        let mollusk = Mollusk::new(&program_id, "target/deploy/oraculo_prediction_market");

        let creator = Pubkey::new_unique();
        let market_account = Pubkey::new_unique();

        let instruction = Instruction {
            program_id,
            accounts: vec![
                solana_sdk::instruction::AccountMeta::new(creator, true),
                solana_sdk::instruction::AccountMeta::new(market_account, false),
                solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
            ],
            data: PredictionMarketInstruction::ResolveMarket {
                market_id: market_account,
                winning_outcome: 0,
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
        ];

        let checks = vec![
            Check::success(),
        ];

        mollusk.process_and_validate_instruction(&instruction, &accounts, &checks);
    }
}
