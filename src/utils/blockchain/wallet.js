import store from 'store';
import { ethers } from 'ethers';

import { logout, getEncryptedWallet, saveEncyptedWallet, getPasscode } from '../sessionManager';

const storeName = 'sanduk';
const Network_Url = 'http://localhost:4001';

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
		const encryptedWallet = await wallet.encrypt(passcode);
		saveEncyptedWallet(encryptedWallet);
		return { privateKey, address, wallet };
	}

	async load(passcode) {
		let wallet = this.loadFromChabi();
		if (!wallet) {
			wallet = await this.loadUsingAppChabi(passcode);
		}
		console.log('Wallet==>', wallet);
		const provider = new ethers.providers.JsonRpcProvider(Network_Url);
		wallet = wallet.connect(provider);
		return wallet;
	}

	loadUsingAppChabi(passcode) {
		passcode = passcode || getPasscode();
		if (!passcode) {
			throw Error('Passcode must be set first');
		}
		const encryptedWallet = getEncryptedWallet();
		if (!encryptedWallet) throw Error('No local wallet found');
		return ethers.Wallet.fromEncryptedJson(encryptedWallet, passcode);
	}

	loadFromChabi(chabi) {
		console.log({ chabi });
		// /	const chabi = store.get('chabi'); // Chabi is private key
		if (!chabi) return null;
		return new ethers.Wallet(chabi);
	}

	getAddress() {
		if (!store.get(storeName)) return null;
		return JSON.parse(store.get(storeName)).address;
	}

	clear() {
		logout();
	}
}
