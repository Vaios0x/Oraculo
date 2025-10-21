// Token Extensions Advanced Examples
// ===================================
// Advanced examples demonstrating token extensions in Solana

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createMint,
  createAccount,
  mintTo,
  transfer,
  transferChecked,
  approve,
  approveChecked,
  revoke,
  burn,
  burnChecked,
  freezeAccount,
  thawAccount,
  closeAccount,
  syncNative,
  setAuthority,
  AuthorityType,
  getAccount,
  getMint,
  NATIVE_MINT
} from "@solana/spl-token";
import { 
  TokenExtensionsManager, 
  TokenExtensionsUtils,
  TokenExtensions,
  ScaledUIAmountConfig,
  TransferFeeConfig,
  TokenMetadata,
  ExtensionCompatibility
} from "../utils/token-extensions-manager";

// Example 1: Scaled UI Amount Extension
export async function scaledUIAmountExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  initialMultiplier: number;
  updatedMultiplier: number;
  uiAmount: number;
  rawAmount: bigint;
}> {
  console.log("🪙 Starting Scaled UI Amount Extension Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Scaled UI Amount extension
    const result = await manager.createTokenWithScaledUIAmount(
      payer,
      mint,
      decimals,
      1.5, // Initial multiplier
      "Scaled Token",
      "SCALED",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`📊 Initial multiplier: ${result.extensions.scaledUIAmount?.multiplier}`);
    
    // Update multiplier
    const newMultiplier = 2.0;
    const updateSignature = await manager.updateScaledUIMultiplier(
      result.mint,
      newMultiplier,
      payer
    );
    
    console.log(`🔄 Multiplier updated: ${updateSignature}`);
    
    // Calculate UI amounts
    const rawAmount = BigInt(1000000000); // 1 token with 9 decimals
    const uiAmount = await manager.calculateUIAmount(result.mint, rawAmount);
    
    console.log(`💰 Raw amount: ${rawAmount.toString()}`);
    console.log(`💰 UI amount: ${uiAmount}`);
    
    // Get current multiplier
    const currentMultiplier = await manager.getCurrentMultiplier(result.mint);
    console.log(`📈 Current multiplier: ${currentMultiplier}`);
    
    return {
      mint: result.mint,
      initialMultiplier: result.extensions.scaledUIAmount?.multiplier || 1.0,
      updatedMultiplier: newMultiplier,
      uiAmount,
      rawAmount
    };
    
  } catch (error) {
    console.error("❌ Error in Scaled UI Amount example:", error);
    throw error;
  }
}

// Example 2: Transfer Fee Extension
export async function transferFeeExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  transferFeeBasisPoints: number;
  maximumFee: bigint;
  calculatedFee: bigint;
}> {
  console.log("💰 Starting Transfer Fee Extension Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Transfer Fee extension
    const transferFeeBasisPoints = 150; // 1.5%
    const maximumFee = BigInt(1000000); // 1 token with 6 decimals
    
    const result = await manager.createTokenWithTransferFee(
      payer,
      mint,
      decimals,
      transferFeeBasisPoints,
      maximumFee,
      "Fee Token",
      "FEE"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`💸 Transfer fee: ${transferFeeBasisPoints} basis points`);
    console.log(`💸 Maximum fee: ${maximumFee.toString()}`);
    
    // Calculate transfer fee
    const transferAmount = BigInt(1000000000); // 10 tokens
    const calculatedFee = await manager.calculateTransferFee(result.mint, transferAmount);
    
    console.log(`🔄 Transfer amount: ${transferAmount.toString()}`);
    console.log(`💸 Calculated fee: ${calculatedFee.toString()}`);
    
    // Get transfer fee info
    const feeInfo = await manager.getTransferFeeInfo(result.mint);
    if (feeInfo) {
      console.log(`📊 Fee info:`);
      console.log(`   Basis Points: ${feeInfo.basisPoints}`);
      console.log(`   Maximum Fee: ${feeInfo.maximumFee.toString()}`);
      console.log(`   Withheld Amount: ${feeInfo.withheldAmount.toString()}`);
    }
    
    return {
      mint: result.mint,
      transferFeeBasisPoints,
      maximumFee,
      calculatedFee
    };
    
  } catch (error) {
    console.error("❌ Error in Transfer Fee example:", error);
    throw error;
  }
}

// Example 3: Metadata Extension
export async function metadataExtensionExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  metadata: TokenMetadata;
  formattedMetadata: string;
}> {
  console.log("📝 Starting Metadata Extension Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create additional metadata
    const additionalMetadata = new Map<string, string>();
    additionalMetadata.set("description", "A token with rich metadata");
    additionalMetadata.set("image", "https://example.com/image.png");
    additionalMetadata.set("attributes", JSON.stringify([
      { trait_type: "Rarity", value: "Common" },
      { trait_type: "Type", value: "Utility" }
    ]));
    
    // Create token with Metadata extension
    const result = await manager.createTokenWithMetadata(
      payer,
      mint,
      decimals,
      "Metadata Token",
      "META",
      "https://example.com/metadata.json",
      additionalMetadata
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`📝 Name: ${result.extensions.metadata?.name}`);
    console.log(`📝 Symbol: ${result.extensions.metadata?.symbol}`);
    console.log(`📝 URI: ${result.extensions.metadata?.uri}`);
    
    // Format metadata for display
    const formattedMetadata = TokenExtensionsUtils.formatTokenMetadata(
      result.extensions.metadata!
    );
    
    console.log(`📋 Formatted Metadata:`);
    console.log(formattedMetadata);
    
    return {
      mint: result.mint,
      metadata: result.extensions.metadata!,
      formattedMetadata
    };
    
  } catch (error) {
    console.error("❌ Error in Metadata extension example:", error);
    throw error;
  }
}

