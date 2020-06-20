import { ReplayState, ReplayActionTypes, ADD_REPLAY, SELECT_REPLAY, SET_REPLAY_STATUS, SET_ANALYSIS, ReplayStatus } from "./types";
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
        case SET_ANALYSIS:
            const replays2 = state.replays.map(replay => {
                let candidate = { ...replay }
                if (replay.id === action.id) {
                    candidate.status = ReplayStatus.Success;
                    candidate.analysis = action.analysis;
                }
                return candidate;
            })
            return { ...state, replays: replays2 }
        default:
            return state;
    }
}
