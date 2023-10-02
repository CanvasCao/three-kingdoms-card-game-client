import {cloneDeep, differenceBy} from "lodash";
import {Card} from "../../types/card";
import {GameFEStatus} from "../../types/gameFEStatus";
import {GameStatus} from "../../types/gameStatus";
import {FEObserver} from "../../types/observer";
import {GamingScene} from "../../types/phaser";
import {Player} from "../../types/player";
import {generateActualCard} from "../../utils/emitDataGenerator";

export class GameFEStatusObserved {
    gamingScene: GamingScene;

    originCardState: {
        selectedCards: GameFEStatus['selectedCards'],
        actualCard: GameFEStatus['actualCard'],
    }
    originTargetState: {
        selectedTargetPlayers: GameFEStatus['selectedTargetPlayers'],
    }

    originSkillState: {
        selectedSkillKey: GameFEStatus['selectedSkillKey']
    }

    originPublicCardsState: {
        publicCards: GameFEStatus['publicCards']
    }

    gameFEStatus: GameFEStatus

    selectedStatusObservers: FEObserver[]
    publicCardsObservers: FEObserver[]

    constructor(gamingScene: GamingScene) {
        this.gamingScene = gamingScene

        this.originCardState = {
            selectedCards: [],
            actualCard: undefined,
        }
        this.originTargetState = {
            selectedTargetPlayers: [],
        }
        this.originSkillState = {
            selectedSkillKey: ""
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
    unselectCard(card: Card) {
        const gameFEStatus = this.gameFEStatus;
        gameFEStatus.selectedCards = differenceBy(gameFEStatus.selectedCards, [card], 'cardId');
        gameFEStatus.actualCard = undefined;
        gameFEStatus.selectedTargetPlayers = [];
        this._setSelectedGameEFStatus(gameFEStatus)
    }

    selectCard(card: Card, needGenerateActualCard: boolean, gameStatus: GameStatus) {
        const gameFEStatus = this.gameFEStatus;
        gameFEStatus.selectedCards.push(card);
        if (needGenerateActualCard) {
            gameFEStatus.actualCard = generateActualCard(gameStatus, gameFEStatus);
        }
        this._setSelectedGameEFStatus(gameFEStatus)
    }

    // Skill
    unselectSkill() {
        const gameFEStatus = this.gameFEStatus;
        // @ts-ignore
        this.resetSelectedStatus()
    }

    selectSkill(skillKey: string) {
        this.resetSelectedStatus()
        const gameFEStatus = this.gameFEStatus;
        // @ts-ignore
        gameFEStatus.selectedSkillKey = skillKey;
        this._setSelectedGameEFStatus(gameFEStatus)
    }


    // Player
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