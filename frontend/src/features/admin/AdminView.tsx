import React from 'react';
import { RootState } from '../../app/store';
import { connect } from 'react-redux';
import AddPlayer from './AddPlayer';

interface Player {
    name: string,
    url: string,
    aliases: string[]
}

interface Props {
};

const mapState = (state: RootState): Props => {
    return {
    };
}


const AdminView = (props: Props) => {
    return (
        <div>
            <AddPlayer />
        </div>
    );
}

export default connect(mapState)(AdminView);
