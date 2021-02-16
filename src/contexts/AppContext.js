import React, { createContext, useReducer } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import { getNetworkByName } from '../constants/networks';
import { saveCurrentNetwork, saveTokenAssets } from '../utils/sessionManager';

const initialState = {
	privateKey: null,
	address: null, // Public Key
	wallet: null,
	lockScreen: false,
	scannedEthAddress: '',
	phrases: [],
	encryptedWallet: '',
	tokenAssets: [],
	passcode: '' // To restore from mnemonic
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);

	function saveAppWallet(wallet) {
		dispatch({ type: APP_ACTIONS.SET_APP_WALLET, data: wallet });
	}

	function lockAppScreen() {
		dispatch({ type: APP_ACTIONS.LOCK_APP, data: true });
	}

	function unlockAppScreen() {
		dispatch({ type: APP_ACTIONS.UNLOCK_APP, data: false });
	}

	function saveScannedAddress(address) {
		dispatch({ type: APP_ACTIONS.SET_SCANNED_ADDRESS, data: address });
	}

	function changeCurrentNetwork(name, url) {
		let network = null;
		if (name === 'custom') {
			network = { name: 'custom', url, display: 'Custom Network' };
		} else {
			network = getNetworkByName(name);
		}
		saveCurrentNetwork(network);
	}

	function saveAppPasscode(passcode) {
		dispatch({ type: APP_ACTIONS.SET_APP_PASSCODE, data: passcode });
	}

	function saveTokens(tokens) {
		if (tokens.length) {
			saveTokenAssets(tokens);
			// dispatch({ type: APP_ACTIONS.SET_TOKEN_ASSETS, data: tokens });
		}
	}

	return (
		<AppContext.Provider
			value={{
				address: state.address,
				encryptedWallet: state.encryptedWallet,
				lockScreen: state.lockScreen,
				passcode: state.passcode,
				phrases: state.phrases,
				privateKey: state.privateKey,
				scannedEthAddress: state.scannedEthAddress,
				wallet: state.wallet,
				tokenAssets: state.tokenAssets,
				changeCurrentNetwork,
				saveScannedAddress,
				unlockAppScreen,
				lockAppScreen,
				saveAppWallet,
				saveAppPasscode,
				saveTokens,
				dispatch
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
