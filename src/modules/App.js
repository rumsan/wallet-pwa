import React from 'react';
import Home from '../modules/home';

import { AppContextProvider } from '../contexts/AppContext';

function App() {
	return (
		<>
			<AppContextProvider>
				<Home />
			</AppContextProvider>
		</>
	);
}

export default App;
