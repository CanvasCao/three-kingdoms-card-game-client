import {editor2} from "../index";
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

    selectedStatusObservers: FEObserver[]
    publicCardsObservers: FEObserver[]

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
        this.selectedStatusObservers = [];
        this.publicCardsObservers = [];
    }

    addSelectedStatusObserver(observer: FEObserver) {
        this.selectedStatusObservers.push(observer);
    }

    addPublicCardsObserver(observer: FEObserver) {
        this.publicCardsObservers.push(observer);
    }

    removeSelectedStatusObserver(observer: FEObserver) {
        this.selectedStatusObservers = this.selectedStatusObservers.filter(o => {
            return o.obId != observer.obId;
        });
    }

    removePublicCardsObserver(observer: FEObserver) {
        this.publicCardsObservers = this.publicCardsObservers.filter(o => {
            return o.obId != observer.obId;
        });
    }

    resetSelectedStatus() {
        this.gameFEStatus = {
            ...cloneDeep(this.gameFEStatus),
            ...cloneDeep(this.originCardState),
            ...cloneDeep(this.originTargetState),
            ...cloneDeep(this.originSkillState),
        };
        editor2.set(this.gameFEStatus)
        this.selectedStatusObservers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }

    setSelectedGameEFStatus(gameFEStatus: GameFEStatus) {
        this.gameFEStatus = gameFEStatus;
        editor2.set(gameFEStatus)
        this.selectedStatusObservers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }

    setPublicCardsGameEFStatus(gameFEStatus: GameFEStatus) {
        this.gameFEStatus = gameFEStatus;
        editor2.set(gameFEStatus)
        this.publicCardsObservers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }
}