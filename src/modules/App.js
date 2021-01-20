import React from 'react';
import Home from '../modules/home';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { History } from '../utils/history';

import { AppContextProvider } from '../contexts/AppContext';

function App() {
	return (
		<>
			<AppContextProvider>
				<BrowserRouter history={History}>
					<Switch>
						<Route component={Home} />
					</Switch>
				</BrowserRouter>
			</AppContextProvider>
		</>
	);
}

export default App;
