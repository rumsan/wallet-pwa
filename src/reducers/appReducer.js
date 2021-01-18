import APP_ACTIONS from '../actions/appActions';

export default (state, action) => {
	switch (action.type) {
		case APP_ACTIONS.GET_PRIVATE_KEY:
			return {
				...state
			};

		default:
			return state;
	}
};