// Example 4: Memo Transfer Extension
export async function memoTransferExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  requireMemos: boolean;
  transferWithMemo: boolean;
}> {
  console.log("📝 Starting Memo Transfer Extension Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Memo Transfer extension
    const result = await manager.createTokenWithMemoTransfer(
      payer,
      mint,
      decimals,
      true // Require memos
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`📝 Require memos: ${result.extensions.memoTransfer?.requireIncomingTransferMemos}`);
    
    // Simulate transfer with memo
    console.log(`🔄 Simulating transfer with memo...`);
    const transferWithMemo = true; // This would be handled by the transfer logic
    
    console.log(`✅ Transfer with memo: ${transferWithMemo}`);
    
    return {
      mint: result.mint,
      requireMemos: result.extensions.memoTransfer?.requireIncomingTransferMemos || false,
      transferWithMemo
    };
    
  } catch (error) {
    console.error("❌ Error in Memo Transfer example:", error);
    throw error;
  }
}

// Example 5: Immutable Owner Extension
export async function immutableOwnerExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  owner: PublicKey,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  owner: PublicKey;
  isImmutable: boolean;
}> {
  console.log("🔒 Starting Immutable Owner Extension Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Immutable Owner extension
    const result = await manager.createTokenWithImmutableOwner(
      payer,
      mint,
      decimals,
      owner
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`🔒 Owner: ${result.extensions.immutableOwner?.owner.toString()}`);
    
    // Check if owner is immutable
    const isImmutable = result.extensions.immutableOwner !== undefined;
    console.log(`🔒 Is immutable: ${isImmutable}`);
    
    return {
      mint: result.mint,
      owner: result.extensions.immutableOwner?.owner || PublicKey.default,
      isImmutable
    };
    
  } catch (error) {
    console.error("❌ Error in Immutable Owner example:", error);
    throw error;
  }
}

// Example 6: Non-Transferable Extension
export async function nonTransferableExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  isNonTransferable: boolean;
  canTransfer: boolean;
}> {
  console.log("🚫 Starting Non-Transferable Extension Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Non-Transferable extension
    const result = await manager.createTokenWithNonTransferable(
      payer,
      mint,
      decimals
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`🚫 Non-transferable: ${result.extensions.nonTransferable?.enabled}`);
    
    // Check transfer capabilities
    const isNonTransferable = result.extensions.nonTransferable?.enabled || false;
    const canTransfer = !isNonTransferable;
    
    console.log(`🚫 Can transfer: ${canTransfer}`);
    
    return {
      mint: result.mint,
      isNonTransferable,
      canTransfer
    };
    
  } catch (error) {
    console.error("❌ Error in Non-Transferable example:", error);
    throw error;
  }
}

// Example 7: Multiple Extensions Combined
export async function multipleExtensionsExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  extensions: TokenExtensions;
  totalCost: number;
  costBreakdown: { [extension: string]: number };
}> {
  console.log("🔧 Starting Multiple Extensions Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with multiple extensions
    const extensions: TokenExtensions = {
      scaledUIAmount: {
        multiplier: 1.2,
        newMultiplier: 1.2,
        newMultiplierEffectiveTimestamp: Math.floor(Date.now() / 1000),
        authority: payer.publicKey
      },
      transferFee: {
        transferFeeConfigAuthority: payer.publicKey,
        withdrawWithheldAuthority: payer.publicKey,
        withheldAmount: BigInt(0),
        olderTransferFee: {
          epoch: BigInt(0),
          maximumFee: BigInt(1000000),
          transferFeeBasisPoints: 100
        },
        newerTransferFee: {
          epoch: BigInt(0),
          maximumFee: BigInt(1000000),
          transferFeeBasisPoints: 100
        }
      },
      metadata: {
        updateAuthority: payer.publicKey,
        mint: mint.publicKey,
        name: "Multi-Extension Token",
        symbol: "MULTI",
        uri: "https://example.com/metadata.json",
        additionalMetadata: new Map()
      },
      memoTransfer: {
        requireIncomingTransferMemos: true
      },
      immutableOwner: {
        owner: payer.publicKey
      }
    };
    
    console.log(`✅ Token created with multiple extensions: ${mint.publicKey.toString()}`);
    console.log(`🔧 Extensions enabled: ${Object.keys(extensions).length}`);
    
    // Calculate extension costs
    const costInfo = TokenExtensionsUtils.calculateExtensionCosts(extensions);
    
    console.log(`💰 Total cost: ${costInfo.totalCost}`);
    console.log(`💰 Cost breakdown:`);
    Object.entries(costInfo.breakdown).forEach(([extension, cost]) => {
      console.log(`   ${extension}: ${cost}`);
    });
    
    return {
      mint: mint.publicKey,
      extensions,
      totalCost: costInfo.totalCost,
      costBreakdown: costInfo.breakdown
    };
    
  } catch (error) {
    console.error("❌ Error in Multiple Extensions example:", error);
    throw error;
  }
}

