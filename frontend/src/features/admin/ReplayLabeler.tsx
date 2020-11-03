import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Replay, ReplayDetails, ReplayPlayer } from '../../interfaces/Replay';
import { Button, Card, MenuDivider, Spinner } from '@blueprintjs/core';
import SuggestPlayer from './SuggestPlayer';
import Player from '../../interfaces/Player';
import './NextUnlabeledReplayButton';
import NextUnlabeledReplayButton from './NextUnlabeledReplayButton';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import playerConverter from '../io/PlayerConverter';

const Overview = (details: ReplayDetails) => {
    // Hell if I know
    // https://github.com/Blizzard/s2protocol/blob/master/docs/flags/details.md#details-flag
    const ts = details.m_timeUTC / (10 * 1000 * 1000) - 11644473600 //+ (details.m_timeLocalOffset / 10000000)
    const date = new Date(ts * 1000).toString()
    return <div className="bp3-dark">
        <h1>{details.m_title}</h1>
        <p>Played at {date}</p>
    </div>
};

const PlayerCard = (player: ReplayPlayer, players: Player[], idx: number, labels: Map<string, number>, setLabels: React.Dispatch<React.SetStateAction<Map<string, number>>>) => {
    const mmr = player.m_userInitialData.m_scaledRating ? player.m_userInitialData.m_scaledRating : 'unknown'
    const onSelect = (p: Player) => {
        const nextLabels = new Map(labels);
        nextLabels.set(p.id, player.m_userId)
        setLabels(nextLabels);
    }
    return (
        <Card className="bp3-dark" key={idx}>
            <h2>{player.m_userInitialData.m_name} ({player.m_race}, MMR {mmr})</h2>
            <MenuDivider />
            <SuggestPlayer onSelect={onSelect} players={players}/>
        </Card>
    )
}


const ReplaySummary = (collection: string, replayId: string) => {
    const replayQuery = firebase.firestore().collection(collection).where(firebase.firestore.FieldPath.documentId(), '==', replayId).limit(1);
    const playerQuery = firebase.firestore().collection('players').withConverter(playerConverter);

    const [labels, setLabels] = React.useState<Map<string, number>>(new Map());
    const [replays, loading,] = useCollectionDataOnce<Replay>(replayQuery);

    const [players] = useCollectionDataOnce<Player>(playerQuery);
    const playerArray: Player[] = players ? players! : [];

    if (loading) {
        return <Spinner size={Spinner.SIZE_SMALL} />
    }

    const cards = replays![0].players.map((player, idx) => {
        return PlayerCard(player, playerArray, idx, labels, setLabels);
    });

    const overview = Overview(replays![0].details);
    return (
        <div>
            {overview}
            {cards}
            <div className="bp3-dark labeler-footer">
                <NextUnlabeledReplayButton docId={replayId} />
                <Button onClick={() => console.log(labels)}>Submit</Button>
            </div>
        </div>
    )
}

const ReplayLabeler = () => {
    const match = useRouteMatch();
    const params = match.params as any;
    const summary = ReplaySummary(params.collection, params.replayId)
    return summary;
}

export default ReplayLabeler;