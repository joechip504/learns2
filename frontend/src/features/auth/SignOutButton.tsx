import React from 'react';
import { Button } from '@blueprintjs/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase';

const onClick = () => {
    firebase.auth().signOut().then(() => window.location.reload())
}

const SignOutButton = () => {
    const [user] = useAuthState(firebase.auth());
    if (user) {
        return <Button onClick={onClick} text='Sign Out' />
    }
    else {
        return null;
    }
}

export default SignOutButton;