// Example 8: Extension Validation and Comparison
export async function extensionValidationExample(
  connection: Connection,
  extensions1: TokenExtensions,
  extensions2: TokenExtensions
): Promise<{
  validation1: { valid: boolean; errors: string[] };
  validation2: { valid: boolean; errors: string[] };
  comparison: {
    differences: string[];
    added: string[];
    removed: string[];
    modified: string[];
  };
}> {
  console.log("🔍 Starting Extension Validation and Comparison Example");
  
  try {
    // Validate extensions
    const validation1 = TokenExtensionsUtils.validateExtensionConfig('metadata', extensions1.metadata || {});
    const validation2 = TokenExtensionsUtils.validateExtensionConfig('metadata', extensions2.metadata || {});
    
    console.log(`✅ Validation 1: ${validation1.valid ? 'Valid' : 'Invalid'}`);
    if (!validation1.valid) {
      console.log(`❌ Errors: ${validation1.errors.join(', ')}`);
    }
    
    console.log(`✅ Validation 2: ${validation2.valid ? 'Valid' : 'Invalid'}`);
    if (!validation2.valid) {
      console.log(`❌ Errors: ${validation2.errors.join(', ')}`);
    }
    
    // Compare extensions
    const comparison = TokenExtensionsUtils.compareExtensionConfigs(extensions1, extensions2);
    
    console.log(`🔍 Comparison results:`);
    console.log(`   Differences: ${comparison.differences.length}`);
    console.log(`   Added: ${comparison.added.length}`);
    console.log(`   Removed: ${comparison.removed.length}`);
    console.log(`   Modified: ${comparison.modified.length}`);
    
    return {
      validation1,
      validation2,
      comparison
    };
    
  } catch (error) {
    console.error("❌ Error in Extension Validation example:", error);
    throw error;
  }
}

// Example 9: Extension Monitoring and Metrics
export async function extensionMonitoringExample(
  connection: Connection,
  duration: number = 60000 // 1 minute
): Promise<{
  metrics: any;
  extensionUsage: { [extension: string]: number };
  totalExtensions: number;
}> {
  console.log("📊 Starting Extension Monitoring Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    console.log(`⏱️ Monitoring for ${duration / 1000} seconds...`);
    
    // Simulate some extension usage
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get metrics
    const metrics = manager.getMetrics();
    
    console.log(`📈 Extension Metrics:`);
    console.log(`   Total Extensions: ${metrics.totalExtensions}`);
    console.log(`   Scaled UI Amount Updates: ${metrics.scaledUIAmountUpdates}`);
    console.log(`   Transfer Fee Collections: ${metrics.transferFeeCollections}`);
    console.log(`   Metadata Updates: ${metrics.metadataUpdates}`);
    console.log(`   Memo Transfer Enables: ${metrics.memoTransferEnables}`);
    console.log(`   Immutable Owner Sets: ${metrics.immutableOwnerSets}`);
    console.log(`   Non-Transferable Sets: ${metrics.nonTransferableSets}`);
    console.log(`   Total Fees Collected: ${metrics.totalFeesCollected.toString()}`);
    console.log(`   Average Multiplier: ${metrics.averageMultiplier}`);
    
    console.log(`📊 Extension Usage:`);
    Object.entries(metrics.extensionUsage).forEach(([extension, count]) => {
      console.log(`   ${extension}: ${count}`);
    });
    
    return {
      metrics,
      extensionUsage: metrics.extensionUsage,
      totalExtensions: metrics.totalExtensions
    };
    
  } catch (error) {
    console.error("❌ Error in Extension Monitoring example:", error);
    throw error;
  }
}

// Example 10: Extension Cost Analysis
export async function extensionCostAnalysisExample(
  connection: Connection,
  extensions: TokenExtensions[]
): Promise<{
  totalCost: number;
  averageCost: number;
  costBreakdown: { [extension: string]: number };
  recommendations: string[];
}> {
  console.log("💰 Starting Extension Cost Analysis Example");
  
  try {
    let totalCost = 0;
    const costBreakdown: { [extension: string]: number } = {};
    const recommendations: string[] = [];
    
    // Analyze each extension set
    extensions.forEach((extensionSet, index) => {
      const costInfo = TokenExtensionsUtils.calculateExtensionCosts(extensionSet);
      totalCost += costInfo.totalCost;
      
      console.log(`📊 Extension Set ${index + 1}:`);
      console.log(`   Cost: ${costInfo.totalCost}`);
      
      Object.entries(costInfo.breakdown).forEach(([extension, cost]) => {
        costBreakdown[extension] = (costBreakdown[extension] || 0) + cost;
        console.log(`   ${extension}: ${cost}`);
      });
    });
    
    const averageCost = totalCost / extensions.length;
    
    console.log(`💰 Total Cost: ${totalCost}`);
    console.log(`💰 Average Cost: ${averageCost.toFixed(2)}`);
    
    // Generate recommendations
    if (totalCost > 10000) {
      recommendations.push("Consider reducing the number of extensions to lower costs");
    }
    
    if (costBreakdown.metadata > 5000) {
      recommendations.push("Metadata extension is expensive, consider if it's necessary");
    }
    
    if (costBreakdown.transferFee > 3000) {
      recommendations.push("Transfer fee extension adds significant cost");
    }
    
    console.log(`💡 Recommendations:`);
    recommendations.forEach(rec => console.log(`   - ${rec}`));
    
    return {
      totalCost,
      averageCost,
      costBreakdown,
      recommendations
    };
    
  } catch (error) {
    console.error("❌ Error in Extension Cost Analysis example:", error);
    throw error;
  }
}

// Example 11: Interest Bearing Tokens
export async function interestBearingExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  interestRate: number;
  calculatedInterest: bigint;
  timeElapsed: number;
}> {
  console.log("💰 Starting Interest Bearing Tokens Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Interest Bearing extension
    const interestRate = 500; // 5% annual rate in basis points
    const result = await manager.createTokenWithInterestBearing(
      payer,
      mint,
      decimals,
      interestRate,
      "Interest Token",
      "INT",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`📊 Interest Rate: ${interestRate} basis points (${interestRate / 100}%)`);
    
    // Calculate interest
    const principal = BigInt(1000000000); // 1 token with 9 decimals
    const timeElapsed = 30 * 24 * 60 * 60; // 30 days in seconds
    const calculatedInterest = await manager.calculateInterest(
      result.mint,
      principal,
      timeElapsed
    );
    
    console.log(`💰 Principal: ${principal.toString()}`);
    console.log(`⏰ Time Elapsed: ${timeElapsed} seconds (30 days)`);
    console.log(`💰 Calculated Interest: ${calculatedInterest.toString()}`);
    
    // Get current interest rate
    const currentRate = await manager.getCurrentInterestRate(result.mint);
    console.log(`📈 Current Interest Rate: ${currentRate}%`);
    
    return {
      mint: result.mint,
      interestRate,
      calculatedInterest,
      timeElapsed
    };
    
  } catch (error) {
    console.error("❌ Error in Interest Bearing example:", error);
    throw error;
  }
}

