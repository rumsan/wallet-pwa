import React, { createContext, useReducer } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';

const initialState = {
	privateKey: null,
	address: null
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);

	function saveAppKeys(keys) {
		dispatch({ type: APP_ACTIONS.SET_WALLET_KEYS, data: keys });
	}

	return (
		<AppContext.Provider
			value={{
				privateKey: state.privateKey,
				address: state.address,
				saveAppKeys,
				dispatch
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
