import { ethers } from 'ethers';
import { getCurrentNetwork } from '../sessionManager';
const NETWORK_URL = getCurrentNetwork();

//const TEST_NETWORK = 'https://testnetwork.esatya.io';

export const getAbi = contractName => {
	const contractJson = require(`./build/${contractName}`);
	return contractJson;
};

export const ethersContract = async (abi, contractAddress) => {
	let provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
	try {
		const instance = new ethers.Contract(contractAddress, abi, provider);
		return instance;
	} catch (error) {
		throw new Error(error);
	}
};

export const ethersWallet = private_key => {
	let provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
	const senderWallet = new ethers.Wallet(private_key, provider);
	return senderWallet;
};
