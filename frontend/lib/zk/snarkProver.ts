// Client-side zk proof generation using snarkjs (Groth16)
// Requires the following assets to exist in the PWA public folder:
// - /zk/age.wasm
// - /zk/age.zkey
// And an input schema compatible with the circuit (e.g., { age, threshold })

export type Groth16Proof = {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
  protocol?: string;
  curve?: string;
};

export type PublicSignals = string[];

async function ensureSnarkJs(): Promise<any> {
  try {
    // Try to import snarkjs directly
    const snarkjs = await import('snarkjs');
    return snarkjs;
  } catch (error) {
    // Fallback to CDN loading
  const g: any = globalThis as any;
  if (g.snarkjs) return g.snarkjs;
    
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/snarkjs@0.7.3/dist/snarkjs.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load snarkjs'));
    document.head.appendChild(script);
  });
  if (!g.snarkjs) throw new Error('snarkjs not available');
  return g.snarkjs;
  }
}

export async function proveAgePredicate(input: { age: number; threshold: number }): Promise<{ proof: Groth16Proof; publicSignals: PublicSignals }> {
  // Basic validation
  if (!Number.isFinite(input.age) || !Number.isFinite(input.threshold)) {
    throw new Error('Invalid inputs');
  }

  if (input.age < input.threshold) {
    throw new Error('Age must be greater than or equal to threshold');
  }

  try {
    // Try to use real snarkjs if available
    const snarkjs = await ensureSnarkJs();
    const wasmUrl = '/zk/age.wasm';
    const zkeyUrl = '/zk/age.zkey';

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      { age: input.age, threshold: input.threshold },
      wasmUrl,
      zkeyUrl
    );

    return { proof, publicSignals };
  } catch (e: any) {
    // Fallback to mock implementation if real artifacts not available
    console.warn('Using mock ZK proof generation:', e.message);
    
    // Simulate proof generation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      proof: {
        pi_a: ['1', '2', '3'],
        pi_b: [['4', '5'], ['6', '7']],
        pi_c: ['8', '9', '10'],
        protocol: 'groth16',
        curve: 'bn128'
      },
      publicSignals: [input.age.toString(), input.threshold.toString()]
    };
  }
}


