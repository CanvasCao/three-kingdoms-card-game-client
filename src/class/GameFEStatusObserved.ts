// import {editor2} from "../index";
import {cloneDeep} from "lodash";
import {GameFEStatus} from "../types/gameFEStatus";
import {FEObserver} from "../types/observer";

export class GameFEStatusObserved {
    originCardState: {
        selectedCards: GameFEStatus['selectedCards'],
        actualCard: GameFEStatus['actualCard'],
    }
    originTargetState: {
        selectedTargetUsers: GameFEStatus['selectedTargetUsers'],
    }

    originSkillState: {
        selectedSkill: GameFEStatus['selectedSkill']
    }

    publicCardsState: {
        publicCards: GameFEStatus['publicCards']
    }

    gameFEStatus: GameFEStatus

    observers: FEObserver[]

    constructor() {
        this.originCardState = {
            selectedCards: [],
            actualCard: null,
        }
        this.originTargetState = {
            selectedTargetUsers: [],
        }
        this.originSkillState = {
            selectedSkill: []
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

    addObserver(observer: FEObserver) {
        this.observers.push(observer);
    }

    removeObserver(observer: FEObserver) {
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
        // editor2.set(this.gameFEStatus)
        this.observers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }

    setGameEFStatus(gameFEStatus: GameFEStatus) {
        this.gameFEStatus = gameFEStatus;
        // editor2.set(gameFEStatus)
        this.observers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }
}