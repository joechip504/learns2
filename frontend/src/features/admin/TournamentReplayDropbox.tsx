import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Intent, ProgressBar, Spinner } from '@blueprintjs/core';
import Dropzone from 'react-dropzone';
import { useAuthState } from 'react-firebase-hooks/auth';


export const TournamentReplayDropbox = () => {
    const [user] = useAuthState(firebase.auth())
    const [loading, setLoading] = React.useState(false);
    const [progressBars, setProgressBars] = React.useState<JSX.Element[]>([]);
    // TODO upload task for each, push in
    let idx = 0;
    const onDrop = (accepted: File[]) => {
        const ref = firebase.storage().ref('dropbox');
        accepted.forEach(file => {
            setProgressBars(prev => [...prev, <ProgressBar value={0} />])
            const task = ref.child(file.name).put(file);
            task.on("state_changed",
                snap => {
                    setProgressBars(prev => {
                    let next = [...prev]
                    next[idx] = <ProgressBar value={snap.bytesTransferred / snap.totalBytes} intent={Intent.PRIMARY} />
                    return next;
                    });
                },
                err => {
                    setProgressBars(prev => {
                    let next = [...prev]
                    next[idx] = <ProgressBar value={1} intent={Intent.DANGER} animate={false} />
                    return next;
                    });
                },
                // On success
                () => {
                    setProgressBars(prev => {
                    let next = [...prev]
                    next[idx] = <ProgressBar value={1} intent={Intent.SUCCESS} animate={false} />
                    return next;
                    })
                })
                console.log("idx=", idx)
            idx++;
        });
    };

    const zone = <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
            <section>
                <div className='dropzone-container' {...getRootProps()}>
                    <input {...getInputProps()} />
                </div>
            </section>
        )}
    </Dropzone>

    const foo = progressBars.map((elem, idx) => <div key={idx}>{elem}</div>)
    console.log(foo)
    return (
        <div>
            <div className="bp3-form-group my-form" >
                <h2 className="bp3-heading bp3-dark">Upload a tournament Replay</h2>
                {zone}
            </div>
            {foo}
        </div>
    )

};