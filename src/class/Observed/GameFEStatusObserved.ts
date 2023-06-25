import {cloneDeep, differenceBy} from "lodash";
import {Card} from "../../types/card";
import {GameFEStatus} from "../../types/gameFEStatus";
import {FEObserver} from "../../types/observer";
import {generateActualCard} from "../../utils/emitDataGenerator";

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

    originPublicCardsState: {
        publicCards: GameFEStatus['publicCards']
    }

    gameFEStatus: GameFEStatus

    selectedStatusObservers: FEObserver[]
    publicCardsObservers: FEObserver[]

    constructor() {
        this.originCardState = {
            selectedCards: [],
            selectedIndexes: [],
            actualCard: null,
            selectedWeaponCard: null,
        }
        this.originTargetState = {
            selectedTargetPlayers: [],
        }
        this.originSkillState = {
            selectedSkill: []
        }

        // publicCardsState 是为了ToPublicCard对象 可以Observer并调整自己的位置
        this.originPublicCardsState = {
            publicCards: []
        }

        this.gameFEStatus = {
            ...cloneDeep(this.originCardState),
            ...cloneDeep(this.originTargetState),
            ...cloneDeep(this.originSkillState),
            ...cloneDeep(this.originPublicCardsState)
        };
        this.selectedStatusObservers = [];
        this.publicCardsObservers = [];
    }


    // Observer functions
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

    // set/reset state
    // reset except public cards
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


    // select/unselect card
    unselectCard(card: Card, _index: number) {
        const gameFEStatus = this.gameFEStatus;
        gameFEStatus.selectedCards = differenceBy(gameFEStatus.selectedCards, [card], 'cardId');
        gameFEStatus.selectedIndexes = differenceBy(gameFEStatus.selectedIndexes, [_index]);
        gameFEStatus.actualCard = null;
        gameFEStatus.selectedTargetPlayers = [];
        this.setSelectedGameEFStatus(gameFEStatus)
    }

    selectCard(card: Card, _index: number, {needGenerateActualCard}: { needGenerateActualCard?: boolean } = {}) {
        const gameFEStatus = this.gameFEStatus;
        gameFEStatus.selectedCards.push(card);
        gameFEStatus.selectedIndexes.push(_index);
        if (needGenerateActualCard) {
            gameFEStatus.actualCard = generateActualCard(gameFEStatus);
        }
        this.setSelectedGameEFStatus(gameFEStatus)
    }

}