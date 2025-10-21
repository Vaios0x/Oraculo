// CPI Messenger Test Suite
// =========================
// Complete test suite for the CPI Messenger program with Cross Program Invocations

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CpiMessenger } from "../target/types/cpi_messenger";
import { expect } from "chai";
import { PublicKey } from "@solana/web3.js";

describe("CPI Messenger", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CpiMessenger as Program<CpiMessenger>;
  const provider = anchor.getProvider();
  const wallet = provider.wallet;

  // Derive PDAs for message and vault accounts
  const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("message"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), wallet.publicKey.toBuffer()],
    program.programId
  );

  console.log("Program ID:", program.programId.toString());
  console.log("Message PDA:", messagePda.toString());
  console.log("Vault PDA:", vaultPda.toString());

  it("Create Message Account", async () => {
    const message = "Hello, World!";
    
    const transactionSignature = await program.methods
      .create(message)
      .accounts({
        messageAccount: messagePda,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc({ commitment: "confirmed" });

    console.log("Create Transaction Signature:", transactionSignature);
    console.log("SolanaFM Link:", `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);

    // Fetch the created account
    const messageAccount = await program.account.messageAccount.fetch(
      messagePda,
      "confirmed"
    );

    console.log("Created Message Account:", JSON.stringify(messageAccount, null, 2));
    
    // Verify the account data
    expect(messageAccount.user.toString()).to.equal(wallet.publicKey.toString());
    expect(messageAccount.message).to.equal(message);
    expect(messageAccount.bump).to.equal(messageBump);
  });

  it("Update Message Account with Payment", async () => {
    const newMessage = "Hello, Solana!";
    
    // Get initial balance
    const initialBalance = await provider.connection.getBalance(wallet.publicKey);
    console.log("Initial User Balance:", initialBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");

    const transactionSignature = await program.methods
      .update(newMessage)
      .accounts({
        messageAccount: messagePda,
        vaultAccount: vaultPda,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc({ commitment: "confirmed" });

    console.log("Update Transaction Signature:", transactionSignature);
    console.log("SolanaFM Link:", `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);

    // Get final balance
    const finalBalance = await provider.connection.getBalance(wallet.publicKey);
    console.log("Final User Balance:", finalBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");

    // Check vault balance
    const vaultBalance = await program.methods
      .getVaultBalance()
      .accounts({
        vaultAccount: vaultPda
      })
      .view();

    console.log("Vault Balance:", vaultBalance.toString(), "lamports");

    // Fetch the updated account
    const messageAccount = await program.account.messageAccount.fetch(
      messagePda,
      "confirmed"
    );

    console.log("Updated Message Account:", JSON.stringify(messageAccount, null, 2));
    
    // Verify the updated data
    expect(messageAccount.message).to.equal(newMessage);
    expect(messageAccount.user.toString()).to.equal(wallet.publicKey.toString());
    
    // Verify payment was made (vault should have 0.001 SOL)
    expect(vaultBalance.toNumber()).to.equal(1_000_000); // 0.001 SOL
  });

  it("Get Message Data", async () => {
    // Get message using view function
    const currentMessage = await program.methods
      .getMessage()
      .accounts({
        messageAccount: messagePda
      })
      .view();

    console.log("Current Message:", currentMessage);
    expect(currentMessage).to.equal("Hello, Solana!");
  });

  it("Transfer from Vault to Another Account", async () => {
    // Create a destination account
    const destination = anchor.web3.Keypair.generate();
    console.log("Destination Account:", destination.publicKey.toString());

    // Fund the destination account
    const airdropSignature = await provider.connection.requestAirdrop(
      destination.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    const initialDestinationBalance = await provider.connection.getBalance(destination.publicKey);
    console.log("Initial Destination Balance:", initialDestinationBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");

    // Transfer 0.0005 SOL from vault to destination
    const transferAmount = 500_000; // 0.0005 SOL
    const transferSignature = await program.methods
      .transferFromVault(transferAmount, destination.publicKey)
      .accounts({
        vaultAccount: vaultPda,
        destination: destination.publicKey,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc({ commitment: "confirmed" });

    console.log("Transfer Transaction Signature:", transferSignature);
    console.log("SolanaFM Link:", `https://solana.fm/tx/${transferSignature}?cluster=devnet-solana`);

    // Check final destination balance
    const finalDestinationBalance = await provider.connection.getBalance(destination.publicKey);
    console.log("Final Destination Balance:", finalDestinationBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");

    // Verify transfer
    const expectedBalance = initialDestinationBalance + transferAmount;
    expect(finalDestinationBalance).to.equal(expectedBalance);

    // Check remaining vault balance
    const remainingVaultBalance = await program.methods
      .getVaultBalance()
      .accounts({
        vaultAccount: vaultPda
      })
      .view();

    console.log("Remaining Vault Balance:", remainingVaultBalance.toString(), "lamports");
    expect(remainingVaultBalance.toNumber()).to.equal(500_000); // 0.0005 SOL remaining
  });

  it("Delete Message Account with Refund", async () => {
    // Get initial user balance
    const initialUserBalance = await provider.connection.getBalance(wallet.publicKey);
    console.log("Initial User Balance:", initialUserBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");

    // Get vault balance before deletion
    const vaultBalanceBefore = await program.methods
      .getVaultBalance()
      .accounts({
        vaultAccount: vaultPda
      })
      .view();

    console.log("Vault Balance Before Deletion:", vaultBalanceBefore.toString(), "lamports");

    const transactionSignature = await program.methods
      .delete()
      .accounts({
        messageAccount: messagePda,
        vaultAccount: vaultPda,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc({ commitment: "confirmed" });

    console.log("Delete Transaction Signature:", transactionSignature);
    console.log("SolanaFM Link:", `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);

    // Get final user balance
    const finalUserBalance = await provider.connection.getBalance(wallet.publicKey);
    console.log("Final User Balance:", finalUserBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");

    // Verify refund was received
    const expectedBalance = initialUserBalance + vaultBalanceBefore.toNumber();
    expect(finalUserBalance).to.equal(expectedBalance);

    // Try to fetch the deleted account (should return null)
    const messageAccount = await program.account.messageAccount.fetchNullable(
      messagePda,
      "confirmed"
    );

    console.log("Expect Null:", JSON.stringify(messageAccount, null, 2));
    expect(messageAccount).to.be.null;
  });

  it("Error handling - Update without sufficient funds", async () => {
    // Create a new message account
    const newMessage = "Test message";
    await program.methods
      .create(newMessage)
      .accounts({
        messageAccount: messagePda,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    // Create a wallet with no SOL
    const poorWallet = anchor.web3.Keypair.generate();
    console.log("Poor Wallet:", poorWallet.publicKey.toString());

    // Try to update with poor wallet (should fail)
    try {
      await program.methods
        .update("Update with no funds")
        .accounts({
          messageAccount: messagePda,
          vaultAccount: vaultPda,
          user: poorWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .signers([poorWallet])
        .rpc();
      
      // If we reach here, the test should fail
      expect.fail("Expected update to fail for insufficient funds");
    } catch (error) {
      console.log("Expected error caught:", error.message);
      expect(error.message).to.include("insufficient funds");
    }
  });

  it("CPI with multiple programs", async () => {
    // This test demonstrates how CPIs can interact with multiple programs
    console.log("📋 CPI with Multiple Programs:");
    console.log("1. System Program - for SOL transfers");
    console.log("2. Token Program - for token operations");
    console.log("3. Custom Programs - for business logic");
    console.log("");
    console.log("✅ CPI Benefits:");
    console.log("- Programs can call other programs");
    console.log("- Programs can sign for PDAs");
    console.log("- Enables complex interactions");
    console.log("- Maintains atomicity");
  });

  it("PDA signing with CPI", async () => {
    console.log("🔐 PDA Signing with CPI:");
    console.log("");
    console.log("1. Program derives PDA:");
    console.log("   const [pda, bump] = PublicKey.findProgramAddressSync(seeds, programId);");
    console.log("");
    console.log("2. Program creates signer seeds:");
    console.log("   const signer_seeds = &[&[b'vault', user.key().as_ref(), &[bump]]];");
    console.log("");
    console.log("3. Program signs for PDA in CPI:");
    console.log("   let cpi_context = CpiContext::new(...).with_signer(signer_seeds);");
    console.log("");
    console.log("4. System Program executes transfer:");
    console.log("   transfer(cpi_context, amount)?;");
    console.log("");
    console.log("✅ This enables programs to control PDA accounts!");
  });
});
