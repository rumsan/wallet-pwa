import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../modules/home';
import UnlockWallet from '../modules/wallet/unlock';
import GoogleRestore from '../modules/misc/googleRestore';
import CreateWallet from '../modules/wallet/create';
import ResetWallet from '../modules/misc/reset';
import RestoreFromMnemonic from '../modules/wallet/restoreMnemonic';

import PWA from '../modules/pwa';

import { AppContextProvider } from '../contexts/AppContext';

function App() {
	return (
		<>
			<AppContextProvider>
				<BrowserRouter>
					<Switch>
						{/* TOD Remove pwa route */}
						<Route exact path="/pwa" component={PWA} />
						<Route exact path="/create" component={CreateWallet} />
						<Route exact path="/unlock" component={UnlockWallet} />
						<Route exact path="/google/restore" component={GoogleRestore} />
						<Route exact path="/mnemonic/restore" component={RestoreFromMnemonic} />
						<Route exact path="/reset" component={ResetWallet} />
						<Route path="/" component={Home} />
						<Route path="*" component={Home} />
					</Switch>
				</BrowserRouter>
			</AppContextProvider>
		</>
	);
}

export default App;
