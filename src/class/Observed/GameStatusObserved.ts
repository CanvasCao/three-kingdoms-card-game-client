import {GameStatus} from "../../types/gameStatus";
import {Observer} from "../../types/observer";

export class GameStatusObserved {
    gameStatus?: GameStatus;
    observers: Observer[];

    constructor() {
        this.gameStatus;
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

    setGameStatus(gameStatus: GameStatus) {
        this.gameStatus = gameStatus;
        // @ts-ignore
        window?.editor&&window?.editor?.set(gameStatus);
        this.observers.forEach(observer => {
            observer.gameStatusNotify(this.gameStatus as GameStatus);
        });
    }
}