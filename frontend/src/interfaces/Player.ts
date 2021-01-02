export default interface Player {
    name: string,
    url: string,
    id: string,
    aliases?: string[]
};

export interface AllPlayersCache {
    objects: Player[];
}