export interface PlayerAnalysis {
    name: string;
    confidence: number;
}

export interface Player {
    name: string;
    race: string;
    blizz_id: number;
    user_id: number;
    //analysis: PlayerAnalysis[];
}

export enum ReplayStatus {
    Init, Loading, Success, Failure
}

export interface ReplayMeta {
    map_title: string;
    base_build: number;
    time_utc: number;
}

export interface AnalysisResponse {
    meta: ReplayMeta;
    players: Player[];
}

export interface Replay {
    name: string;
    id: number;
    status: ReplayStatus;
    analysis?: AnalysisResponse;
}

export interface ReplayState {
    replays: Replay[]
    selected?: number;
}

export const ADD_REPLAY = 'ADD_REPLAY'
export const ADD_PLAYERS = 'ADD_PLAYERS'
export const SELECT_REPLAY = 'SELECT_REPLAY'
export const SET_REPLAY_STATUS = 'SET_REPLAY_STATUS'
export const SET_ANALYSIS = 'SET_ANALYSIS'

interface AddReplayAction {
    type: typeof ADD_REPLAY;
    replay: Replay;
}

interface SelectReplayAction {
    type: typeof SELECT_REPLAY;
    id: number;
}

interface SetReplayStatusAction {
    type: typeof SET_REPLAY_STATUS;
    id: number;
    status: ReplayStatus;
}

interface AddPlayersAction {
    type: typeof ADD_PLAYERS;
    id: number;
    players: Player[];
}

interface SetAnalysisAction {
    type: typeof SET_ANALYSIS;
    id: number;
    analysis: AnalysisResponse;
}

export type ReplayActionTypes = AddReplayAction | AddPlayersAction | SelectReplayAction | SetReplayStatusAction | SetAnalysisAction