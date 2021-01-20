import APP_ACTIONS from '../actions/appActions';

export default (state, action) => {
	const { privateKey, address } = action.data;
	switch (action.type) {
		case APP_ACTIONS.SET_WALLET_KEYS:
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

		default:
			return state;
	}
};
