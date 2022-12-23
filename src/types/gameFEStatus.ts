import {Card, Users} from "./gameStatus";

export type GameFEStatus = {
    selectedCards: Card[],
    actualCard: Card|null,

    selectedTargetUsers: Users,
    selectedSkill: any[],
    publicCards: Card[],
};