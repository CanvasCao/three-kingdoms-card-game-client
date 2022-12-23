import {GameFEStatus} from "./gameFEStatus";
import {GameStatus} from "./gameStatus";

export interface FEObserver {
    obId: string,
    gameFEStatusNotify: (s: GameFEStatus) => void
}


export interface Observer {
    obId: string,
    gameStatusNotify: (s: GameStatus) => void
}

