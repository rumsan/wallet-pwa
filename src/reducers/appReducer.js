import APP_ACTIONS from '../actions/appActions';

export default (state, action) => {
	switch (action.type) {
		case APP_ACTIONS.SET_APP_WALLET:
			const { privateKey, address, wallet, phrases, encryptedWallet } = action.data;
			return {
				...state,
				privateKey,
				address,
				wallet,
				phrases,
				encryptedWallet
			};

		case APP_ACTIONS.SET_ETH_BALANCE:
			return {
				...state,
				ethBalance: action.data
			};

		case APP_ACTIONS.SET_APP_PASSCODE:
			return {
				...state,
				passcode: action.data
			};

		case APP_ACTIONS.SET_SCCANNED_DATA:
			return {
				...state,
				scannedEthAddress: action.data.address,
				scannedAmount: action.data.amount ? action.data.amount : null
			};

		case APP_ACTIONS.SET_SENDING_TOKEN_NAME:
			return {
				...state,
				sendingTokenName: action.data
			};

		case APP_ACTIONS.LOCK_APP:
			return {
				...state,
				lockScreen: action.data
			};

		case APP_ACTIONS.UNLOCK_APP:
			return {
				...state,
				lockScreen: action.data
			};

		default:
			return state;
	}
};
