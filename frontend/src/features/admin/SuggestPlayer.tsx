import React from 'react';
import 'firebase/firestore';
import Player from '../../interfaces/Player';
import { IItemRendererProps, ItemPredicate, ItemRenderer, Suggest } from '@blueprintjs/select';
import { Intent, MenuItem } from '@blueprintjs/core';

interface Props {
    onSelect: (p: Player) => void
    players: Player[];
}

function SuggestPlayer (props: Props) {
    const [selected, setSelected] = React.useState<Player | undefined>(undefined);
    const [typeaheadQuery, setTypeaheadQuery] = React.useState('');
    const PlayerSuggest = Suggest.ofType<Player>();
    const inputValueRenderer = (p: Player) => p.name
    const onItemSelect = (p: Player) => {
        setSelected(p);
        setTypeaheadQuery(p.name);
        props.onSelect(p);
    };
    const itemRenderer: ItemRenderer<Player> = (p: Player, props: IItemRendererProps) => {
        const onClick = () => {
            setSelected(p)
            setTypeaheadQuery(p.name)
            onItemSelect(p)
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
                items={props.players}
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