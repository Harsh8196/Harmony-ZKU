const poseidon_gencontract = require("circomlibjs");
const { ethers } = require("ethers");
const ganache = require("ganache-cli");


  const provider = new ethers.providers.Web3Provider(ganache.provider());

  account = provider.getSigner(0);

  console.log(poseidon_gencontract);

  const PoseidonT3 = new ethers.ContractFactory(
    poseidon_gencontract.poseidonContract.generateABI(2),
    poseidon_gencontract.poseidonContract.createCode(2),
    account
);
  const poseidonT3 = PoseidonT3.deploy();
  poseidonT3.deployed();

  console.log(poseidonT3.address)
