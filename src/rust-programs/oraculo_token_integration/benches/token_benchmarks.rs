use {
    mollusk_svm::Mollusk,
    mollusk_svm_bencher::MolluskComputeUnitBencher,
    mollusk_svm_programs_token::{associated_token, token, token2022},
    oraculo_token_integration::TokenIntegrationInstruction,
    solana_sdk::{
        account::Account,
        instruction::Instruction,
        pubkey::Pubkey,
        system_program,
    },
    spl_token_interface::{
        instruction::{initialize_mint, mint_to, transfer_checked},
        state::{Account as TokenAccount, AccountState, Mint},
    },
};

fn main() {
    // Initialize Mollusk with token programs
    let mut mollusk = Mollusk::default();
    token::add_program(&mut mollusk);
    token2022::add_program(&mut mollusk);
    associated_token::add_program(&mut mollusk);

    // Create test accounts
    let creator = Pubkey::new_unique();
    let bettor = Pubkey::new_unique();
    let market_account = Pubkey::new_unique();
    let token_mint = Pubkey::new_unique();
    let creator_token_account = Pubkey::new_unique();
    let bettor_token_account = Pubkey::new_unique();
    let market_token_account = Pubkey::new_unique();
    let authority = Pubkey::new_unique();

    // Token configuration
    let decimals = 6;
    let transfer_amount = 1_000_000;
    let initial_balance = 10_000_000;

    // Calculate rent-exempt minimums
    let mint_rent = mollusk.sysvars.rent.minimum_balance(Mint::LEN);
    let account_rent = mollusk.sysvars.rent.minimum_balance(TokenAccount::LEN);

    // Create mint account
    let mut mint_data = vec![0u8; Mint::LEN];
    Mint::pack(
        Mint {
            mint_authority: Some(authority).into(),
            supply: initial_balance,
            decimals,
            is_initialized: true,
            freeze_authority: None.into(),
        },
        &mut mint_data,
    )
    .unwrap();

    // Create token accounts
    let mut creator_token_data = vec![0u8; TokenAccount::LEN];
    TokenAccount::pack(
        TokenAccount {
            mint: token_mint,
            owner: authority,
            amount: initial_balance,
            delegate: None.into(),
            state: AccountState::Initialized,
            is_native: None.into(),
            delegated_amount: 0,
            close_authority: None.into(),
        },
        &mut creator_token_data,
    )
    .unwrap();

    let mut bettor_token_data = vec![0u8; TokenAccount::LEN];
    TokenAccount::pack(
        TokenAccount {
            mint: token_mint,
            owner: bettor,
            amount: initial_balance,
            delegate: None.into(),
            state: AccountState::Initialized,
            is_native: None.into(),
            delegated_amount: 0,
            close_authority: None.into(),
        },
        &mut bettor_token_data,
    )
    .unwrap();

    let mut market_token_data = vec![0u8; TokenAccount::LEN];
    TokenAccount::pack(
        TokenAccount {
            mint: token_mint,
            owner: market_account,
            amount: 0,
            delegate: None.into(),
            state: AccountState::Initialized,
            is_native: None.into(),
            delegated_amount: 0,
            close_authority: None.into(),
        },
        &mut market_token_data,
    )
    .unwrap();

    // Create market instruction
    let create_market_instruction = Instruction {
        program_id: Pubkey::new_unique(),
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new(token_mint, false),
            solana_sdk::instruction::AccountMeta::new(market_token_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(token::id(), false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: TokenIntegrationInstruction::CreateTokenMarket {
            title: "Benchmark Market".to_string(),
            description: "A market for benchmarking".to_string(),
            end_time: 1735689600,
            outcome_options: vec!["Yes".to_string(), "No".to_string()],
            token_decimals: 9,
        }
        .try_to_vec()
        .unwrap(),
    };

    let create_market_accounts = vec![
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
                lamports: mint_rent,
                data: mint_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
        (
            market_token_account,
            Account {
                lamports: account_rent,
                data: market_token_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
    ];

    // Create stake tokens instruction
    let stake_tokens_instruction = Instruction {
        program_id: Pubkey::new_unique(),
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
            amount: transfer_amount,
        }
        .try_to_vec()
        .unwrap(),
    };

    let stake_tokens_accounts = vec![
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
                lamports: account_rent,
                data: bettor_token_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
        (
            market_token_account,
            Account {
                lamports: account_rent,
                data: market_token_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
    ];

    // Create distribute winnings instruction
    let distribute_instruction = Instruction {
        program_id: Pubkey::new_unique(),
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new(market_token_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(token::id(), false),
        ],
        data: TokenIntegrationInstruction::DistributeWinnings {
            market_id: market_account,
            winning_outcome: 0,
        }
        .try_to_vec()
        .unwrap(),
    };

    let distribute_accounts = vec![
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
            market_token_account,
            Account {
                lamports: account_rent,
                data: market_token_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
    ];

    // Create token transfer instruction for comparison
    let transfer_instruction = transfer_checked(
        &token::id(),
        &bettor_token_account,
        &token_mint,
        &market_token_account,
        &authority,
        &[],
        transfer_amount,
        decimals,
    )
    .unwrap();

    let transfer_accounts = vec![
        (
            bettor_token_account,
            Account {
                lamports: account_rent,
                data: bettor_token_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
        (
            token_mint,
            Account {
                lamports: mint_rent,
                data: mint_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
        (
            market_token_account,
            Account {
                lamports: account_rent,
                data: market_token_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
        (
            authority,
            Account {
                lamports: 1_000_000,
                data: vec![],
                owner: system_program::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
    ];

    // Run benchmarks
    MolluskComputeUnitBencher::new(mollusk)
        .bench(("create_token_market", &create_market_instruction, &create_market_accounts))
        .bench(("stake_tokens", &stake_tokens_instruction, &stake_tokens_accounts))
        .bench(("distribute_winnings", &distribute_instruction, &distribute_accounts))
        .bench(("token_transfer", &transfer_instruction, &transfer_accounts))
        .must_pass(true)
        .out_dir("./target/benches")
        .execute();
}
