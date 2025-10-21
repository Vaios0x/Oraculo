// PDA Messenger Test Suite
// =======================
// Complete test suite for the PDA Messenger program

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PdaMessenger } from "../target/types/pda_messenger";
import { expect } from "chai";
import { PublicKey } from "@solana/web3.js";

describe("PDA Messenger", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PdaMessenger as Program<PdaMessenger>;
  const provider = anchor.getProvider();
  const wallet = provider.wallet;

  // Derive PDA for message account
  const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("message"), wallet.publicKey.toBuffer()],
    program.programId
  );

  console.log("Program ID:", program.programId.toString());
  console.log("Message PDA:", messagePda.toString());
  console.log("Message Bump:", messageBump);

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

  it("Update Message Account", async () => {
    const newMessage = "Hello, Solana!";
    
    const transactionSignature = await program.methods
      .update(newMessage)
      .accounts({
        messageAccount: messagePda,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc({ commitment: "confirmed" });

    console.log("Update Transaction Signature:", transactionSignature);
    console.log("SolanaFM Link:", `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);

    // Fetch the updated account
    const messageAccount = await program.account.messageAccount.fetch(
      messagePda,
      "confirmed"
    );

    console.log("Updated Message Account:", JSON.stringify(messageAccount, null, 2));
    
    // Verify the updated data
    expect(messageAccount.message).to.equal(newMessage);
    expect(messageAccount.user.toString()).to.equal(wallet.publicKey.toString());
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

  it("Delete Message Account", async () => {
    const transactionSignature = await program.methods
      .delete()
      .accounts({
        messageAccount: messagePda,
        user: wallet.publicKey
      })
      .rpc({ commitment: "confirmed" });

    console.log("Delete Transaction Signature:", transactionSignature);
    console.log("SolanaFM Link:", `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);

    // Try to fetch the deleted account (should return null)
    const messageAccount = await program.account.messageAccount.fetchNullable(
      messagePda,
      "confirmed"
    );

    console.log("Expect Null:", JSON.stringify(messageAccount, null, 2));
    expect(messageAccount).to.be.null;
  });

  it("Error handling - Create duplicate account", async () => {
    // First create an account
    const message = "First message";
    await program.methods
      .create(message)
      .accounts({
        messageAccount: messagePda,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    // Try to create the same account again (should fail)
    try {
      await program.methods
        .create("Duplicate message")
        .accounts({
          messageAccount: messagePda,
          user: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .rpc();
      
      // If we reach here, the test should fail
      expect.fail("Expected creation to fail for duplicate account");
    } catch (error) {
      console.log("Expected error caught:", error.message);
      expect(error.message).to.include("already in use");
    }
  });

  it("Error handling - Update non-existent account", async () => {
    // Delete the account first
    try {
      await program.methods
        .delete()
        .accounts({
          messageAccount: messagePda,
          user: wallet.publicKey
        })
        .rpc();
    } catch (error) {
      // Account might not exist, continue
    }

    // Try to update non-existent account (should fail)
    try {
      await program.methods
        .update("Update non-existent")
        .accounts({
          messageAccount: messagePda,
          user: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .rpc();
      
      // If we reach here, the test should fail
      expect.fail("Expected update to fail for non-existent account");
    } catch (error) {
      console.log("Expected error caught:", error.message);
      expect(error.message).to.include("AccountNotInitialized");
    }
  });

  it("Multiple users with different PDAs", async () => {
    // Create a second wallet
    const secondWallet = anchor.web3.Keypair.generate();
    console.log("Second Wallet:", secondWallet.publicKey.toString());

    // Fund the second wallet
    const airdropSignature = await provider.connection.requestAirdrop(
      secondWallet.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    // Derive PDA for second wallet
    const [secondMessagePda, secondMessageBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("message"), secondWallet.publicKey.toBuffer()],
      program.programId
    );

    console.log("Second Message PDA:", secondMessagePda.toString());

    // Create message for second wallet
    const secondMessage = "Second user message";
    await program.methods
      .create(secondMessage)
      .accounts({
        messageAccount: secondMessagePda,
        user: secondWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([secondWallet])
      .rpc();

    // Verify both accounts exist independently
    const firstAccount = await program.account.messageAccount.fetchNullable(messagePda);
    const secondAccount = await program.account.messageAccount.fetch(secondMessagePda);

    if (firstAccount) {
      console.log("First Account Message:", firstAccount.message);
    }
    console.log("Second Account Message:", secondAccount.message);

    expect(secondAccount.message).to.equal(secondMessage);
    expect(secondAccount.user.toString()).to.equal(secondWallet.publicKey.toString());
  });

  it("PDA derivation consistency", async () => {
    // Test that PDAs are derived consistently
    const [pda1, bump1] = PublicKey.findProgramAddressSync(
      [Buffer.from("message"), wallet.publicKey.toBuffer()],
      program.programId
    );

    const [pda2, bump2] = PublicKey.findProgramAddressSync(
      [Buffer.from("message"), wallet.publicKey.toBuffer()],
      program.programId
    );

    expect(pda1.toString()).to.equal(pda2.toString());
    expect(bump1).to.equal(bump2);
    expect(pda1.toString()).to.equal(messagePda.toString());
    expect(bump1).to.equal(messageBump);

    console.log("PDA Consistency Verified");
    console.log("PDA:", pda1.toString());
    console.log("Bump:", bump1);
  });
});
