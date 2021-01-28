import { ethers } from 'ethers';
import { getCurrentNetwork } from '../sessionManager';

// TODO get current network
const NETWORK_URL = 'https://testnetwork.esatya.io';

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
