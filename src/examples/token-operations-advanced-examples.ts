// Token Operations Advanced Examples
// ==================================
// Advanced examples demonstrating token transfer, delegation, burning, and account operations

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
import { TokenOperationsManager, TokenOperationsUtils } from "../utils/token-operations-manager";

// Example 1: Complete Token Transfer Workflow
export async function completeTokenTransferWorkflow(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  sourceOwner: Keypair,
  destinationOwner: Keypair,
  amount: number,
  decimals: number = 9
): Promise<{
  sourceAccount: PublicKey;
  destinationAccount: PublicKey;
  transferSignature: string;
  finalBalances: { source: bigint; destination: bigint };
}> {
  console.log("🚀 Starting Complete Token Transfer Workflow");
  
  try {
    const manager = new TokenOperationsManager(connection);
    
    // Get or create source token account
    const sourceAccount = await getAssociatedTokenAddress(
      mint,
      sourceOwner.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );
    
    // Get or create destination token account
    const destinationAccount = await getAssociatedTokenAddress(
      mint,
      destinationOwner.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );
    
    console.log(`📊 Source Account: ${sourceAccount.toString()}`);
    console.log(`📊 Destination Account: ${destinationAccount.toString()}`);
    
    // Check if accounts exist, create if needed
    try {
      await getAccount(connection, sourceAccount);
      console.log("✅ Source account exists");
    } catch {
      console.log("🔨 Creating source account...");
      // Account creation would be handled by the calling code
    }
    
    try {
      await getAccount(connection, destinationAccount);
      console.log("✅ Destination account exists");
    } catch {
      console.log("🔨 Creating destination account...");
      // Account creation would be handled by the calling code
    }
    
    // Get initial balances
    const sourceAccountInfo = await getAccount(connection, sourceAccount);
    const destinationAccountInfo = await getAccount(connection, destinationAccount);
    
    console.log(`💰 Initial Source Balance: ${sourceAccountInfo.amount.toString()}`);
    console.log(`💰 Initial Destination Balance: ${destinationAccountInfo.amount.toString()}`);
    
    // Perform transfer with checked amounts
    console.log(`🔄 Transferring ${amount} tokens...`);
    const transferOperation = await manager.transferTokensChecked(
      sourceAccount,
      destinationAccount,
      mint,
      amount,
      decimals,
      sourceOwner
    );
    
    console.log(`✅ Transfer completed: ${transferOperation.signature}`);
    
    // Get final balances
    const finalSourceInfo = await getAccount(connection, sourceAccount);
    const finalDestinationInfo = await getAccount(connection, destinationAccount);
    
    const finalBalances = {
      source: finalSourceInfo.amount,
      destination: finalDestinationInfo.amount
    };
    
    console.log(`💰 Final Source Balance: ${finalBalances.source.toString()}`);
    console.log(`💰 Final Destination Balance: ${finalBalances.destination.toString()}`);
    
    return {
      sourceAccount,
      destinationAccount,
      transferSignature: transferOperation.signature!,
      finalBalances
    };
    
  } catch (error) {
    console.error("❌ Error in complete token transfer workflow:", error);
    throw error;
  }
}

