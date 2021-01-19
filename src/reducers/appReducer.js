import APP_ACTIONS from '../actions/appActions';

export default (state, action) => {
	const { privateKey, address } = action.data;
	console.log({ privateKey });
	console.log({ address });
	switch (action.type) {
		case APP_ACTIONS.SET_WALLET_KEYS:
			return {
				...state,
				privateKey: privateKey,
				address: address
			};

		default:
			return state;
	}
};
