import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { history } from './app/store';

import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import Header from './features/header/Header';
import AdminView from './features/admin/AdminView';

import firebase from 'firebase';
import 'firebase/analytics'
import 'firebase/performance'
import 'firebase/auth'
import 'firebase/firestore'

export const firebaseConfig = {
  apiKey: "AIzaSyDT5NEcgiF-e83SwJtIt5BqWldzlwoklTM",
  authDomain: "learns2.firebaseapp.com",
  databaseURL: "https://learns2.firebaseio.com",
  projectId: "learns2",
  storageBucket: "learns2.appspot.com",
  messagingSenderId: "992813064878",
  appId: "1:992813064878:web:124423e7f43846dd15833f",
  measurementId: "G-8P130415P8"
}

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

firebase.analytics();
firebase.performance();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Header />
        <Switch>
          <Route path="/admin">
            <AdminView />
         </Route>
          <Route path="*">
            <App />
          </Route>
        </Switch>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
