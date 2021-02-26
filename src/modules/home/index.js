import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BackupWallet from '../wallet/backup/index';
import Footer from '../layouts/Footer';
import Header from '../layouts/Header';
import ImportToken from '../tokens/importToken';
import Main from './main';
import NetworkSettings from '../settings/network';
import Settings from '../settings';
import Transfer from '../transfer';
import Tokens from '../tokens';
import TokenDetails from '../tokens/details';
import Vault from '../vault';

function App() {
	return (
		<>
			<Header />
			<Switch>
				<Route exact path="/" component={Main} />
				<Route exact path="/backup" component={BackupWallet} />
				<Route exact path="/networks" component={NetworkSettings} />
				<Route exact path="/import-token" component={ImportToken} />
				<Route exact path="/settings" component={Settings} />
				<Route exact path="/tokens" component={Tokens} />
				<Route exact path="/token/:symbol" component={TokenDetails} />
				<Route exact path="/transfer" component={Transfer} />
				<Route exact path="/vault" component={Vault} />
			</Switch>
			<Footer />
		</>
	);
}

export default App;
