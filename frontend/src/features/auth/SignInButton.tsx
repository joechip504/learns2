import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Spinner } from '@blueprintjs/core';

const uiConfig: firebaseui.auth.Config = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            clientId: '992813064878-56jfssija58lfu1hc49fvdeejqrkphnh.apps.googleusercontent.com'
        }
    ],
    callbacks: {
        signInSuccessWithAuthResult: (res) => {
            // https://github.com/firebase/firebaseui-web#credential-helper
            return true
        }
    }
};

const SignInButton = () => {
    const [user, loading, error] = useAuthState(firebase.auth());
    if (loading) {
        return <Spinner size={Spinner.SIZE_SMALL} />
    }
    else if (!user || error) {
        return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
    }
    else return null;
}

export default SignInButton;
