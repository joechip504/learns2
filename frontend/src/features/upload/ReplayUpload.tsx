import React from 'react';

import Dropzone, { FileRejection, DropEvent } from 'react-dropzone';

const onDrop = (accepted: File[], rejected: FileRejection[], event: DropEvent) => {
    console.log(accepted)
    console.log(rejected)
    console.log(event)
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