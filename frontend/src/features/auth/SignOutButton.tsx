import React from 'react';
import { RootState } from '../../app/store';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import firebase from 'firebase';

interface Props {
    isAuthenticated: boolean;
}

const mapState = (root: RootState) => {
    return { isAuthenticated: root.auth.isAuthenticated }
}

const onClick = () => {
    firebase.auth().signOut().then(() => window.location.reload())
}

const SignOutButton = ({ isAuthenticated }: Props) => {
    if (isAuthenticated) {
        return <Button onClick={onClick} text='Sign Out' />
    }
    else {
        return null;
    }
}

export default connect(mapState)(SignOutButton)

