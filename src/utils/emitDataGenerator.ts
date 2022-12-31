import {GameStatus, Player} from "../types/gameStatus";
import {EmitActionData, EmitResponseData, EmitThrowData} from "../types/emit";
import {attachFEInfoToCard} from "./cardUtils";
import {getMyPlayerId, getMyResponseInfo, uuidv4} from "./gameStatusUtils";
import {GameFEStatus} from "../types/gameFEStatus";

const generateAction = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): (EmitActionData | undefined) => {
    const actualCard = attachFEInfoToCard(JSON.parse(JSON.stringify(gameFEStatus.actualCard)))!;
    actualCard.cardId = uuidv4(); // TODO 作为前端判断要不要重新计算和刷新disable的依据

    if (actualCard.couldHaveMultiTarget || actualCard.needAActionToB) {
        return {
            cards: gameFEStatus.selectedCards,
            selectedIndexes: gameFEStatus.selectedIndexes,
            actualCard,
            originId: getMyPlayerId(),
            targetIds: gameFEStatus.selectedTargetPlayers.map((targetPlayer: Player) => targetPlayer.playerId)
        }
    } else if (actualCard.noNeedSetTargetDueToImDefaultTarget) {
        return {
            cards: gameFEStatus.selectedCards,
            selectedIndexes: gameFEStatus.selectedIndexes,
            actualCard,
            originId: getMyPlayerId(),
            targetId: getMyPlayerId(),
        }
    } else if (actualCard.canOnlyHaveOneTarget) {
        return {
            cards: gameFEStatus.selectedCards,
            selectedIndexes: gameFEStatus.selectedIndexes,
            actualCard,
            originId: getMyPlayerId(),
            targetId: gameFEStatus.selectedTargetPlayers[0].playerId,
        }
    } else if (actualCard.noNeedSetTargetDueToTargetAll) {
        return {
            cards: gameFEStatus.selectedCards,
            selectedIndexes: gameFEStatus.selectedIndexes,
            actualCard,
            originId: getMyPlayerId(),
        }
    }
}


const generateResponse = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): EmitResponseData => {
    const info = getMyResponseInfo(gameStatus)!

    return {
        cards: gameFEStatus.selectedCards,
        selectedIndexes: gameFEStatus.selectedIndexes,
        actualCard: gameFEStatus.selectedCards[0],
        originId: getMyPlayerId(),
        targetId: info.targetId,
        wuxieTargetCardId: info.wuxieTargetCardId
    }
}

const generateThrowData = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): EmitThrowData => {
    return {cards: gameFEStatus.selectedCards, selectedIndexes: gameFEStatus.selectedIndexes}
}

export {
    generateAction,
    generateResponse,
    generateThrowData
}