import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Replay, ReplayPlayer } from '../../interfaces/Replay';
import { Button, Card, MenuDivider, Spinner } from '@blueprintjs/core';
import SuggestPlayer from './SuggestPlayer';
import Player from '../../interfaces/Player';
import './NextUnlabeledReplayButton';
import NextUnlabeledReplayButton from './NextUnlabeledReplayButton';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import playerConverter from '../io/PlayerConverter';

const Overview = (replay: Replay) => {
    const details = replay.details;
    // Hell if I know
    // https://github.com/Blizzard/s2protocol/blob/master/docs/flags/details.md#details-flag
    const ts = details.m_timeUTC / (10 * 1000 * 1000) - 11644473600 //+ (details.m_timeLocalOffset / 10000000)
    const date = new Date(ts * 1000).toString()
    return <div className="bp3-dark">
        <h1>{details.m_title}</h1>
        <hr />
        <p>Played at {date}</p>
        <p>{replay.storageEvent.name}</p>
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
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [players] = useCollectionDataOnce<Player>(playerQuery);
    const playerArray: Player[] = players ? players! : [];

    const submitEnabled = labels.size > 0 && !isSubmitting;

    const onSubmit = () => {
        setIsSubmitting(true);
        if (replays) {
            const ref = firebase.firestore().collection(collection).doc(replayId)
            ref.update({
                'labels': Object.fromEntries(labels),
                'isLabeled': true
            })
            .then(() => true) // notify
            .catch(err => console.error(err))
            .finally(() => {
                setLabels(new Map());
                setIsSubmitting(false);
            })
        }
        else {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <Spinner size={Spinner.SIZE_SMALL} />
    }
    const replay = replays![0];
    const cards = replay.players.map((player, idx) => {
        return PlayerCard(player, playerArray, idx, labels, setLabels);
    });

    const overview = Overview(replay);
    return (
        <div>
            {overview}
            {cards}
            <div className="bp3-dark labeler-footer">
                <NextUnlabeledReplayButton docId={replayId} />
                <Button disabled={!submitEnabled} onClick={onSubmit}>Submit</Button>
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