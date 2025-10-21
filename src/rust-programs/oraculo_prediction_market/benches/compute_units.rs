use {
    mollusk_svm::Mollusk,
    mollusk_svm_bencher::MolluskComputeUnitBencher,
    oraculo_prediction_market::PredictionMarketInstruction,
    solana_sdk::{
        account::Account,
        instruction::Instruction,
        pubkey::Pubkey,
        system_program,
    },
};

fn main() {
    // Initialize Mollusk
    let mollusk = Mollusk::default();

    // Create test accounts
    let creator = Pubkey::new_unique();
    let bettor = Pubkey::new_unique();
    let market_account = Pubkey::new_unique();
    let bet_account = Pubkey::new_unique();

    // Create market instruction
    let create_market_instruction = Instruction {
        program_id: Pubkey::new_unique(),
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: PredictionMarketInstruction::CreateMarket {
            title: "Benchmark Market".to_string(),
            description: "A market for benchmarking".to_string(),
            end_time: 1735689600,
            outcome_options: vec!["Yes".to_string(), "No".to_string()],
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
    ];

    // Create bet instruction
    let place_bet_instruction = Instruction {
        program_id: Pubkey::new_unique(),
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

    let place_bet_accounts = vec![
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

    // Create resolve instruction
    let resolve_market_instruction = Instruction {
        program_id: Pubkey::new_unique(),
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

    let resolve_market_accounts = vec![
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

    // Run benchmarks
    MolluskComputeUnitBencher::new(mollusk)
        .bench(("create_market", &create_market_instruction, &create_market_accounts))
        .bench(("place_bet", &place_bet_instruction, &place_bet_accounts))
        .bench(("resolve_market", &resolve_market_instruction, &resolve_market_accounts))
        .must_pass(true)
        .out_dir("./target/benches")
        .execute();
}
