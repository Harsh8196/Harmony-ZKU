pragma circom 2.0.0;
include "../node_modules/circomlib/circuits/mimcsponge.circom";

template init() {
    signal input cardNo[2];
    signal input secret;
    signal output commitment_card1;
    signal output commitment_card2;
    signal output commitment;

    component mimc_card1 = MiMCSponge(2, 220, 1);
    
    mimc_card1.ins[0] <== cardNo[0];
    mimc_card1.ins[1] <== secret;
    mimc_card1.k <== 0;

    commitment_card1 <== mimc_card1.outs[0];
    
    component mimc_card2 = MiMCSponge(2, 220, 1);
    mimc_card2.ins[0] <== cardNo[1];
    mimc_card2.ins[1] <== secret;
    mimc_card2.k <== 0;

    commitment_card2 <== mimc_card2.outs[0];

    component mimc_comitment = MiMCSponge(2,220,1);
    mimc_comitment.ins[0] <== mimc_card1.outs[0];
    mimc_comitment.ins[1] <== mimc_card2.outs[0];
    mimc_comitment.k <== 0;

    commitment <== mimc_comitment.outs[0];
}

component main = init();