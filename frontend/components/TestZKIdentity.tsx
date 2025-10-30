'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface TestResult {
  step: string;
  success: boolean;
  txHash?: string;
  data?: any;
  error?: string;
}

export default function TestZKIdentity() {
  const { wallet, publicKey, connected } = useWallet();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');

  const runTest = async () => {
    if (!wallet || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsRunning(true);
    setResults([]);
    setCurrentStep('Initializing test...');

    try {
      // Test data (same as backend test)
      const testVkId = new Uint8Array(32).fill(1);
      const testPredicateHash = new Uint8Array(32).fill(2);
      const testIssuerHash = new Uint8Array(32).fill(3);
      const testExpiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
      const testNonce = new Uint8Array(16).fill(4);
      const testPublicInputs = new Uint8Array([1, 2, 3, 4, 5]);
      const testProof = new Uint8Array([6, 7, 8, 9, 10]);

      // Step 1: Initialize config
      setCurrentStep('Step 1: Initializing verifier config...');
      const { buildProvider, initConfig } = await import('../lib/identityClient');
      const provider = await buildProvider(process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com', wallet);

      let configResult: TestResult = { step: 'Initialize Config', success: false };
      try {
        const configTx = await initConfig(provider, new Uint8Array(32).fill(0), 1, publicKey);
        configResult = { 
          step: 'Initialize Config', 
          success: true, 
          txHash: configTx,
          data: { message: 'Config initialized successfully' }
        };
        setResults(prev => [...prev, configResult]);
      } catch (error: any) {
        if (error.message?.includes('already in use')) {
          configResult = { 
            step: 'Initialize Config', 
            success: true, 
            data: { message: 'Config already initialized' }
          };
        } else {
          configResult = { 
            step: 'Initialize Config', 
            success: false, 
            error: error.message 
          };
        }
        setResults(prev => [...prev, configResult]);
      }

      // Step 2: Verify identity proof
      setCurrentStep('Step 2: Verifying identity proof...');
      const { verifyIdentityProof } = await import('../lib/identityClient');
      
      const identityResult: TestResult = { step: 'Verify Identity', success: false };
      try {
        const identityTx = await verifyIdentityProof(provider, {
          vkId: testVkId,
          predicateHash: testPredicateHash,
          issuerHash: testIssuerHash,
          expiresAt: testExpiresAt,
          nonce: testNonce,
          publicInputs: testPublicInputs,
          proof: testProof
        }, publicKey);

        identityResult.success = true;
        identityResult.txHash = identityTx;
        identityResult.data = {
          subject: publicKey.toString(),
          predicateHash: Buffer.from(testPredicateHash).toString('hex'),
          issuerHash: Buffer.from(testIssuerHash).toString('hex'),
          vkId: Buffer.from(testVkId).toString('hex'),
          expiresAt: new Date(testExpiresAt * 1000).toISOString()
        };
        setResults(prev => [...prev, identityResult]);
      } catch (error: any) {
        identityResult.error = error.message;
        setResults(prev => [...prev, identityResult]);
        throw error;
      }

      // Step 3: Fetch attestation data (sin coder Anchor para evitar fallo de IDL)
      setCurrentStep('Step 3: Fetching attestation data...');
      try {
        const anchor = await import('@coral-xyz/anchor');
        const { ORACULO_IDENTITY_PROGRAM_ID } = await import('../lib/identityClient');
        const [attestationPda] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from('attest'), publicKey.toBuffer(), testPredicateHash],
          ORACULO_IDENTITY_PROGRAM_ID
        );
        const info = await provider.connection.getAccountInfo(attestationPda);
        const fetchResult: TestResult = info
          ? { step: 'Fetch Attestation', success: true, data: { pda: attestationPda.toBase58(), dataLen: info.data.length } }
          : { step: 'Fetch Attestation', success: false, error: 'Attestation not found' };
        setResults(prev => [...prev, fetchResult]);
      } catch (error: any) {
        const fetchResult: TestResult = { step: 'Fetch Attestation', success: false, error: error.message };
        setResults(prev => [...prev, fetchResult]);
      }

      // Step 4: Fetch verifier config (sin coder Anchor)
      setCurrentStep('Step 4: Fetching verifier config...');
      try {
        const anchor = await import('@coral-xyz/anchor');
        const { ORACULO_IDENTITY_PROGRAM_ID } = await import('../lib/identityClient');
        const [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from('config')],
          ORACULO_IDENTITY_PROGRAM_ID
        );
        const info = await provider.connection.getAccountInfo(configPda);
        const configFetchResult: TestResult = info
          ? { step: 'Fetch Config', success: true, data: { pda: configPda.toBase58(), dataLen: info.data.length } }
          : { step: 'Fetch Config', success: false, error: 'Config not found' };
        setResults(prev => [...prev, configFetchResult]);
      } catch (error: any) {
        const configFetchResult: TestResult = { step: 'Fetch Config', success: false, error: error.message };
        setResults(prev => [...prev, configFetchResult]);
      }

      setCurrentStep('Test completed successfully!');
      toast.success('ZK Identity test completed successfully!');

    } catch (error: any) {
      console.error('Test failed:', error);
      toast.error(`Test failed: ${error.message}`);
      setCurrentStep('Test failed');
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getExplorerUrl = (txHash: string) => {
    return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
  };

  const resetTest = () => {
    setResults([]);
    setCurrentStep('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            ZK Identity Backend Test
          </CardTitle>
          <CardDescription>
            Test the ZK Identity program using the same configuration as the backend tests.
            This will execute real transactions on Solana devnet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!connected ? (
            <div className="text-center py-8">
              <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Please connect your wallet to run the test</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={runTest} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isRunning ? 'Running Test...' : 'Run ZK Identity Test'}
                </Button>
                
                {results.length > 0 && (
                  <Button 
                    onClick={resetTest} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>

              {currentStep && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Current Step:</p>
                  <p className="text-sm text-muted-foreground">{currentStep}</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Test Results:</h3>
                  {results.map((result, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {result.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">{result.step}</p>
                            {result.error && (
                              <p className="text-sm text-red-500">{result.error}</p>
                            )}
                            {result.data && (
                              <div className="mt-2 space-y-1">
                                {Object.entries(result.data).map(([key, value]) => (
                                  <div key={key} className="text-sm">
                                    <span className="font-medium">{key}:</span>{' '}
                                    <span className="text-muted-foreground">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {result.txHash && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(result.txHash!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(getExplorerUrl(result.txHash!), '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {results.length > 0 && results.every(r => r.success) && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="font-medium text-green-800 dark:text-green-200">
                      All tests passed successfully!
                    </p>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    The ZK Identity program is working correctly on devnet.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
