import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
// Usar el IDL completo para evitar incompatibilidades del coder
// Importar el IDL generado que sí existe en el repo. Si en algún entorno no está,
// se puede sustituir en tiempo de build por otro IDL compatible con el mismo address.
import idl from '../idl/oraculo_identity.json';

// Preferir la variable de entorno; si no existe, usar el campo "address" del IDL (Anchor >=0.29)
// y, como compatibilidad, caer a metadata.address si estuviera presente.
const ENV_PROGRAM_ID = (process.env.NEXT_PUBLIC_IDENTITY_PROGRAM_ID || '').trim();
const IDL_PROGRAM_ID = (idl as any)?.address || (idl as any)?.metadata?.address || '';

if (!ENV_PROGRAM_ID && !IDL_PROGRAM_ID) {
  // Lanzar un error claro en tiempo de carga para evitar el críptico "_bn"
  throw new Error(
    'ORACULO_IDENTITY_PROGRAM_ID no definido. Configure NEXT_PUBLIC_IDENTITY_PROGRAM_ID o asegúrese de que el IDL contenga un campo "address" válido.'
  );
}

export const ORACULO_IDENTITY_PROGRAM_ID = new PublicKey(
  ENV_PROGRAM_ID.length > 0 ? ENV_PROGRAM_ID : IDL_PROGRAM_ID
);

async function importAnchor(): Promise<any> {
  return await import('@coral-xyz/anchor');
}

export type OraculoIdentityIdl = any;

// Nota: evitamos construir Program de Anchor para no depender del coder
export async function getProgram(_provider: any) {
  const anchor = await importAnchor();
  return { anchor } as any;
}

export function attestationPda(subject: PublicKey, predicateHash: Uint8Array) {
  return PublicKey.findProgramAddressSync([
    Buffer.from('attest'),
    subject.toBuffer(),
    Buffer.from(predicateHash),
  ], ORACULO_IDENTITY_PROGRAM_ID);
}

export function configPda() {
  return PublicKey.findProgramAddressSync([
    Buffer.from('config'),
  ], ORACULO_IDENTITY_PROGRAM_ID);
}

export function noncePda(subject: PublicKey) {
  return PublicKey.findProgramAddressSync([
    Buffer.from('nonce'),
    subject.toBuffer(),
  ], ORACULO_IDENTITY_PROGRAM_ID);
}

export async function verifyIdentityProof(
  provider: any,
  args: {
    vkId: Uint8Array; // 32 bytes
    predicateHash: Uint8Array; // 32
    issuerHash: Uint8Array; // 32
    expiresAt: number; // u64 - will be converted to BN
    nonce: Uint8Array; // 16
    publicInputs: Uint8Array;
    proof: Uint8Array;
  },
  subjectPublicKey?: any
) {
  const anchor = await importAnchor();
  
  // Obtener el publicKey del parámetro, wallet o del provider
  const subject = subjectPublicKey || provider.wallet?.publicKey || provider.publicKey;
  if (!subject) {
    throw new Error('No public key available. Please provide subjectPublicKey parameter or ensure wallet is connected.');
  }
  const [attest] = attestationPda(subject, args.predicateHash);
  const [config] = configPda();
  const [noncePdaKey] = noncePda(subject);

  // Discriminador e inputs serializados manualmente (borsh-like)
  const verifyDisc = Buffer.from([7, 88, 49, 216, 219, 55, 206, 170]);
  const expiresBuf = Buffer.alloc(8);
  expiresBuf.writeBigUInt64LE(BigInt(args.expiresAt));
  const publicInputsLen = Buffer.alloc(4);
  publicInputsLen.writeUInt32LE(args.publicInputs.length);
  const proofLen = Buffer.alloc(4);
  proofLen.writeUInt32LE(args.proof.length);
  const dataBuf = Buffer.concat([
    verifyDisc,
    Buffer.from(args.vkId),
    Buffer.from(args.predicateHash),
    Buffer.from(args.issuerHash),
    expiresBuf,
    Buffer.from(args.nonce),
    publicInputsLen,
    Buffer.from(args.publicInputs),
    proofLen,
    Buffer.from(args.proof),
  ]);

  const ix: TransactionInstruction = {
    programId: ORACULO_IDENTITY_PROGRAM_ID,
    keys: [
      { pubkey: subject, isSigner: true, isWritable: true },
      { pubkey: attest, isSigner: false, isWritable: true },
      { pubkey: config, isSigner: false, isWritable: true },
      { pubkey: noncePdaKey, isSigner: false, isWritable: true },
      { pubkey: (anchor as any).web3.SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: dataBuf,
  } as any;

  // Add compute budget por defecto
  const computeIxs = [
    (anchor as any).web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 }),
    (anchor as any).web3.ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 5_000 }),
  ];

  const tx = new (anchor as any).web3.Transaction().add(...computeIxs, ix);
  tx.feePayer = subject;
  const { blockhash } = await provider.connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  const signed = await provider.wallet.signTransaction(tx);
  const sig = await provider.connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
  await provider.connection.confirmTransaction(sig, 'confirmed');
  return sig;
}

export async function initConfig(
  provider: any,
  allowedIssuersRoot: Uint8Array = new Uint8Array(32).fill(0),
  version: number = 1,
  adminPublicKey?: any
) {
  const anchor = await importAnchor();
  
  // Obtener el publicKey del parámetro, wallet o del provider
  const admin = adminPublicKey || provider.wallet?.publicKey || provider.publicKey;
  if (!admin) {
    throw new Error('No public key available. Please provide adminPublicKey parameter or ensure wallet is connected.');
  }
  
  const [config] = configPda();

  const initDisc = Buffer.from([23, 235, 115, 232, 168, 96, 1, 231]);
  const versionBuf = Buffer.alloc(4);
  versionBuf.writeUInt32LE(version);
  const dataBuf = Buffer.concat([
    initDisc,
    Buffer.from(allowedIssuersRoot),
    versionBuf,
  ]);

  const ix: TransactionInstruction = {
    programId: ORACULO_IDENTITY_PROGRAM_ID,
    keys: [
      { pubkey: admin, isSigner: true, isWritable: true },
      { pubkey: config, isSigner: false, isWritable: true },
      { pubkey: (anchor as any).web3.SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: dataBuf,
  } as any;

  const tx = new (anchor as any).web3.Transaction().add(ix);
  tx.feePayer = admin;
  const { blockhash } = await provider.connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  const signed = await provider.wallet.signTransaction(tx);
  const sig = await provider.connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
  await provider.connection.confirmTransaction(sig, 'confirmed');
  return sig;
}

export async function buildProvider(connectionUrl: string, wallet: any) {
  const anchor = await importAnchor();
  const connection = new (anchor as any).web3.Connection(connectionUrl, 'confirmed');
  const provider = new (anchor as any).AnchorProvider(connection, wallet, { commitment: 'confirmed' });
  
  // Asegurar que el provider tenga el publicKey disponible
  if (wallet.publicKey && !provider.publicKey) {
    provider.publicKey = wallet.publicKey;
  }
  
  return provider;
}


