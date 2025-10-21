// Transaction and Instruction Structure Examples
// =============================================
// Examples demonstrating transaction and instruction concepts

import { Connection, PublicKey, Keypair, Transaction, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolanaTransactionManager } from "../utils/solana-transactions";

/**
 * Example 1: Transaction Basics
 * Demonstrates fundamental transaction concepts
 */
export async function transactionBasicsExample() {
  console.log("📋 Transaction Basics Example");
  console.log("=============================");

  console.log("📋 Transaction Concepts:");
  console.log("");
  console.log("1. What is a Transaction?");
  console.log("   - Atomic unit of execution");
  console.log("   - Contains one or more instructions");
  console.log("   - All instructions succeed or all fail");
  console.log("   - Size limit: 1232 bytes");
  console.log("");
  console.log("2. Transaction Components:");
  console.log("   - Signatures: Array of signatures");
  console.log("   - Message: Transaction message");
  console.log("   - Recent Blockhash: Timestamp");
  console.log("   - Instructions: Array of instructions");
  console.log("");
  console.log("3. Transaction Properties:");
  console.log("   - Atomic: All or nothing");
  console.log("   - Sequential: Instructions execute in order");
  console.log("   - Signed: Requires signatures");
  console.log("   - Timestamped: Uses recent blockhash");
}

/**
 * Example 2: Instruction Structure
 * Demonstrates instruction components
 */
export async function instructionStructureExample() {
  console.log("🔧 Instruction Structure Example");
  console.log("================================");

  console.log("📋 Instruction Components:");
  console.log("");
  console.log("1. Program ID:");
  console.log("   - Address of the program to invoke");
  console.log("   - Example: System Program (11111111111111111111111111111111)");
  console.log("   - Example: Token Program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)");
  console.log("");
  console.log("2. Accounts:");
  console.log("   - List of accounts the instruction uses");
  console.log("   - Each account has metadata:");
  console.log("     * pubkey: Account address");
  console.log("     * is_signer: Must sign transaction");
  console.log("     * is_writable: Can be modified");
  console.log("");
  console.log("3. Instruction Data:");
  console.log("   - Byte array specifying which instruction to invoke");
  console.log("   - Includes function arguments");
  console.log("   - Program-specific format");
}

/**
 * Example 3: AccountMeta Details
 * Demonstrates AccountMeta structure
 */
export async function accountMetaExample() {
  console.log("👤 AccountMeta Example");
  console.log("======================");

  console.log("📋 AccountMeta Properties:");
  console.log("");
  console.log("1. pubkey:");
  console.log("   - Account's public key");
  console.log("   - Unique identifier");
  console.log("   - Required for all accounts");
  console.log("");
  console.log("2. is_signer:");
  console.log("   - Whether account must sign transaction");
  console.log("   - true: Account must sign");
  console.log("   - false: Account doesn't need to sign");
  console.log("   - Example: User wallet (true), Token account (false)");
  console.log("");
  console.log("3. is_writable:");
  console.log("   - Whether account can be modified");
  console.log("   - true: Account data can change");
  console.log("   - false: Account is read-only");
  console.log("   - Example: User wallet (true), Program account (false)");
}

/**
 * Example 4: Message Structure
 * Demonstrates transaction message structure
 */
export async function messageStructureExample() {
  console.log("📨 Message Structure Example");
  console.log("============================");

  console.log("📋 Message Components:");
  console.log("");
  console.log("1. Message Header:");
  console.log("   - num_required_signatures: Number of signers");
  console.log("   - num_readonly_signed_accounts: Read-only signers");
  console.log("   - num_readonly_unsigned_accounts: Read-only non-signers");
  console.log("");
  console.log("2. Account Addresses:");
  console.log("   - Ordered list of all account addresses");
  console.log("   - Order: Writable signers, Read-only signers, Writable non-signers, Read-only non-signers");
  console.log("   - Compact array format");
  console.log("");
  console.log("3. Recent Blockhash:");
  console.log("   - Timestamp for transaction");
  console.log("   - Prevents duplicate transactions");
  console.log("   - Expires after 150 blocks (~1 minute)");
  console.log("");
  console.log("4. Instructions:");
  console.log("   - Array of CompiledInstruction");
  console.log("   - Each instruction has:");
  console.log("     * program_id_index: Index into account addresses");
  console.log("     * accounts: Array of account indices");
  console.log("     * data: Instruction data");
}

