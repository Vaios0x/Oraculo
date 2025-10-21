use {
    mollusk_svm::{result::Check, Mollusk},
    mollusk_svm_programs_token::{associated_token, token, token2022},
    oraculo_token_integration::TokenIntegrationInstruction,
    solana_sdk::{
        account::Account,
        instruction::Instruction,
        program_pack::Pack,
        pubkey::Pubkey,
        system_program,
    },
    spl_token_interface::{
        instruction::{initialize_mint, mint_to, transfer_checked},
        state::{Account as TokenAccount, AccountState, Mint},
    },
    std::collections::HashMap,
};

#[test]
fn test_complete_token_market_workflow() {
    // Initialize Mollusk with token programs
    let mut mollusk = Mollusk::default();
    token::add_program(&mut mollusk);
    token2022::add_program(&mut mollusk);
    associated_token::add_program(&mut mollusk);

    let program_id = Pubkey::new_unique();
    let creator = Pubkey::new_unique();
    let bettor = Pubkey::new_unique();
    let market_account = Pubkey::new_unique();
    let token_mint = Pubkey::new_unique();
    let creator_token_account = Pubkey::new_unique();
    let bettor_token_account = Pubkey::new_unique();
    let market_token_account = Pubkey::new_unique();

    // Create account store with initial balances
    let mut account_store = HashMap::new();
    account_store.insert(
        creator,
        Account {
            lamports: 10_000_000,
            data: vec![],
            owner: system_program::id(),
            executable: false,
            rent_epoch: 0,
        },
    );
    account_store.insert(
        bettor,
        Account {
            lamports: 10_000_000,
            data: vec![],
            owner: system_program::id(),
            executable: false,
            rent_epoch: 0,
        },
    );

    // Create a stateful context
    let context = mollusk.with_context(account_store);

    // Step 1: Create token-based prediction market
    println!("Step 1: Creating token-based prediction market...");
    let create_market_instruction = Instruction {
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
            title: "Token-based Solana Prediction".to_string(),
            description: "Will Solana reach $500 using tokens?".to_string(),
            end_time: 1735689600,
            outcome_options: vec!["Yes".to_string(), "No".to_string()],
            token_decimals: 9,
        }
        .try_to_vec()
        .unwrap(),
    };

    let create_checks = vec![
        Check::success(),
        Check::account(&market_account)
            .owner(program_id)
            .build(),
    ];

    context.process_and_validate_instruction(&create_market_instruction, &create_checks);

    // Step 2: Stake tokens on outcome
    println!("Step 2: Staking tokens on outcome...");
    let stake_tokens_instruction = Instruction {
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
            outcome_index: 0, // "Yes"
            amount: 1_000_000,
        }
        .try_to_vec()
        .unwrap(),
    };

    let stake_checks = vec![
        Check::success(),
    ];

    context.process_and_validate_instruction(&stake_tokens_instruction, &stake_checks);

    // Step 3: Distribute winnings
    println!("Step 3: Distributing winnings...");
    let distribute_instruction = Instruction {
        program_id,
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new(market_token_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(token::id(), false),
        ],
        data: TokenIntegrationInstruction::DistributeWinnings {
            market_id: market_account,
            winning_outcome: 0, // "Yes" wins
        }
        .try_to_vec()
        .unwrap(),
    };

    let distribute_checks = vec![
        Check::success(),
    ];

    context.process_and_validate_instruction(&distribute_instruction, &distribute_checks);

    println!("✅ Complete token market workflow test passed!");
}

