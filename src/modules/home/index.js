import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Transfer from '../transfer';
import Main from './main';

import { History } from '../../utils/history';

function App() {
	return (
		<>
			<Header />
			<Router history={History}>
				<Switch>
					<div id="appCapsule">
						<Route exact path="/" component={Main} />
						<Route path="/transfer" component={Transfer} />
					</div>
				</Switch>
				<Footer />
			</Router>
		</>
	);
}

export default App;
