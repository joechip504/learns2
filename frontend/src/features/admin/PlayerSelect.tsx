import React, { useState } from 'react';
import firebase from 'firebase';
import Player from './Player';
import { ItemRenderer, Suggest, Select } from '@blueprintjs/select';
import { Button, Icon, Menu, MenuItem } from '@blueprintjs/core';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const PSelect = Select.ofType<Player>();

const inputRenderer = (player: Player) => {
    return player.name;
}

const samplePlayers: Player[] = [
    { 'name': 'Jobama', 'url': 'asdf', 'id': '1' },
    { 'name': 'Yobama', 'url': 'asdf', 'id': '2' },
    { 'name': 'YoMomma', 'url': 'asdf', 'id': '3' }
]

const itemRenderer: ItemRenderer<Player> = (player: Player, props) => <MenuItem text={player.name + ' ' + player.id} key={player.id}/>;

export const PlayerSelect = () => {
    const [player, setPlayer] = useState<Player>(samplePlayers[0]);
    const ref = firebase.firestore().collection('players');
    const [players] = useCollectionData(ref.limit(1000))
    //console.log(players);

    let playerList: Player[] = []
    if (players) {
        playerList = players as Player[];
    };

    return (
        <div className='bp3-dark'>
            <PSelect items={playerList} itemRenderer={itemRenderer} activeItem={player} onItemSelect={(p: Player) => setPlayer(p)}>
                <Button text={player.name} icon={"search"}/>
            </PSelect>
        </div>
    )
}