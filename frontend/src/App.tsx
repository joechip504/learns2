import React from 'react';
import './App.css';
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AdminView from './features/admin/AdminView';
import ReplayLabeler from './features/admin/ReplayLabeler';
import Header from './features/header/Header';
import HomePage from './features/home/HomePage';

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/admin">
            <AdminView />
          </Route>
          <Route path="/edit/:collection/:replayId">
            <ReplayLabeler />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  )
}

export default App;
