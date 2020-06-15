import React from 'react';
import { addReplay, setReplayStatus } from '../../store/replay/actions';
import { Replay, ReplayStatus } from '../../store/replay/types';
import { store } from '../../app/store';

import Dropzone, { FileRejection, DropEvent } from 'react-dropzone';

var replayId = 0;

const onDrop = (accepted: File[], rejected: FileRejection[], event: DropEvent) => {
    accepted.forEach(file => {
        const replay: Replay = { name: file.name, id: replayId++, status: ReplayStatus.Init }
        store.dispatch(addReplay(replay))
        const reader = new FileReader();
        reader.onload = () => {
            const payload = reader.result;
            store.dispatch(setReplayStatus(replay.id, ReplayStatus.Loading))
            setTimeout(() => {
                store.dispatch(setReplayStatus(replay.id, ReplayStatus.Success));
            }, 2000);
            console.log(payload);
            // TODO send off analysis req
        }
        reader.readAsArrayBuffer(file);
    });
}

export const ReplayUpload = () => {
    return (
        <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
                <section>
                    <div className='dropzone-container' {...getRootProps()}>
                        <input {...getInputProps()} />
                    </div>
                </section>
            )}
        </Dropzone>
    )
}