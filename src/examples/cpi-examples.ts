// Cross Program Invocation (CPI) Examples
// =======================================
// Examples demonstrating CPI concepts and inter-program communication

import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";

/**
 * Example 1: CPI Basics
 * Demonstrates fundamental CPI concepts
 */
export async function cpiBasicsExample() {
  console.log("🔗 CPI Basics Example");
  console.log("====================");

  console.log("📋 CPI Concepts:");
  console.log("");
  console.log("1. What is CPI?");
  console.log("   - Cross Program Invocation");
  console.log("   - Programs calling other programs");
  console.log("   - Enables program composition");
  console.log("   - Maintains atomicity");
  console.log("");
  console.log("2. CPI Benefits:");
  console.log("   - Code reusability");
  console.log("   - Modular design");
  console.log("   - Complex interactions");
  console.log("   - Atomic transactions");
  console.log("");
  console.log("3. Common CPI Targets:");
  console.log("   - System Program (SOL transfers)");
  console.log("   - Token Program (token operations)");
  console.log("   - Custom Programs (business logic)");
  console.log("");
  console.log("4. CPI Context:");
  console.log("   - CpiContext for program calls");
  console.log("   - Account info for targets");
  console.log("   - Signer seeds for PDA signing");
}

/**
 * Example 2: System Program CPI
 * Demonstrates CPI with System Program
 */
export async function systemProgramCpiExample() {
  console.log("💰 System Program CPI Example");
  console.log("=============================");

  console.log("📋 System Program CPI:");
  console.log("");
  console.log("1. SOL Transfers:");
  console.log("   - Transfer SOL between accounts");
  console.log("   - Program can sign for PDAs");
  console.log("   - Atomic transaction execution");
  console.log("");
  console.log("2. Account Creation:");
  console.log("   - Create new accounts");
  console.log("   - Allocate space");
  console.log("   - Assign ownership");
  console.log("");
  console.log("3. Example Code:");
  console.log("   let transfer_accounts = Transfer {");
  console.log("       from: user.to_account_info(),");
  console.log("       to: vault.to_account_info(),");
  console.log("   };");
  console.log("   let cpi_context = CpiContext::new(");
  console.log("       system_program.to_account_info(),");
  console.log("       transfer_accounts,");
  console.log("   );");
  console.log("   transfer(cpi_context, amount)?;");
}

/**
 * Example 3: PDA Signing with CPI
 * Demonstrates how programs sign for PDAs
 */
export async function pdaSigningCpiExample() {
  console.log("🔐 PDA Signing with CPI Example");
  console.log("===============================");

  console.log("📋 PDA Signing Concepts:");
  console.log("");
  console.log("1. PDA Signing:");
  console.log("   - Programs can sign for PDAs");
  console.log("   - No private key required");
  console.log("   - Deterministic signing");
  console.log("   - Secure and verifiable");
  console.log("");
  console.log("2. Signer Seeds:");
  console.log("   - Seeds used to derive PDA");
  console.log("   - Must match PDA derivation");
  console.log("   - Include bump for verification");
  console.log("   - Example: [b'vault', user.key(), &[bump]]");
  console.log("");
  console.log("3. CPI Context with Signer:");
  console.log("   let signer_seeds: &[&[&[u8]]] = &[&[");
  console.log("       b'vault',");
  console.log("       user_key.as_ref(),");
  console.log("       &[ctx.bumps.vault_account]");
  console.log("   ]];");
  console.log("   let cpi_context = CpiContext::new(...)");
  console.log("       .with_signer(signer_seeds);");
}

/**
 * Example 4: Token Program CPI
 * Demonstrates CPI with Token Program
 */
export async function tokenProgramCpiExample() {
  console.log("🪙 Token Program CPI Example");
  console.log("===========================");

  console.log("📋 Token Program CPI:");
  console.log("");
  console.log("1. Token Operations:");
  console.log("   - Create token accounts");
  console.log("   - Transfer tokens");
  console.log("   - Mint tokens");
  console.log("   - Burn tokens");
  console.log("");
  console.log("2. Common Instructions:");
  console.log("   - createInitializeAccount");
  console.log("   - createTransfer");
  console.log("   - createMintTo");
  console.log("   - createBurn");
  console.log("");
  console.log("3. Example Code:");
  console.log("   let mint_ix = createMintToInstruction(");
  console.log("       mint_account,");
  console.log("       destination_account,");
  console.log("       authority,");
  console.log("       amount");
  console.log("   );");
  console.log("   let cpi_context = CpiContext::new(");
  console.log("       token_program.to_account_info(),");
  console.log("       mint_ix");
  console.log("   );");
}

/**
 * Example 5: Custom Program CPI
 * Demonstrates CPI with custom programs
 */
export async function customProgramCpiExample() {
  console.log("🔧 Custom Program CPI Example");
  console.log("============================");

  console.log("📋 Custom Program CPI:");
  console.log("");
  console.log("1. Program Composition:");
  console.log("   - Programs calling other programs");
  console.log("   - Business logic separation");
  console.log("   - Modular architecture");
  console.log("   - Reusable components");
  console.log("");
  console.log("2. Example Scenarios:");
  console.log("   - DeFi protocols");
  console.log("   - Gaming mechanics");
  console.log("   - NFT marketplaces");
  console.log("   - Governance systems");
  console.log("");
  console.log("3. Implementation:");
  console.log("   - Define instruction data");
  console.log("   - Create CPI context");
  console.log("   - Handle return values");
  console.log("   - Manage errors");
}