/**
 * Example 5: Transaction Size Limits
 * Demonstrates transaction size constraints
 */
export async function transactionSizeExample() {
  console.log("📏 Transaction Size Example");
  console.log("===========================");

  console.log("📋 Size Constraints:");
  console.log("");
  console.log("1. Total Size Limit:");
  console.log("   - Maximum: 1232 bytes");
  console.log("   - Based on IPv6 MTU (1280 bytes)");
  console.log("   - Minus network headers (48 bytes)");
  console.log("");
  console.log("2. Size Components:");
  console.log("   - Signatures: 64 bytes each");
  console.log("   - Message header: 3 bytes");
  console.log("   - Account keys: 32 bytes each");
  console.log("   - Recent blockhash: 32 bytes");
  console.log("   - Instructions: Variable size");
  console.log("");
  console.log("3. Optimization Strategies:");
  console.log("   - Minimize number of accounts");
  console.log("   - Use compact data formats");
  console.log("   - Batch operations when possible");
  console.log("   - Split large transactions");
}

/**
 * Example 6: Building Complex Transactions
 * Demonstrates building complex transactions
 */
export async function complexTransactionExample() {
  console.log("🔧 Complex Transaction Example");
  console.log("==============================");

  const connection = new Connection("http://localhost:8899", "confirmed");
  const transactionManager = new SolanaTransactionManager(connection);

  // Generate keypairs
  const sender = Keypair.generate();
  const recipient1 = Keypair.generate();
  const recipient2 = Keypair.generate();

  console.log("📋 Complex Transaction Components:");
  console.log("");
  console.log("1. Multiple Instructions:");
  console.log("   - Transfer SOL to recipient 1");
  console.log("   - Transfer SOL to recipient 2");
  console.log("   - All in one transaction");
  console.log("");
  console.log("2. Account Management:");
  console.log("   - Sender: Writable signer");
  console.log("   - Recipient 1: Writable non-signer");
  console.log("   - Recipient 2: Writable non-signer");
  console.log("   - System Program: Read-only non-signer");
  console.log("");
  console.log("3. Transaction Structure:");
  console.log("   - Header: 1 signer, 0 read-only signers, 1 read-only non-signer");
  console.log("   - Accounts: [sender, recipient1, recipient2, system_program]");
  console.log("   - Instructions: [transfer1, transfer2]");
  console.log("   - Recent blockhash: Current blockhash");

  try {
    // Fund sender
    const airdropSignature = await connection.requestAirdrop(
      sender.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);

    // Create multiple transfer instructions
    const transfer1 = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: recipient1.publicKey,
      lamports: 0.1 * LAMPORTS_PER_SOL
    });

    const transfer2 = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: recipient2.publicKey,
      lamports: 0.05 * LAMPORTS_PER_SOL
    });

    // Build transaction with multiple instructions
    const transaction = new Transaction().add(transfer1, transfer2);

    // Send transaction
    const signature = await connection.sendTransaction(transaction, [sender]);
    console.log("✅ Complex transaction sent:", signature);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 7: Transaction Analysis
 * Demonstrates analyzing transaction structure
 */
