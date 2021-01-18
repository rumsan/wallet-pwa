import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './home/index';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Transfer from '../modules/transfer/';

function App() {
  return (
    <>
      <Header />
      <Router>
        <Switch>
          <div id="appCapsule">
            <Route exact path="/" component={Home} />
            <Route path="/transfer" component={Transfer} />
          </div>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
