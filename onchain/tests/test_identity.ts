import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OraculoIdentity } from "../target/types/oraculo_identity";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("oraculo_identity", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.OraculoIdentity as Program<OraculoIdentity>;
  const wallet = provider.wallet as anchor.Wallet;

  // Test data
  const testVkId = new Uint8Array(32).fill(1); // Mock verification key ID
  const testPredicateHash = new Uint8Array(32).fill(2); // Mock predicate hash
  const testIssuerHash = new Uint8Array(32).fill(3); // Mock issuer hash
  const testExpiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days from now
  const testNonce = new Uint8Array(16).fill(4); // Mock nonce
  const testPublicInputs = new Uint8Array([1, 2, 3, 4, 5]); // Mock public inputs
  const testProof = new Uint8Array([6, 7, 8, 9, 10]); // Mock proof

  it("Should initialize verifier config", async () => {
    console.log("🧪 Testing verifier config initialization...");
    
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    try {
      const tx = await program.methods
        .initConfig(Array.from(new Uint8Array(32).fill(0)), 1)
        .accounts({
          admin: wallet.publicKey,
          verifierConfig: configPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Config initialized successfully:", tx);
    } catch (error) {
      if (error.message?.includes("already in use")) {
        console.log("ℹ️  Config already initialized, continuing...");
      } else {
        throw error;
      }
    }
  });

  it("Should verify identity proof (with auto-init)", async () => {
    console.log("🧪 Testing identity proof verification...");
    
    const subject = wallet.publicKey;
    const [attestationPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("attest"), subject.toBuffer(), testPredicateHash],
      program.programId
    );
    
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );
    
    const [noncePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("nonce"), subject.toBuffer()],
      program.programId
    );

    console.log("📋 Account addresses:");
    console.log("  Subject:", subject.toString());
    console.log("  Attestation PDA:", attestationPda.toString());
    console.log("  Config PDA:", configPda.toString());
    console.log("  Nonce PDA:", noncePda.toString());

    const tx = await program.methods
      .verifyIdentityProof(
        Array.from(testVkId),
        Array.from(testPredicateHash),
        Array.from(testIssuerHash),
        new anchor.BN(testExpiresAt),
        Array.from(testNonce),
        Buffer.from(testPublicInputs),
        Buffer.from(testProof)
      )
      .accounts({
        subject: subject,
        attestationPda: attestationPda,
        verifierConfig: configPda,
        noncePda: noncePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Identity proof verified successfully:", tx);
    console.log("🔗 Transaction URL: https://explorer.solana.com/tx/" + tx + "?cluster=devnet");
  });

  it("Should fetch and verify attestation data", async () => {
    console.log("🧪 Testing attestation data retrieval...");
    
    const subject = wallet.publicKey;
    const [attestationPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("attest"), subject.toBuffer(), testPredicateHash],
      program.programId
    );

    try {
      const attestation = await program.account.attestationPda.fetch(attestationPda);
      
      console.log("📊 Attestation data:");
      console.log("  Subject:", attestation.subject.toString());
      console.log("  Predicate Hash:", Buffer.from(attestation.predicateHash).toString('hex'));
      console.log("  Issuer Hash:", Buffer.from(attestation.issuerHash).toString('hex'));
      console.log("  VK ID:", Buffer.from(attestation.vkId).toString('hex'));
      console.log("  Issued At:", new Date(Number(attestation.issuedAt) * 1000).toISOString());
      console.log("  Expires At:", new Date(Number(attestation.expiresAt) * 1000).toISOString());
      console.log("  Last Nonce:", Buffer.from(attestation.lastNonce).toString('hex'));

      // Verify the data matches what we sent
      expect(attestation.subject.toString()).to.equal(subject.toString());
      expect(Buffer.from(attestation.predicateHash).toString('hex')).to.equal(Buffer.from(testPredicateHash).toString('hex'));
      expect(Buffer.from(attestation.issuerHash).toString('hex')).to.equal(Buffer.from(testIssuerHash).toString('hex'));
      expect(Number(attestation.expiresAt)).to.equal(testExpiresAt);

      console.log("✅ Attestation data verified successfully");
    } catch (error) {
      console.error("❌ Failed to fetch attestation:", error);
      throw error;
    }
  });

  it("Should fetch verifier config", async () => {
    console.log("🧪 Testing verifier config retrieval...");
    
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    try {
      const config = await program.account.verifierConfig.fetch(configPda);
      
      console.log("📊 Verifier config:");
      console.log("  Version:", Number(config.version));
      console.log("  Admin:", config.admin.toString());
      console.log("  Allowed Issuers Root:", Buffer.from(config.allowedIssuersRoot).toString('hex'));

      expect(Number(config.version)).to.equal(1);
      expect(config.admin.toString()).to.equal(wallet.publicKey.toString());

      console.log("✅ Verifier config verified successfully");
    } catch (error) {
      console.error("❌ Failed to fetch verifier config:", error);
      throw error;
    }
  });
});
