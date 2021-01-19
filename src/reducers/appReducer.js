import APP_ACTIONS from '../actions/appActions';

export default (state, action) => {
	console.log('Action==>', action);
	const { privateKey, publicKey } = action.data;
	switch (action.type) {
		case APP_ACTIONS.SET_WALLET_KEY:
			return {
				...state,
				privateKey: privateKey,
				publicKey: publicKey
			};

		default:
			return state;
	}
};
