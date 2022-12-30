import {getMyPlayerId, uuidv4} from "../utils/gameStatusUtils";
import {LostCard} from "./LostCard";
import {GamingScene} from "../types/phaser";
import {
    EmitNotifyAddPublicCardData,
    EmitNotifyOwnerChangeCardData,
} from "../types/emit";
import {attachFEInfoToCard, getIsCardFaceFrontByCardAreaType} from "../utils/cardUtils";
import {PublicLine} from "./PublicLine";
import {Card} from "../types/gameStatus";

export class LostCardsManager {
    // obId: string;
    gamingScene: GamingScene;

    constructor(gamingScene: GamingScene) {
        // this.obId = uuidv4();
        this.gamingScene = gamingScene;

    }

    addLines(data: EmitNotifyAddPublicCardData) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;


        const fromId = data.fromId;
        const fromBoardPlayer = this.gamingScene.boardPlayers.find((p) => p.player.playerId == fromId)!;
        // let targetIds
        // if (behaviour?.targetIds) {
        //     targetIds = behaviour.targetIds
        // } else if (behaviour.targetId) {
        //     targetIds = [behaviour?.targetId]
        // } else if (attachFEInfoToCard(data?.actualCard)?.noNeedSetTargetDueToTargetAll) {
        //     targetIds = Object.values(gameStatus.players).filter(u => !u.isDead).map(u => u.playerId)
        // }
        //
        // targetIds.forEach((targetId: string) => {
        //     const targetBoardPlayer = this.gamingScene.boardPlayers.find((p) => p.player.playerId == targetId)!;
        //     new PublicLine(this.gamingScene, {
        //         startPosition: fromBoardPlayer.linePosition,
        //         endPosition: targetBoardPlayer.linePosition,
        //     });
        // })

    }

    addPublicCard(data: EmitNotifyAddPublicCardData) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
        data.cards.forEach((card, index) => {
            const originIndex = data.originIndexes ? data.originIndexes[index] : undefined;
            const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.fromId)
            // toBoardPlayer undefined 就是toPublic Card
            new LostCard(this.gamingScene,
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
            const originIndex = data.originIndexes[index];
            const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.fromId)!
            const toBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.toId)!

            // 到myPlayer的逻辑在ControlCard
            if (toBoardPlayer.player.playerId == getMyPlayerId()) {
                return
            }

            let isFaceFront = getIsCardFaceFrontByCardAreaType(data.cardAreaType, data.fromId, data.toId)

            new LostCard(this.gamingScene,
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
