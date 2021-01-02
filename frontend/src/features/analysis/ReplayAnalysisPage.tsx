import React from 'react'
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useRouteMatch } from 'react-router-dom';
import { constants } from '../../app/constants';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Replay, ReplayPlayer } from '../../interfaces/Replay';
import { Callout, Card, Divider, Intent, Spinner } from '@blueprintjs/core';

interface RouteParams {
    replayId: string;
}

interface AnalysisProps {
    replay: Replay;
}

const Overview = (replay: Replay) => {
    const details = replay.details;
    // Hell if I know
    // https://github.com/Blizzard/s2protocol/blob/master/docs/flags/details.md#details-flag
    const ts = details.m_timeUTC / (10 * 1000 * 1000) - 11644473600 //+ (details.m_timeLocalOffset / 10000000)
    const date = new Date(ts * 1000).toString()
    return (
        <Callout icon='application'>
            <h4 className='bp3-heading'>{details.m_title}</h4>
            <Divider />
            <p>{date}</p>
        </Callout>
    )
};


const profileUrl = (localId: string) => {
    let prefix = 'https://starcraft2.com';
    let region = '';
    if (localId.startsWith('1')) { region = 'en-us'; }
    else if (localId.startsWith('2')) { } // EU
    else if (localId.startsWith('3')) { } // KR
    else if (localId.startsWith('4')) { } // SEA
    else if (localId.startsWith('5')) { } // CN
    return `${prefix}/${region}/profile/${localId}`;
}

const PlayerCard = (player: ReplayPlayer, idx: number) => {
    let playerName = player.m_userInitialData.m_name;
    if (player.m_userInitialData.m_clanTag) {
        playerName = `<${player.m_userInitialData.m_clanTag}> ${playerName}`;
    }
    const url = profileUrl(player.m_localizedId);
    const race = player.m_race;
    const mmr = player.m_userInitialData.m_scaledRating;
    const result = player.m_result === 1 ? "WIN" : "LOSS";
    let stub = race;
    if (mmr && mmr > 0) {
        stub = `${mmr} ` + stub;
    };
    return (
        <Card className='analysis-player-card' key={idx}>
            <h3 className='bp3-heading'>
                <a href={url} target='_blank' rel="noopener noreferrer">{playerName}</a>
            </h3>
            <Divider />
            <h4 className='bp3-heading'>{stub}</h4>
            <p>{result}</p>
        </Card>
    )
}

const Status = (replay: Replay) => {
    if (!replay.analysis) return null;
    else {
        const analysis = replay.analysis;
        const text = `Status: ${analysis.status}`;
        const timestamp = <p className='bp3-ui-text'>{analysis.timestamp.toDate().toString()}</p>
        const intent = analysis.status === 'FINISHED' ? Intent.SUCCESS : Intent.PRIMARY;
        //const spinner = <Spinner size={Spinner.SIZE_SMALL}/>;
        return (
            <Callout intent={intent} icon='graph' title={text}>
                {timestamp}
                <Divider />
            </Callout>
        );

    }

}

const Players = (replay: Replay) => {
    const cards = replay.players
        .sort((a, b) => a.m_result - b.m_result)
        .map((player, idx) => PlayerCard(player, idx));
    return (
        <Callout>
            {cards}
        </Callout>
    )
}


const Analysis = (props: AnalysisProps) => {
    const status = Status(props.replay);
    const overview = Overview(props.replay);
    const players = Players(props.replay);
    return (
        <div className='bp3-dark analysis-grid'>
            <div className='analysis-grid-item'>{status}</div>
            <div className='analysis-grid-item'>{overview}</div>
            <div className='analysis-grid-item'>{players}</div>
        </div>
    )
}

const ReplayAnalysisPage = () => {
    const match = useRouteMatch();
    const params = match.params as RouteParams;
    const ref = firebase.firestore().doc(`${constants.userReplayCollection}/${params.replayId}`);
    const [doc, loading] = useDocumentData<Replay>(ref);
    let component = null;
    if (loading) component = <Spinner />;
    else if (doc) component = <Analysis replay={doc} />

    return component;
}

export default ReplayAnalysisPage;