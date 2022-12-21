import {getMyUserId, uuidv4} from "../utils/utils";
import intersection from 'lodash/intersection';
import differenceBy from 'lodash/differenceBy';
import {ControlCard} from "./ControlCard";
import {PublicCard} from "./PublicCard";

export class PublicControlCardsManager {
    constructor(gamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene;
    }

    add(data) {
        // cards:[]
        // message
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        data.cards.forEach((card) => {
            gameFEStatus.publicCards.push(card);
            new PublicCard(this.gamingScene, card, data.message,gameFEStatus.publicCards);
        })

        // setGameEFStatus 是为了adjust location
        this.gamingScene.gameFEStatusObserved.setGameEFStatus(gameFEStatus)
    }
}
