import React from 'react';
import { Card } from '@blueprintjs/core';
import { Player, Replay } from '../../store/replay/types';

export const PlayerCard = (p: Player) => {
    return (
        <Card className='bp3-dark bp3-elevation-3' style={{width: '100%', margin: 'auto', paddingTop: '20px'}}>
            <h3 className='bp3-heading'>{p.name}</h3>
            <hr/>
            <div className='bp3-ui-text'>
                <div id="primary-guess" className="primary-guess">Best Guess: <strong>Jobama</strong> 99%</div>
                <div id="runner-up-guess" className="runner-up-guess">Runner Up: TFresh 98%</div>
            </div>
        </Card>
    )
}


export const PlayerCards = (replay: Replay): JSX.Element[] | null => {
    if (replay.analysis === undefined) { return null; }
    else {
        return replay.analysis.players.map(p => PlayerCard(p));
    }
}