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
        <Callout intent={Intent.PRIMARY}>
            <h4 className='bp3-heading'>{details.m_title}</h4>
            <Divider />
            <p>Finished on {date}</p>
        </Callout>
    )
};

const PlayerCard = (player: ReplayPlayer, idx: number) => {
    return (
        <Card className='analysis-player-card' key={idx}>
            {player.m_userInitialData.m_clanTag}
            {player.m_userInitialData.m_name}
            {player.m_userInitialData.m_scaledRating}
        </Card>
    )
}

const Players = (replay: Replay) => {
    const cards = replay.players.map((player, idx) => PlayerCard(player, idx));
    return (
        <Callout>
            <h4 className='bp3-heading'>Players</h4>
            <Divider />
            {cards}
        </Callout>
    )
}


const Analysis = (props: AnalysisProps) => {
    const overview = Overview(props.replay);
    const players = Players(props.replay);
    return (
        <div className='bp3-dark analysis-grid'>
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