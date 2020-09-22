import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { history } from './app/store';

import firebase from 'firebase';
import { setUser } from './store/auth/actions';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import Header from './features/header/Header';

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

export const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
firebase.analytics();
firebase.performance();

auth.onAuthStateChanged((user) => {
  if (user !== null) {
    store.dispatch(setUser(user));
  }
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Header />
        <Switch>
          <Route path="/upload">
            <h1>TODO</h1>
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
