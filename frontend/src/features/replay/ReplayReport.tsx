import React from 'react';
import { Replay, AnalysisResponse } from '../../store/replay/types';
import { Card } from '@blueprintjs/core';
import { RootState } from '../../app/store';
import { connect } from 'react-redux';
import { PlayerCards } from './PlayerCard';

const inner = (analysis: AnalysisResponse) => {
    //const teamSize = analysis.players.length / 2;

    return <div>
        <div id="gameinfo" className="game-info-bar">
            <h3 id="game-title">{analysis.meta.map_title} at {analysis.meta.time_utc}</h3>
            <div id="game-stats"><span>Add game stats here</span>
            </div>
<section id="team-1" className="team-section"></section>
            <section id="team-2" className="team-section"></section> 
        </div>

        <p>{JSON.stringify(analysis.players)}</p>
        <p>{JSON.stringify(analysis.meta)}</p>
    </div>
}

interface Props {
    replay? : Replay;
}

const ReplayReport = (props: Props) => {
    const replay = props.replay;
    if (replay === undefined) {
        return null;
    }
    const title = replay.name;
    let analysis = null;
    if (replay.analysis !== undefined) {
        analysis = inner(replay.analysis)
    }
    return ( <div>
        <Card className='bp3-dark'>
            <h5>{title}</h5>
            {analysis}
        </Card>
        {PlayerCards(replay)}
        </div>
    )
}

//entrypoint for handling global stsate change
const mapState = (root: RootState): Props => {
    let replay = undefined;
    const selected = root.replay.selected;
    if (selected !== undefined) {
        root.replay.replays.forEach(r => {
            if (r.id === selected) {
                replay = r;
            }
        });
    }
    return {replay: replay}
}

export default connect(mapState)(ReplayReport);