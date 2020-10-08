import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Replay, ReplayDetails, ReplayPlayer } from '../../interfaces/Replay';
import { Button, Card, MenuDivider, Spinner } from '@blueprintjs/core';

const Overview = (details: ReplayDetails) => {
    // Hell if I know
    // https://github.com/Blizzard/s2protocol/blob/master/docs/flags/details.md#details-flag
    const ts = details.m_timeUTC / (10 * 1000 * 1000) - 11644473600 - (details.m_timeLocalOffset / 10000000)
    const date = new Date(ts * 1000).toString()
    return <div className="bp3-dark">
        <h1>{details.m_title}</h1>
        <p>Played at {date}</p>
    </div>
};

const PlayerCard = (player: ReplayPlayer, idx: number) => {
    console.log(player)
    const mmr = player.m_userInitialData.m_scaledRating ? player.m_userInitialData.m_scaledRating : 'unknown'
    return (
        <Card className="bp3-dark" key={idx}>
            <h2>{player.m_userInitialData.m_name} ({player.m_race}, MMR {mmr})</h2>
            <MenuDivider />
            <Button>Some button</Button>
        </Card>
    )
}

const ReplaySummary = (collection: string, replayId: string) => {
    const [loading, setLoading] = React.useState(true);
    const [replay, setReplay] = React.useState<Replay | undefined>(undefined);

    useEffect(() => {
        const ref = firebase.firestore().collection(collection).doc(replayId)
        ref.get()
            .then(doc => {
                const data = doc.data() as Replay;
                setReplay(data)
                console.log(data)
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [collection, replayId]);

    if (loading) {
        return <Spinner size={Spinner.SIZE_SMALL} />
    }

    const cards = replay!.players.map((player, idx) => {
        return PlayerCard(player, idx);
    });

    const overview = Overview(replay!.details);
    return (
        <div>
            {overview}
            {cards}
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