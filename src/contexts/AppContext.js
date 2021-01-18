import React, { createContext, useReducer } from 'react';
import appReduce from '../reducers/appReducer';

const initialState = {
	privateKey: null
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);

	return (
		<AppContext.Provider
			value={{
				privateKey: state.privateKey,
				dispatch
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
