export function getEncryptedWallet() {
	if (localStorage.getItem('wallet') && Object.keys(localStorage.getItem('wallet')).length) {
		return JSON.parse(localStorage.getItem('wallet'));
	}
	return null;
}

export function saveEncyptedWallet(userData) {
	localStorage.setItem('wallet', JSON.stringify(userData));
}

export function saveCurrentNetwork(network) {
	localStorage.setItem('currentNetwork', JSON.stringify(network));
}

export function getCurrentNetwork() {
	if (localStorage.getItem('currentNetwork') && Object.keys(localStorage.getItem('currentNetwork')).length) {
		return JSON.parse(localStorage.getItem('currentNetwork'));
	}
	return null;
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