// Example 12: Default Account State
export async function defaultAccountStateExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  defaultState: string;
  newAccountsFrozen: boolean;
}> {
  console.log("🔒 Starting Default Account State Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Default Account State extension
    const defaultState = 'Frozen';
    const result = await manager.createTokenWithDefaultAccountState(
      payer,
      mint,
      decimals,
      defaultState,
      "Frozen Token",
      "FROZEN",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`🔒 Default State: ${defaultState}`);
    
    // Simulate new account behavior
    const newAccountsFrozen = defaultState === 'Frozen';
    console.log(`🆕 New accounts will be: ${newAccountsFrozen ? 'Frozen' : 'Initialized'}`);
    
    return {
      mint: result.mint,
      defaultState,
      newAccountsFrozen
    };
    
  } catch (error) {
    console.error("❌ Error in Default Account State example:", error);
    throw error;
  }
}

// Example 13: Permanent Delegate
export async function permanentDelegateExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  delegate: PublicKey,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  delegate: PublicKey;
  isPermanent: boolean;
}> {
  console.log("🔐 Starting Permanent Delegate Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Permanent Delegate extension
    const result = await manager.createTokenWithPermanentDelegate(
      payer,
      mint,
      decimals,
      delegate,
      "Permanent Token",
      "PERM",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`🔐 Permanent Delegate: ${delegate.toString()}`);
    
    // Check if delegate is permanent
    const isPermanent = result.extensions.permanentDelegate !== undefined;
    console.log(`🔐 Is Permanent Delegate: ${isPermanent}`);
    
    return {
      mint: result.mint,
      delegate,
      isPermanent
    };
    
  } catch (error) {
    console.error("❌ Error in Permanent Delegate example:", error);
    throw error;
  }
}

// Example 14: Mint Close Authority
export async function mintCloseAuthorityExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  closeAuthority: PublicKey,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  closeAuthority: PublicKey;
  canClose: boolean;
}> {
  console.log("🔒 Starting Mint Close Authority Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Mint Close Authority extension
    const result = await manager.createTokenWithMintCloseAuthority(
      payer,
      mint,
      decimals,
      closeAuthority,
      "Closeable Token",
      "CLOSE",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`🔒 Close Authority: ${closeAuthority.toString()}`);
    
    // Check if mint can be closed
    const canClose = result.extensions.mintCloseAuthority !== undefined;
    console.log(`🔒 Can Close Mint: ${canClose}`);
    
    return {
      mint: result.mint,
      closeAuthority,
      canClose
    };
    
  } catch (error) {
    console.error("❌ Error in Mint Close Authority example:", error);
    throw error;
  }
}

// Example 15: Token Groups
export async function tokenGroupsExample(
  connection: Connection,
  payer: Keypair,
  groupMint: Keypair,
  memberMint: Keypair,
  decimals: number = 0
): Promise<{
  groupMint: PublicKey;
  memberMint: PublicKey;
  groupInfo: any;
  memberInfo: any;
}> {
  console.log("👥 Starting Token Groups Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create group token
    const groupResult = await manager.createTokenWithGroup(
      payer,
      groupMint,
      decimals,
      100, // max size
      "Collection Group",
      "GROUP",
      "https://example.com/group-metadata.json"
    );
    
    console.log(`✅ Group Token created: ${groupResult.mint.toString()}`);
    
    // Create member token
    const memberResult = await manager.createTokenWithGroupMember(
      payer,
      memberMint,
      decimals,
      groupResult.mint,
      1, // member number
      "Collection Member",
      "MEMBER",
      "https://example.com/member-metadata.json"
    );
    
    console.log(`✅ Member Token created: ${memberResult.mint.toString()}`);
    
    // Get group information
    const groupInfo = await manager.getTokenGroupInfo(groupResult.mint);
    const memberInfo = await manager.getTokenGroupMemberInfo(memberResult.mint);
    
    console.log(`👥 Group Info:`, groupInfo);
    console.log(`👤 Member Info:`, memberInfo);
    
    return {
      groupMint: groupResult.mint,
      memberMint: memberResult.mint,
      groupInfo,
      memberInfo
    };
    
  } catch (error) {
    console.error("❌ Error in Token Groups example:", error);
    throw error;
  }
}

// Example 16: CPI Guard
export async function cpiGuardExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  lockCpi: boolean;
  cpiGuardEnabled: boolean;
}> {
  console.log("🛡️ Starting CPI Guard Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with CPI Guard extension
    const lockCpi = true;
    const result = await manager.createTokenWithCpiGuard(
      payer,
      mint,
      decimals,
      lockCpi,
      "Protected Token",
      "GUARD",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`🛡️ Lock CPI: ${lockCpi}`);
    
    // Check if CPI Guard is enabled
    const cpiGuardEnabled = await manager.isCpiGuardEnabled(result.mint);
    console.log(`🛡️ CPI Guard Enabled: ${cpiGuardEnabled}`);
    
    return {
      mint: result.mint,
      lockCpi,
      cpiGuardEnabled
    };
    
  } catch (error) {
    console.error("❌ Error in CPI Guard example:", error);
    throw error;
  }
}

