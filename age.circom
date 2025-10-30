pragma circom 2.0.0;

template AgeCheck() {
    signal input age;
    signal input threshold;
    signal output out;
    
    // Verificar que age >= threshold
    out <-- (age >= threshold) ? 1 : 0;
    out === 1;
}

component main = AgeCheck();
