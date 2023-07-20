import {Card, PandingSign} from "./card";
import {Skill} from "./skill";

export type GameStatusPlayers = { [key: string]: Player }
export type Players = Player[]
export type Player = {
    maxBlood: number,
    currentBlood: number,
    heroId: string,
    shaLimitTimes: number,
    playerId: string,
    playerName: string,
    heroName: string,
    location: number,
    skills: Skill[],

    canSelectHeroIds: string[];

    // cards
    cards: Card[],
    pandingSigns: PandingSign[],
    weaponCard: Card,
    shieldCard: Card,
    plusHorseCard: Card,
    minusHorseCard: Card,

    // ui tags
    isTieSuo: boolean,

    // resetWhenMyTurnEnds
    judgedShandian: boolean,
    skipDraw: boolean,
    skipPlay: boolean,
    shaTimes: number,

    // Dead
    isDead: boolean,

    // FE
    linePosition: { x: number, y: number },
    playerPosition: { x: number, y: number },
}