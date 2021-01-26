import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../modules/home';
import UnlockWallet from '../modules/wallet/unlock';
import GoogleBackup from '../modules/misc/googleBackup';
import GoogleRestore from '../modules/misc/googleRestore';
import CreateWallet from '../modules/wallet/create';

import { AppContextProvider } from '../contexts/AppContext';

function App() {
	return (
		<>
			<AppContextProvider>
				<BrowserRouter>
					<Switch>
						<Route exact path="/create" component={CreateWallet} />
						<Route exact path="/unlock" component={UnlockWallet} />
						<Route exact path="/google/backup" component={GoogleBackup} />
						<Route exact path="/google/restore" component={GoogleRestore} />
						<Route path="/" component={Home} />
					</Switch>
				</BrowserRouter>
			</AppContextProvider>
		</>
	);
}

export default App;
