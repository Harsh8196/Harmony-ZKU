/*
    Prove: I know (x1,y1,x2,y2,x3,y3,r2,energy) such that:
    - x2^2 + y2^2 <= r^2
    - x3^2 + y3^2 <= r^2
    - (x1-x2)^2 + (y1-y2)^2 <= energy^2
    - (x2-x3)^2 + (y2-y3)^2 <= energy^2
    - 0.5*(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2)) != 0 -triangle Area calculation
    - MiMCSponge(x1,y1) = pub1
    - MiMCSponge(x2,y2) = pub2
    - MiMCSponge(x3,y3) = pub3
*/
pragma circom 2.0.0;
include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "./range-proof.circom";

template move() {

    signal  input x1;
    signal  input y1;
    signal  input x2;
    signal  input y2;
    signal  input x3;
    signal  input y3;
    signal input r;
    signal input energy;

    signal output pub1;
    signal output pub2;
    signal output pub3;

    /* check abs(x1), abs(y1), abs(x2), abs(y2) < 2 ** 32 */
    component rpx1x2 = MultiRangeProof(4, 40, 2 ** 32);
    rpx1x2.in[0] <== x1;
    rpx1x2.in[1] <== y1;
    rpx1x2.in[2] <== x2;
    rpx1x2.in[3] <== y2;

    /* check abs(x2), abs(y2), abs(x3), abs(y3) < 2 ** 32 */
    component rpx2x3 = MultiRangeProof(4, 40, 2 ** 32);
    rpx2x3.in[0] <== x2;
    rpx2x3.in[1] <== y2;
    rpx2x3.in[2] <== x3;
    rpx2x3.in[3] <== y3;

    /* check x2^2 + y2^2 < r^2 */

    component comp2 = LessThan(32);
    signal x2Sq;
    signal y2Sq;
    signal rSq;
    x2Sq <== x2 * x2;
    y2Sq <== y2 * y2;
    rSq <== r * r;
    comp2.in[0] <== x2Sq + y2Sq;
    comp2.in[1] <== rSq;
    comp2.out === 1;

    /* check x3^2 + y3^2 < r^2 */

    component comp3 = LessThan(32);
    signal x3Sq;
    signal y3Sq;
    signal r3Sq;
    x3Sq <== x3 * x3;
    y3Sq <== y3 * y3;
    r3Sq <== r * r;
    comp3.in[0] <== x3Sq + y3Sq;
    comp3.in[1] <== r3Sq;
    comp3.out === 1;

    /* check (x1-x2)^2 + (y1-y2)^2 <= energy^2 */

    signal diffX;
    diffX <== x1 - x2;
    signal diffY;
    diffY <== y1 - y2;

    component ltDist = LessThan(32);
    signal firstDistSquare;
    signal secondDistSquare;
    firstDistSquare <== diffX * diffX;
    secondDistSquare <== diffY * diffY;
    ltDist.in[0] <== firstDistSquare + secondDistSquare;
    ltDist.in[1] <== energy * energy + 1;
    ltDist.out === 1;

    /* check (x1-x2)^2 + (y1-y2)^2 <= energy^2 */

    signal diffX1;
    diffX1 <== x1 - x2;
    signal diffY1;
    diffY1 <== y1 - y2;

    component ltDist1 = LessThan(32);
    signal firstDistSquare1;
    signal secondDistSquare1;
    firstDistSquare1 <== diffX1 * diffX1;
    secondDistSquare1 <== diffY1 * diffY1;
    ltDist1.in[0] <== firstDistSquare1 + secondDistSquare1;
    ltDist1.in[1] <== energy * energy + 1;
    ltDist1.out === 1;

    /* check (x2-x3)^2 + (y2-y3)^2 <= energy^2 */

    signal diffX2;
    diffX2 <== x2 - x3;
    signal diffY2;
    diffY2 <== y2 - y3;

    component ltDist2 = LessThan(32);
    signal firstDistSquare2;
    signal secondDistSquare2;
    firstDistSquare2 <== diffX2 * diffX2;
    secondDistSquare2 <== diffY2 * diffY2;
    ltDist2.in[0] <== firstDistSquare2 + secondDistSquare2;
    ltDist2.in[1] <== energy * energy + 1;
    ltDist2.out === 1;

    /*check 0.5*(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2)) != 0*/
    signal diffY3;
    diffY3 <== y3 - y1;
    signal compx1;
    compx1 <== x1*diffY2;
    signal compx2;
    compx2 <== x2*diffY3;
    signal compx3;
    compx3 <== x3*diffY1;
    signal triangleArea;
    triangleArea <== (1/2)*(compx1+compx2+compx3);

    component isEqual_ = IsEqual();
    isEqual_.in[0] <== triangleArea;
    isEqual_.in[1] <== 0;
    isEqual_.out === 0;

    component mimc1 = MiMCSponge(2, 220, 1);
    component mimc2 = MiMCSponge(2, 220, 1);
    component mimc3 = MiMCSponge(2, 220, 1);

    mimc1.ins[0] <== x1;
    mimc1.ins[1] <== y1;
    mimc1.k <== 0;
    mimc2.ins[0] <== x2;
    mimc2.ins[1] <== y2;
    mimc2.k <== 0;
    mimc3.ins[0] <== x3;
    mimc3.ins[1] <== y3;
    mimc3.k <== 0;

    pub1 <== mimc1.outs[0];
    pub2 <== mimc2.outs[0];
    pub3 <== mimc3.outs[0];


}

component main = move();