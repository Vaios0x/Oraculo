import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OraclePrivacy } from "../target/types/oracle_privacy";
import { expect } from "chai";

describe("oracle_privacy", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.OraclePrivacy as Program<OraclePrivacy>;
  const provider = anchor.getProvider();

  let marketPda: anchor.web3.PublicKey;
  let marketBump: number;
  let betPda: anchor.web3.PublicKey;
  let betBump: number;

  it("Creates a private prediction market", async () => {
    // Generate a new keypair for the market
    const marketKeypair = anchor.web3.Keypair.generate();
    marketPda = marketKeypair.publicKey;
    marketBump = 0; // Will be set by the program

    const title = "Will Bitcoin reach $100k in 2024?";
    const description = "A prediction market about Bitcoin's price reaching $100k by the end of 2024";
    const endTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
    const outcomes = ["Yes", "No"];
    const privacyLevel = 1; // Private

    const tx = await program.methods
      .createPrivateMarket(
        title,
        description,
        new anchor.BN(endTime),
        outcomes,
        privacyLevel
      )
      .accounts({
        market: marketPda,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([marketKeypair])
      .rpc();

    console.log("Market creation signature:", tx);

    // Fetch the created market
    const market = await program.account.market.fetch(marketPda);
    expect(market.title).to.equal(title);
    expect(market.description).to.equal(description);
    expect(market.outcomes).to.deep.equal(outcomes);
    expect(market.privacyLevel).to.equal(privacyLevel);
    expect(market.isResolved).to.be.false;
    expect(market.totalStaked.toNumber()).to.equal(0);
  });

  it("Places an anonymous bet", async () => {
    const betKeypair = anchor.web3.Keypair.generate();
    betPda = betKeypair.publicKey;
    betBump = 0; // Will be set by the program

    const outcomeIndex = 0; // "Yes"
    const amount = new anchor.BN(1000000); // 0.001 SOL
    const commitmentHash = new Uint8Array(32).fill(1); // Mock commitment hash

    const tx = await program.methods
      .placeAnonymousBet(
        outcomeIndex,
        amount,
        commitmentHash
      )
      .accounts({
        market: marketPda,
        bet: betPda,
        bettor: provider.wallet.publicKey,
        marketVault: provider.wallet.publicKey, // For MVP, using wallet as vault
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([betKeypair])
      .rpc();

    console.log("Bet placement signature:", tx);

    // Fetch the created bet
    const bet = await program.account.bet.fetch(betPda);
    expect(bet.outcomeIndex).to.equal(outcomeIndex);
    expect(bet.amount.toNumber()).to.equal(amount.toNumber());
    expect(bet.bettor.toString()).to.equal(provider.wallet.publicKey.toString());
  });

  it("Resolves the market", async () => {
    const winningOutcome = 0; // "Yes"
    const resolutionProof = new Uint8Array(32).fill(2); // Mock resolution proof

    const tx = await program.methods
      .resolvePrivateMarket(
        winningOutcome,
        resolutionProof
      )
      .accounts({
        market: marketPda,
        resolver: provider.wallet.publicKey,
      })
      .rpc();

    console.log("Market resolution signature:", tx);

    // Fetch the resolved market
    const market = await program.account.market.fetch(marketPda);
    expect(market.isResolved).to.be.true;
    expect(market.winningOutcome).to.equal(winningOutcome);
  });

  it("Claims winnings", async () => {
    const betProof = new Uint8Array(32).fill(3); // Mock bet proof

    const tx = await program.methods
      .claimAnonymousWinnings(betProof)
      .accounts({
        bet: betPda,
        market: marketPda,
        bettor: provider.wallet.publicKey,
        marketVault: provider.wallet.publicKey, // For MVP, using wallet as vault
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Winnings claim signature:", tx);
  });

  it("Gets market info", async () => {
    const marketInfo = await program.methods
      .getMarketInfo()
      .accounts({
        market: marketPda,
      })
      .view();

    expect(marketInfo.title).to.equal("Will Bitcoin reach $100k in 2024?");
    expect(marketInfo.outcomes).to.deep.equal(["Yes", "No"]);
    expect(marketInfo.isResolved).to.be.true;
    expect(marketInfo.winningOutcome).to.equal(0);
  });
});
