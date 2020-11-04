export default interface Player {
    name: string,
    url: string,
    id: string,
    aliases?: string[]
};

export interface ReplayPlayer {
    m_userId: number;
    m_name: string;
    m_race: string;
    m_userInitialData: UserInitialData;
    m_toon: MToon;
};

export interface ReplayDetails {
    m_isBlizzardMap: boolean;
    m_mapSizeX: number;
    m_mapSizeY: number;
    m_timeLocalOffset: number;
    m_timeUTC: number;
    m_title: string;
};

export interface UserInitialData {
    m_name: string;
    m_clanTag: string;
    m_scaledRating: number
};

export interface MToon {
    m_region: number;
    m_id: number;
    m_realm: number;
    m_programId: string;
};

export interface Replay {
    docId: string;
    players: ReplayPlayer[];
    details: ReplayDetails;
    is_labeled: boolean;
    labels?: any;
};