// Hello Anchor Test Suite
// =======================
// Complete test suite for the Hello Anchor program

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloAnchor } from "../target/types/hello_anchor";
import { expect } from "chai";

describe("Hello Anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloAnchor as Program<HelloAnchor>;
  const provider = anchor.getProvider();

  it("Initialize account with data", async () => {
    // Generate keypair for the new account
    const newAccountKp = anchor.web3.Keypair.generate();
    console.log("New Account:", newAccountKp.publicKey.toString());

    // Send transaction
    const data = new anchor.BN(42);
    const txHash = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([newAccountKp])
      .rpc();
    
    console.log(`Transaction Hash: ${txHash}`);
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await provider.connection.confirmTransaction(txHash);

    // Fetch the created account
    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey
    );

    console.log("On-chain data is:", newAccount.data.toString());

    // Check whether the data on-chain is equal to local 'data'
    expect(data.eq(newAccount.data)).to.be.true;
  });

  it("Update account data", async () => {
    // Generate keypair for the new account
    const newAccountKp = anchor.web3.Keypair.generate();
    console.log("New Account:", newAccountKp.publicKey.toString());

    // Initialize with data 42
    const initialData = new anchor.BN(42);
    await program.methods
      .initialize(initialData)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([newAccountKp])
      .rpc();

    // Update with new data
    const newData = new anchor.BN(100);
    const updateTxHash = await program.methods
      .updateData(newData)
      .accounts({
        account: newAccountKp.publicKey,
        signer: provider.wallet.publicKey
      })
      .rpc();

    console.log(`Update Transaction Hash: ${updateTxHash}`);

    // Fetch the updated account
    const updatedAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey
    );

    console.log("Updated data is:", updatedAccount.data.toString());
    expect(newData.eq(updatedAccount.data)).to.be.true;
  });

  it("Get account data", async () => {
    // Generate keypair for the new account
    const newAccountKp = anchor.web3.Keypair.generate();
    console.log("New Account:", newAccountKp.publicKey.toString());

    // Initialize with data
    const data = new anchor.BN(77);
    await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([newAccountKp])
      .rpc();

    // Get data using the program method
    const retrievedData = await program.methods
      .getData()
      .accounts({
        account: newAccountKp.publicKey
      })
      .view();

    console.log("Retrieved data is:", retrievedData.toString());
    expect(data.eq(new anchor.BN(retrievedData))).to.be.true;
  });

  it("Multiple accounts interaction", async () => {
    // Create multiple accounts
    const account1Kp = anchor.web3.Keypair.generate();
    const account2Kp = anchor.web3.Keypair.generate();
    const account3Kp = anchor.web3.Keypair.generate();

    console.log("Account 1:", account1Kp.publicKey.toString());
    console.log("Account 2:", account2Kp.publicKey.toString());
    console.log("Account 3:", account3Kp.publicKey.toString());

    // Initialize all accounts with different data
    const data1 = new anchor.BN(10);
    const data2 = new anchor.BN(20);
    const data3 = new anchor.BN(30);

    // Initialize account 1
    await program.methods
      .initialize(data1)
      .accounts({
        newAccount: account1Kp.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([account1Kp])
      .rpc();

    // Initialize account 2
    await program.methods
      .initialize(data2)
      .accounts({
        newAccount: account2Kp.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([account2Kp])
      .rpc();

    // Initialize account 3
    await program.methods
      .initialize(data3)
      .accounts({
        newAccount: account3Kp.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([account3Kp])
      .rpc();

    // Verify all accounts
    const account1 = await program.account.newAccount.fetch(account1Kp.publicKey);
    const account2 = await program.account.newAccount.fetch(account2Kp.publicKey);
    const account3 = await program.account.newAccount.fetch(account3Kp.publicKey);

    expect(data1.eq(account1.data)).to.be.true;
    expect(data2.eq(account2.data)).to.be.true;
    expect(data3.eq(account3.data)).to.be.true;

    console.log("All accounts verified successfully!");
  });

  it("Error handling - duplicate account initialization", async () => {
    // Generate keypair for the new account
    const newAccountKp = anchor.web3.Keypair.generate();

    // Initialize account first time
    const data = new anchor.BN(42);
    await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([newAccountKp])
      .rpc();

    // Try to initialize the same account again (should fail)
    try {
      await program.methods
        .initialize(data)
        .accounts({
          newAccount: newAccountKp.publicKey,
          signer: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .signers([newAccountKp])
        .rpc();
      
      // If we reach here, the test should fail
      expect.fail("Expected initialization to fail for duplicate account");
    } catch (error) {
      console.log("Expected error caught:", error.message);
      expect(error.message).to.include("already in use");
    }
  });
});
