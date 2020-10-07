import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/app';
import { Intent, ProgressBar } from '@blueprintjs/core';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

//https://firebase.google.com/docs/storage/web/start#use_multiple_storage_buckets
export const TournamentReplayDropbox = () => {
    const [progress, setProgress] = React.useState(0);
    const [intent, setIntent] = React.useState<Intent>(Intent.PRIMARY);
    const [animate, setAnimate] = React.useState(false);
    const [fileName, setFileName] = React.useState('');
    const ref = firebase.app().storage('gs://tournament-dropbox.learns2.joepringle.dev').ref()
    const onDrop = (accepted: File[]) => {
        if (accepted.length !== 1) {
            alert('Please drop exactly one file (.zip or .SC2Replay)');
        }
        else {
            const file = accepted[0];
            const filename = uuidv4() + '_' + file.name;
            setFileName(filename);
            const task = ref.child(filename).put(file);
            task.on("state_changed",
                snap => {
                    setIntent(Intent.PRIMARY);
                    setProgress(snap.bytesTransferred / snap.totalBytes);
                    setAnimate(true);
                },
                err => {
                    setProgress(1);
                    setAnimate(false);
                    setIntent(Intent.DANGER);
                    setFileName(err.message);
                },
                // On success
                () => {
                    setAnimate(false);
                    setIntent(Intent.SUCCESS);
                    setFileName(`Wrote to gs://${task.snapshot.metadata.bucket}/${task.snapshot.metadata.fullPath}`)
                });
        }
    };
    return (
        <div className='grid-container'>
            <h3 className="bp3-dark bp3-heading">Drop exactly one .SC2Replay or .zip file</h3>
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div className='dropzone-container' {...getRootProps()}>
                            <input {...getInputProps()} />
                        </div>
                    </section>
                )}
            </Dropzone>
            <div style={{ marginTop: '20px' }}>
                <h4 className="bp3-dark">{fileName}</h4>
                <ProgressBar intent={intent} value={progress} animate={animate} />
            </div>
        </div>
    );
}