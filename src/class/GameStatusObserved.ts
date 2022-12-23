// import {editor} from "../index";
import {GameFEStatus} from "../types/gameFEStatus";
import {GameStatus} from "../types/gameStatus";
import {Observer} from "../types/observer";

export class GameStatusObserved {
    gameStatus: GameStatus | {};
    observers: Observer[];

    constructor() {
        this.gameStatus = {};
        this.observers = [];
    }

    addObserver(observer: Observer) {
        this.observers.push(observer);
    }

    removeObserver(observer: Observer) {
        this.observers = this.observers.filter(o => {
            return o.obId != observer.obId;
        });
    }

    setGameStatus(gameStatus: GameFEStatus) {
        this.gameStatus = gameStatus;
        // editor.set(gameStatus);
        this.observers.forEach(observer => {
            observer.gameStatusNotify(this.gameStatus as GameStatus);
        });
    }
}