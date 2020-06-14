import React from 'react';
import { Menu, MenuItem, Spinner, MenuDivider } from '@blueprintjs/core';

export const SideBar = () => {
    return (
        <Menu large={false}>
            <h4 className='bp3-heading'>Uploaded:</h4>
            <MenuDivider/>
            <MenuItem active={true} intent='primary' text='replay-1' labelElement={<Spinner size={Spinner.SIZE_SMALL} />} />
            <MenuItem text='replay-2' />
            <MenuItem text='replay-3' />
        </Menu>
    )
}