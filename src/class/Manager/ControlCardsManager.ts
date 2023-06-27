import { getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import intersection from 'lodash/intersection';
import differenceBy from 'lodash/differenceBy';
import {ControlCard} from "../Card/ControlCard";
import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {sizeConfig} from "../../config/sizeConfig";
import {uuidv4} from "../../utils/uuid";
import {Card} from "../../types/card";

export class ControlCardsManager {
    obId: string;
    gamingScene: GamingScene;
    _playerCards: Card[];

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this._playerCards = [];

        this.drawBackground();
        this.gamingScene.gameStatusObserved.addObserver(this);
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
