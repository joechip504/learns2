import React from 'react';
import { Card } from '@blueprintjs/core';
import { Player, Replay } from '../../store/replay/types';
import { RootState } from '../../app/store';

export const PlayerCard = (p: Player) => {
    return (
        <Card className='bp3-dark bp3-elevation-3' style={{width: '100%', margin: 'auto', paddingTop: '20px'}}>
            <h3 className='bp3-heading'>{p.name}</h3>
            <hr/>
            <div className='bp3-ui-text'>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit </p>
            </div>
            <span>ojgortjinrloperjti</span>
        </Card>
    )
}


export const PlayerCards = (replay: Replay) => {
    if (replay.analysis === undefined) { return null; }
    else {
        return replay.analysis.players.map(p => PlayerCard(p));
    }
}