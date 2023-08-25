import {Card} from "./card";
import {Players} from "./player";

export type GameFEStatus = {
    selectedCards: Card[],

    actualCard: Card | null,

    selectedTargetPlayers: Players,

    selectedSkillNameKey: string,

    publicCards: Card[],
}










