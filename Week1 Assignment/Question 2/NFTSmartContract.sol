// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTSmartContract is ERC721URIStorage {
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter public _tokenIds;
    Counters.Counter public actIndex;
    mapping(uint256 => string) private _tokenURIs;
    bytes32[] Leaves;
    bytes32 public root;
    bytes32[] hashes;

    constructor() ERC721("HarshNFT", "HAR") {}

    function GenerateNFT(address receiver,string memory _name,string memory _desc)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(receiver, newItemId);
        string memory tokenURI = createTokenURI(_name, _desc);
        _setTokenURI(newItemId, tokenURI);
        root = createMerkleRoot(tokenURI,newItemId,receiver,actIndex.current());
        actIndex.increment();
        return newItemId;
    }

    //Store OnChain Metadata, Create Token URI

    function createTokenURI(string memory _name,string memory _desc) public pure returns(string memory tokenURI) {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "', _name, '"',
                '"description": "', _desc, '"'
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    //Generate Merkle tree

    function createMerkleRoot(string memory _tokenURI, uint256 _tokenId, address _receiver, uint256 _actIndex) public returns (bytes32 _root) {

        bytes32 Hash = keccak256(abi.encodePacked(_tokenURI, _tokenId.toString(),_receiver,msg.sender));
        Leaves.push(Hash);

        //Check Current Index is even
        
        if(_actIndex % 2 == 0){
            Leaves.push(Hash);
        }else{
            Leaves.pop();
            Leaves[_actIndex] = Hash;
        }

        uint n = Leaves.length;
        uint offset = 0;
        hashes = Leaves;

        while (n > 0) {
            for (uint i = 0; i < n - 1; i += 2) {
                hashes.push(
                    keccak256(
                        abi.encodePacked(hashes[offset + i], hashes[offset + i + 1])
                    )
                );
                
            }
            offset += n;
            n = n / 2;
        }


        return hashes[hashes.length - 1];

    }

    // function returnsHashes() public view returns(bytes32[] memory) {
    //     return hashes;
    // }

    // function returnLeaves() public view returns(bytes32[] memory) {
    //     return Leaves;
    // }
    
}