export async function transactionAnalysisExample() {
  console.log("🔍 Transaction Analysis Example");
  console.log("===============================");

  console.log("📋 Analysis Techniques:");
  console.log("");
  console.log("1. Transaction Inspection:");
  console.log("   - getTransaction RPC method");
  console.log("   - Transaction signature lookup");
  console.log("   - Solana Explorer inspection");
  console.log("");
  console.log("2. Key Information:");
  console.log("   - Block time and slot");
  console.log("   - Compute units consumed");
  console.log("   - Transaction fee");
  console.log("   - Account balance changes");
  console.log("   - Program logs");
  console.log("");
  console.log("3. Error Analysis:");
  console.log("   - Transaction status");
  console.log("   - Error messages");
  console.log("   - Account state changes");
  console.log("   - Program execution logs");
}

/**
 * Example 8: Instruction Data Format
 * Demonstrates instruction data structure
 */
export async function instructionDataExample() {
  console.log("📊 Instruction Data Example");
  console.log("==========================");

  console.log("📋 Data Format:");
  console.log("");
  console.log("1. Discriminator:");
  console.log("   - First 8 bytes identify instruction");
  console.log("   - Generated from instruction name");
  console.log("   - Example: 'transfer' -> [2, 0, 0, 0, 128, 150, 152, 0]");
  console.log("");
  console.log("2. Arguments:");
  console.log("   - Function parameters");
  console.log("   - Serialized according to program format");
  console.log("   - Example: Amount (u64) -> 8 bytes");
  console.log("");
  console.log("3. Serialization:");
  console.log("   - Borsh serialization (common)");
  console.log("   - Program-specific formats");
  console.log("   - Endianness considerations");
}

/**
 * Example 9: Transaction Optimization
 * Demonstrates transaction optimization techniques
 */
export async function transactionOptimizationExample() {
  console.log("⚡ Transaction Optimization Example");
  console.log("=================================");

  console.log("📋 Optimization Strategies:");
  console.log("");
  console.log("1. Account Optimization:");
  console.log("   - Minimize account count");
  console.log("   - Reuse accounts when possible");
  console.log("   - Order accounts efficiently");
  console.log("");
  console.log("2. Instruction Optimization:");
  console.log("   - Batch related operations");
  console.log("   - Minimize instruction data");
  console.log("   - Use efficient serialization");
  console.log("");
  console.log("3. Size Optimization:");
  console.log("   - Compact data formats");
  console.log("   - Remove unnecessary accounts");
  console.log("   - Split large transactions");
  console.log("");
  console.log("4. Performance Optimization:");
  console.log("   - Parallel execution when possible");
  console.log("   - Minimize compute units");
  console.log("   - Efficient account access");
}

/**
 * Example 10: Transaction Testing
 * Demonstrates testing transaction scenarios
 */
export async function transactionTestingExample() {
  console.log("🧪 Transaction Testing Example");
  console.log("==============================");

  console.log("📋 Testing Approaches:");
  console.log("");
  console.log("1. Unit Testing:");
  console.log("   - Test individual instructions");
  console.log("   - Mock account states");
  console.log("   - Test error conditions");
  console.log("");
  console.log("2. Integration Testing:");
  console.log("   - Test complete transactions");
  console.log("   - Test with real accounts");
  console.log("   - Test edge cases");
  console.log("");
  console.log("3. Transaction Testing:");
  console.log("   - Test transaction structure");
  console.log("   - Test account ordering");
  console.log("   - Test size limits");
  console.log("");
  console.log("4. Error Testing:");
  console.log("   - Test insufficient funds");
  console.log("   - Test invalid accounts");
  console.log("   - Test expired blockhash");
  console.log("   - Test signature validation");
}

// Export all examples for easy importing
export const TransactionStructureExamples = {
  basics: transactionBasicsExample,
  instructionStructure: instructionStructureExample,
  accountMeta: accountMetaExample,
  messageStructure: messageStructureExample,
  transactionSize: transactionSizeExample,
  complexTransaction: complexTransactionExample,
  transactionAnalysis: transactionAnalysisExample,
  instructionData: instructionDataExample,
  transactionOptimization: transactionOptimizationExample,
  transactionTesting: transactionTestingExample
};
