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
                setSubmitState(SubmitState.INIT); 
                resp.json().then(payload => {
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
    let gradientClass = 'gradient-primary';
    if (isDragActive || submitState === SubmitState.SUBMITTING) {
        gradientClass = 'gradient-thinking';
    }
    const style = `dropzone-container upload-prompt ${gradientClass}`;
    let intent: Intent = Intent.PRIMARY;
    if (submitState === SubmitState.FAILED) {
        intent = Intent.DANGER;
    }
    intent = isDragActive ? Intent.SUCCESS : intent;
    return (
        <div>
            <Callout id='uploadCallout' intent={intent} icon='cloud-upload' title={cardTitle} />
            <Divider />
            <div {...getRootProps()} className={style}>
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