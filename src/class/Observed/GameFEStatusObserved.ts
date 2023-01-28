import {cloneDeep} from "lodash";
import {GameFEStatus} from "../../types/gameFEStatus";
import {FEObserver} from "../../types/observer";

export class GameFEStatusObserved {
    originCardState: {
        selectedCards: GameFEStatus['selectedCards'],
        selectedIndexes: GameFEStatus['selectedIndexes'],
        actualCard: GameFEStatus['actualCard'],
        selectedWeaponCard: GameFEStatus['selectedWeaponCard']
    }
    originTargetState: {
        selectedTargetPlayers: GameFEStatus['selectedTargetPlayers'],
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
            selectedWeaponCard: null,
            selectedIndexes: [],
        }
        this.originTargetState = {
            selectedTargetPlayers: [],
        }
        this.originSkillState = {
            selectedSkill: []
        }
        this.publicCardsState = {
            publicCards: [] // 所有人打出的牌+(刘备仁德/张辽突袭)=失去的牌
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
        // @ts-ignore
        window?.editor2 && window.editor2?.set(this.gameFEStatus)
        this.selectedStatusObservers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }

    setSelectedGameEFStatus(gameFEStatus: GameFEStatus) {
        this.gameFEStatus = gameFEStatus;
        // @ts-ignore
        window?.editor2 && window.editor2?.set(this.gameFEStatus)
        this.selectedStatusObservers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }

    setPublicCardsGameEFStatus(gameFEStatus: GameFEStatus) {
        this.gameFEStatus = gameFEStatus;
        // @ts-ignore
        window?.editor2 && window.editor2?.set(this.gameFEStatus)
        this.publicCardsObservers.forEach(observer => {
            observer.gameFEStatusNotify(this.gameFEStatus);
        });
    }
}