export function getEncryptedWallet() {
	if (localStorage.getItem('wallet') && Object.keys(localStorage.getItem('wallet')).length) {
		return JSON.parse(localStorage.getItem('wallet'));
	}
	return null;
}

export function saveEncyptedWallet(userData) {
	localStorage.setItem('wallet', JSON.stringify(userData));
}

export function getPasscode() {
	return localStorage.getItem('appChabi');
}

export function savePasscode(passcode) {
	localStorage.setItem('appChabi', passcode);
}

export function logout() {
	localStorage.clear();
	window.location = '/';
}
