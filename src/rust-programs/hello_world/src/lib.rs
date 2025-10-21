use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello, OráculoS!");
    msg!("Welcome to the future of prediction markets!");
    Ok(())
}

#[cfg(test)]
mod tests {
    use mollusk_svm::{result::Check, Mollusk};
    use solana_sdk::{instruction::Instruction, pubkey::Pubkey};

    #[test]
    fn test_hello_world() {
        let program_id = Pubkey::new_unique();
        let mollusk = Mollusk::new(&program_id, "target/deploy/hello_world");

        let instruction = Instruction::new_with_bytes(program_id, &[], vec![]);

        mollusk.process_and_validate_instruction(&instruction, &[], &[Check::success()]);
    }

    #[test]
    fn test_hello_world_with_validation() {
        let program_id = Pubkey::new_unique();
        let mollusk = Mollusk::new(&program_id, "target/deploy/hello_world");

        let instruction = Instruction::new_with_bytes(program_id, &[], vec![]);

        // Define validation checks
        let checks = vec![
            Check::success(),
            Check::compute_units(211), // Expected compute units
        ];

        mollusk.process_and_validate_instruction(&instruction, &[], &checks);
    }
}