/**
 * Example 6: CPI Error Handling
 * Demonstrates error handling in CPI
 */
export async function cpiErrorHandlingExample() {
  console.log("❌ CPI Error Handling Example");
  console.log("============================");

  console.log("📋 Error Handling Strategies:");
  console.log("");
  console.log("1. CPI Errors:");
  console.log("   - Program execution failures");
  console.log("   - Insufficient funds");
  console.log("   - Invalid accounts");
  console.log("   - Permission denied");
  console.log("");
  console.log("2. Error Propagation:");
  console.log("   - CPI errors bubble up");
  console.log("   - Transaction fails atomically");
  console.log("   - State changes reverted");
  console.log("   - User gets clear feedback");
  console.log("");
  console.log("3. Best Practices:");
  console.log("   - Validate inputs before CPI");
  console.log("   - Check account states");
  console.log("   - Handle edge cases");
  console.log("   - Provide meaningful errors");
}

/**
 * Example 7: CPI Testing Strategies
 * Demonstrates testing approaches for CPI
 */
export async function cpiTestingStrategiesExample() {
  console.log("🧪 CPI Testing Strategies");
  console.log("=========================");

  console.log("📋 Testing Approaches:");
  console.log("");
  console.log("1. Unit Tests:");
  console.log("   - Test CPI logic in isolation");
  console.log("   - Mock external programs");
  console.log("   - Test error conditions");
  console.log("   - Verify account changes");
  console.log("");
  console.log("2. Integration Tests:");
  console.log("   - Test with real programs");
  console.log("   - Test complete workflows");
  console.log("   - Test error scenarios");
  console.log("   - Test edge cases");
  console.log("");
  console.log("3. CPI-Specific Tests:");
  console.log("   - Test PDA signing");
  console.log("   - Test account validation");
  console.log("   - Test error propagation");
  console.log("   - Test atomicity");
  console.log("");
  console.log("4. Performance Tests:");
  console.log("   - Test CPI execution time");
  console.log("   - Test compute unit usage");
  console.log("   - Test memory consumption");
  console.log("   - Test transaction limits");
}

/**
 * Example 8: CPI Best Practices
 * Demonstrates best practices for CPI usage
 */
export async function cpiBestPracticesExample() {
  console.log("⭐ CPI Best Practices");
  console.log("====================");

  console.log("📋 Best Practices:");
  console.log("");
  console.log("1. Account Validation:");
  console.log("   - Verify account ownership");
  console.log("   - Check account states");
  console.log("   - Validate account data");
  console.log("   - Handle missing accounts");
  console.log("");
  console.log("2. Error Handling:");
  console.log("   - Handle CPI failures gracefully");
  console.log("   - Provide meaningful error messages");
  console.log("   - Log important events");
  console.log("   - Test error scenarios");
  console.log("");
  console.log("3. Security:");
  console.log("   - Validate all inputs");
  console.log("   - Check permissions");
  console.log("   - Use proper signer seeds");
  console.log("   - Avoid privilege escalation");
  console.log("");
  console.log("4. Performance:");
  console.log("   - Minimize CPI calls");
  console.log("   - Batch operations when possible");
  console.log("   - Optimize account access");
  console.log("   - Monitor compute usage");
}

/**
 * Example 9: Advanced CPI Patterns
 * Demonstrates advanced CPI usage patterns
 */
export async function advancedCpiPatternsExample() {
  console.log("🚀 Advanced CPI Patterns");
  console.log("=======================");

  console.log("📋 Advanced Patterns:");
  console.log("");
  console.log("1. Nested CPIs:");
  console.log("   - CPI calling another CPI");
  console.log("   - Complex program chains");
  console.log("   - Maintain atomicity");
  console.log("   - Handle nested errors");
  console.log("");
  console.log("2. Conditional CPIs:");
  console.log("   - CPI based on conditions");
  console.log("   - Dynamic program selection");
  console.log("   - State-dependent calls");
  console.log("   - Flexible execution paths");
  console.log("");
  console.log("3. Batch CPIs:");
  console.log("   - Multiple CPI calls");
  console.log("   - Batch operations");
  console.log("   - Optimize performance");
  console.log("   - Reduce transaction count");
  console.log("");
  console.log("4. CPI with Events:");
  console.log("   - Emit events from CPI");
  console.log("   - Track program interactions");
  console.log("   - Debug and monitoring");
  console.log("   - Analytics and insights");
}

// Export all examples for easy importing
export const CpiExamples = {
  basics: cpiBasicsExample,
  systemProgram: systemProgramCpiExample,
  pdaSigning: pdaSigningCpiExample,
  tokenProgram: tokenProgramCpiExample,
  customProgram: customProgramCpiExample,
  errorHandling: cpiErrorHandlingExample,
  testingStrategies: cpiTestingStrategiesExample,
  bestPractices: cpiBestPracticesExample,
  advancedPatterns: advancedCpiPatternsExample
};
