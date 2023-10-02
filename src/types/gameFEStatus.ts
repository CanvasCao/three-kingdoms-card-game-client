import {Card} from "./card";
import {Players} from "./player";

export type GameFEStatus = {
    selectedCards: Card[],

    actualCard?: Card ,

    selectedTargetPlayers: Players,

    selectedSkillKey: string,

    publicCards: Card[],
}










