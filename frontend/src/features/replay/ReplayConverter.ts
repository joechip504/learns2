import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Replay } from '../../interfaces/Replay';

const replayConverter: firebase.firestore.FirestoreDataConverter<Replay> = {
    toFirestore(replay: Replay) {
        return replay;
    },
    fromFirestore(snapshot, options) {
        let data = snapshot.data(options);
        const docId = snapshot.id;
        data['docId'] = docId;
        return data as Replay;
    }
}

export default replayConverter;