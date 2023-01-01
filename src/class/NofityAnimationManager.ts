import {getMyPlayerId} from "../utils/gameStatusUtils";
import {LostCard} from "./LostCard";
import {GamingScene} from "../types/phaser";
import {
    EmitNotifyAddLinesData,
    EmitNotifyAddPublicCardData,
    EmitNotifyOwnerChangeCardData,
} from "../types/emit";
import {attachFEInfoToCard, getIsCardFaceFrontByCardAreaType} from "../utils/cardUtils";
import {PublicLine} from "./PublicLine";

export class NofityAnimationManager {
    // obId: string;
    gamingScene: GamingScene;

    constructor(gamingScene: GamingScene) {
        // this.obId = uuidv4();
        this.gamingScene = gamingScene;

    }

    addLines(data: EmitNotifyAddLinesData) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        const fromId = data.fromId;
        const fromBoardPlayer = this.gamingScene.boardPlayers.find((p) => p.player.playerId == fromId)!;
        let toIds = data.toIds;
        if (toIds) {
        } else if (!toIds && attachFEInfoToCard(data?.actualCard)?.noNeedSetTargetDueToTargetAll) {
            toIds = Object.values(gameStatus.players).filter(u => !u.isDead).map(u => u.playerId)
        } else {
            toIds = []
        }
        toIds.forEach((toId: string) => {
            const targetBoardPlayer = this.gamingScene.boardPlayers.find((p) => p.player.playerId == toId)!;
            new PublicLine(this.gamingScene, {
                startPosition: fromBoardPlayer.linePosition,
                endPosition: targetBoardPlayer.linePosition,
            });
        })
    }

    addPublicCard(data: EmitNotifyAddPublicCardData) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
        data.cards.forEach((card, index) => {
            const originIndex = data.originIndexes ? data.originIndexes[index] : undefined;
            const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.fromId)
            gameFEStatus.publicCards.push(card)

            // toBoardPlayer undefined 就是toPublic Card
            new LostCard(
                this.gamingScene,
                card,
                true,
                data.message,
                originIndex,
                gameFEStatus.publicCards,
                fromBoardPlayer,
                undefined,
            )
        })

        // setGameEFStatus 是为了LostCard adjustLocation
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }

    addOwnerChangeCard(data: EmitNotifyOwnerChangeCardData) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        data.cards.forEach((card, index) => {
            const originIndex = data.originIndexes?.[index] || 0;
            const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.fromId)
            const toBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.toId)

            // 到myPlayer的逻辑在ControlCard
            if (toBoardPlayer?.player.playerId == getMyPlayerId()) {
                return
            }

            let isFaceFront = getIsCardFaceFrontByCardAreaType(data.cardAreaType, data.fromId, data.toId)

            new LostCard(
                this.gamingScene,
                card,
                isFaceFront,
                data.message,
                originIndex,
                gameFEStatus.publicCards,
                fromBoardPlayer,
                toBoardPlayer,
            )
        })
    }
}
