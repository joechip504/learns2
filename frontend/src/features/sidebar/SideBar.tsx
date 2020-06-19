import React from 'react';
import { connect } from 'react-redux';
import { Menu, MenuItem, Spinner, Icon, MenuDivider, Intent } from '@blueprintjs/core';
import { ReplayUpload } from '../upload/ReplayUpload';
import { RootState } from '../../app/store';
import { Replay, ReplayStatus } from '../../store/replay/types';
import { store } from '../../app/store';
import { selectReplay } from '../../store/replay/actions';

interface Props {
    replays: Replay[];
    selected?: number;
}

const mapState = (root: RootState): Props => {
    return {
        replays: root.replay.replays,
        selected: root.replay.selected
    }
}

const SideBar = (props: Props) => {
    const items = props.replays.map((replay, idx) => {
        const onClick = () => { store.dispatch(selectReplay(replay.id)) }
        const isActive = props.selected === replay.id;
        let labelElement = null;
        let intent: Intent | undefined = undefined;
        if (replay.status === ReplayStatus.Loading) {
            labelElement = <Spinner size={Spinner.SIZE_SMALL} />;
        }
        if (replay.status === ReplayStatus.Failure) {
            labelElement = <Icon icon='error' />
            intent = Intent.DANGER;
        }
        else if (replay.status === ReplayStatus.Success) {
            labelElement = <Icon icon='tick-circle' />
            if (props.selected === undefined) {
                store.dispatch(selectReplay(replay.id));
            }
        }
        return <MenuItem key={idx} text={replay.name} active={isActive} onClick={onClick} labelElement={labelElement} intent={intent} />
    })
    let divider = null;
    if (items.length > 0) {
        divider = <MenuDivider />
    }
    return (
        <Menu large={false} className='left-menu'>
            {items}
            {divider}
            <h4 className='bp3-heading'>Drop Replays</h4>
            <ReplayUpload />
        </Menu>
    )
}
export default connect(mapState)(SideBar)