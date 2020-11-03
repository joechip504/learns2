import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import replayConverter from '../replay/ReplayConverter';
import { Replay } from '../../interfaces/Replay';
import { Link } from 'react-router-dom';


function UnlabeledReplays () {
    const ref = firebase.firestore().collection('tournamentReplays')
    const query = ref
        .where('isLabeled', '==', false)
        .limit(3)
        .withConverter(replayConverter)
    const [replays] = useCollectionDataOnce<Replay>(query)
    let items: JSX.Element[] = [];
    if (replays) {
        replays.forEach((replay, idx) => {
            items.push(<li key={idx}><Link to={`/edit/tournamentReplays/${replay.docId}`}>{replay.docId}</Link></li>)
        });
    }
    return <div>
        <ul>{items}</ul>
    </div>
}

export default UnlabeledReplays;