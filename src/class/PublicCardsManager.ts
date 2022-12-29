import {uuidv4} from "../utils/gameStatusUtils";
import {PublicCard} from "./PublicCard";
import {GamingScene} from "../types/phaser";
import {EmitPlayBehaviorPublicCardData, EmitPlayNonBehaviorPublicCardData} from "../types/emit";
import {attachFEInfoToCard} from "../utils/cardUtils";
import {PublicLine} from "./PublicLine";

export class PublicControlCardsManager {
    obId: string;
    gamingScene: GamingScene;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene;
    }

    addLines(data: EmitPlayBehaviorPublicCardData) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        const behaviour = data.behaviour as any
        const originId = data.behaviour.originId;
        const originCanvasPlayer = this.gamingScene.players.find((p) => p.player.playerId == originId)!;
        let targetIds
        if (behaviour?.targetIds) {
            targetIds = behaviour.targetIds
        } else if (behaviour.targetId) {
            targetIds = [behaviour?.targetId]
        } else if (attachFEInfoToCard(data.behaviour?.actualCard)?.noNeedSetTargetDueToTargetAll) {
            targetIds = Object.values(gameStatus.players).filter(u => !u.isDead).map(u => u.playerId)
        }

        targetIds.forEach((targetId: string) => {
            const targetCanvasPlayer = this.gamingScene.players.find((p) => p.player.playerId == targetId)!;
            new PublicLine(this.gamingScene, {
                startPosition: originCanvasPlayer.linePosition,
                endPosition: targetCanvasPlayer.linePosition,
            });
        })

    }

    addPublicCard(data: EmitPlayBehaviorPublicCardData | EmitPlayNonBehaviorPublicCardData) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        // @ts-ignore
        const cards: Card[] = data.behaviour ? data.behaviour.cards : data.cards;
        cards.forEach((card) => {
            gameFEStatus.publicCards.push(card);
            new PublicCard(this.gamingScene, card, data.message, gameFEStatus.publicCards);
        })

        // setGameEFStatus 是为了adjust location
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }
}
