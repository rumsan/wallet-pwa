import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BackupWallet from '../wallet/backup/index';
import Footer from '../layouts/Footer';
import Header from '../layouts/Header';
import Main from './main';
import NetworkSettings from '../settings/network';
import Settings from '../settings';
import Transfer from '../transfer';
import Tokens from '../tokens';

function App() {
	return (
		<>
			<Header />
			<Switch>
				<Route exact path="/" component={Main} />
				<Route exact path="/tokens" component={Tokens} />
				<Route exact path="/backup" component={BackupWallet} />
				<Route exact path="/networks" component={NetworkSettings} />
				<Route exact path="/settings" component={Settings} />
				<Route exact path="/transfer" component={Transfer} />
			</Switch>
			<Footer />
		</>
	);
}

export default App;
