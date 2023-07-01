import {Card} from "./card";
import {Players} from "./player";

export type GameFEStatus = {
    selectedCards: Card[],
    selectedIndexes: (number | string)[],
    actualCard: Card | null,

    selectedTargetPlayers: Players,

    selectedSkillName: string,

    publicCards: Card[],
}










