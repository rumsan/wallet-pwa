import React, { createContext, useReducer } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';

const initialState = {
	privateKey: null,
	address: null,
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

	return (
		<AppContext.Provider
			value={{
				privateKey: state.privateKey,
				address: state.address,
				lockScreen: state.lockScreen,
				scannedEthAddress: state.scannedEthAddress,
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
