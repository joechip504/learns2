import React, { useState } from 'react';
import { RootState } from '../../app/store';
import { connect } from 'react-redux';
import { Button, Divider, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase';

interface Props {};

const mapState = (root: RootState): Props => { return {}; }

const AddPlayer = (props: Props) => {
    const playersRef = firebase.firestore().collection('players')
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [user] = useAuthState(firebase.auth());
    let disabled = true
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await playersRef.add({
            'name': name,
            'url': url
        })
            .then((doc) => console.log(doc))
            .catch(err => console.error(err))
    }
    let intent = Intent.PRIMARY
    let text = "Please log in"
    if (user) {
        disabled = false
        text = "Submit"
    }
    return (
        <div className="bp3-form-group my-form" >
            <h2 className="bp3-heading bp3-dark">Add a new Player</h2>
            <Divider className="bp3-dark" />
            <FormGroup label="Player Name" labelFor="name-input" className="bp3-dark">
                <InputGroup className="bp3-dark" id="name-input" placeholder="INnoVation" onChange={(e: any) => setName(e.target.value)} />
            </FormGroup>
            <FormGroup label="Player Liquipedia URL" labelFor="url-input" className="bp3-dark">
                <InputGroup className="bp3-dark" id="url-input" placeholder="https://liquipedia.net/starcraft2/INnoVation" onChange={(e: any) => setUrl(e.target.value)} />
            </FormGroup>
            <Button onClick={onSubmit} intent={intent} disabled={disabled} text={text} />
        </div>
    );
}

export default connect(mapState)(AddPlayer);
