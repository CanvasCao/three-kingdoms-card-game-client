import {getMyUserId, uuidv4} from "../utils/gameStatusUtils";
import {PublicCard} from "./PublicCard";
import {GamingScene} from "../types/phaser";
import {EmitPlayPublicCardData} from "../types/emit";
import {attachFEInfoToCard} from "../utils/cardUtils";
import {PublicLine} from "./PublicLine";

export class PublicControlCardsManager {
    obId: string;
    gamingScene: GamingScene;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene;
    }

    add(data: EmitPlayPublicCardData) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        const card = attachFEInfoToCard(data.behaviour.actualCard);
        const behaviour = data.behaviour as any
        const originId = data.behaviour.originId;
        const originCanvasPlayer = this.gamingScene.players.find((p) => p.user.userId == originId)!;
        let targetIds
        if (behaviour?.targetIds) {
            targetIds = behaviour.targetIds
        } else if (behaviour.targetId) {
            targetIds = [behaviour?.targetId]
        } else if (card.noNeedSetTargetDueToTargetAll) {
            targetIds = Object.values(gameStatus.users).filter(u => !u.isDead).map(u => u.userId)
        }

        targetIds.forEach((targetId: string) => {
            const targetCanvasPlayer = this.gamingScene.players.find((p) => p.user.userId == targetId)!;

            new PublicLine(this.gamingScene, {
                startX: originCanvasPlayer.playerX,
                startY: originCanvasPlayer.playerY,
                endX: targetCanvasPlayer.playerX,
                endY: targetCanvasPlayer.playerY,
            });
        })


        data.behaviour.cards.forEach((card) => {
            gameFEStatus.publicCards.push(card);
            new PublicCard(this.gamingScene, card, data.message, gameFEStatus.publicCards);
        })

        // setGameEFStatus 是为了adjust location
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }
}
