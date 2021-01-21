import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Transfer from '../transfer';
import Main from './main';
import Settings from '../settings';
import NetworkSettings from '../settings/network';

function App() {
	return (
		<>
			<Header />
			<Switch>
				<Route exact path="/" component={Main} />
				<Route exact path="/transfer" component={Transfer} />
				<Route exact path="/settings" component={Settings} />
				<Route exact path="/networks" component={NetworkSettings} />
			</Switch>
			<Footer />
		</>
	);
}

export default App;