// Example 2: Advanced Delegation System
export async function advancedDelegationSystem(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  tokenOwner: Keypair,
  delegate: Keypair,
  delegationAmount: number,
  decimals: number = 9
): Promise<{
  tokenAccount: PublicKey;
  delegationSignature: string;
  delegateCanTransfer: boolean;
  revokeSignature: string;
}> {
  console.log("🔐 Starting Advanced Delegation System");
  
  try {
    const manager = new TokenOperationsManager(connection);
    
    // Get token account
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      tokenOwner.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );
    
    console.log(`📊 Token Account: ${tokenAccount.toString()}`);
    console.log(`👤 Owner: ${tokenOwner.publicKey.toString()}`);
    console.log(`🔑 Delegate: ${delegate.publicKey.toString()}`);
    
    // Check account info before delegation
    const accountInfoBefore = await manager.getTokenAccountInfo(tokenAccount);
    console.log("📋 Account Info Before Delegation:");
    console.log(TokenOperationsUtils.formatTokenAccountInfo(accountInfoBefore!));
    
    // Approve delegate with checked amounts
    console.log(`🔐 Approving delegate for ${delegationAmount} tokens...`);
    const delegationOperation = await manager.approveDelegateChecked(
      tokenAccount,
      mint,
      delegate.publicKey,
      delegationAmount,
      decimals,
      tokenOwner
    );
    
    console.log(`✅ Delegation approved: ${delegationOperation.signature}`);
    
    // Check account info after delegation
    const accountInfoAfter = await manager.getTokenAccountInfo(tokenAccount);
    console.log("📋 Account Info After Delegation:");
    console.log(TokenOperationsUtils.formatTokenAccountInfo(accountInfoAfter!));
    
    // Verify delegate can transfer
    const canTransfer = await manager.canTransfer(tokenAccount, delegate.publicKey);
    console.log(`🔍 Delegate can transfer: ${canTransfer}`);
    
    // Revoke delegation
    console.log("🚫 Revoking delegation...");
    const revokeSignature = await manager.revokeDelegate(tokenAccount, tokenOwner);
    console.log(`✅ Delegation revoked: ${revokeSignature}`);
    
    // Check account info after revocation
    const accountInfoAfterRevoke = await manager.getTokenAccountInfo(tokenAccount);
    console.log("📋 Account Info After Revocation:");
    console.log(TokenOperationsUtils.formatTokenAccountInfo(accountInfoAfterRevoke!));
    
    return {
      tokenAccount,
      delegationSignature: delegationOperation.signature!,
      delegateCanTransfer: canTransfer,
      revokeSignature
    };
    
  } catch (error) {
    console.error("❌ Error in advanced delegation system:", error);
    throw error;
  }
}

// Example 3: Token Burning and Supply Management
export async function tokenBurningAndSupplyManagement(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  tokenOwner: Keypair,
  burnAmount: number,
  decimals: number = 9
): Promise<{
  tokenAccount: PublicKey;
  initialSupply: bigint;
  finalSupply: bigint;
  burnSignature: string;
  supplyReduction: bigint;
}> {
  console.log("🔥 Starting Token Burning and Supply Management");
  
  try {
    const manager = new TokenOperationsManager(connection);
    
    // Get token account
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      tokenOwner.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );
    
    console.log(`📊 Token Account: ${tokenAccount.toString()}`);
    console.log(`👤 Owner: ${tokenOwner.publicKey.toString()}`);
    
    // Get initial mint supply
    const mintInfo = await getMint(connection, mint);
    const initialSupply = mintInfo.supply;
    console.log(`📈 Initial Supply: ${initialSupply.toString()}`);
    
    // Get initial account balance
    const accountInfo = await manager.getTokenAccountInfo(tokenAccount);
    console.log(`💰 Initial Account Balance: ${accountInfo?.amount.toString()}`);
    
    // Burn tokens with checked amounts
    console.log(`🔥 Burning ${burnAmount} tokens...`);
    const burnOperation = await manager.burnTokensChecked(
      tokenAccount,
      mint,
      burnAmount,
      decimals,
      tokenOwner
    );
    
    console.log(`✅ Tokens burned: ${burnOperation.signature}`);
    
    // Get final mint supply
    const finalMintInfo = await getMint(connection, mint);
    const finalSupply = finalMintInfo.supply;
    console.log(`📉 Final Supply: ${finalSupply.toString()}`);
    
    // Get final account balance
    const finalAccountInfo = await manager.getTokenAccountInfo(tokenAccount);
    console.log(`💰 Final Account Balance: ${finalAccountInfo?.amount.toString()}`);
    
    const supplyReduction = initialSupply - finalSupply;
    console.log(`📊 Supply Reduction: ${supplyReduction.toString()}`);
    
    return {
      tokenAccount,
      initialSupply,
      finalSupply,
      burnSignature: burnOperation.signature!,
      supplyReduction
    };
    
  } catch (error) {
    console.error("❌ Error in token burning and supply management:", error);
    throw error;
  }
}

