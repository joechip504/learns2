import React from 'react';

import { FileInput, Card, Button, ButtonGroup } from '@blueprintjs/core';

export const ReplayUpload = () => {
    return (
        <Card className='replay-upload bp3-dark'>
            <h2>Select .SC2Replay file</h2>
            <ButtonGroup minimal={true} large={true} fill={true}>
                <Button large={true} icon='upload'></Button>
                <FileInput fill={true} />
            </ButtonGroup>
        </Card>)
}