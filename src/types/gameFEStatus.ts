import {Card} from "./card";
import {FEObserver} from "./observer";
import {Players} from "./player";

export type GameFEStatus = {
    selectedCards: Card[],
    selectedIndexes: number[],
    actualCard: Card | null,
    selectedWeaponCard: Card | null,

    selectedTargetPlayers: Players,

    selectedSkill: any[],

    publicCards: Card[],
}