// Example 4: Account Freezing and Thawing System
export async function accountFreezingAndThawingSystem(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  tokenOwner: Keypair,
  freezeAuthority: Keypair
): Promise<{
  tokenAccount: PublicKey;
  freezeSignature: string;
  thawSignature: string;
  isFrozenAfterFreeze: boolean;
  isFrozenAfterThaw: boolean;
}> {
  console.log("❄️ Starting Account Freezing and Thawing System");
  
  try {
    const manager = new TokenOperationsManager(connection);
    
    // Get token account
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      tokenOwner.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );
    
    console.log(`📊 Token Account: ${tokenAccount.toString()}`);
    console.log(`👤 Owner: ${tokenOwner.publicKey.toString()}`);
    console.log(`❄️ Freeze Authority: ${freezeAuthority.publicKey.toString()}`);
    
    // Check initial freeze status
    const initialFreezeStatus = await manager.isAccountFrozen(tokenAccount);
    console.log(`🔍 Initial Freeze Status: ${initialFreezeStatus}`);
    
    // Freeze account
    console.log("❄️ Freezing account...");
    const freezeOperation = await manager.freezeAccount(
      tokenAccount,
      mint,
      freezeAuthority
    );
    
    console.log(`✅ Account frozen: ${freezeOperation.signature}`);
    
    // Check freeze status after freezing
    const isFrozenAfterFreeze = await manager.isAccountFrozen(tokenAccount);
    console.log(`🔍 Freeze Status After Freeze: ${isFrozenAfterFreeze}`);
    
    // Try to transfer (should fail)
    console.log("🔄 Attempting transfer on frozen account...");
    try {
      await manager.transferTokens(
        tokenAccount,
        tokenAccount, // Self transfer to test
        1,
        tokenOwner
      );
      console.log("⚠️ Transfer succeeded (unexpected)");
    } catch (error) {
      console.log("✅ Transfer failed as expected (account is frozen)");
    }
    
    // Thaw account
    console.log("🌡️ Thawing account...");
    const thawOperation = await manager.thawAccount(
      tokenAccount,
      mint,
      freezeAuthority
    );
    
    console.log(`✅ Account thawed: ${thawOperation.signature}`);
    
    // Check freeze status after thawing
    const isFrozenAfterThaw = await manager.isAccountFrozen(tokenAccount);
    console.log(`🔍 Freeze Status After Thaw: ${isFrozenAfterThaw}`);
    
    return {
      tokenAccount,
      freezeSignature: freezeOperation.signature!,
      thawSignature: thawOperation.signature!,
      isFrozenAfterFreeze,
      isFrozenAfterThaw
    };
    
  } catch (error) {
    console.error("❌ Error in account freezing and thawing system:", error);
    throw error;
  }
}

// Example 5: Wrapped SOL (WSOL) Operations
export async function wrappedSOLOperations(
  connection: Connection,
  payer: Keypair,
  owner: Keypair,
  wrapAmount: number
): Promise<{
  wrappedSOLAccount: PublicKey;
  wrapSignature: string;
  syncSignature: string;
  unwrapSignature: string;
  finalBalance: bigint;
}> {
  console.log("🪙 Starting Wrapped SOL Operations");
  
  try {
    const manager = new TokenOperationsManager(connection);
    
    // Get wrapped SOL account
    const wrappedSOLAccount = await getAssociatedTokenAddress(
      NATIVE_MINT,
      owner.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );
    
    console.log(`📊 Wrapped SOL Account: ${wrappedSOLAccount.toString()}`);
    console.log(`👤 Owner: ${owner.publicKey.toString()}`);
    console.log(`🪙 Wrap Amount: ${wrapAmount} lamports`);
    
    // Create wrapped SOL account if it doesn't exist
    try {
      await getAccount(connection, wrappedSOLAccount);
      console.log("✅ Wrapped SOL account exists");
    } catch {
      console.log("🔨 Creating wrapped SOL account...");
      // Account creation would be handled by the calling code
    }
    
    // Transfer SOL to wrapped SOL account
    console.log("💸 Transferring SOL to wrapped account...");
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: wrappedSOLAccount,
      lamports: wrapAmount
    });
    
    const transferTransaction = new Transaction().add(transferInstruction);
    const { blockhash } = await connection.getLatestBlockhash();
    transferTransaction.recentBlockhash = blockhash;
    transferTransaction.feePayer = payer.publicKey;
    
    transferTransaction.sign(payer);
    const wrapSignature = await connection.sendTransaction(transferTransaction, [payer]);
    await connection.confirmTransaction(wrapSignature);
    
    console.log(`✅ SOL transferred: ${wrapSignature}`);
    
    // Sync native SOL
    console.log("🔄 Syncing native SOL...");
    const syncSignature = await manager.syncNative(wrappedSOLAccount);
    console.log(`✅ Native SOL synced: ${syncSignature}`);
    
    // Check wrapped SOL balance
    const wrappedAccountInfo = await manager.getTokenAccountInfo(wrappedSOLAccount);
    console.log(`💰 Wrapped SOL Balance: ${wrappedAccountInfo?.amount.toString()}`);
    
    // Unwrap SOL (close account)
    console.log("🔄 Unwrapping SOL...");
    const unwrapSignature = await manager.closeAccount(
      wrappedSOLAccount,
      owner.publicKey,
      owner
    );
    console.log(`✅ SOL unwrapped: ${unwrapSignature}`);
    
    // Check final balance
    const finalAccountInfo = await manager.getTokenAccountInfo(wrappedSOLAccount);
    const finalBalance = finalAccountInfo?.amount || 0n;
    
    return {
      wrappedSOLAccount,
      wrapSignature,
      syncSignature,
      unwrapSignature,
      finalBalance
    };
    
  } catch (error) {
    console.error("❌ Error in wrapped SOL operations:", error);
    throw error;
  }
}

