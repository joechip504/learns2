import React from 'react';
import { Navbar, Button, Alignment, NavbarDivider, NavbarHeading, Icon } from '@blueprintjs/core';
import { RootState } from '../../app/store';
import { AuthState } from '../../store/auth/types';
import { connect } from 'react-redux';
import SignInButton from '../auth/SignInButton';
import SignOutButton from '../auth/SignOutButton';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as firebase from 'firebase/app';
import { Link } from 'react-router-dom';

const onClick = () => { window.open('https://github.com/joechip504/learns2', '_blank') }

interface Props {
    auth: AuthState;
}
const mapState = (root: RootState): Props => {
    return { auth: root.auth }
}

const Header = (props: Props) => {
    // firebase-ui does something weird where it automatically removes the button after login
    // it throw errors if this check is bundled with the button component
    // either have to spend some time debugging that or just add a one-line check here ;)
    const [user] = useAuthState(firebase.auth());

    const userHeading = user && (
        <Navbar.Group>
            <Icon icon='user' iconSize={20} style={{ marginRight: '7px' }} />
            <NavbarHeading className='bp3-minimal' >{user.email}</NavbarHeading>
        </Navbar.Group>
    )
    return (
        <Navbar id='learns2header' className='bp3-dark'>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    <h1 className='bp3-heading'>learns2</h1>
                </Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button className='bp3-minimal' icon='info-sign' text='About' />
                <Button className='bp3-minimal' icon='git-repo' text='Source' onClick={onClick} />
                <Link to='/admin'><Button className='bp3-minimal' icon='cloud-upload' text='Manage'/></Link>
                <NavbarDivider />
                {userHeading}
                <SignInButton />
                <SignOutButton />
            </Navbar.Group>
        </Navbar>
    )
}

export default connect(mapState)(Header);