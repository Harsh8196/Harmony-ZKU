// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.3;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "./EthereumLightClient.sol";
import "./EthereumProver.sol";
import "./TokenLocker.sol";

contract TokenLockerOnHarmony is TokenLocker, OwnableUpgradeable {
    using RLPReader for RLPReader.RLPItem;
    using RLPReader for bytes;
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    EthereumLightClient public lightclient;


    //Mapping Receipt hash => bool
    mapping(bytes32 => bool) public spentReceipt;

    function initialize() external initializer {
        __Ownable_init();
    }

    // Change Light Client 
    function changeLightClient(EthereumLightClient newClient)
        external
        onlyOwner
    {
        lightclient = newClient;
    }

    // Bind bridge address  
    function bind(address otherSide) external onlyOwner {
        otherSideBridge = otherSide;
    }

    
    /// Used to validate and execute proof
    /// blockno is the block header number
    /// rootHash is the Keccak-256 hash of the root node of the MPT.
    /// mptKey is the key (consisting of nibbles) of the node whose
    ///        inclusion/exclusion we are proving.
    /// proof is decoded to stack of MPT nodes (starting with the root) that
    ///        need to be traversed during verification.
   


    function validateAndExecuteProof(
        uint256 blockNo,
        bytes32 rootHash,
        bytes calldata mptkey,
        bytes calldata proof
    ) external {
        bytes32 blockHash = bytes32(lightclient.blocksByHeight(blockNo, 0));
        require(
            lightclient.VerifyReceiptsHash(blockHash, rootHash),
            "wrong receipt hash"
        );
        bytes32 receiptHash = keccak256(
            abi.encodePacked(blockHash, rootHash, mptkey)
        );
        require(spentReceipt[receiptHash] == false, "double spent!");
        bytes memory rlpdata = EthereumProver.validateMPTProof(
            rootHash,
            mptkey,
            proof
        );
        spentReceipt[receiptHash] = true;
        uint256 executedEvents = execute(rlpdata);
        require(executedEvents > 0, "no valid event");
    }
}