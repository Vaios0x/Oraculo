// Solana Account Examples
// =======================
// Examples demonstrating how to read different types of Solana accounts

import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolanaAccountManager, AccountUtils, COMMON_PROGRAM_IDS } from "../utils/solana-accounts";

/**
 * Example 1: Fetch Wallet Account
 * Demonstrates how to create a wallet and fetch its account information
 */
export async function fetchWalletAccountExample() {
  console.log("🔑 Fetching Wallet Account Example");
  console.log("==================================");

  // Create connection
  const connection = AccountUtils.createConnection("http://localhost:8899");
  const accountManager = new SolanaAccountManager(connection);

  // Generate new keypair
  const keypair = Keypair.generate();
  console.log(`Public Key: ${keypair.publicKey.toString()}`);

  try {
    // Request airdrop (only works on devnet/localnet)
    const signature = await connection.requestAirdrop(
      keypair.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(signature, "confirmed");
    console.log("✅ Airdrop successful");

    // Fetch account information
    const account = await accountManager.fetchWalletAccount(keypair.publicKey);
    if (account) {
      console.log("📊 Account Information:");
      console.log(JSON.stringify(accountManager.formatAccountData(account), null, 2));
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 2: Fetch Program Account
 * Demonstrates how to fetch information about a Solana program
 */
export async function fetchProgramAccountExample() {
  console.log("🔧 Fetching Program Account Example");
  console.log("===================================");

  // Create connection to mainnet
  const connection = AccountUtils.createConnection("https://api.mainnet-beta.solana.com");
  const accountManager = new SolanaAccountManager(connection);

  try {
    // Fetch Token Program account
    const tokenProgramId = COMMON_PROGRAM_IDS.TOKEN_PROGRAM;
    console.log(`Token Program ID: ${tokenProgramId.toString()}`);

    const account = await accountManager.fetchProgramAccount(tokenProgramId);
    if (account) {
      console.log("📊 Program Account Information:");
      console.log(JSON.stringify(accountManager.formatAccountData(account), null, 2));
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 3: Fetch Mint Account
 * Demonstrates how to fetch and deserialize a mint account
 */
export async function fetchMintAccountExample() {
  console.log("🪙 Fetching Mint Account Example");
  console.log("=================================");

  // Create connection to mainnet
  const connection = AccountUtils.createConnection("https://api.mainnet-beta.solana.com");
  const accountManager = new SolanaAccountManager(connection);

  try {
    // USDC Mint address
    const usdcMintAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    console.log(`USDC Mint Address: ${usdcMintAddress.toString()}`);

    // Fetch mint account data
    const mintData = await accountManager.fetchMintAccount(usdcMintAddress);
    if (mintData) {
      console.log("📊 Mint Account Data:");
      console.log(JSON.stringify(mintData, null, 2));
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 4: Compare Different Account Types
 * Demonstrates the differences between wallet, program, and mint accounts
 */
export async function compareAccountTypesExample() {
  console.log("🔍 Comparing Account Types Example");
  console.log("==================================");

  const connection = AccountUtils.createConnection("https://api.mainnet-beta.solana.com");
  const accountManager = new SolanaAccountManager(connection);

  const accounts = [
    {
      name: "System Program",
      address: COMMON_PROGRAM_IDS.SYSTEM_PROGRAM.toString(),
      type: "Program"
    },
    {
      name: "Token Program", 
      address: COMMON_PROGRAM_IDS.TOKEN_PROGRAM.toString(),
      type: "Program"
    },
    {
      name: "USDC Mint",
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      type: "Mint"
    }
  ];

  for (const accountInfo of accounts) {
    try {
      const address = new PublicKey(accountInfo.address);
      const account = await accountManager.fetchWalletAccount(address);
      
      if (account) {
        console.log(`\n📊 ${accountInfo.name} (${accountInfo.type}):`);
        console.log(`   Owner: ${account.owner.toString()}`);
        console.log(`   Executable: ${account.executable}`);
        console.log(`   Lamports: ${account.lamports}`);
        console.log(`   Space: ${account.space} bytes`);
        console.log(`   Is Wallet: ${accountManager.isWalletAccount(account)}`);
        console.log(`   Is Program: ${accountManager.isProgramAccount(account)}`);
      }
    } catch (error) {
      console.error(`❌ Error fetching ${accountInfo.name}:`, error);
    }
  }
}

/**
 * Example 5: Account Analysis Tool
 * Comprehensive tool for analyzing any Solana account
 */
export async function analyzeAccount(address: string, network: string = "mainnet-beta") {
  console.log(`🔍 Analyzing Account: ${address}`);
  console.log("================================");

  const endpoint = network === "mainnet-beta" 
    ? "https://api.mainnet-beta.solana.com"
    : "https://api.devnet.solana.com";

  const connection = AccountUtils.createConnection(endpoint);
  const accountManager = new SolanaAccountManager(connection);

  try {
    const publicKey = new PublicKey(address);
    const account = await accountManager.fetchWalletAccount(publicKey);

    if (!account) {
      console.log("❌ Account not found");
      return;
    }

    console.log("📊 Analysis Results:");
    console.log("===================");
    
    const formatted = accountManager.formatAccountData(account);
    console.log(JSON.stringify(formatted, null, 2));

    // Additional analysis
    console.log("\n🔍 Additional Analysis:");
    console.log(`   Balance: ${formatted.balanceSOL} SOL`);
    console.log(`   Data Size: ${formatted.dataLength} bytes`);
    console.log(`   Account Type: ${formatted.isWallet ? 'Wallet' : formatted.isProgram ? 'Program' : 'State Account'}`);
    
    // Check if it's a known program
    const knownPrograms = Object.entries(COMMON_PROGRAM_IDS);
    const knownProgram = knownPrograms.find(([name, id]) => id.toString() === account.owner.toString());
    if (knownProgram) {
      console.log(`   Owned by: ${knownProgram[0]}`);
    }

  } catch (error) {
    console.error("❌ Error analyzing account:", error);
  }
}

// Export all examples for easy importing
export const AccountExamples = {
  fetchWalletAccount: fetchWalletAccountExample,
  fetchProgramAccount: fetchProgramAccountExample,
  fetchMintAccount: fetchMintAccountExample,
  compareAccountTypes: compareAccountTypesExample,
  analyzeAccount: analyzeAccount
};
