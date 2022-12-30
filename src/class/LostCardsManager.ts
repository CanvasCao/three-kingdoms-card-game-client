import {uuidv4} from "../utils/gameStatusUtils";
import {LostCard} from "./LostCard";
import {GamingScene} from "../types/phaser";
import {
    EmitNotifyAddPublicCardData,
    EmitNotifyOwnerChangeCardData,
} from "../types/emit";
import {attachFEInfoToCard} from "../utils/cardUtils";
import {PublicLine} from "./PublicLine";
import {Card} from "../types/gameStatus";

export class LostCardsManager {
    obId: string;
    gamingScene: GamingScene;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene;

    }

    addLines(data: EmitNotifyAddPublicCardData) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        const behaviour = data.behaviour as any
        const originId = data.behaviour.originId;
        const originBoardPlayer = this.gamingScene.boardPlayers.find((p) => p.player.playerId == originId)!;
        let targetIds
        if (behaviour?.targetIds) {
            targetIds = behaviour.targetIds
        } else if (behaviour.targetId) {
            targetIds = [behaviour?.targetId]
        } else if (attachFEInfoToCard(data.behaviour?.actualCard)?.noNeedSetTargetDueToTargetAll) {
            targetIds = Object.values(gameStatus.players).filter(u => !u.isDead).map(u => u.playerId)
        }

        targetIds.forEach((targetId: string) => {
            const targetBoardPlayer = this.gamingScene.boardPlayers.find((p) => p.player.playerId == targetId)!;
            new PublicLine(this.gamingScene, {
                startPosition: originBoardPlayer.linePosition,
                endPosition: targetBoardPlayer.linePosition,
            });
        })

    }

    addPublicCard(data: EmitNotifyAddPublicCardData) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
        const cards: Card[] = data.behaviour.cards;
        cards.forEach((card, index) => {
            const originIndex = data.originIndexes ? data.originIndexes[index] : undefined;
            const originBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.behaviour.originId)!

            gameFEStatus.publicCards.push(card);
            new LostCard(this.gamingScene,
                card,
                originIndex,
                data.message,
                gameFEStatus.publicCards,
                originBoardPlayer,
                null
            )
        })

        // setGameEFStatus 是为了adjust location
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }

    addOwnerChangeCard(data: EmitNotifyOwnerChangeCardData) {
        // const targetBoardPlayer = data?.behaviour?.targetId ?
        //     this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.behaviour.targetId) :
        //     undefined;

    }
}
