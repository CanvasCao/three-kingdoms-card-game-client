import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {ToPublicCard} from "../Card/ToPublicCard";
import {GamingScene} from "../../types/phaser";
import {
    EmitNotifyAddLinesData,
    EmitNotifyAddToPublicCardData,
    EmitNotifyAddToPlayerCardData,
} from "../../types/emit";
import {attachFEInfoToCard, generatePublicCardMessage, getIsToOtherPlayerCardFaceFront} from "../../utils/cardUtils";
import {PublicLine} from "../Line/PublicLine";
import {ToPlayerCard} from "../Card/ToPlayerCard";
import {Card} from "../../types/card";
import {cardDuration} from "../../config/animationConfig";
import {uuidv4} from "../../utils/uuid";
import {SCROLL_CARDS_CONFIG} from "../../config/cardConfig";

export class NofityAnimationManager {
    // obId: string;
    gamingScene: GamingScene;

    constructor(gamingScene: GamingScene) {
        // this.obId = uuidv4();
        this.gamingScene = gamingScene;

    }

    addLines(data: EmitNotifyAddLinesData) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;

        const fromId = data.fromId;
        const actualCard = data.actualCard;
        const fromBoardPlayer = this.gamingScene.boardPlayers.find((p) => p.playerId == fromId)!;
        let toIds = data.toIds || [];

        // 借刀杀人
        if (actualCard?.key == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key) {
            const targetBoardPlayer1 = this.gamingScene.boardPlayers.find((p) => p.playerId == toIds[0])!;
            const targetBoardPlayer2 = this.gamingScene.boardPlayers.find((p) => p.playerId == toIds[1])!;

            new PublicLine(this.gamingScene, {
                startPosition: fromBoardPlayer.linePosition,
                endPosition: targetBoardPlayer1.linePosition,
            });
            setTimeout(() => {
                new PublicLine(this.gamingScene, {
                    startPosition: targetBoardPlayer1.linePosition,
                    endPosition: targetBoardPlayer2.linePosition,
                });
            }, cardDuration)
        }
        // AOE
        else if (actualCard && attachFEInfoToCard(actualCard)?.noNeedSetTargetDueToTargetAll) {
            toIds = Object.values(gameStatus.players).filter(player => !player.isDead).map(player => player.playerId)
        } else {
            // 其他正确指定目标的情况
            toIds.forEach((toId: string) => {
                const targetBoardPlayer = this.gamingScene.boardPlayers.find((p) => p.playerId == toId)!;
                new PublicLine(this.gamingScene, {
                    startPosition: fromBoardPlayer.linePosition,
                    endPosition: targetBoardPlayer.linePosition,
                });
            })
        }
    }

    addToPublicCard(data: EmitNotifyAddToPublicCardData) {
        const prevGameStatus = this.gamingScene.gameStatusObserved.prev_gameStatus!;
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;

        const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.playerId == data.fromId)
        const isMe = fromBoardPlayer?.playerId === getMyPlayerId()
        let handCardsWithOrder: { card: Card, originIndex: number }[] = [] // 只有我打出的牌才需要Card with order

        if (isMe) {
            data.cards.forEach((card) => {
                const originIndex = prevGameStatus.players[getMyPlayerId()].cards.findIndex((prev_card) => prev_card.cardId === card.cardId)
                handCardsWithOrder.push({card, originIndex})
                handCardsWithOrder = handCardsWithOrder.sort((a, b) => a.originIndex - b.originIndex)
            })
        } else {
            handCardsWithOrder = data.cards.map((card) => {
                return {card, originIndex: -1} // 别人的牌originIndex -1
            })
        }

        const message = generatePublicCardMessage(gameStatus, data);

        handCardsWithOrder.forEach(({card, originIndex}) => {
            card.cardId = uuidv4(); // 为了防止 关羽装备武器再打出武器 会在ToPublicCard只显示成一张

            gameFEStatus.publicCards.push(card)

            new ToPublicCard(
                this.gamingScene,
                card,
                message,
                gameFEStatus.publicCards, // 为了计算初始位置
                fromBoardPlayer,
                originIndex,
            )
        })

        // 为了 adjustLocation
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }

    addToPlayerCard(data: EmitNotifyAddToPlayerCardData) {
        const prevGameStatus = this.gamingScene.gameStatusObserved.prev_gameStatus!;

        // 到别人手里 需要叠起来移动
        // 到自己手里需要一张一张移动
        const toBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.playerId == data.toId)
        // 但是到自己手里的逻辑在ControlCard
        if (toBoardPlayer?.playerId == getMyPlayerId()) {
            return
        }

        // 从自己手里给出去需要一张一张给 因为手里的牌不一定连在一起
        const fromBoardPlayer = this.gamingScene.boardPlayers.find((bp) => bp.playerId == data.fromId)
        if (fromBoardPlayer?.playerId == getMyPlayerId()) {
            data.cards.forEach((card, index) => {
                const originIndex = prevGameStatus.players[getMyPlayerId()].cards.findIndex((prev_card) => prev_card.cardId === card.cardId)

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
            let isFaceFront = getIsToOtherPlayerCardFaceFront(data.fromId, data.toId, data.isPublic)
            new ToPlayerCard(
                this.gamingScene,
                data.cards[0],
                isFaceFront,
                -1,
                fromBoardPlayer,
                toBoardPlayer,
                data.cards.length
            )
        }
    }
}
