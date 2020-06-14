import React from 'react';
import { Card } from '@blueprintjs/core';

interface PlayerGuess {
    pid: number;
    displayName: string;
    confidence: number;
}

export interface Player {
    displayName: string;
    gameId: number;
}

export const PlayerCard = (p: Player) => {
    return (
        <Card className='bp3-dark' style={{width: '100%', margin: 'auto', paddingTop: '20px'}}>
            <h3 className='bp3-heading'>{p.displayName}</h3>
            <hr/>
            <div className='bp3-ui-text'>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit </p>
            </div>
        </Card>
    )
}