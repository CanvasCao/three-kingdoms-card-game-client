import {Card, Players} from "./gameStatus";

export type GameFEStatus = {
    selectedCards: Card[],
    actualCard: Card|null,

    selectedTargetPlayers: Players,
    selectedSkill: any[],
    publicCards: Card[],
};