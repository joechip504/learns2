import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '@blueprintjs/core';
import Dropzone from 'react-dropzone';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase'

interface Props { };

const mapState = (): Props => { return {}; }

const AddTournamentReplay = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    const [user] = useAuthState(firebase.auth())
    console.log(user);
    const [loading, setLoading] = React.useState(false);
    const spinner = loading && <Spinner />
    const onDrop = (accepted: File[]) => {
        user!.getIdToken().then(token => {
            console.log(token)
            accepted.forEach(file => {
                let req = new FormData()
                setLoading(true)
                req.append('replay', file)
                let params: RequestInit = {
                    method: 'POST',
                    body: req,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                fetch(`/replay_info`, params)
                    .then(resp => handleResponse(resp))
                    .catch(err => {
                        console.error(err);
                    })
                    .finally(() => setLoading(false))
            })

        })

    }
    const handleResponse = (resp: Response) => {
        resp.json().then(json => console.log(json))
    }
    return (
        <div className="bp3-form-group my-form" >
            <h2 className="bp3-heading bp3-dark">Upload a tournament Replay</h2>
            {spinner}
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div className='dropzone-container' {...getRootProps()}>
                            <input {...getInputProps()} />
                        </div>
                    </section>
                )}
            </Dropzone>
        </div>
    );
}

export default connect(mapState)(AddTournamentReplay);