// Example 6: Batch Token Operations
export async function batchTokenOperations(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  operations: Array<{
    type: 'transfer' | 'burn' | 'approve';
    account: PublicKey;
    amount: number;
    authority: Keypair;
    delegate?: PublicKey;
  }>,
  decimals: number = 9
): Promise<{
  operations: Array<{
    type: string;
    signature: string;
    success: boolean;
    error?: string;
  }>;
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
}> {
  console.log("📦 Starting Batch Token Operations");
  
  try {
    const manager = new TokenOperationsManager(connection);
    const results: Array<{
      type: string;
      signature: string;
      success: boolean;
      error?: string;
    }> = [];
    
    let successfulOperations = 0;
    let failedOperations = 0;
    
    for (const operation of operations) {
      try {
        console.log(`🔄 Processing ${operation.type} operation...`);
        
        let signature: string;
        
        switch (operation.type) {
          case 'transfer':
            const transferOp = await manager.transferTokensChecked(
              operation.account,
              operation.account, // Self transfer for demo
              mint,
              operation.amount,
              decimals,
              operation.authority
            );
            signature = transferOp.signature!;
            break;
            
          case 'burn':
            const burnOp = await manager.burnTokensChecked(
              operation.account,
              mint,
              operation.amount,
              decimals,
              operation.authority
            );
            signature = burnOp.signature!;
            break;
            
          case 'approve':
            if (!operation.delegate) {
              throw new Error('Delegate required for approve operation');
            }
            const approveOp = await manager.approveDelegateChecked(
              operation.account,
              mint,
              operation.delegate,
              operation.amount,
              decimals,
              operation.authority
            );
            signature = approveOp.signature!;
            break;
            
          default:
            throw new Error(`Unknown operation type: ${operation.type}`);
        }
        
        results.push({
          type: operation.type,
          signature,
          success: true
        });
        
        successfulOperations++;
        console.log(`✅ ${operation.type} completed: ${signature}`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          type: operation.type,
          signature: '',
          success: false,
          error: errorMessage
        });
        
        failedOperations++;
        console.log(`❌ ${operation.type} failed: ${errorMessage}`);
      }
    }
    
    const totalOperations = operations.length;
    
    console.log(`📊 Batch Operations Summary:`);
    console.log(`   Total: ${totalOperations}`);
    console.log(`   Successful: ${successfulOperations}`);
    console.log(`   Failed: ${failedOperations}`);
    console.log(`   Success Rate: ${((successfulOperations / totalOperations) * 100).toFixed(2)}%`);
    
    return {
      operations: results,
      totalOperations,
      successfulOperations,
      failedOperations
    };
    
  } catch (error) {
    console.error("❌ Error in batch token operations:", error);
    throw error;
  }
}

// Example 7: Token Operations Monitoring
export async function tokenOperationsMonitoring(
  connection: Connection,
  duration: number = 60000 // 1 minute
): Promise<{
  metrics: any;
  operationHistory: any[];
  efficiency: any;
}> {
  console.log("📊 Starting Token Operations Monitoring");
  
  try {
    const manager = new TokenOperationsManager(connection);
    
    console.log(`⏱️ Monitoring for ${duration / 1000} seconds...`);
    
    // Start monitoring
    const startTime = Date.now();
    const initialMetrics = manager.getMetrics();
    
    // Monitor for specified duration
    await new Promise(resolve => setTimeout(resolve, duration));
    
    const endTime = Date.now();
    const finalMetrics = manager.getMetrics();
    const operationHistory = manager.getOperationHistory();
    
    // Calculate efficiency
    const efficiency = TokenOperationsUtils.calculateOperationEfficiency(operationHistory);
    
    console.log("📈 Monitoring Results:");
    console.log(`   Duration: ${(endTime - startTime) / 1000} seconds`);
    console.log(`   Total Operations: ${finalMetrics.totalTransfers + finalMetrics.totalBurns + finalMetrics.totalDelegations + finalMetrics.totalFreezes + finalMetrics.totalThaws}`);
    console.log(`   Transfers: ${finalMetrics.totalTransfers}`);
    console.log(`   Burns: ${finalMetrics.totalBurns}`);
    console.log(`   Delegations: ${finalMetrics.totalDelegations}`);
    console.log(`   Freezes: ${finalMetrics.totalFreezes}`);
    console.log(`   Thaws: ${finalMetrics.totalThaws}`);
    console.log(`   Total Amount Transferred: ${finalMetrics.totalAmountTransferred.toString()}`);
    console.log(`   Total Amount Burned: ${finalMetrics.totalAmountBurned.toString()}`);
    console.log(`   Operation Frequency: ${efficiency.operationFrequency.toFixed(2)} ops/min`);
    console.log(`   Efficiency: ${efficiency.efficiency.toFixed(4)}`);
    
    return {
      metrics: finalMetrics,
      operationHistory,
      efficiency
    };
    
  } catch (error) {
    console.error("❌ Error in token operations monitoring:", error);
    throw error;
  }
}

