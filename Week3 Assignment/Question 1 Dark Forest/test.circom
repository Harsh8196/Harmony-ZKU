pragma circom 2.0.3;

template BadHash() {
    signal private input x
    signal x_squared;
    signal x_cubed;
    signal output out;

    x_squared <== x * x;
    x_cubed <== x_squared * x;
    out <== x_cubed - x + 7;
}

component main = BadHash();

