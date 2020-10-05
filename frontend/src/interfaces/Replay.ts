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
    m_userInitialData: UserInitialData
};

export interface ReplayDetails {
};

export interface UserInitialData {
    m_name: string;
    m_scaledRating: number
};

export interface LadderReplay {
    players: ReplayPlayer[];
    details: ReplayDetails;
}