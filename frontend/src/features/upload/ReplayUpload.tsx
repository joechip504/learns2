import React from 'react';

import Dropzone, { FileRejection, DropEvent } from 'react-dropzone';

const onDrop  = (accepted: File[], rejected: FileRejection[], event: DropEvent) => {
    console.log(accepted)
    console.log(rejected)
    console.log(event)
}

export const ReplayUpload = () => {
    return (
        <div className='replay-upload'>
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div className='s2-replay-dropzone' {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drop.SC2Replay files here</p>
                        </div>
                    </section>
                )}
            </Dropzone>
        </div>)
}