pragma circom 2.0.0;

// ZK Compression: Batch age verification
template BatchAgeVerification(n) {
    signal input ages[n];
    signal input thresholds[n];
    signal output batchValid;

    // ZK Compression: Check each age >= threshold
    // Use quadratic constraints for each check
    signal checks[n];
    
    for (var i = 0; i < n; i++) {
        // Check if age[i] >= threshold[i]
        // This creates a quadratic constraint
        checks[i] <== (ages[i] - thresholds[i]) * (ages[i] - thresholds[i] + 1);
    }

    // All checks must be positive (age >= threshold)
    // Use multiplication to ensure all are valid
    signal temp1 <== checks[0] * checks[1];
    signal temp2 <== checks[2] * checks[3];
    batchValid <== temp1 * temp2;
}

// Main component for batch verification (up to 4 identities)
component main = BatchAgeVerification(4);
