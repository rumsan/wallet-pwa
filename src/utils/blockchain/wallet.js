import { ethers } from 'ethers';

import { getCurrentNetwork, logout, getEncryptedWallet } from '../sessionManager';
import { getNetworkByName } from '../../constants/networks';

export default class {
	static isValidMnemonic = ethers.utils.isValidMnemonic;

	constructor({ passcode }) {
		this.passcode = passcode;
	}

	async create(mnemonic) {
		const passcode = this.passcode;
		if (!passcode) {
			throw Error('Passcode must be set first');
		}
		let wallet = getEncryptedWallet();
		if (wallet) return { wallet: null, encryptedWallet: wallet };
		if (mnemonic) wallet = ethers.Wallet.fromMnemonic(mnemonic);
		else wallet = ethers.Wallet.createRandom();

		const { address, privateKey } = wallet;
		const encryptedWallet = await wallet.encrypt(passcode.toString());
		return { privateKey, address, wallet, encryptedWallet };
	}

	async loadFromPrivateKey(privateKey) {
		if (!privateKey) return null;
		let wallet = await new ethers.Wallet(privateKey);
		if (!wallet) throw Error('Wallet not found');
		const network = this.fetchCurrentNetwork();
		const { url } = network;
		const provider = new ethers.providers.JsonRpcProvider(url);
		wallet = wallet.connect(provider);
		return wallet;
	}

	async load(passcode) {
		let wallet = this.loadFromChabi();
		if (!wallet) {
			wallet = await this.loadUsingAppChabi(passcode);
		}
		const network = this.fetchCurrentNetwork();
		const { url } = network;
		const provider = new ethers.providers.JsonRpcProvider(url);
		wallet = wallet.connect(provider);
		const { address, privateKey } = wallet;
		return { privateKey, address };
	}

	async loadUsingAppChabi(passcode) {
		if (!passcode) {
			throw Error('Passcode must be set first');
		}
		const encryptedWallet = getEncryptedWallet();
		if (!encryptedWallet) throw Error('No local wallet found');
		const data = await ethers.Wallet.fromEncryptedJson(encryptedWallet, passcode.toString());
		return data;
	}

	loadFromChabi(chabi) {
		if (!chabi) return null;
		return new ethers.Wallet(chabi);
	}

	fetchCurrentNetwork() {
		let network = getCurrentNetwork();
		if (!network) network = getNetworkByName();
		return network;
	}

	clear() {
		logout();
	}
}
