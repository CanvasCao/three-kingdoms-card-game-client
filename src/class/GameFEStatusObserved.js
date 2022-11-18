export class GameFEStatusObserved {
    constructor() {
        this.originState = {
            selectedCards: [],
            selectedCardTargetUsers: [],
        }
        this.gameFEStatus = this.originState;
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

    resetGameEFStatus() {
        this.gameFEStatus = this.originState;
        this.observers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }

    setGameEFStatus(gameFEStatus) {
        console.log(gameFEStatus)
        this.gameFEStatus = gameFEStatus;
        this.observers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }
}