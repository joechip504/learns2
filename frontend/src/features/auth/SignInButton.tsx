import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Spinner } from '@blueprintjs/core';

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
    const [user, loading, error] = useAuthState(firebase.auth());
    if (!user || error) {
        return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
    }
    else if (loading) {
        return <Spinner size={Spinner.SIZE_SMALL} />
    }
    else return null;
}

export default SignInButton;
