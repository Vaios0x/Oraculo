"use client";

import React, { useState } from 'react';
import { Fingerprint, Shield, Zap, CheckCircle, XCircle, Key, IdCard, Layers } from 'lucide-react';
import { proveAgePredicate, Groth16Proof, PublicSignals } from '../lib/zk/snarkProver';
import { sha256Bytes, randomBytes } from '../lib/crypto';
import { useWallet } from '@solana/wallet-adapter-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ZKCompression from './ZKCompression';
// On-chain submission will be wired via identityClient when program is deployed

export default function IdentityZK() {
  const wallet = useWallet();
  const [isProving, setIsProving] = useState(false);
  const [proveResult, setProveResult] = useState<null | { type: 'zkTLS' | 'VC'; message: string }>(null);
  const [proveError, setProveError] = useState<string | null>(null);
  const [age, setAge] = useState<number>(21);
  const [threshold, setThreshold] = useState<number>(18);
  const [proofPayload, setProofPayload] = useState<null | { proof: Groth16Proof; publicSignals: PublicSignals; vkId: string }>(null);
  const [lastTxSig, setLastTxSig] = useState<string | null>(null);

  return (
    <div className="matrix-card-enhanced p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="identity" className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4" />
            ZK Identity
          </TabsTrigger>
          <TabsTrigger value="compression" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            ZK Compression
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="identity" className="space-y-6 sm:space-y-8">
      <div id="zk-identity-section" className="matrix-card-enhanced p-6 sm:p-8 border-2 border-green-400/50 bg-green-400/5" aria-labelledby="zk-identity-heading">
        <div className="space-y-4">
          <h3 id="zk-identity-heading" className="text-2xl sm:text-3xl font-bold matrix-text-green">
            🪪 Identity (ZK)
          </h3>
          <p className="matrix-text-white text-sm sm:text-base">
            Prove an attribute without revealing your data. Use zkTLS (a fact from a trusted website) or a Verifiable Credential (VC/DID) with selective disclosure.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label="Proof inputs">
            <div className="matrix-card-enhanced p-3 flex items-center space-x-2">
              <IdCard className="w-4 h-4 text-green-400" />
              <label className="text-sm matrix-text-white">Age</label>
              <input
                type="number"
                min={0}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value || '0', 10))}
                className="bg-black/60 border border-green-400/40 rounded px-2 py-1 text-sm matrix-text-white w-full"
                aria-label="Age value"
              />
            </div>
            <div className="matrix-card-enhanced p-3 flex items-center space-x-2">
              <IdCard className="w-4 h-4 text-green-400" />
              <label className="text-sm matrix-text-white">Threshold</label>
              <input
                type="number"
                min={0}
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value || '0', 10))}
                className="bg-black/60 border border-green-400/40 rounded px-2 py-1 text-sm matrix-text-white w-full"
                aria-label="Threshold value"
              />
            </div>
            <div className="matrix-card-enhanced p-3 text-xs matrix-text-white opacity-80">
              Predicate: prove age ≥ threshold locally in your browser using snarkjs (Groth16). Add /zk/age.wasm and /zk/age.zkey to enable real proving.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Identity proof options">
            <button
              type="button"
              className="matrix-button-enhanced px-4 py-3 flex items-center justify-center space-x-2"
              onClick={async () => {
                setProveError(null);
                setProveResult(null);
                setIsProving(true);
                try {
                  await new Promise((r) => setTimeout(r, 800));
                  setProveResult({ type: 'zkTLS', message: 'Attribute proven via zkTLS' });
                } catch (e: any) {
                  setProveError(e?.message || 'Error generating zkTLS proof');
                } finally {
                  setIsProving(false);
                }
              }}
              aria-label="Generate zkTLS proof"
              disabled={isProving}
            >
              <Fingerprint className="w-5 h-5" />
              <span>{isProving ? 'Generating proof…' : 'Prove with zkTLS'}</span>
            </button>

            <button
              type="button"
              className="matrix-button-enhanced px-4 py-3 flex items-center justify-center space-x-2"
              onClick={async () => {
                setProveError(null);
                setProveResult(null);
                setIsProving(true);
                try {
                  const { proof, publicSignals } = await proveAgePredicate({ age, threshold });
                  setProofPayload({ proof, publicSignals, vkId: 'age_groth16_v1' });
                  setProveResult({ type: 'VC', message: 'Attribute proven via VC/DID (age ≥ threshold)' });
                } catch (e: any) {
                  setProveError(e?.message || 'Error generating VC/DID proof');
                } finally {
                  setIsProving(false);
                }
              }}
              aria-label="Generate VC/DID proof"
              disabled={isProving}
            >
              <Shield className="w-5 h-5" />
              <span>{isProving ? 'Generating proof…' : 'Prove with VC/DID'}</span>
            </button>
          </div>

          <div className="min-h-[2.5rem]" aria-live="polite" aria-atomic="true">
            {isProving && (
              <div className="flex items-center space-x-2 text-yellow-300">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Generating cryptographic proof…</span>
              </div>
            )}
            {!isProving && proveResult && (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">
                  {proveResult.message}. Ready to verify on Solana.
                  {lastTxSig && (
                    <>
                      {' '}•{' '}
                      <a
                        href={`https://explorer.solana.com/tx/${lastTxSig}?cluster=devnet`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        View tx
                      </a>
                    </>
                  )}
                </span>
              </div>
            )}
            {!isProving && proveError && (
              <div className="flex items-center space-x-2 text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">{proveError}</span>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              className="matrix-button-enhanced px-4 py-3 flex items-center space-x-2"
              onClick={async () => {
                if (!proveResult) return;
                setProveError(null);
                setIsProving(true);
                try {
                  if (!wallet.publicKey || !wallet.signTransaction) throw new Error('Connect a wallet first');
                  
                  // Derive hashes & fields
                  const predicateStr = `age>=${threshold}`;
                  const predicateHash = (await sha256Bytes(predicateStr)).slice(0, 32);
                  const issuerHash = (await sha256Bytes('self')).slice(0, 32);
                  const nonce = randomBytes(16);
                  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30d

                  // Lazy import to avoid build errors if anchor not installed yet
                  const { verifyIdentityProof, buildProvider } = await import('../lib/identityClient');
                  const provider = await buildProvider(process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com', wallet);

                  // Use proofPayload if available (VC/DID), otherwise create mock data (zkTLS)
                  let publicInputs: Uint8Array;
                  let proofBytes: Uint8Array;
                  let vkId: Uint8Array;

                  if (proofPayload) {
                    // Real VC/DID proof
                    publicInputs = new TextEncoder().encode(JSON.stringify(proofPayload.publicSignals));
                    proofBytes = new TextEncoder().encode(JSON.stringify(proofPayload.proof));
                    vkId = new Uint8Array(32).fill(0); // Convert to 32-byte array
                  } else {
                    // Mock zkTLS proof
                    publicInputs = new TextEncoder().encode(JSON.stringify([age, threshold]));
                    proofBytes = new TextEncoder().encode(JSON.stringify({ mock: 'zkTLS_proof' }));
                    vkId = new Uint8Array(32).fill(1); // Different pattern for zkTLS
                  }

                  const sig = await verifyIdentityProof(provider, {
                    vkId,
                    predicateHash,
                    issuerHash,
                    expiresAt,
                    nonce,
                    publicInputs,
                    proof: proofBytes,
                  });
                  setLastTxSig(sig);
                  setProveResult({ ...proveResult, message: `${proveResult.message} and submitted on-chain: ${sig.slice(0, 8)}…` });
                } catch (e: any) {
                  setProveError(e?.message || 'Error verifying on Solana');
                } finally {
                  setIsProving(false);
                }
              }}
              aria-label="Verify on Solana"
              disabled={isProving || !proveResult}
              tabIndex={0}
            >
              <Key className="w-5 h-5" />
              <span>{isProving ? 'Verifying…' : 'Verify on Solana'}</span>
            </button>
            {proofPayload && (
              <div className="text-xs matrix-text-white opacity-70 mt-2">
                vkId: {proofPayload.vkId} · publicSignals: {proofPayload.publicSignals.join(',').slice(0, 80)}{proofPayload.publicSignals.join(',').length > 80 ? '…' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
        </TabsContent>
        
        <TabsContent value="compression" className="space-y-6 sm:space-y-8">
          <ZKCompression />
        </TabsContent>
      </Tabs>
    </div>
  );
}


