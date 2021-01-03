import React from 'react'
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useRouteMatch } from 'react-router-dom';
import { constants } from '../../app/constants';
import { useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { Prediction, Replay, ReplayPlayer } from '../../interfaces/Replay';
import { Callout, Card, Divider, Icon, IconName, Intent, Spinner } from '@blueprintjs/core';
import Player, { AllPlayersCache } from '../../interfaces/Player';

interface RouteParams {
    replayId: string;
}

interface AnalysisProps {
    replay: Replay;
    playerCache: AllPlayersCache;
}

const AnalysisDescription = (confidence: number, player: Player) => {
    const link = <a href={player.url} target='_blank' rel="noopener noreferrer">{player.name}</a>
    if (confidence >= .95) {
        return <p>This replay exhibits <b>high</b> similarity to known games of {link}.</p>
    }
    else if (confidence >= .85) {
        return <p>This replay exhibits <b>some</b> similarity to known games of {link}.</p>
    }
    else {
        return <p>This replay exhibits <b>a little</b> similarity to known games of {link}.</p>
    }
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
            <p>{date}</p>
            <Divider />

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

const PlayerInfoTable = (props: { player: ReplayPlayer }) => {
    const result = props.player.m_result === 1 ? "WIN" : "LOSS";

    return (
        <table className="bp3-html-table bp3-html-table-striped">
            <thead>
                <th>Result</th>
                <th>Race</th>
                <th>MMR</th>
            </thead>
            <tbody>
                <tr>
                    <td>{result}</td>
                    <td>{props.player.m_race}</td>
                    <td>{props.player.m_userInitialData.m_scaledRating}</td>
                </tr>
            </tbody>
        </table>
    )
}

const PlayerPredictionTable = (props: { player: ReplayPlayer, playerLookup: Map<string, Player>, prediction?: Prediction }) => {
    if (props.prediction === undefined) return null;
    const player = props.playerLookup.get(props.prediction.player_doc_id)!;
    const strConfidence = (100 * props.prediction.confidence).toFixed(2) + '%';
    let rowClass = 'tr-high-confidence';
    let icon: IconName = 'person';
    if (props.prediction.confidence < .95) {
        rowClass = 'tr-med-confidence';
        icon = 'help';
        if (props.prediction.confidence < .85) {
            rowClass = 'tr-low-confidence';
            icon = 'error';
        }
    }
    return (
        <table className="bp3-html-table bp3-html-table-striped">
            <thead>
                <th></th>
                <th>Prediction</th>
                <th>Confidence</th>
            </thead>
            <tbody>
                <tr className={rowClass}>
                    <td><Icon icon={icon} /></td>
                    <td>{player.name}</td>
                    <td>{strConfidence}</td>
                </tr>
            </tbody>
        </table>
    )
}

const PlayerCard = (player: ReplayPlayer, idx: number, playerLookup: Map<string, Player>, prediction?: Prediction) => {
    let playerName = player.m_userInitialData.m_name;
    if (player.m_userInitialData.m_clanTag) {
        playerName = `<${player.m_userInitialData.m_clanTag}> ${playerName}`;
    }
    const url = profileUrl(player.m_localizedId);
    const blurb = prediction && AnalysisDescription(prediction.confidence, playerLookup.get(prediction.player_doc_id)!);
    return (
        <Card className='analysis-player-card' key={idx}>
            <h3 className='bp3-heading'>
                <a href={url} target='_blank' rel="noopener noreferrer">{playerName}</a>
            </h3>
            <Divider />
            <div className='player-card-body'>
                <PlayerInfoTable player={player} />
                <PlayerPredictionTable player={player} playerLookup={playerLookup} prediction={prediction} />
                <div />
                <div>{blurb}</div>
            </div>
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

const Players = (replay: Replay, predictions: Map<number, Prediction>, playerLookup: Map<string, Player>) => {
    const cards = replay.players
        .sort((a, b) => a.m_result - b.m_result)
        .map((player, idx) => {
            const prediction = predictions.get(player.m_userId);
            return PlayerCard(player, idx, playerLookup, prediction);
        });
    return (
        <Callout>
            {cards}
        </Callout>
    )
}


const Analysis = (props: AnalysisProps) => {
    const predictions = new Map<number, Prediction>();
    const playerLookup = new Map<string, Player>();
    if (props.replay.analysis && props.replay.analysis.predictions) {
        props.replay.analysis.predictions.forEach(prediction => {
            predictions.set(prediction.player_user_id, prediction);
        });
    };
    props.playerCache.objects.forEach(player => {
        playerLookup.set(player.id, player);
    });
    const status = Status(props.replay);
    const overview = Overview(props.replay);
    const players = Players(props.replay, predictions, playerLookup);
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
    const replayRef = firebase.firestore().doc(`${constants.userReplayCollection}/${params.replayId}`);
    const [replayDoc, replayLoading] = useDocumentData<Replay>(replayRef);
    const [allPlayers, allPlayersLoading] = useDocumentDataOnce<AllPlayersCache>(firebase.firestore().doc('caches/allPlayers'));
    let component = null;
    if (replayLoading || allPlayersLoading) component = <Spinner />;
    else if (replayDoc && allPlayers) component = <Analysis replay={replayDoc} playerCache={allPlayers} />
    return component;
}

export default ReplayAnalysisPage;