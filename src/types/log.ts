import {Card} from "./card"

export type Log = {
    [roundPlayer: string]: {
        [playerId: string]: {
            use: Card[],
            play: Card[],
        }
    }
}