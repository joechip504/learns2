export interface PlayerAnalysis {
    name: string;
    confidence: number;
}

export interface Player {
    name: string;
    analysis: PlayerAnalysis[];
}

export interface Replay {
    name: string;
    id: number;
    players?: Player[];
}

export interface ReplayState {
    replays: Replay[]
}

export const ADD_REPLAY = 'ADD_REPLAY'
export const ADD_PLAYERS = 'ADD_PLAYERS'

interface AddReplayAction {
    type: typeof ADD_REPLAY;
    replay: Replay;
}

interface AddPlayersAction {
    type: typeof ADD_PLAYERS;
    id: number;
    players: Player[];
}

export type ReplayActionTypes = AddReplayAction | AddPlayersAction