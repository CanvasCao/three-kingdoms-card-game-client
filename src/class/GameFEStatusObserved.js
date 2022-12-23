import {editor2} from "../index";
import {cloneDeep} from "lodash";

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
        this.publicCardsState = {
            publicCards: [] // 存储后端card对象 前端PublicCard不维护数组
        }

        this.gameFEStatus = {
            ...cloneDeep(this.originCardState),
            ...cloneDeep(this.originTargetState),
            ...cloneDeep(this.originSkillState),
            ...cloneDeep(this.publicCardsState)
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
            ...cloneDeep(this.gameFEStatus),
            ...cloneDeep(this.originCardState),
            ...cloneDeep(this.originTargetState),
            ...cloneDeep(this.originSkillState),
        };
        editor2.set(this.gameFEStatus)
        this.observers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }

    setGameEFStatus(gameFEStatus) {
        this.gameFEStatus = gameFEStatus;
        editor2.set(gameFEStatus)
        this.observers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }
}