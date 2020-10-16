import React from 'react';
import AddPlayer from './AddPlayer';
import { TournamentReplayDropbox } from './TournamentReplayDropbox';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as firebase from 'firebase/app';
import UnlabeledReplays from './UnlabeledReplays';

const AdminView = () => {
    const [user] = useAuthState(firebase.auth());
    if (!user) {
        return <h1 className="bp3-dark">Please log in.</h1>
    }
    else {
        return (
            <div>
                <div style={{ marginTop: '10px' }}> <AddPlayer /> </div>
                <div><TournamentReplayDropbox /> </div>
                <div><UnlabeledReplays/></div>
            </div>
        );
    }
}

export default AdminView;
