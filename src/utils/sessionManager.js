export function getEncryptedWallet() {
	if (localStorage.getItem('wallet') && Object.keys(localStorage.getItem('wallet')).length) {
		return JSON.parse(localStorage.getItem('wallet'));
	}
	return null;
}

export function saveEncyptedWallet(userData) {
	localStorage.setItem('wallet', JSON.stringify(userData));
}

export function savePublickey(pubKey) {
	localStorage.setItem('publicKey', pubKey);
}

export function getPublicKey() {
	return localStorage.getItem('publicKey');
}

export function logout() {
	localStorage.clear();
	window.location = '/';
}
