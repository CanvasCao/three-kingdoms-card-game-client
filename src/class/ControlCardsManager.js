import {getMyUserId, uuidv4} from "../utils/utils";
import intersection from 'lodash/intersection';
import differenceBy from 'lodash/differenceBy';
import {ControlCard} from "./ControlCard";

export class ControlCardsManager {
    constructor(gamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this._userCards = [];
        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    gameStatusNotify(gameStatus) {
        const user = gameStatus.users[getMyUserId()];

        // const needMoveCards = intersectionBy(this.controlCards, user.cards, 'cardId');
        // const needDestoryCards = differenceBy(this.userCards, user.cards, 'cardId');
        const needNewCards = differenceBy(user.cards, this._userCards, 'cardId');
        this._userCards = user.cards;

        needNewCards.forEach((c) => {
            new ControlCard(this.gamingScene, c);
        })
    }
}
