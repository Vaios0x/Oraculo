// Test script for ZK proof generation
const { proveAgePredicate } = require('./frontend/lib/zk/snarkProver.ts');

async function testZKProof() {
  console.log('🧪 Testing ZK Proof Generation...\n');

  try {
    // Test case 1: Valid proof (age >= threshold)
    console.log('Test 1: Age 25, Threshold 18');
    const result1 = await proveAgePredicate({ age: 25, threshold: 18 });
    console.log('✅ Proof generated successfully');
    console.log('Public signals:', result1.publicSignals);
    console.log('Proof structure:', {
      pi_a_length: result1.proof.pi_a.length,
      pi_b_length: result1.proof.pi_b.length,
      pi_c_length: result1.proof.pi_c.length
    });
    console.log('');

    // Test case 2: Invalid proof (age < threshold)
    console.log('Test 2: Age 16, Threshold 18');
    try {
      await proveAgePredicate({ age: 16, threshold: 18 });
      console.log('❌ Should have failed but didn\'t');
    } catch (error) {
      console.log('✅ Correctly rejected invalid proof:', error.message);
    }
    console.log('');

    // Test case 3: Edge case (age = threshold)
    console.log('Test 3: Age 18, Threshold 18');
    const result3 = await proveAgePredicate({ age: 18, threshold: 18 });
    console.log('✅ Edge case proof generated successfully');
    console.log('Public signals:', result3.publicSignals);
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testZKProof();
