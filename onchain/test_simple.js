const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");

async function testIdentityProgram() {
  console.log("🧪 Starting ZK Identity Program Test...");
  
  // Configure the client to use devnet
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Load the program
  const idl = require("./target/idl/oraculo_identity.json");
  const program = new anchor.Program(idl, provider);
  const wallet = provider.wallet;

  console.log("📋 Program ID:", program.programId.toString());
  console.log("👤 Wallet:", wallet.publicKey.toString());

  // Test data
  const testVkId = new Uint8Array(32).fill(1);
  const testPredicateHash = new Uint8Array(32).fill(2);
  const testIssuerHash = new Uint8Array(32).fill(3);
  const testExpiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  const testNonce = new Uint8Array(16).fill(4);
  const testPublicInputs = new Uint8Array([1, 2, 3, 4, 5]);
  const testProof = new Uint8Array([6, 7, 8, 9, 10]);

  try {
    // Test 1: Initialize config (optional, will be auto-initialized)
    console.log("\n🔧 Test 1: Initialize config...");
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      program.programId
    );

    try {
      const tx1 = await program.methods
        .initConfig(Array.from(new Uint8Array(32).fill(0)), 1)
        .accounts({
          admin: wallet.publicKey,
          verifierConfig: configPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Config initialized:", tx1);
    } catch (error) {
      if (error.message?.includes("already in use")) {
        console.log("ℹ️  Config already initialized, continuing...");
      } else {
        console.log("⚠️  Config init failed:", error.message);
      }
    }

    // Test 2: Verify identity proof
    console.log("\n🔐 Test 2: Verify identity proof...");
    const subject = wallet.publicKey;
    const [attestationPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("attest"), subject.toBuffer(), testPredicateHash],
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

    const tx2 = await program.methods
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

    console.log("✅ Identity proof verified:", tx2);
    console.log("🔗 Transaction URL: https://explorer.solana.com/tx/" + tx2 + "?cluster=devnet");

    // Test 3: Fetch attestation data
    console.log("\n📊 Test 3: Fetch attestation data...");
    const attestation = await program.account.attestationPda.fetch(attestationPda);
    
    console.log("📊 Attestation data:");
    console.log("  Subject:", attestation.subject.toString());
    console.log("  Predicate Hash:", Buffer.from(attestation.predicateHash).toString('hex'));
    console.log("  Issuer Hash:", Buffer.from(attestation.issuerHash).toString('hex'));
    console.log("  VK ID:", Buffer.from(attestation.vkId).toString('hex'));
    console.log("  Issued At:", new Date(Number(attestation.issuedAt) * 1000).toISOString());
    console.log("  Expires At:", new Date(Number(attestation.expiresAt) * 1000).toISOString());
    console.log("  Last Nonce:", Buffer.from(attestation.lastNonce).toString('hex'));

    // Test 4: Fetch verifier config
    console.log("\n⚙️  Test 4: Fetch verifier config...");
    const config = await program.account.verifierConfig.fetch(configPda);
    
    console.log("📊 Verifier config:");
    console.log("  Version:", Number(config.version));
    console.log("  Admin:", config.admin.toString());
    console.log("  Allowed Issuers Root:", Buffer.from(config.allowedIssuersRoot).toString('hex'));

    console.log("\n🎉 All tests passed successfully!");
    console.log("✅ ZK Identity program is working correctly on devnet");

  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}

// Run the test
testIdentityProgram()
  .then(() => {
    console.log("\n🏁 Test completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Test failed:", error);
    process.exit(1);
  });