#[test]
fn test_token_transfer_with_mollusk() {
    // Initialize Mollusk with token programs
    let mut mollusk = Mollusk::default();
    token::add_program(&mut mollusk);
    token2022::add_program(&mut mollusk);
    associated_token::add_program(&mut mollusk);

    // Create test accounts
    let mint = Pubkey::new_unique();
    let source = Pubkey::new_unique();
    let destination = Pubkey::new_unique();
    let authority = Pubkey::new_unique();

    // Token configuration
    let decimals = 6;
    let transfer_amount = 1_000_000; // 1 token with 6 decimals
    let initial_balance = 10_000_000; // 10 tokens

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

    // Create source token account
    let mut source_data = vec![0u8; TokenAccount::LEN];
    TokenAccount::pack(
        TokenAccount {
            mint,
            owner: authority,
            amount: initial_balance,
            delegate: None.into(),
            state: AccountState::Initialized,
            is_native: None.into(),
            delegated_amount: 0,
            close_authority: None.into(),
        },
        &mut source_data,
    )
    .unwrap();

    // Create destination token account
    let mut destination_data = vec![0u8; TokenAccount::LEN];
    TokenAccount::pack(
        TokenAccount {
            mint,
            owner: Pubkey::new_unique(),
            amount: 0,
            delegate: None.into(),
            state: AccountState::Initialized,
            is_native: None.into(),
            delegated_amount: 0,
            close_authority: None.into(),
        },
        &mut destination_data,
    )
    .unwrap();

    // Setup accounts for transfer_checked
    let accounts = vec![
        (
            source,
            Account {
                lamports: account_rent,
                data: source_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
        (
            mint,
            Account {
                lamports: mint_rent,
                data: mint_data,
                owner: token::id(),
                executable: false,
                rent_epoch: 0,
            },
        ),
        (
            destination,
            Account {
                lamports: account_rent,
                data: destination_data,
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

    // Create transfer_checked instruction
    let instruction = transfer_checked(
        &token::id(),
        &source,
        &mint,
        &destination,
        &authority,
        &[],
        transfer_amount,
        decimals,
    )
    .unwrap();

    // Expected balances after transfer
    let expected_source_balance = (initial_balance - transfer_amount).to_le_bytes();
    let expected_dest_balance = transfer_amount.to_le_bytes();

    // Define validation checks
    let checks = vec![
        Check::success(),
        Check::account(&source)
            .data_slice(64, &expected_source_balance) // Token amount is at offset 64
            .build(),
        Check::account(&destination)
            .data_slice(64, &expected_dest_balance)
            .build(),
    ];

    // Process and validate the instruction
    let result = mollusk.process_and_validate_instruction(&instruction, &accounts, &checks);
    println!("{:#?}", result);

    // Deserialize token account data
    let source_account = result.get_account(&source).unwrap();
    let source_token = TokenAccount::unpack(&source_account.data).unwrap();
    println!("Source Token Account: {:#?}", source_token);

    let destination_account = result.get_account(&destination).unwrap();
    let dest_token = TokenAccount::unpack(&destination_account.data).unwrap();
    println!("Destination Token Account: {:#?}", dest_token);

    println!("✅ Token transfer test passed!");
}

#[test]
fn test_multiple_token_operations() {
    let mut mollusk = Mollusk::default();
    token::add_program(&mut mollusk);
    token2022::add_program(&mut mollusk);
    associated_token::add_program(&mut mollusk);

    let mint = Pubkey::new_unique();
    let alice = Pubkey::new_unique();
    let bob = Pubkey::new_unique();
    let charlie = Pubkey::new_unique();
    let authority = Pubkey::new_unique();

    let decimals = 6;
    let initial_balance = 10_000_000;
    let transfer_amount = 1_000_000;

    // Create account store
    let mut account_store = HashMap::new();
    account_store.insert(
        mint,
        Account {
            lamports: mollusk.sysvars.rent.minimum_balance(Mint::LEN),
            data: vec![0u8; Mint::LEN],
            owner: token::id(),
            executable: false,
            rent_epoch: 0,
        },
    );
    account_store.insert(
        alice,
        Account {
            lamports: mollusk.sysvars.rent.minimum_balance(TokenAccount::LEN),
            data: vec![0u8; TokenAccount::LEN],
            owner: token::id(),
            executable: false,
            rent_epoch: 0,
        },
    );
    account_store.insert(
        bob,
        Account {
            lamports: mollusk.sysvars.rent.minimum_balance(TokenAccount::LEN),
            data: vec![0u8; TokenAccount::LEN],
            owner: token::id(),
            executable: false,
            rent_epoch: 0,
        },
    );
    account_store.insert(
        charlie,
        Account {
            lamports: mollusk.sysvars.rent.minimum_balance(TokenAccount::LEN),
            data: vec![0u8; TokenAccount::LEN],
            owner: token::id(),
            executable: false,
            rent_epoch: 0,
        },
    );

    let context = mollusk.with_context(account_store);

    // First transfer: Alice -> Bob
    let transfer1 = transfer_checked(
        &token::id(),
        &alice,
        &mint,
        &bob,
        &authority,
        &[],
        transfer_amount,
        decimals,
    )
    .unwrap();

    context.process_and_validate_instruction(&transfer1, &[Check::success()]);

    // Second transfer: Bob -> Charlie
    let transfer2 = transfer_checked(
        &token::id(),
        &bob,
        &mint,
        &charlie,
        &authority,
        &[],
        transfer_amount / 2,
        decimals,
    )
    .unwrap();

    context.process_and_validate_instruction(&transfer2, &[Check::success()]);

    println!("✅ Multiple token operations test passed!");
}

#[test]
fn test_token_market_with_extensions() {
    let mut mollusk = Mollusk::default();
    token::add_program(&mut mollusk);
    token2022::add_program(&mut mollusk);
    associated_token::add_program(&mut mollusk);

    let program_id = Pubkey::new_unique();
    let creator = Pubkey::new_unique();
    let market_account = Pubkey::new_unique();
    let token_mint = Pubkey::new_unique();
    let market_token_account = Pubkey::new_unique();

    // Test with Token-2022 extensions
    let instruction = Instruction {
        program_id,
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new(token_mint, false),
            solana_sdk::instruction::AccountMeta::new(market_token_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(token2022::id(), false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: TokenIntegrationInstruction::CreateTokenMarket {
            title: "Token-2022 Extended Market".to_string(),
            description: "A market using Token-2022 extensions".to_string(),
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

    println!("✅ Token-2022 extensions test passed!");
}
