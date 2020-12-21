import React, { useState } from 'react';
import { Button, Divider, FormGroup, InputGroup, Intent, Spinner } from '@blueprintjs/core';
import * as firebase from 'firebase/app';

const AddPlayer = () => {

    const playersRef = firebase.firestore().collection('players')
    const [loading, setLoading] = React.useState(false);
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [message, setMessage] = React.useState('');
    const disabled = name === '' || url === '';

    const getPlayer = (name: string, url: string) => playersRef
        .where("url", "==", url)
        .where("name", "==", name)
        .limit(1)
        .get();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let snap = await getPlayer(name, url)
        if (snap.size !== 0) {
            setLoading(false);
            setMessage(`document already exists with name=${name}, url=${url}`);
        }
        else {
            playersRef.add({ 'name': name, 'url': url })
                .then((doc) => setMessage(`Added new player ${name} with url ${url}`))
                .catch(err => setMessage(err))
                .finally(() => {
                    setLoading(false)
                    setName('')
                    setUrl('')
                });
        }
    }

    let intent = Intent.PRIMARY
    let spinner = loading && <Spinner size={Spinner.SIZE_SMALL} />

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
            <div>
                <Button onClick={onSubmit} intent={intent} disabled={disabled} text={"Submit"} />
                {spinner}
                <h4 className="bp3-dark">{message}</h4>
            </div>
        </div>
    );
}

export default AddPlayer;