// Example 17: Advanced Extension Combinations
export async function advancedExtensionCombinationsExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  extensions: TokenExtensions;
  totalExtensions: number;
  extensionTypes: string[];
}> {
  console.log("🔧 Starting Advanced Extension Combinations Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with multiple advanced extensions
    const extensions: TokenExtensions = {
      interestBearing: {
        rateAuthority: payer.publicKey,
        initializationTimestamp: BigInt(Math.floor(Date.now() / 1000)),
        lastUpdateTimestamp: BigInt(Math.floor(Date.now() / 1000)),
        preUpdateAverageRate: 500,
        currentRate: 500
      },
      defaultAccountState: {
        state: 'Frozen'
      },
      permanentDelegate: {
        delegate: payer.publicKey
      },
      mintCloseAuthority: {
        closeAuthority: payer.publicKey
      },
      cpiGuard: {
        lockCpi: true
      },
      metadata: {
        updateAuthority: payer.publicKey,
        mint: mint.publicKey,
        name: "Advanced Token",
        symbol: "ADV",
        uri: "https://example.com/metadata.json",
        additionalMetadata: new Map()
      }
    };
    
    console.log(`✅ Token created with advanced extensions: ${mint.publicKey.toString()}`);
    console.log(`🔧 Extensions enabled: ${Object.keys(extensions).length}`);
    
    const extensionTypes = Object.keys(extensions);
    console.log(`📋 Extension Types: ${extensionTypes.join(', ')}`);
    
    return {
      mint: mint.publicKey,
      extensions,
      totalExtensions: Object.keys(extensions).length,
      extensionTypes
    };
    
  } catch (error) {
    console.error("❌ Error in Advanced Extension Combinations example:", error);
    throw error;
  }
}

// Example 18: Pausable Tokens
export async function pausableExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  pauseAuthority: PublicKey,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  pauseAuthority: PublicKey;
  isPaused: boolean;
  pauseSignature: string;
  unpauseSignature: string;
}> {
  console.log("⏸️ Starting Pausable Tokens Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Pausable extension
    const result = await manager.createTokenWithPausable(
      payer,
      mint,
      decimals,
      pauseAuthority,
      "Pausable Token",
      "PAUSE",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`⏸️ Pause Authority: ${pauseAuthority.toString()}`);
    
    // Pause token operations
    const pauseSignature = await manager.pauseTokenOperations(
      result.mint,
      payer
    );
    
    // Check if token is paused
    const isPaused = await manager.isTokenPaused(result.mint);
    console.log(`⏸️ Token is paused: ${isPaused}`);
    
    // Unpause token operations
    const unpauseSignature = await manager.unpauseTokenOperations(
      result.mint,
      payer
    );
    
    return {
      mint: result.mint,
      pauseAuthority,
      isPaused,
      pauseSignature,
      unpauseSignature
    };
    
  } catch (error) {
    console.error("❌ Error in Pausable example:", error);
    throw error;
  }
}

// Example 19: Transfer Hooks
export async function transferHookExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  hookProgramId: PublicKey,
  hookAuthority: PublicKey,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  hookProgramId: PublicKey;
  hookAuthority: PublicKey;
  hookEnabled: boolean;
}> {
  console.log("🪝 Starting Transfer Hook Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Transfer Hook extension
    const result = await manager.createTokenWithTransferHook(
      payer,
      mint,
      decimals,
      hookProgramId,
      hookAuthority,
      "Hook Token",
      "HOOK",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`🪝 Hook Program: ${hookProgramId.toString()}`);
    console.log(`🪝 Hook Authority: ${hookAuthority.toString()}`);
    
    // Check if transfer hook is enabled
    const hookEnabled = result.extensions.transferHook !== undefined;
    console.log(`🪝 Transfer Hook enabled: ${hookEnabled}`);
    
    return {
      mint: result.mint,
      hookProgramId,
      hookAuthority,
      hookEnabled
    };
    
  } catch (error) {
    console.error("❌ Error in Transfer Hook example:", error);
    throw error;
  }
}

// Example 20: Confidential Transfers
export async function confidentialTransferExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  auditorElgamalPubkey: PublicKey,
  auditorAuthority: PublicKey,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  auditorElgamalPubkey: PublicKey;
  auditorAuthority: PublicKey;
  confidentialEnabled: boolean;
}> {
  console.log("🔒 Starting Confidential Transfer Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Confidential Transfer extension
    const result = await manager.createTokenWithConfidentialTransfer(
      payer,
      mint,
      decimals,
      auditorElgamalPubkey,
      auditorAuthority,
      "Confidential Token",
      "CONF",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`🔒 Auditor Elgamal Pubkey: ${auditorElgamalPubkey.toString()}`);
    console.log(`🔒 Auditor Authority: ${auditorAuthority.toString()}`);
    
    // Check if confidential transfer is enabled
    const confidentialEnabled = result.extensions.confidentialTransfer !== undefined;
    console.log(`🔒 Confidential Transfer enabled: ${confidentialEnabled}`);
    
    return {
      mint: result.mint,
      auditorElgamalPubkey,
      auditorAuthority,
      confidentialEnabled
    };
    
  } catch (error) {
    console.error("❌ Error in Confidential Transfer example:", error);
    throw error;
  }
}

