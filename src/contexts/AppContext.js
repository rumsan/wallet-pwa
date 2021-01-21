import React, { createContext, useReducer } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import { getNetworkByName } from '../constants/networks';
import { saveCurrentNetwork } from '../utils/sessionManager';

const initialState = {
	privateKey: null,
	address: null, // Public Key
	lockScreen: false,
	scannedEthAddress: ''
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);

	function saveAppKeys(keys) {
		dispatch({ type: APP_ACTIONS.SET_WALLET_KEYS, data: keys });
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

	return (
		<AppContext.Provider
			value={{
				privateKey: state.privateKey,
				address: state.address,
				lockScreen: state.lockScreen,
				scannedEthAddress: state.scannedEthAddress,
				changeCurrentNetwork,
				saveScannedAddress,
				unlockAppScreen,
				lockAppScreen,
				saveAppKeys,
				dispatch
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
