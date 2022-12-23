import {getMyUserId, uuidv4} from "../utils/utils";
import intersection from 'lodash/intersection';
import differenceBy from 'lodash/differenceBy';
import {ControlCard} from "./ControlCard";
import {PublicCard} from "./PublicCard";
import {GamingScene} from "../types/phaser";
import {User} from "../types/gameStatus";
import {EmitPlayPublicCardData} from "../types/emit";

export class PublicControlCardsManager {
    obId: string;
    gamingScene: GamingScene;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene;
    }

    add(data: EmitPlayPublicCardData) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        data.cards.forEach((card) => {
            gameFEStatus.publicCards.push(card);
            new PublicCard(this.gamingScene, card, data.message, gameFEStatus.publicCards);
        })

        // setGameEFStatus 是为了adjust location
        this.gamingScene.gameFEStatusObserved.setGameEFStatus(gameFEStatus)
    }
}
