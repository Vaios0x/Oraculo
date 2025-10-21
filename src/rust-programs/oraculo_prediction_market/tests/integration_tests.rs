use {
    mollusk_svm::{result::Check, Mollusk},
    oraculo_prediction_market::{
        BetAccount, PredictionMarket, PredictionMarketInstruction,
    },
    solana_sdk::{
        account::Account,
        instruction::Instruction,
        pubkey::Pubkey,
        system_program,
    },
    std::collections::HashMap,
};

#[test]
fn test_complete_prediction_market_workflow() {
    // Initialize Mollusk with our program
    let program_id = Pubkey::new_unique();
    let mollusk = Mollusk::new(&program_id, "target/deploy/oraculo_prediction_market");

    // Create accounts
    let creator = Pubkey::new_unique();
    let bettor1 = Pubkey::new_unique();
    let bettor2 = Pubkey::new_unique();
    let market_account = Pubkey::new_unique();
    let bet_account1 = Pubkey::new_unique();
    let bet_account2 = Pubkey::new_unique();

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
        bettor1,
        Account {
            lamports: 5_000_000,
            data: vec![],
            owner: system_program::id(),
            executable: false,
            rent_epoch: 0,
        },
    );
    account_store.insert(
        bettor2,
        Account {
            lamports: 5_000_000,
            data: vec![],
            owner: system_program::id(),
            executable: false,
            rent_epoch: 0,
        },
    );

    // Create a stateful context
    let context = mollusk.with_context(account_store);

    // Step 1: Create a prediction market
    println!("Step 1: Creating prediction market...");
    let create_market_instruction = Instruction {
        program_id,
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: PredictionMarketInstruction::CreateMarket {
            title: "Will Solana reach $500 in 2024?".to_string(),
            description: "A prediction market about Solana's price performance".to_string(),
            end_time: 1735689600, // End of 2024
            outcome_options: vec!["Yes".to_string(), "No".to_string()],
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

    // Step 2: Place first bet
    println!("Step 2: Placing first bet...");
    let place_bet1_instruction = Instruction {
        program_id,
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(bettor1, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new(bet_account1, false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: PredictionMarketInstruction::PlaceBet {
            market_id: market_account,
            outcome_index: 0, // "Yes"
            amount: 1_000_000,
        }
        .try_to_vec()
        .unwrap(),
    };

    let bet1_checks = vec![
        Check::success(),
        Check::account(&bet_account1)
            .owner(program_id)
            .build(),
    ];

    context.process_and_validate_instruction(&place_bet1_instruction, &bet1_checks);

    // Step 3: Place second bet
    println!("Step 3: Placing second bet...");
    let place_bet2_instruction = Instruction {
        program_id,
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(bettor2, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new(bet_account2, false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: PredictionMarketInstruction::PlaceBet {
            market_id: market_account,
            outcome_index: 1, // "No"
            amount: 2_000_000,
        }
        .try_to_vec()
        .unwrap(),
    };

    let bet2_checks = vec![
        Check::success(),
        Check::account(&bet_account2)
            .owner(program_id)
            .build(),
    ];

    context.process_and_validate_instruction(&place_bet2_instruction, &bet2_checks);

    // Step 4: Resolve market
    println!("Step 4: Resolving market...");
    let resolve_market_instruction = Instruction {
        program_id,
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: PredictionMarketInstruction::ResolveMarket {
            market_id: market_account,
            winning_outcome: 0, // "Yes" wins
        }
        .try_to_vec()
        .unwrap(),
    };

    let resolve_checks = vec![
        Check::success(),
    ];

    context.process_and_validate_instruction(&resolve_market_instruction, &resolve_checks);

    // Verify final state
    let store = context.account_store.borrow();
    let market_data = store.get(&market_account).unwrap();
    let market: PredictionMarket = borsh::BorshDeserialize::try_from_slice(&market_data.data).unwrap();
    
    assert!(market.is_resolved);
    assert_eq!(market.winning_outcome, Some(0));
    
    println!("✅ Complete prediction market workflow test passed!");
    println!("Market: {}", market.title);
    println!("Resolved: {}", market.is_resolved);
    println!("Winning outcome: {:?}", market.winning_outcome);
}

#[test]
fn test_multiple_markets() {
    let program_id = Pubkey::new_unique();
    let mollusk = Mollusk::new(&program_id, "target/deploy/oraculo_prediction_market");

    let creator = Pubkey::new_unique();
    let market1 = Pubkey::new_unique();
    let market2 = Pubkey::new_unique();

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

    let context = mollusk.with_context(account_store);

    // Create first market
    let create_market1_instruction = Instruction {
        program_id,
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market1, false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: PredictionMarketInstruction::CreateMarket {
            title: "Bitcoin $100k?".to_string(),
            description: "Will Bitcoin reach $100k?".to_string(),
            end_time: 1735689600,
            outcome_options: vec!["Yes".to_string(), "No".to_string()],
        }
        .try_to_vec()
        .unwrap(),
    };

    context.process_and_validate_instruction(&create_market1_instruction, &[Check::success()]);

    // Create second market
    let create_market2_instruction = Instruction {
        program_id,
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market2, false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: PredictionMarketInstruction::CreateMarket {
            title: "Ethereum $10k?".to_string(),
            description: "Will Ethereum reach $10k?".to_string(),
            end_time: 1735689600,
            outcome_options: vec!["Yes".to_string(), "No".to_string()],
        }
        .try_to_vec()
        .unwrap(),
    };

    context.process_and_validate_instruction(&create_market2_instruction, &[Check::success()]);

    println!("✅ Multiple markets test passed!");
}

#[test]
fn test_error_handling() {
    let program_id = Pubkey::new_unique();
    let mollusk = Mollusk::new(&program_id, "target/deploy/oraculo_prediction_market");

    let non_creator = Pubkey::new_unique();
    let market_account = Pubkey::new_unique();

    let accounts = vec![
        (
            non_creator,
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

    // Try to resolve market without being the creator
    let resolve_instruction = Instruction {
        program_id,
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(non_creator, true),
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

    // This should fail because non_creator is not the market creator
    let result = mollusk.process_instruction(&resolve_instruction, &accounts);
    assert!(result.program_result.is_err());
    
    println!("✅ Error handling test passed!");
}
