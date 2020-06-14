import React from 'react';
import { Menu, MenuItem, Spinner, MenuDivider } from '@blueprintjs/core';
import { ReplayUpload } from '../upload/ReplayUpload';
export const SideBar = () => {
    return (
        <Menu large={false} className='left-menu'>
            <h4 className='bp3-heading'>Replays</h4>
            <MenuDivider/>
            <MenuItem active={true} intent='primary' text='replay-1' labelElement={<Spinner size={Spinner.SIZE_SMALL} />} />
            <MenuItem text='replay-2' />
            <MenuItem text='replay-3' />
            <MenuDivider/>
            <h4 className='bp3-heading'>Drop .SC2Replay file(s)</h4>
            <ReplayUpload/>
        </Menu>
    )
}