import {Card, SelectedCards} from "./card";
import {Players} from "./player";

export type GameFEStatus = {
    selectedCards: SelectedCards,
    selectedIndexes: number[],
    actualCard: Card | null,

    selectedTargetPlayers: Players,

    selectedSkillName: string,

    publicCards: Card[],
}










