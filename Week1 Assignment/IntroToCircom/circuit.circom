pragma circom 2.0.0;
include "./mimcsponge.circom";

template createMerkletree (N) {
    signal input leaves[N];
    signal output root;
    signal leavesHash[2*N-1];
    var Num = N;
    component mimc[N];
    
    //Computing Individual Hash for Input Signals and Store into Array

    for(var i=0;i<N;i++){
        mimc[i] = MiMCSponge(1, 220, 1);
        mimc[i].ins[0] <== leaves[i] ;
        mimc[i].k <== 0 ;
        leavesHash[i] <== mimc[i].outs[0] ;
    }

    var n = N;
    var offset = 0;
    
    component mimcN[N-1];
    
    //Generating Merkle root

    while(n > 0) {
        for (var j=0;j<n;j++){
            if(j%2 == 1){
                mimcN[N-Num] = MiMCSponge(2, 220, 1);
                mimcN[N-Num].ins[0] <== leavesHash[offset+j-1];
                mimcN[N-Num].ins[1] <== leavesHash[offset+j];
                mimcN[N-Num].k <== 0; 
                leavesHash[N] <== mimcN[N-Num].outs[0];
                N += 1 ;
            }
            
        }
        offset = n;
        n = n/2;
    }
    log(leavesHash[0]);
    log(leavesHash[1]);
    log(leavesHash[2]);
    log(leavesHash[3]);
    log(leavesHash[4]);
    log(leavesHash[5]);
    log(leavesHash[6]);
    
    root <== leavesHash[2*Num-2];
    log(root);
}

component main = createMerkletree(8);