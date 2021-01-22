import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../modules/home';
import UnlockWallet from '../modules/wallet/unlock';
import GoogleRedirect from '../modules/misc/google';

import { AppContextProvider } from '../contexts/AppContext';

function App() {
	return (
		<>
			<AppContextProvider>
				<BrowserRouter>
					<Switch>
						<Route path="/unlock" component={UnlockWallet} />
						<Route path="/google" component={GoogleRedirect} />
						<Route path="/" component={Home} />
					</Switch>
				</BrowserRouter>
			</AppContextProvider>
		</>
	);
}

export default App;
