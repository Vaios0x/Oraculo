use criterion::{black_box, criterion_group, criterion_main, Criterion};
use oraculo_token_integration::TokenIntegrationInstruction;
use solana_sdk::pubkey::Pubkey;
use borsh::BorshDeserialize;

fn benchmark_instruction_serialization(c: &mut Criterion) {
    let create_market_instruction = TokenIntegrationInstruction::CreateTokenMarket {
        title: "Benchmark Market".to_string(),
        description: "A market for benchmarking".to_string(),
        end_time: 1735689600,
        outcome_options: vec!["Yes".to_string(), "No".to_string()],
        token_decimals: 9,
    };

    let stake_tokens_instruction = TokenIntegrationInstruction::StakeTokens {
        market_id: Pubkey::new_unique(),
        outcome_index: 0,
        amount: 1_000_000,
    };

    let distribute_instruction = TokenIntegrationInstruction::DistributeWinnings {
        market_id: Pubkey::new_unique(),
        winning_outcome: 0,
    };

    c.bench_function("create_market_serialization", |b| {
        b.iter(|| {
            black_box(borsh::to_vec(&create_market_instruction).unwrap());
        })
    });

    c.bench_function("stake_tokens_serialization", |b| {
        b.iter(|| {
            black_box(borsh::to_vec(&stake_tokens_instruction).unwrap());
        })
    });

    c.bench_function("distribute_winnings_serialization", |b| {
        b.iter(|| {
            black_box(borsh::to_vec(&distribute_instruction).unwrap());
        })
    });
}

fn benchmark_instruction_deserialization(c: &mut Criterion) {
    let create_market_data = borsh::to_vec(&TokenIntegrationInstruction::CreateTokenMarket {
        title: "Benchmark Market".to_string(),
        description: "A market for benchmarking".to_string(),
        end_time: 1735689600,
        outcome_options: vec!["Yes".to_string(), "No".to_string()],
        token_decimals: 9,
    }).unwrap();

    let stake_tokens_data = borsh::to_vec(&TokenIntegrationInstruction::StakeTokens {
        market_id: Pubkey::new_unique(),
        outcome_index: 0,
        amount: 1_000_000,
    }).unwrap();

    let distribute_data = borsh::to_vec(&TokenIntegrationInstruction::DistributeWinnings {
        market_id: Pubkey::new_unique(),
        winning_outcome: 0,
    }).unwrap();

    c.bench_function("create_market_deserialization", |b| {
        b.iter(|| {
            black_box(TokenIntegrationInstruction::try_from_slice(&create_market_data).unwrap());
        })
    });

    c.bench_function("stake_tokens_deserialization", |b| {
        b.iter(|| {
            black_box(TokenIntegrationInstruction::try_from_slice(&stake_tokens_data).unwrap());
        })
    });

    c.bench_function("distribute_winnings_deserialization", |b| {
        b.iter(|| {
            black_box(TokenIntegrationInstruction::try_from_slice(&distribute_data).unwrap());
        })
    });
}

criterion_group!(benches, benchmark_instruction_serialization, benchmark_instruction_deserialization);
criterion_main!(benches);
