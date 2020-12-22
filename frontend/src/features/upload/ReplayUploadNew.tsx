import React, { useCallback, useState } from 'react'
import { Callout, Card, Divider, Icon, Intent } from "@blueprintjs/core";
import { useDropzone } from 'react-dropzone'
import { useHistory } from 'react-router-dom';

enum SubmitState {
    INIT,
    SUBMITTING,
    FAILED
};

interface AnalysisResponse {
    ok: boolean;
    path: string;
}

function MyDropzone() {
    const [file, setFile] = useState<File>();
    const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.INIT);
    const history = useHistory();
    var prompt = 'Drag/drop a replay';
    var cardTitle = file ? file.name : prompt;
    switch (submitState) {
        case SubmitState.SUBMITTING:
            prompt = 'Validating...'
            break;
        default:
            break;
    }

    const onDrop = useCallback(acceptedFiles => {
        const onResponse = (resp: Response) => {
            if (resp.status === 202) {
                setSubmitState(SubmitState.INIT); // TODO redirect
                resp.json().then(payload => {
                    console.log(payload);
                    const analysisResponse = payload as AnalysisResponse;
                    const parts = analysisResponse.path.split('/');
                    const docid = parts[parts.length - 1];
                    history.push(`/analysis/${docid}`);
                })
            }
            else {
                console.log(resp)
                setSubmitState(SubmitState.FAILED); // TODO redirect
            }
        }
        setFile(acceptedFiles[0]);
        setSubmitState(SubmitState.SUBMITTING);
        let body = new FormData();
        body.append('replay', acceptedFiles[0]);
        let params: RequestInit = {
            method: 'POST',
            body: body
        }
        fetch('/api/analysis', params)
            .then(resp => onResponse(resp))
    }, [history])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const intent = isDragActive ? Intent.SUCCESS : Intent.PRIMARY;
    return (
        <div>
            <Callout id='uploadCallout' intent={intent} icon='cloud-upload' title={cardTitle} />
            <Divider />
            <div {...getRootProps()} className='dropzone-container upload-prompt'>
                <input {...getInputProps()} />
                <Icon className='upload-prompt-item' icon='cloud-upload' iconSize={64} />
                <h1 className='bp3-heading upload-prompt-item'>{prompt}</h1>
            </div>
        </div>
    )
}


const ReplayUploadNew = () => {
    return (
        <Card>
            <MyDropzone />
        </Card>
    )
};

export default ReplayUploadNew;