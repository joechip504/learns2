import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import Player from '../../interfaces/Player';

export function usePlayers() {
    const [players, setPlayers] = React.useState<Player[]>([]);

    const subscription = () => {
        const s = firebase.firestore().collection('players').onSnapshot(snapshot => {
            let next: Player[] = [];
            snapshot.forEach(doc => {
                let p = doc.data();
                p['id'] = doc.id;
                next.push(p as Player);
            });
            setPlayers(prev => prev.concat(next))
        });
        return s;
    };

    React.useEffect(() => {
        subscription();
    }, []);

    return players;
}