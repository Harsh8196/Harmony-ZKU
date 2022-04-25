const ZKPayroll = artifacts.require("ZKPayroll");
const Verifier = artifacts.require("Verifier")
const PoseidonT3 = artifacts.require("PoseidonT3")
const IncrementalBinaryTree = artifacts.require("IncrementalBinaryTree");
const poseidon_gencontract = require("circomlibjs");
const { ethers } = require("ethers");


module.exports = async function (deployer) {

  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = provider.getSigner(0);

    const PoseidonT3_ = new ethers.ContractFactory(
        poseidon_gencontract.poseidonContract.generateABI(2),
        poseidon_gencontract.poseidonContract.createCode(2),
        signer
    );


  await deployer.deploy(Verifier)
  const _verifier = await Verifier.deployed()
  const poseidonT3Contract = await PoseidonT3_.deploy();
  IncrementalBinaryTree.link("PoseidonT3",poseidonT3Contract.address)
  await deployer.deploy(IncrementalBinaryTree);
  await deployer.link(IncrementalBinaryTree,ZKPayroll);
  await deployer.deploy(ZKPayroll,_verifier.address);
};
