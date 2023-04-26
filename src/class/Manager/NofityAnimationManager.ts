import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {ToPublicCard} from "../Card/ToPublicCard";
import {GamingScene} from "../../types/phaser";
import {
    EmitNotifyAddLinesData,
    EmitNotifyAddToPublicCardData,
    EmitNotifyAddToPlayerCardData,
} from "../../types/emit";
import {attachFEInfoToCard, generatePublicCardMessage, getIfToPlayerCardFaceFront} from "../../utils/cardUtils";
import {PublicLine} from "../Line/PublicLine";
import {ToPlayerCard} from "../Card/ToPlayerCard";
import {Card} from "../../types/gameStatus";

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
        let toIds = data.toIds || [];

        //借刀杀人 貂蝉决斗
        if (toIds && attachFEInfoToCard(data?.actualCard)?.needAActionToB) {
            const targetBoardPlayer1 = this.gamingScene.boardPlayers.find((p) => p.player.playerId == toIds[0])!;
            const targetBoardPlayer2 = this.gamingScene.boardPlayers.find((p) => p.player.playerId == toIds[1])!;

            new PublicLine(this.gamingScene, {
                startPosition: fromBoardPlayer.linePosition,
                endPosition: targetBoardPlayer1.linePosition,
            });
            setTimeout(() => {
                new PublicLine(this.gamingScene, {
                    startPosition: targetBoardPlayer1.linePosition,
                    endPosition: targetBoardPlayer2.linePosition,
                });
            }, 400)
            return
        }

        // AOE
        if (attachFEInfoToCard(data?.actualCard)?.noNeedSetTargetDueToTargetAll) {
            toIds = Object.values(gameStatus.players).filter(u => !u.isDead).map(u => u.playerId)
        }
        // 其他正确指定目标的情况
        toIds.forEach((toId: string) => {
            const targetBoardPlayer = this.gamingScene.boardPlayers.find((p) => p.player.playerId == toId)!;
            new PublicLine(this.gamingScene, {
                startPosition: fromBoardPlayer.linePosition,
                endPosition: targetBoardPlayer.linePosition,
            });
        })
    }

    addToPublicCard(data: EmitNotifyAddToPublicCardData) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
        const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.fromId)
        let cardsWithOrder: { card: Card, originIndex: number }[] = []
        data.cards.forEach((card, index) => {
            const originIndex = data.originIndexes ? data.originIndexes[index] : 0;
            cardsWithOrder.push({card, originIndex})
        })

        cardsWithOrder = cardsWithOrder.sort((a, b) => {
            return a.originIndex - b.originIndex
        })

        const message = generatePublicCardMessage(gameStatus, data);
        cardsWithOrder.forEach(({card, originIndex}) => {
            gameFEStatus.publicCards.push(card)
            new ToPublicCard(
                this.gamingScene,
                card,
                message,
                gameFEStatus.publicCards,
                fromBoardPlayer,
                originIndex,
            )
        })

        // setGameEFStatus 是为了ToPublicCard adjustLocation
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }

    addToPlayerCard(data: EmitNotifyAddToPlayerCardData) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        // 到别人手里 需要叠起来移动
        // 到自己手里需要一张一张移动
        const toBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.toId)
        // 但是到自己手里的逻辑在ControlCard
        if (toBoardPlayer?.player?.playerId == getMyPlayerId()) {
            return
        }

        // 从自己手里给出去需要一张一张给
        const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.player.playerId == data.fromId)
        if (fromBoardPlayer?.player?.playerId == getMyPlayerId()) {
            data.cards.forEach((card, index) => {
                const originIndex = data.originIndexes?.[index] || 0;
                new ToPlayerCard(
                    this.gamingScene,
                    card,
                    true,
                    originIndex,
                    fromBoardPlayer,
                    toBoardPlayer,
                )
            })
        } else {
            let isFaceFront = getIfToPlayerCardFaceFront(data.cardAreaType, data.fromId, data.toId)
            new ToPlayerCard(
                this.gamingScene,
                data.cards[0],
                isFaceFront,
                undefined,
                fromBoardPlayer,
                toBoardPlayer,
                data.cards.length
            )
        }
    }
}
