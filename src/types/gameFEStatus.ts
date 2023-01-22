import {Card, Players} from "./gameStatus";

export type GameFEStatus = {
    selectedCards: Card[],
    actualCard: Card | null,

    // 传给后端 后端nofity
    selectedIndexes: number[],

    selectedTargetPlayers: Players,

    selectedWeaponCard: Card | null,
    selectedSkill: any[],

    publicCards: Card[],
};