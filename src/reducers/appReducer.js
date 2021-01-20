import APP_ACTIONS from '../actions/appActions';

export default (state, action) => {
	switch (action.type) {
		case APP_ACTIONS.SET_WALLET_KEYS:
			const { privateKey, address } = action.data;
			return {
				...state,
				privateKey: privateKey,
				address: address
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