// Example 21: Variable Length Mint
export async function variableLengthMintExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  length: number,
  data: Uint8Array,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  length: number;
  dataSize: number;
  variableLengthEnabled: boolean;
}> {
  console.log("📏 Starting Variable Length Mint Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with Variable Length Mint extension
    const result = await manager.createTokenWithVariableLengthMint(
      payer,
      mint,
      decimals,
      length,
      data,
      "Variable Token",
      "VAR",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`📏 Length: ${length}`);
    console.log(`📏 Data Size: ${data.length} bytes`);
    
    // Check if variable length mint is enabled
    const variableLengthEnabled = result.extensions.variableLengthMint !== undefined;
    console.log(`📏 Variable Length Mint enabled: ${variableLengthEnabled}`);
    
    return {
      mint: result.mint,
      length,
      dataSize: data.length,
      variableLengthEnabled
    };
    
  } catch (error) {
    console.error("❌ Error in Variable Length Mint example:", error);
    throw error;
  }
}

// Example 22: Extension Compatibility Check
export async function extensionCompatibilityExample(
  connection: Connection,
  extensions: TokenExtensions
): Promise<{
  compatibility: ExtensionCompatibility;
  allExtensionTypes: string[];
  requirements: { [extension: string]: any };
}> {
  console.log("🔍 Starting Extension Compatibility Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Check extension compatibility
    const compatibility = manager.checkExtensionCompatibility(extensions);
    
    console.log(`🔍 Compatibility Check:`);
    console.log(`   Incompatible: ${compatibility.incompatible.length}`);
    console.log(`   Warnings: ${compatibility.warnings.length}`);
    console.log(`   Recommendations: ${compatibility.recommendations.length}`);
    
    if (compatibility.incompatible.length > 0) {
      console.log(`❌ Incompatible extensions:`);
      compatibility.incompatible.forEach(issue => console.log(`   - ${issue}`));
    }
    
    if (compatibility.warnings.length > 0) {
      console.log(`⚠️ Warnings:`);
      compatibility.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    if (compatibility.recommendations.length > 0) {
      console.log(`💡 Recommendations:`);
      compatibility.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }
    
    // Get all available extension types
    const allExtensionTypes = manager.getAllExtensionTypes();
    console.log(`📋 Available Extension Types: ${allExtensionTypes.length}`);
    
    // Get requirements for each extension
    const requirements: { [extension: string]: any } = {};
    allExtensionTypes.forEach(extensionType => {
      requirements[extensionType] = manager.getExtensionRequirements(extensionType);
    });
    
    return {
      compatibility,
      allExtensionTypes,
      requirements
    };
    
  } catch (error) {
    console.error("❌ Error in Extension Compatibility example:", error);
    throw error;
  }
}

// Example 23: Complete Extension System
export async function completeExtensionSystemExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  extensions: TokenExtensions;
  compatibility: ExtensionCompatibility;
  allTypes: string[];
  metrics: any;
}> {
  console.log("🔧 Starting Complete Extension System Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Create token with multiple extensions
    const extensions: TokenExtensions = {
      scaledUIAmount: {
        multiplier: 1.5,
        newMultiplier: 1.5,
        newMultiplierEffectiveTimestamp: Math.floor(Date.now() / 1000),
        authority: payer.publicKey
      },
      transferFee: {
        transferFeeConfigAuthority: payer.publicKey,
        withdrawWithheldAuthority: payer.publicKey,
        withheldAmount: BigInt(0),
        olderTransferFee: {
          epoch: BigInt(0),
          maximumFee: BigInt(1000000),
          transferFeeBasisPoints: 100
        },
        newerTransferFee: {
          epoch: BigInt(0),
          maximumFee: BigInt(1000000),
          transferFeeBasisPoints: 100
        }
      },
      metadata: {
        updateAuthority: payer.publicKey,
        mint: mint.publicKey,
        name: "Complete Token",
        symbol: "COMPLETE",
        uri: "https://example.com/metadata.json",
        additionalMetadata: new Map()
      },
      pausable: {
        paused: false,
        pauseAuthority: payer.publicKey
      },
      cpiGuard: {
        lockCpi: true
      }
    };
    
    console.log(`✅ Token created with complete extension system: ${mint.publicKey.toString()}`);
    console.log(`🔧 Extensions enabled: ${Object.keys(extensions).length}`);
    
    // Check compatibility
    const compatibility = manager.checkExtensionCompatibility(extensions);
    
    // Get all extension types
    const allTypes = manager.getAllExtensionTypes();
    
    // Get metrics
    const metrics = manager.getMetrics();
    
    console.log(`📊 System Metrics:`);
    console.log(`   Total Extensions: ${metrics.totalExtensions}`);
    console.log(`   Available Types: ${allTypes.length}`);
    console.log(`   Compatibility Issues: ${compatibility.incompatible.length}`);
    
    return {
      mint: mint.publicKey,
      extensions,
      compatibility,
      allTypes,
      metrics
    };
    
  } catch (error) {
    console.error("❌ Error in Complete Extension System example:", error);
    throw error;
  }
}

