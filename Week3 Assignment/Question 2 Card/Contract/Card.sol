// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

interface IVerifier {
     function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input
        ) external view returns (bool r);
}

contract Card {
    IVerifier verifier;
    address[] public players; //Address of Players
    struct cardsHash {
        uint256[] _cardsHash;  //List of Cards uint256 from Circuit
    }

    mapping(address=>cardsHash) distributedCrads; //Mapping with Player
    mapping(address => uint256) cardCommitment; // Final CommitmentCard from Circuit

    constructor (address verifier_address)  {
        verifier = IVerifier(verifier_address);
    }

    //Player Registration 
    function registerPlayers(address _player) public {
        players.push(_player);
    }

    //Storing distributed card to each player recive from circuit Public json

    function storeCardCommitment(uint256[] memory _cards,address _player,uint256 _cardsCommitment) public {
        for(uint i = 0;i<_cards.length;i++){
            distributedCrads[_player]._cardsHash.push(_cards[i]);
        }

        cardCommitment[_player] = _cardsCommitment;
    }

    //ZK Proof verifier and checks condition.

    function isSameSuite(uint[2] memory a,uint[2][2] memory b,uint[2] memory c,uint[3] memory input,address _player) public {
        uint256 _card1Hash = input[0];
        uint256 _cardsCommitment = input[2];
        uint256[] memory _allcardsHash = getCardHashes(_player);
        require(verifier.verifyProof(a,b,c,input),"Proof is invalid.");

        require(_allcardsHash[0] == _card1Hash,"Card 1 is Spoofed." );

        require(cardCommitment[_player] == _cardsCommitment,"Card is not from same suite");


    }
    function getCardHashes(address _player) public view returns(uint256[] memory){
        return (distributedCrads[_player]._cardsHash);
    }

}