import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';


import * as firebase from 'firebase/app';
import 'firebase/analytics'
import 'firebase/performance'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/performance'
import './App.css';
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css';
import App from './App';

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
firebase.analytics();
firebase.performance();

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
