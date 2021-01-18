const Web3 = require("web3");

const blockchain_network = "http://localhost:3000/";

const web3 = new Web3(new Web3.providers.HttpProvider(blockchain_network));

export default web3;
