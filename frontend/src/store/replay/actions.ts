import { Player, ReplayActionTypes, ADD_REPLAY, ADD_PLAYERS, Replay, SELECT_REPLAY, ReplayStatus, SET_REPLAY_STATUS } from "./types"

export const addReplay = (replay: Replay): ReplayActionTypes => {
    return {
        type: ADD_REPLAY,
        replay: replay
    }
}

export const addPlayers = (id: number, players: Player[]): ReplayActionTypes => {
    return {
        type: ADD_PLAYERS,
        id: id,
        players: players
    }
}

export const selectReplay = (id: number): ReplayActionTypes => {
    return {
        type: SELECT_REPLAY,
        id: id
    }
}

export const setReplayStatus = (id: number, status: ReplayStatus): ReplayActionTypes => {
    return {
        type: SET_REPLAY_STATUS,
        id: id,
        status: status
    }
}