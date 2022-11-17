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
            return o.uuid != observer.uuid;
        });
    }

    setGameStatus(gameStatus) {
        this.gameStatus = gameStatus;
        this.observers.forEach(observer => {
            observer.gameStatusNotify(this.gameStatus);
        });
    }
}