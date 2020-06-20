import React from 'react';
import { Replay, AnalysisResponse } from '../../store/replay/types';
import { Card } from '@blueprintjs/core';
import { RootState } from '../../app/store';
import { connect } from 'react-redux';

const inner = (analysis: AnalysisResponse) => {
    return <div>
        <p>{JSON.stringify(analysis.players)}</p>
        <p>{JSON.stringify(analysis.meta)}</p>
    </div>
}

interface Props {
    replay? : Replay;
}

const Meta = (props: Props) => {
    const replay = props.replay;
    if (replay === undefined) {
        return null;
    }
    const title = replay.name;
    let analysis = null;
    if (replay.analysis !== undefined) {
        analysis = inner(replay.analysis)
    }
    return (
        <Card className='bp3-dark'>
            <h5>{title}</h5>
            {analysis}
        </Card>
    )
}

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

export default connect(mapState)(Meta);