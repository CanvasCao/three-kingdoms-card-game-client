import {Card, PandingSign} from "./card";

export type GameStatusPlayers = { [key: string]: Player }
export type Players = Player[]
export type Player = {
    maxBlood: number,
    currentBlood: number,
    imageName: string,
    shaLimitTimes: number,
    playerId: string,
    name: string,
    location: number,

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