// Example 8: Token Operations Validation
export async function tokenOperationsValidation(
  connection: Connection,
  operations: Array<{
    type: 'transfer' | 'burn' | 'approve';
    source: PublicKey;
    destination?: PublicKey;
    amount: number;
    authority: PublicKey;
    delegate?: PublicKey;
  }>
): Promise<{
  validations: Array<{
    operation: any;
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  totalValid: number;
  totalInvalid: number;
}> {
  console.log("🔍 Starting Token Operations Validation");
  
  try {
    const manager = new TokenOperationsManager(connection);
    const validations: Array<{
      operation: any;
      valid: boolean;
      errors: string[];
      warnings: string[];
    }> = [];
    
    let totalValid = 0;
    let totalInvalid = 0;
    
    for (const operation of operations) {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      console.log(`🔍 Validating ${operation.type} operation...`);
      
      // Basic validation
      if (!operation.source || operation.source.equals(PublicKey.default)) {
        errors.push('Invalid source address');
      }
      
      if (operation.amount <= 0) {
        errors.push('Amount must be greater than 0');
      }
      
      if (!operation.authority || operation.authority.equals(PublicKey.default)) {
        errors.push('Invalid authority address');
      }
      
      // Type-specific validation
      if (operation.type === 'transfer') {
        if (!operation.destination || operation.destination.equals(PublicKey.default)) {
          errors.push('Invalid destination address for transfer');
        }
        
        if (operation.destination && operation.source.equals(operation.destination)) {
          warnings.push('Transferring to same account');
        }
      }
      
      if (operation.type === 'approve') {
        if (!operation.delegate || operation.delegate.equals(PublicKey.default)) {
          errors.push('Invalid delegate address for approve');
        }
      }
      
      // Check account capabilities
      try {
        const canTransfer = await manager.canTransfer(operation.source, operation.authority);
        if (!canTransfer) {
          errors.push('Account cannot be transferred from');
        }
      } catch (error) {
        errors.push('Failed to check transfer capability');
      }
      
      const isValid = errors.length === 0;
      
      validations.push({
        operation,
        valid: isValid,
        errors,
        warnings
      });
      
      if (isValid) {
        totalValid++;
        console.log(`✅ ${operation.type} operation is valid`);
      } else {
        totalInvalid++;
        console.log(`❌ ${operation.type} operation is invalid: ${errors.join(', ')}`);
      }
      
      if (warnings.length > 0) {
        console.log(`⚠️ Warnings: ${warnings.join(', ')}`);
      }
    }
    
    console.log(`📊 Validation Summary:`);
    console.log(`   Total Operations: ${operations.length}`);
    console.log(`   Valid: ${totalValid}`);
    console.log(`   Invalid: ${totalInvalid}`);
    console.log(`   Success Rate: ${((totalValid / operations.length) * 100).toFixed(2)}%`);
    
    return {
      validations,
      totalValid,
      totalInvalid
    };
    
  } catch (error) {
    console.error("❌ Error in token operations validation:", error);
    throw error;
  }
}

// Export all examples
export const TokenOperationsExamples = {
  completeTokenTransferWorkflow,
  advancedDelegationSystem,
  tokenBurningAndSupplyManagement,
  accountFreezingAndThawingSystem,
  wrappedSOLOperations,
  batchTokenOperations,
  tokenOperationsMonitoring,
  tokenOperationsValidation
};
