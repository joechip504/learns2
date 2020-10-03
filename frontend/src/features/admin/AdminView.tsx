import React from 'react';
import { RootState } from '../../app/store';
import { connect } from 'react-redux';
import AddPlayer from './AddPlayer';
import { PlayerSelect } from './PlayerSelect';
import { Divider } from '@blueprintjs/core';
import AddTournamentReplay from './AddTournamentReplay';
//import { useAuthState } from 'react-firebase-hooks/auth';


interface Props {
};

const mapState = (state: RootState): Props => {
    return {
    };
}


const AdminView = (props: Props) => {
    return (
        <div>
            <PlayerSelect />
            <AddPlayer />
            <Divider/>
            <AddTournamentReplay/>
        </div>
    );
}

export default connect(mapState)(AdminView);
