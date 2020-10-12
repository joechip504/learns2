import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import Player from '../../interfaces/Player';
import { IItemRendererProps, ItemPredicate, ItemRenderer, Suggest } from '@blueprintjs/select';
import { Intent, MenuItem } from '@blueprintjs/core';
import { useCollectionOnce } from 'react-firebase-hooks/firestore'

const SuggestPlayer = () => {
    let players: Player[] = []
    const query = firebase.firestore().collection('players')

    const [snapshot,] = useCollectionOnce(query);
    const [selected, setSelected] = React.useState<Player | undefined>(undefined);
    const [typeaheadQuery, setTypeaheadQuery] = React.useState('');

    if (snapshot) {
        snapshot.docs.forEach(doc => {
            let p = doc.data();
            p['id'] = doc.id;
            players.push(p as Player);
        })
    }

    const PlayerSuggest = Suggest.ofType<Player>();
    const inputValueRenderer = (p: Player) => p.name
    const onItemSelect = (p: Player) => {
        setSelected(p);
        setTypeaheadQuery(p.name);
    };
    const itemRenderer: ItemRenderer<Player> = (p: Player, props: IItemRendererProps) => {
        const onClick = () => {
            setSelected(p)
            setTypeaheadQuery(p.name)
        }
        if (props.modifiers.active) {
            return <MenuItem key={p.id} text={p.name} active={true} intent={Intent.PRIMARY} onClick={onClick}/>
        }
        else if (props.modifiers.matchesPredicate) {
            return <MenuItem key={p.id} text={p.name} active={false} intent={Intent.NONE} onClick={onClick}/>
        }
        return null;
    }

    const itemPredicate: ItemPredicate<Player> = (query, player, _index) => {
        if (!query) {
            return true;
        }
        let res = player.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        return res;
    }

    return (
            <PlayerSuggest
                itemPredicate={itemPredicate}
                inputValueRenderer={inputValueRenderer}
                items={players}
                onItemSelect={onItemSelect}
                itemRenderer={itemRenderer}
                fill={true}
                selectedItem={selected}
                itemsEqual="id"
                query={typeaheadQuery}
                onQueryChange={q => setTypeaheadQuery(q)}
            >
            </PlayerSuggest>
    )
}

export default SuggestPlayer;