export class GameFEStatusObserved {
    constructor() {
        this.originCardState = {
            selectedCards: [],
            actualCard: null,
        }
        this.originTargetState = {
            selectedTargetUsers: [],
        }
        this.originSkillState = {
            selectedSkill: ""
        }
        this.gameFEStatus = {
            ...this.originCardState,
            ...this.originTargetState,
            ...this.originSkillState,
        };
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

    reset() {
        this.gameFEStatus = {
            ...this.gameFEStatus,
            ...this.originCardState,
            ...this.originTargetState,
            ...this.originSkillState,
        };
        this.observers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }

    setGameEFStatus(gameFEStatus) {
        this.gameFEStatus = gameFEStatus;
        this.observers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }
}