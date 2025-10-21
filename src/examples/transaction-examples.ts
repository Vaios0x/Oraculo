// Solana Transaction Examples
// ===========================
// Examples demonstrating how to write data to Solana network

import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolanaTransactionManager, TransactionUtils } from "../utils/solana-transactions";

/**
 * Example 1: Transfer SOL between accounts
 * Demonstrates basic SOL transfer functionality
 */
export async function transferSOLExample() {
  console.log("💰 Transfer SOL Example");
  console.log("=======================");

  // Create connection
  const connection = new Connection("http://localhost:8899", "confirmed");
  const transactionManager = new SolanaTransactionManager(connection);

  // Generate keypairs
  const sender = Keypair.generate();
  const receiver = Keypair.generate();

  console.log(`Sender: ${sender.publicKey.toString()}`);
  console.log(`Receiver: ${receiver.publicKey.toString()}`);

  try {
    // Fund sender account
    console.log("📥 Funding sender account...");
    const airdropSignature = await connection.requestAirdrop(
      sender.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature, "confirmed");
    console.log("✅ Sender funded");

    // Check initial balances
    const initialSenderBalance = await TransactionUtils.getAccountBalance(connection, sender.publicKey);
    const initialReceiverBalance = await TransactionUtils.getAccountBalance(connection, receiver.publicKey);
    
    console.log(`Initial Sender Balance: ${initialSenderBalance} SOL`);
    console.log(`Initial Receiver Balance: ${initialReceiverBalance} SOL`);

    // Transfer 0.1 SOL
    console.log("🔄 Transferring 0.1 SOL...");
    const transferResult = await transactionManager.transferSOL({
      from: sender.publicKey,
      to: receiver.publicKey,
      amount: 0.1,
      signer: sender
    });

    if (transferResult.success) {
      console.log(`✅ Transfer successful! Signature: ${transferResult.signature}`);
      
      // Check final balances
      const finalSenderBalance = await TransactionUtils.getAccountBalance(connection, sender.publicKey);
      const finalReceiverBalance = await TransactionUtils.getAccountBalance(connection, receiver.publicKey);
      
      console.log(`Final Sender Balance: ${finalSenderBalance} SOL`);
      console.log(`Final Receiver Balance: ${finalReceiverBalance} SOL`);
    } else {
      console.log(`❌ Transfer failed: ${transferResult.error}`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 2: Create a new token
 * Demonstrates token creation using Token Extensions Program
 */
export async function createTokenExample() {
  console.log("🪙 Create Token Example");
  console.log("=======================");

  // Create connection
  const connection = new Connection("http://localhost:8899", "confirmed");
  const transactionManager = new SolanaTransactionManager(connection);

  // Generate wallet
  const wallet = Keypair.generate();
  console.log(`Wallet: ${wallet.publicKey.toString()}`);

  try {
    // Fund wallet
    console.log("📥 Funding wallet...");
    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature, "confirmed");
    console.log("✅ Wallet funded");

    // Create token with 6 decimals
    console.log("🪙 Creating token...");
    const createTokenResult = await transactionManager.createToken({
      wallet,
      decimals: 6,
      mintAuthority: wallet.publicKey,
      freezeAuthority: wallet.publicKey
    });

    if (createTokenResult.success && createTokenResult.mintAddress) {
      console.log(`✅ Token created successfully!`);
      console.log(`Mint Address: ${createTokenResult.mintAddress.toString()}`);
      console.log(`Transaction Signature: ${createTokenResult.signature}`);
    } else {
      console.log(`❌ Token creation failed: ${createTokenResult.error}`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 3: Mint tokens to an account
 * Demonstrates minting tokens to a specific account
 */
export async function mintTokensExample() {
  console.log("🏭 Mint Tokens Example");
  console.log("=====================");

  // Create connection
  const connection = new Connection("http://localhost:8899", "confirmed");
  const transactionManager = new SolanaTransactionManager(connection);

  // Generate accounts
  const wallet = Keypair.generate();
  const recipient = Keypair.generate();

  console.log(`Wallet: ${wallet.publicKey.toString()}`);
  console.log(`Recipient: ${recipient.publicKey.toString()}`);

  try {
    // Fund wallet
    console.log("📥 Funding wallet...");
    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature, "confirmed");
    console.log("✅ Wallet funded");

    // Create token
    console.log("🪙 Creating token...");
    const createTokenResult = await transactionManager.createToken({
      wallet,
      decimals: 6
    });

    if (!createTokenResult.success || !createTokenResult.mintAddress) {
      console.log(`❌ Token creation failed: ${createTokenResult.error}`);
      return;
    }

    const mintAddress = createTokenResult.mintAddress;
    console.log(`✅ Token created: ${mintAddress.toString()}`);

    // Create associated token account for recipient
    console.log("📝 Creating associated token account...");
    const createAccountResult = await transactionManager.createAssociatedTokenAccount(
      recipient.publicKey,
      mintAddress,
      wallet
    );

    if (!createAccountResult.success) {
      console.log(`❌ Account creation failed: ${createAccountResult.error}`);
      return;
    }

    console.log("✅ Associated token account created");

    // Mint 1000 tokens to recipient
    console.log("🏭 Minting 1000 tokens...");
    const mintResult = await transactionManager.mintTokens(
      mintAddress,
      await getAssociatedTokenAddress(mintAddress, recipient.publicKey, true),
      1000 * Math.pow(10, 6), // 1000 tokens with 6 decimals
      wallet
    );

    if (mintResult.success) {
      console.log(`✅ Tokens minted successfully!`);
      console.log(`Transaction Signature: ${mintResult.signature}`);
    } else {
      console.log(`❌ Minting failed: ${mintResult.error}`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 4: Transfer tokens between accounts
 * Demonstrates token transfer functionality
 */
export async function transferTokensExample() {
  console.log("🔄 Transfer Tokens Example");
  console.log("===========================");

  // Create connection
  const connection = new Connection("http://localhost:8899", "confirmed");
  const transactionManager = new SolanaTransactionManager(connection);

  // Generate accounts
  const sender = Keypair.generate();
  const receiver = Keypair.generate();

  console.log(`Sender: ${sender.publicKey.toString()}`);
  console.log(`Receiver: ${receiver.publicKey.toString()}`);

  try {
    // Fund sender
    console.log("📥 Funding sender...");
    const airdropSignature = await connection.requestAirdrop(
      sender.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature, "confirmed");
    console.log("✅ Sender funded");

    // Create token
    console.log("🪙 Creating token...");
    const createTokenResult = await transactionManager.createToken({
      wallet: sender,
      decimals: 6
    });

    if (!createTokenResult.success || !createTokenResult.mintAddress) {
      console.log(`❌ Token creation failed: ${createTokenResult.error}`);
      return;
    }

    const mintAddress = createTokenResult.mintAddress;
    console.log(`✅ Token created: ${mintAddress.toString()}`);

    // Create associated token accounts
    console.log("📝 Creating associated token accounts...");
    
    const senderTokenAccount = await getAssociatedTokenAddress(mintAddress, sender.publicKey, true);
    const receiverTokenAccount = await getAssociatedTokenAddress(mintAddress, receiver.publicKey, true);

    await transactionManager.createAssociatedTokenAccount(mintAddress, sender.publicKey, sender);
    await transactionManager.createAssociatedTokenAccount(mintAddress, receiver.publicKey, sender);

    // Mint tokens to sender
    console.log("🏭 Minting tokens to sender...");
    await transactionManager.mintTokens(
      mintAddress,
      senderTokenAccount,
      1000 * Math.pow(10, 6),
      sender
    );

    // Transfer 100 tokens to receiver
    console.log("🔄 Transferring 100 tokens...");
    const transferResult = await transactionManager.transferTokens(
      senderTokenAccount,
      receiverTokenAccount,
      100 * Math.pow(10, 6),
      sender
    );

    if (transferResult.success) {
      console.log(`✅ Token transfer successful!`);
      console.log(`Transaction Signature: ${transferResult.signature}`);
    } else {
      console.log(`❌ Transfer failed: ${transferResult.error}`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 5: Complex transaction with multiple instructions
 * Demonstrates building complex transactions
 */
export async function complexTransactionExample() {
  console.log("🔧 Complex Transaction Example");
  console.log("==============================");

  // Create connection
  const connection = new Connection("http://localhost:8899", "confirmed");
  const transactionManager = new SolanaTransactionManager(connection);

  // Generate accounts
  const wallet = Keypair.generate();
  const recipient1 = Keypair.generate();
  const recipient2 = Keypair.generate();

  console.log(`Wallet: ${wallet.publicKey.toString()}`);
  console.log(`Recipient 1: ${recipient1.publicKey.toString()}`);
  console.log(`Recipient 2: ${recipient2.publicKey.toString()}`);

  try {
    // Fund wallet
    console.log("📥 Funding wallet...");
    const airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature, "confirmed");
    console.log("✅ Wallet funded");

    // Create multiple transfers in one transaction
    console.log("🔄 Creating complex transaction...");
    
    const transfer1 = await transactionManager.transferSOL({
      from: wallet.publicKey,
      to: recipient1.publicKey,
      amount: 0.1,
      signer: wallet
    });

    const transfer2 = await transactionManager.transferSOL({
      from: wallet.publicKey,
      to: recipient2.publicKey,
      amount: 0.05,
      signer: wallet
    });

    if (transfer1.success && transfer2.success) {
      console.log("✅ Complex transaction successful!");
      console.log(`Transfer 1 Signature: ${transfer1.signature}`);
      console.log(`Transfer 2 Signature: ${transfer2.signature}`);
    } else {
      console.log("❌ Complex transaction failed");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 6: Transaction analysis and monitoring
 * Demonstrates how to analyze transaction results
 */
export async function analyzeTransactionExample(signature: string) {
  console.log(`🔍 Analyzing Transaction: ${signature}`);
  console.log("=====================================");

  const connection = new Connection("http://localhost:8899", "confirmed");
  const transactionManager = new SolanaTransactionManager(connection);

  try {
    // Get transaction details
    const transaction = await transactionManager.getTransactionDetails(signature);
    if (transaction) {
      console.log("📊 Transaction Details:");
      console.log(JSON.stringify(transaction, null, 2));
    }

    // Check if transaction was successful
    const isSuccessful = await transactionManager.isTransactionSuccessful(signature);
    console.log(`✅ Transaction Successful: ${isSuccessful}`);

  } catch (error) {
    console.error("❌ Error analyzing transaction:", error);
  }
}

// Export all examples for easy importing
export const TransactionExamples = {
  transferSOL: transferSOLExample,
  createToken: createTokenExample,
  mintTokens: mintTokensExample,
  transferTokens: transferTokensExample,
  complexTransaction: complexTransactionExample,
  analyzeTransaction: analyzeTransactionExample
};

// Helper import for getAssociatedTokenAddress
import { getAssociatedTokenAddress } from "@solana/spl-token";
