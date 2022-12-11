import {editor} from "../index";

export class GameStatusObserved {
    constructor() {
        this.gameStatus = {};
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(o => {
            return o.obId != observer.obId;
        });
    }

    setGameStatus(gameStatus) {
        this.gameStatus = gameStatus;
        editor.set(gameStatus);
        this.observers.forEach(observer => {
            observer.gameStatusNotify(this.gameStatus);
        });
    }
}