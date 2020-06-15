import React from 'react';
import { Navbar, Button, Alignment } from '@blueprintjs/core';

const onClick = () => { window.open('https://github.com/joechip504/learns2', '_blank')}

export const Header = () => {
    return (
        <Navbar className='bp3-dark'>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    <h1>learns2</h1>
                </Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button className='bp3-minimal' icon='info-sign' text='About' />
                <Button className='bp3-minimal' icon='git-repo' text='Source' onClick={onClick}/>
            </Navbar.Group>
        </Navbar>
    )
}