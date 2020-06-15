import { ReplayState, ReplayActionTypes, ADD_REPLAY, ADD_PLAYERS, SELECT_REPLAY, SET_REPLAY_STATUS } from "./types";
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
            const replays0 = state.replays.map(replay => {
                let candidate = { ...replay }
                if (replay.id === action.id) {
                    candidate.players = action.players;
                }
                return candidate;
            })
            return { ...state, replays: replays0 };
        case SELECT_REPLAY:
            return { ...state, selected: action.id };
        case SET_REPLAY_STATUS:
            const replays1 = state.replays.map(replay => {
                let candidate = { ...replay }
                if (replay.id === action.id) {
                    candidate.status = action.status;
                }
                return candidate;
            })
            return { ...state, replays: replays1 };
        default:
            return state;
    }
}
