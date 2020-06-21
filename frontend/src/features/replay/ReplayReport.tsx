import React from 'react';
import { Replay, AnalysisResponse } from '../../store/replay/types';
import { Card, Callout, Intent } from '@blueprintjs/core';
import { RootState } from '../../app/store';
import { connect } from 'react-redux';
import { PlayerCards } from './PlayerCard';
import { INTENT_PRIMARY } from '@blueprintjs/core/lib/esm/common/classes';

const inner = (analysis: AnalysisResponse) => {
    //const teamSize = analysis.players.length / 2;

    //add game stats in the game-stats id
    return <div>
        <Callout id="gameinfo" className="game-info-bar" intent={Intent.PRIMARY} icon={null}>
            <h3 id="game-title">{analysis.meta.map_title} at {new Date(analysis.meta.time_utc).toUTCString()}</h3>
            <div id="game-stats"><span></span>
            </div>
<section id="team-1" className="team-section"></section>
            <section id="team-2" className="team-section"></section> 
        </Callout>

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
    //Card = game stats for now, PlayerCards = Player Analysis
    return ( <div>
        {analysis}
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