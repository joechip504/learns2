import React from 'react';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import replayConverter from '../replay/ReplayConverter';
import { Replay } from '../../interfaces/Replay';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

interface Props {
    docId: string;
}

function NextUnlabeledReplayButton(props: Props) {
    const ref = firebase.firestore().collection('tournamentReplays');
    const query = ref
        .where('isLabeled', '==', false)
        .where(firebase.firestore.FieldPath.documentId(), '!=', props.docId)
        .limit(1)
        .withConverter(replayConverter)

    const [res,] = useCollectionDataOnce<Replay>(query);
    const isEnabled = (res && res.length === 1);
    const nextDocId = isEnabled ? res![0].docId : '';
    return (
        <Link to={`/edit/tournamentReplays/${nextDocId}`}>
            <Button disabled={!isEnabled} text="Next"></Button>
        </Link>
    )
}

export default NextUnlabeledReplayButton;