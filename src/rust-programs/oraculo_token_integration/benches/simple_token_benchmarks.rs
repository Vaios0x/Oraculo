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

    // Create market instruction
    let create_market_instruction = Instruction {
        program_id: Pubkey::new_unique(),
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new(token_mint, false),
            solana_sdk::instruction::AccountMeta::new(market_token_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(token::ID, false),
            solana_sdk::instruction::AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: borsh::to_vec(&TokenIntegrationInstruction::CreateTokenMarket {
            title: "Benchmark Market".to_string(),
            description: "A market for benchmarking".to_string(),
            end_time: 1735689600,
            outcome_options: vec!["Yes".to_string(), "No".to_string()],
            token_decimals: 9,
        }).unwrap(),
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

    // Create stake tokens instruction
    let stake_tokens_instruction = Instruction {
        program_id: Pubkey::new_unique(),
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(bettor, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new(bettor_token_account, false),
            solana_sdk::instruction::AccountMeta::new(market_token_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(token::ID, false),
        ],
        data: borsh::to_vec(&TokenIntegrationInstruction::StakeTokens {
            market_id: market_account,
            outcome_index: 0,
            amount: 1_000_000,
        }).unwrap(),
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

    // Create distribute winnings instruction
    let distribute_instruction = Instruction {
        program_id: Pubkey::new_unique(),
        accounts: vec![
            solana_sdk::instruction::AccountMeta::new(creator, true),
            solana_sdk::instruction::AccountMeta::new(market_account, false),
            solana_sdk::instruction::AccountMeta::new(market_token_account, false),
            solana_sdk::instruction::AccountMeta::new_readonly(token::ID, false),
        ],
        data: borsh::to_vec(&TokenIntegrationInstruction::DistributeWinnings {
            market_id: market_account,
            winning_outcome: 0,
        }).unwrap(),
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
        .bench(("create_token_market", &create_market_instruction, &create_market_accounts))
        .bench(("stake_tokens", &stake_tokens_instruction, &stake_tokens_accounts))
        .bench(("distribute_winnings", &distribute_instruction, &distribute_accounts))
        .must_pass(true)
        .out_dir("./target/benches")
        .execute();
}
