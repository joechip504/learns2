import React, { useCallback, useState } from 'react'
import { Callout, Card, Divider, Icon, Intent} from "@blueprintjs/core";
import { useDropzone } from 'react-dropzone'

enum SubmitState {
    INIT,
    SUBMITTING
};

function MyDropzone() {
    const [file, setFile] = useState<File>();
    const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.INIT);
    var prompt = 'Drag/drop a replay';
    var cardTitle = file ? file.name : prompt;
    switch(submitState) {
        case SubmitState.SUBMITTING:
            prompt = 'Validating...'
            break;
        default:
            break;
    }
    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
        setSubmitState(SubmitState.SUBMITTING);
        console.log(acceptedFiles[0]);
        // Do something with the files
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const intent = isDragActive ? Intent.SUCCESS : Intent.PRIMARY;
    return (
        <div>
            <Callout id='uploadCallout' intent={intent} icon='cloud-upload' title={cardTitle}/>
            <Divider />
            <div {...getRootProps()} className='dropzone-container upload-prompt'>
                <input {...getInputProps()} />
                    <Icon className='upload-prompt-item' icon='cloud-upload' iconSize={64}/>
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