import { ReplayState, ReplayActionTypes, ADD_REPLAY, ADD_PLAYERS, SELECT_REPLAY } from "./types";
import { Reducer } from "@reduxjs/toolkit";

const initialReplayState: ReplayState = {
    replays: []
}

export const replayReducer: Reducer<ReplayState, ReplayActionTypes> = (state: ReplayState = initialReplayState, action: ReplayActionTypes): ReplayState => {
    switch (action.type) {
        case ADD_REPLAY:
            return {
                ...state,
                replays: [...state.replays, action.replay]
            }
        case ADD_PLAYERS:
            var curr = state.replays;
            for (let i = 0; i < curr.length; i++) {
                if (action.id === curr[i].id) {
                    curr[i].players = action.players;
                }
            }
            return { ...state, replays: curr }
        case SELECT_REPLAY:
            return { ...state, selected: action.id }
        default:
            return state;
    }
}
