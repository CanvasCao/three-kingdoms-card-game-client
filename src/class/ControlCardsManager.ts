import {getMyPlayerId, uuidv4} from "../utils/gameStatusUtils";
import intersection from 'lodash/intersection';
import differenceBy from 'lodash/differenceBy';
import {ControlCard} from "./ControlCard";
import {GamingScene} from "../types/phaser";
import {Card, GameStatus} from "../types/gameStatus";

export class ControlCardsManager {
    obId: string;
    gamingScene: GamingScene;
    _playerCards: Card[];

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this._playerCards = [];
        this.gamingScene.gameStatusObserved.addObserver(this);
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
