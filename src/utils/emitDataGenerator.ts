import {GameStatus, Player} from "../types/gameStatus";
import {EmitActionData, EmitResponseData, EmitThrowData} from "../types/emit";
import {attachFEInfoToCard} from "./cardUtils";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {GameFEStatus} from "../types/gameFEStatus";
import {getMyResponseInfo} from "./stageUtils";
import {getIsZhangBaSheMaoSelected} from "./weaponUtils";
import {uuidv4} from "./uuid";

const generateAction = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): (EmitActionData | undefined) => {
    const actualCard = JSON.parse(JSON.stringify(gameFEStatus.actualCard))
    const actualCardWithFEInfo = attachFEInfoToCard(actualCard)!;

    if (actualCardWithFEInfo.couldHaveMultiTarget || actualCardWithFEInfo.needAActionToB) {
        return {
            cards: gameFEStatus.selectedCards,
            selectedIndexes: gameFEStatus.selectedIndexes,
            actualCard,
            originId: getMyPlayerId(),
            targetIds: gameFEStatus.selectedTargetPlayers.map((targetPlayer: Player) => targetPlayer.playerId)
        }
    } else if (actualCardWithFEInfo.noNeedSetTargetDueToImDefaultTarget) {
        return {
            cards: gameFEStatus.selectedCards,
            selectedIndexes: gameFEStatus.selectedIndexes,
            actualCard,
            originId: getMyPlayerId(),
            targetId: getMyPlayerId(),
        }
    } else if (actualCardWithFEInfo.canOnlyHaveOneTarget) {
        return {
            cards: gameFEStatus.selectedCards,
            selectedIndexes: gameFEStatus.selectedIndexes,
            actualCard,
            originId: getMyPlayerId(),
            targetId: gameFEStatus.selectedTargetPlayers[0].playerId,
        }
    } else if (actualCardWithFEInfo.noNeedSetTargetDueToTargetAll) {
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
        actualCard: gameFEStatus.actualCard!,
        originId: getMyPlayerId(),
        targetId: info.targetId,
        wuxieTargetCardId: info.wuxieTargetCardId
    }
}

const generateThrowData = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): EmitThrowData => {
    return {cards: gameFEStatus.selectedCards, selectedIndexes: gameFEStatus.selectedIndexes}
}

const generateActualCard = (gameFEStatus: GameFEStatus) => {
    if (getIsZhangBaSheMaoSelected(gameFEStatus)) {
        return {
            "huase": gameFEStatus.selectedCards[0].huase,
            "huase2": gameFEStatus.selectedCards[1].huase,
            "cardId": uuidv4(),
            "CN": "杀",
            "EN": "Strike",
            "type": "BASIC",
        }
    } else {
        const card = JSON.parse(JSON.stringify(gameFEStatus.selectedCards[0]))
        card.cardId = uuidv4()
        return card
    }
}

export {
    generateAction,
    generateResponse,
    generateThrowData,
    generateActualCard
}
