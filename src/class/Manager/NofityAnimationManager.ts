import {getMyPlayerId} from "../../utils/gameStatusUtils";
import {ToPublicCard} from "../Card/ToPublicCard";
import {GamingScene} from "../../types/phaser";
import {
    EmitNotifyAddLinesData,
    EmitNotifyAddToPublicCardData,
    EmitNotifyAddToPlayerCardData,
} from "../../types/emit";
import {attachFEInfoToCard, getIfToPlayerCardFaceFront} from "../../utils/cardUtils";
import {PublicLine} from "../Line/PublicLine";

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

    addToPublicCard(data: EmitNotifyAddToPublicCardData) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
        data.cards.forEach((card, index) => {
            const originIndex = data.originIndexes ? data.originIndexes[index] : undefined;
            const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.fromId)
            gameFEStatus.publicCards.push(card)

            new ToPublicCard(
                this.gamingScene,
                card,
                data.message,
                gameFEStatus.publicCards,
                fromBoardPlayer,
                originIndex,
            )
        })

        // setGameEFStatus 是为了ToPublicCard adjustLocation
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }

    addToPlayerCard(data: EmitNotifyAddToPlayerCardData) {
    //     const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
    //
    //     data.cards.forEach((card, index) => {
    //         const originIndex = data.originIndexes?.[index] || 0;
    //         const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.fromId)
    //         const toBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.toId)
    //
    //         // 到myPlayer的逻辑在ControlCard
    //         if (toBoardPlayer?.player.playerId == getMyPlayerId()) {
    //             return
    //         }
    //
    //         let isFaceFront = getIfToPlayerCardFaceFront(data.cardAreaType, data.fromId, data.toId)
    //
    //         new ToPublicCard(
    //             this.gamingScene,
    //             card,
    //             isFaceFront,
    //             data.message,
    //             originIndex,
    //             gameFEStatus.publicCards,
    //             fromBoardPlayer,
    //             toBoardPlayer,
    //         )
    //     })
    }
}
