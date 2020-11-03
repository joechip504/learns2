import * as firebase from 'firebase/app';
import 'firebase/firestore';
import Player from '../../interfaces/Player';

const playerConverter: firebase.firestore.FirestoreDataConverter<Player> = {
    toFirestore(player: Player) {
        return player;
    },
    fromFirestore(snapshot, options) {
        let data = snapshot.data(options);
        const docId = snapshot.id;
        data['id'] = docId;
        return data as Player;
    }
}

export default playerConverter;