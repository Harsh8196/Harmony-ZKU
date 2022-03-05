// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract HelloWorld {
    
    // uint variable a
    uint a;

    // store value in variable "a"

    function storeUint (uint _a) public {
        a=_a;
    }

    // retrive value of variable "a"

    function retrieveUint() public view returns (uint) {
        return a;
    }
}