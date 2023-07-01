import {cloneDeep, differenceBy} from "lodash";
import {Card} from "../../types/card";
import {GameFEStatus} from "../../types/gameFEStatus";
import {FEObserver} from "../../types/observer";
import {Player} from "../../types/player";
import {generateActualCard} from "../../utils/emitDataGenerator";

export class GameFEStatusObserved {
    originCardState: {
        selectedCards: GameFEStatus['selectedCards'],
        selectedIndexes: GameFEStatus['selectedIndexes'],
        actualCard: GameFEStatus['actualCard'],
    }
    originTargetState: {
        selectedTargetPlayers: GameFEStatus['selectedTargetPlayers'],
    }

    originSkillState: {
        selectedSkillName: GameFEStatus['selectedSkillName']
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
        }
        this.originTargetState = {
            selectedTargetPlayers: [],
        }
        this.originSkillState = {
            selectedSkillName: ""
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

    // set/reset state 会更新 window?.editor2
    resetSelectedStatus() { // reset except public cards
        this.gameFEStatus = {
            ...cloneDeep(this.gameFEStatus), // 为了保留public cards
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

    _setSelectedGameEFStatus(gameFEStatus: GameFEStatus) {
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
    unselectCard(card: Card, indexOrEqName: number | string) {
        const gameFEStatus = this.gameFEStatus;
        gameFEStatus.selectedCards = differenceBy(gameFEStatus.selectedCards, [card], 'cardId');
        gameFEStatus.selectedIndexes = differenceBy(gameFEStatus.selectedIndexes, [indexOrEqName]);
        gameFEStatus.actualCard = null;
        gameFEStatus.selectedTargetPlayers = [];
        this._setSelectedGameEFStatus(gameFEStatus)
    }

    selectCard(card: Card, indexOrEqName: number | string, {needGenerateActualCard}: { needGenerateActualCard?: boolean } = {}) {
        const gameFEStatus = this.gameFEStatus;
        gameFEStatus.selectedCards.push(card);
        gameFEStatus.selectedIndexes.push(indexOrEqName);
        if (needGenerateActualCard) {
            gameFEStatus.actualCard = generateActualCard(gameFEStatus);
        }
        this._setSelectedGameEFStatus(gameFEStatus)
    }

    unselectSkill() {
        const gameFEStatus = this.gameFEStatus;
        // @ts-ignore
        this.resetSelectedStatus()
    }

    selectSkill(skillName: string) {
        const gameFEStatus = this.gameFEStatus;
        // @ts-ignore
        gameFEStatus.selectedSkillName = skillName;
        this._setSelectedGameEFStatus(gameFEStatus)
    }

    unselectPlayer(player: Player) {
        const gameFEStatus = this.gameFEStatus;
        // @ts-ignore
        gameFEStatus.selectedTargetPlayers = differenceBy(gameFEStatus.selectedTargetPlayers, [player], 'playerIdId');
        this._setSelectedGameEFStatus(gameFEStatus);
    }

    selectPlayer(player: Player) {
        const gameFEStatus = this.gameFEStatus;
        // @ts-ignore
        gameFEStatus.selectedTargetPlayers.push(player);
        this._setSelectedGameEFStatus(gameFEStatus)
    }
}