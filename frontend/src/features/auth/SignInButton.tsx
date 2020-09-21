import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

const uiConfig: firebaseui.auth.Config = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => true
    }
};

const SignInButton = () => {
    return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
}

export default SignInButton;
