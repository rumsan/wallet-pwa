import CryptoJS from 'crypto-js';
import { getPublicKey } from './sessionManager';

const publicKey = getPublicKey();

export const encryptData = data => {
	let raw_data = '';
	if (typeof data === 'string') raw_data = data;
	if (typeof data === 'object') raw_data = JSON.stringify(data);
	const ciphertext = CryptoJS.AES.encrypt(raw_data, publicKey).toString();
	return ciphertext;
};

export const decryptData = ciphertext => {
	const bytes = CryptoJS.AES.decrypt(ciphertext, publicKey);
	const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
	return decryptedData;
};
