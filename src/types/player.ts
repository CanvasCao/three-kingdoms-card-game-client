import {Card, PandingSign} from "./card";
import {Hero} from "./hero";

export type GameStatusPlayers = { [key: string]: Player }
export type Players = Player[]
export type Player = {
    currentBlood: number,
    playerId: string,
    playerName: string,
    location: number,
    teamMember: string,

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

    // 选将
    canSelectHeros: Hero[];
} & Hero