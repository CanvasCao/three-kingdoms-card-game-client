import {getMyPlayerId, uuidv4} from "../../utils/gameStatusUtils";
import intersection from 'lodash/intersection';
import differenceBy from 'lodash/differenceBy';
import {ControlCard} from "../Card/ControlCard";
import {GamingScene} from "../../types/phaser";
import {Card, GameStatus} from "../../types/gameStatus";
import {sizeConfig} from "../../config/sizeConfig";
import {ControlEquipmentCard} from "../Card/ControlEquipmentCard";
import {EQUIPMENT_TYPE} from "../../config/cardConfig";

export class ControlCardsManager {
    obId: string;
    gamingScene: GamingScene;
    _playerCards: Card[];

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this._playerCards = [];

        this.drawBackground();
        this.drawEqupmentCards();
        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawEqupmentCards() {
        new ControlEquipmentCard(this.gamingScene, EQUIPMENT_TYPE.WEAPON);
        new ControlEquipmentCard(this.gamingScene, EQUIPMENT_TYPE.SHIELD);
        new ControlEquipmentCard(this.gamingScene, EQUIPMENT_TYPE.PLUS_HORSE);
        new ControlEquipmentCard(this.gamingScene, EQUIPMENT_TYPE.MINUS_HORSE);
    }

    drawBackground() {
        const bgHeight = sizeConfig.controlCard.height + sizeConfig.controlCardBgMargin * 2
        const maskImg = this.gamingScene.add.image(0, sizeConfig.background.height - bgHeight, 'white')
        maskImg.displayHeight = bgHeight;
        maskImg.displayWidth = sizeConfig.background.width;
        // @ts-ignore
        maskImg.setTint("#000")
        maskImg.setAlpha(0.4)
        maskImg.setOrigin(0, 0)
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const player = gameStatus.players[getMyPlayerId()];

        // const needMoveCards = intersectionBy(this.controlCards, player.cards, 'cardId');
        // const needDestoryCards = differenceBy(this.playerCards, player.cards, 'cardId');
        const needNewCards = differenceBy(player.cards, this._playerCards, 'cardId');
        this._playerCards = player.cards;

        needNewCards.forEach((card) => {
            new ControlCard(this.gamingScene, card);
        })
    }
}