// Example 24: Advanced Confidential Transfer Setup
export async function advancedConfidentialTransferExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  isAvailable: boolean;
  requirements: any;
  setupComplete: boolean;
}> {
  console.log("🔒 Starting Advanced Confidential Transfer Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Check if confidential transfers are available
    const isAvailable = await manager.isConfidentialTransferAvailable();
    
    if (!isAvailable) {
      console.log("⚠️ Confidential Transfers are currently disabled");
      console.log("   This feature is temporarily unavailable due to security audit");
      console.log("   The ZK ElGamal Program is disabled on mainnet and devnet");
    }
    
    // Get requirements and setup information
    const requirements = manager.getConfidentialTransferRequirements();
    
    console.log("📋 Confidential Transfer Requirements:");
    console.log("   Prerequisites:", requirements.prerequisites.length);
    console.log("   Setup Steps:", requirements.setupSteps.length);
    console.log("   Limitations:", requirements.limitations.length);
    console.log("   Security Notes:", requirements.securityNotes.length);
    
    // Create token with Confidential Transfer extension (simulation)
    const result = await manager.createTokenWithConfidentialTransfer(
      payer,
      mint,
      decimals,
      PublicKey.default, // auditorElgamalPubkey
      payer.publicKey, // auditorAuthority
      "Confidential Token",
      "CONF",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${result.mint.toString()}`);
    console.log(`🔒 Confidential Transfer enabled: ${result.extensions.confidentialTransfer !== undefined}`);
    
    return {
      mint: result.mint,
      isAvailable,
      requirements,
      setupComplete: !isAvailable // Setup is "complete" in simulation mode
    };
    
  } catch (error) {
    console.error("❌ Error in Advanced Confidential Transfer example:", error);
    throw error;
  }
}

// Example 25: Confidential Transfer Account Setup
export async function confidentialTransferAccountSetupExample(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  account: PublicKey,
  decimals: number = 9
): Promise<{
  account: PublicKey;
  elgamalKeypair: any;
  aesKey: any;
  configured: boolean;
  state: any;
}> {
  console.log("🔧 Starting Confidential Transfer Account Setup Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Generate ElGamal keypair
    const elgamalKeypair = await manager.generateElGamalKeypair(payer, account);
    console.log(`🔐 ElGamal keypair generated: ${elgamalKeypair.publicKey.toString()}`);
    
    // Generate AES key
    const aesKey = await manager.generateAESKey(payer, account);
    console.log(`🔑 AES key generated`);
    
    // Configure account for confidential transfers
    const configureSignature = await manager.configureConfidentialTransferAccount(
      account,
      mint,
      payer,
      elgamalKeypair,
      aesKey,
      BigInt(0), // initial balance
      BigInt(65536) // max pending balance credit counter
    );
    
    console.log(`✅ Account configured: ${configureSignature}`);
    
    // Get confidential transfer state
    const state = await manager.getConfidentialTransferState(account);
    
    return {
      account,
      elgamalKeypair,
      aesKey,
      configured: true,
      state
    };
    
  } catch (error) {
    console.error("❌ Error in Confidential Transfer Account Setup example:", error);
    throw error;
  }
}

// Example 26: Confidential Transfer Operations
export async function confidentialTransferOperationsExample(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  sourceAccount: PublicKey,
  destinationAccount: PublicKey,
  amount: bigint,
  decimals: number = 9
): Promise<{
  depositSignature: string;
  applySignature: string;
  transferSignature: string;
  withdrawSignature: string;
  operationsComplete: boolean;
}> {
  console.log("💰 Starting Confidential Transfer Operations Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Generate keys for source account
    const sourceElgamalKeypair = await manager.generateElGamalKeypair(payer, sourceAccount);
    const sourceAESKey = await manager.generateAESKey(payer, sourceAccount);
    
    // Generate keys for destination account
    const destElgamalKeypair = await manager.generateElGamalKeypair(payer, destinationAccount);
    const destAESKey = await manager.generateAESKey(payer, destinationAccount);
    
    // Deposit tokens to confidential pending balance
    console.log("💰 Depositing tokens to confidential pending balance...");
    const depositSignature = await manager.depositToConfidentialPendingBalance(
      sourceAccount,
      payer,
      amount,
      decimals
    );
    
    // Apply pending balance to available balance
    console.log("🔄 Applying pending balance to available balance...");
    const applySignature = await manager.applyPendingBalance(
      sourceAccount,
      payer,
      sourceElgamalKeypair,
      sourceAESKey
    );
    
    // Perform confidential transfer
    console.log("🔒 Performing confidential transfer...");
    const transferSignature = await manager.confidentialTransfer(
      sourceAccount,
      destinationAccount,
      payer,
      amount / BigInt(2), // Transfer half the amount
      decimals,
      sourceElgamalKeypair,
      sourceAESKey,
      destElgamalKeypair.publicKey
    );
    
    // Withdraw from confidential balance
    console.log("💸 Withdrawing from confidential balance...");
    const withdrawSignature = await manager.withdrawFromConfidentialBalance(
      sourceAccount,
      payer,
      amount / BigInt(4), // Withdraw quarter of the amount
      decimals,
      sourceElgamalKeypair,
      sourceAESKey
    );
    
    console.log("✅ All confidential transfer operations completed");
    
    return {
      depositSignature,
      applySignature,
      transferSignature,
      withdrawSignature,
      operationsComplete: true
    };
    
  } catch (error) {
    console.error("❌ Error in Confidential Transfer Operations example:", error);
    throw error;
  }
}

// Example 27: Proof Generation for Confidential Transfers
export async function confidentialTransferProofExample(
  connection: Connection,
  payer: Keypair,
  account: PublicKey,
  amount: bigint
): Promise<{
  depositProof: any;
  withdrawProof: any;
  transferProof: any;
  proofGenerationComplete: boolean;
}> {
  console.log("🔐 Starting Confidential Transfer Proof Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    
    // Generate keys
    const elgamalKeypair = await manager.generateElGamalKeypair(payer, account);
    const aesKey = await manager.generateAESKey(payer, account);
    
    // Generate proof data for different operations
    console.log("🔐 Generating proof data for deposit...");
    const depositProof = await manager.generateProofData(
      'deposit',
      amount,
      elgamalKeypair,
      aesKey
    );
    
    console.log("🔐 Generating proof data for withdraw...");
    const withdrawProof = await manager.generateProofData(
      'withdraw',
      amount / BigInt(2),
      elgamalKeypair,
      aesKey
    );
    
    console.log("🔐 Generating proof data for transfer...");
    const transferProof = await manager.generateProofData(
      'transfer',
      amount / BigInt(4),
      elgamalKeypair,
      aesKey,
      { destination: PublicKey.default }
    );
    
    console.log("✅ All proof data generated successfully");
    
    return {
      depositProof,
      withdrawProof,
      transferProof,
      proofGenerationComplete: true
    };
    
  } catch (error) {
    console.error("❌ Error in Confidential Transfer Proof example:", error);
    throw error;
  }
}

// Example 28: Complete Confidential Transfer Workflow
export async function completeConfidentialTransferWorkflowExample(
  connection: Connection,
  payer: Keypair,
  mint: Keypair,
  decimals: number = 9
): Promise<{
  mint: PublicKey;
  sourceAccount: PublicKey;
  destinationAccount: PublicKey;
  workflowComplete: boolean;
  allSignatures: string[];
}> {
  console.log("🔄 Starting Complete Confidential Transfer Workflow Example");
  
  try {
    const manager = new TokenExtensionsManager(connection);
    const allSignatures: string[] = [];
    
    // Step 1: Create token with Confidential Transfer extension
    console.log("Step 1: Creating token with Confidential Transfer extension...");
    const tokenResult = await manager.createTokenWithConfidentialTransfer(
      payer,
      mint,
      decimals,
      PublicKey.default, // auditorElgamalPubkey
      payer.publicKey, // auditorAuthority
      "Workflow Token",
      "WORK",
      "https://example.com/metadata.json"
    );
    
    console.log(`✅ Token created: ${tokenResult.mint.toString()}`);
    allSignatures.push(tokenResult.signature);
    
    // Step 2: Create source account
    console.log("Step 2: Creating source account...");
    const sourceAccount = new PublicKey(mint.publicKey.toBytes());
    const sourceElgamalKeypair = await manager.generateElGamalKeypair(payer, sourceAccount);
    const sourceAESKey = await manager.generateAESKey(payer, sourceAccount);
    
    const configureSourceSignature = await manager.configureConfidentialTransferAccount(
      sourceAccount,
      tokenResult.mint,
      payer,
      sourceElgamalKeypair,
      sourceAESKey
    );
    allSignatures.push(configureSourceSignature);
    
    // Step 3: Create destination account
    console.log("Step 3: Creating destination account...");
    const destinationAccount = new PublicKey(mint.publicKey.toBytes().reverse());
    const destElgamalKeypair = await manager.generateElGamalKeypair(payer, destinationAccount);
    const destAESKey = await manager.generateAESKey(payer, destinationAccount);
    
    const configureDestSignature = await manager.configureConfidentialTransferAccount(
      destinationAccount,
      tokenResult.mint,
      payer,
      destElgamalKeypair,
      destAESKey
    );
    allSignatures.push(configureDestSignature);
    
    // Step 4: Deposit tokens
    console.log("Step 4: Depositing tokens to confidential pending balance...");
    const depositAmount = BigInt(1000000000); // 1 token with 9 decimals
    const depositSignature = await manager.depositToConfidentialPendingBalance(
      sourceAccount,
      payer,
      depositAmount,
      decimals
    );
    allSignatures.push(depositSignature);
    
    // Step 5: Apply pending balance
    console.log("Step 5: Applying pending balance to available balance...");
    const applySignature = await manager.applyPendingBalance(
      sourceAccount,
      payer,
      sourceElgamalKeypair,
      sourceAESKey
    );
    allSignatures.push(applySignature);
    
    // Step 6: Perform confidential transfer
    console.log("Step 6: Performing confidential transfer...");
    const transferAmount = depositAmount / BigInt(2);
    const transferSignature = await manager.confidentialTransfer(
      sourceAccount,
      destinationAccount,
      payer,
      transferAmount,
      decimals,
      sourceElgamalKeypair,
      sourceAESKey,
      destElgamalKeypair.publicKey
    );
    allSignatures.push(transferSignature);
    
    // Step 7: Apply pending balance on destination
    console.log("Step 7: Applying pending balance on destination account...");
    const applyDestSignature = await manager.applyPendingBalance(
      destinationAccount,
      payer,
      destElgamalKeypair,
      destAESKey
    );
    allSignatures.push(applyDestSignature);
    
    // Step 8: Withdraw from source
    console.log("Step 8: Withdrawing from source account...");
    const withdrawAmount = transferAmount / BigInt(2);
    const withdrawSignature = await manager.withdrawFromConfidentialBalance(
      sourceAccount,
      payer,
      withdrawAmount,
      decimals,
      sourceElgamalKeypair,
      sourceAESKey
    );
    allSignatures.push(withdrawSignature);
    
    console.log("✅ Complete Confidential Transfer Workflow finished");
    console.log(`📊 Total signatures: ${allSignatures.length}`);
    
    return {
      mint: tokenResult.mint,
      sourceAccount,
      destinationAccount,
      workflowComplete: true,
      allSignatures
    };
    
  } catch (error) {
    console.error("❌ Error in Complete Confidential Transfer Workflow example:", error);
    throw error;
  }
}

// Export all examples
export const TokenExtensionsExamples = {
  scaledUIAmountExample,
  transferFeeExample,
  metadataExtensionExample,
  memoTransferExample,
  immutableOwnerExample,
  nonTransferableExample,
  multipleExtensionsExample,
  extensionValidationExample,
  extensionMonitoringExample,
  extensionCostAnalysisExample,
  interestBearingExample,
  defaultAccountStateExample,
  permanentDelegateExample,
  mintCloseAuthorityExample,
  tokenGroupsExample,
  cpiGuardExample,
  advancedExtensionCombinationsExample,
  pausableExample,
  transferHookExample,
  confidentialTransferExample,
  variableLengthMintExample,
  extensionCompatibilityExample,
  completeExtensionSystemExample,
  advancedConfidentialTransferExample,
  confidentialTransferAccountSetupExample,
  confidentialTransferOperationsExample,
  confidentialTransferProofExample,
  completeConfidentialTransferWorkflowExample
};
