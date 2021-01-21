import { ethers } from 'ethers';

import { logout, getEncryptedWallet, saveEncyptedWallet } from '../sessionManager';
import { APP_CONSTANTS } from '../../constants';
const NETWORK_URL = APP_CONSTANTS.BLOCKCHAIN_NETWORK;

export default class {
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
		saveEncyptedWallet(encryptedWallet);
		return { privateKey, address, wallet };
	}

	async loadFromPrivayKey(privateKey) {
		if (!privateKey) return null;
		let wallet = await new ethers.Wallet(privateKey);
		if (!wallet) throw Error('Wallet not found');
		const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
		wallet = wallet.connect(provider);
		return wallet;
	}

	async load(passcode) {
		let wallet = this.loadFromChabi();
		if (!wallet) {
			wallet = await this.loadUsingAppChabi(passcode);
		}
		const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
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

	clear() {
		logout();
	}
}
