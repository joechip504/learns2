import React from 'react';
import { addReplay, setReplayStatus, setAnalysis } from '../../store/replay/actions';
import { Replay, ReplayStatus, AnalysisResponse } from '../../store/replay/types';
import { store } from '../../app/store';

import Dropzone, { FileRejection, DropEvent } from 'react-dropzone';

var replayId = 0;

const endpoint = process.env.REACT_APP_ANALYSIS_ENDPOINT!;

const handleResponse = (resp: Response, id: number) => {
    if(resp.type === 'cors' && resp.ok) {
        return resp.json().then(json => {
            store.dispatch(setAnalysis(id, json[0] as AnalysisResponse));
        })
    }
    else {
        throw Error();
    }
}

const onDrop = (accepted: File[], rejected: FileRejection[], event: DropEvent) => {
    accepted.forEach(file => {
        const replay: Replay = { name: file.name, id: replayId++, status: ReplayStatus.Init }
        store.dispatch(addReplay(replay))
        let req = new FormData()
        req.append('replay', file)
        let params: RequestInit =  {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            body: req
        }
        store.dispatch(setReplayStatus(replay.id, ReplayStatus.Loading))
        fetch(endpoint, params)
            .then(resp => handleResponse(resp, replay.id))
            .catch(err => {
                store.dispatch(setReplayStatus(replay.id, ReplayStatus.Failure));
                console.error(err);
            })
    })
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