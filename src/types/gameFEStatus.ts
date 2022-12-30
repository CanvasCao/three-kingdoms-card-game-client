import {Card, Players} from "./gameStatus";

export type GameFEStatus = {
    selectedCards: Card[],

    // 传给后端 后端nofity
    selectedIndexes: number[],
    actualCard: Card | null,

    selectedTargetPlayers: Players,
    selectedSkill: any[],
    publicCards: Card[],
};