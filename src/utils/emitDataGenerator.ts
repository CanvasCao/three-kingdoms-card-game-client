import {GameStatus} from "../types/gameStatus";
import {EmitActionData, EmitResponseData, EmitThrowData} from "../types/emit";
import {attachFEInfoToCard} from "./cardUtils";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {GameFEStatus} from "../types/gameFEStatus";
import {getIsZhangBaSheMaoSelected} from "./weaponUtils";
import {uuidv4} from "./uuid";
import {Player} from "../types/player";
import {BasicCardResponseInfo, SkillResponseInfo, WuXieResponseInfo} from "../types/responseInfo";
import {CARD_CONFIG} from "../config/cardConfig";
import {getMyResponseInfo} from "./response/responseUtils";

const generateAction = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): (EmitActionData | undefined) => {
    const actualCard = JSON.parse(JSON.stringify(gameFEStatus.actualCard))
    const actualCardWithFEInfo = attachFEInfoToCard(actualCard)!;

    if (actualCardWithFEInfo.couldHaveMultiTarget || actualCardWithFEInfo.needAActionToB) {
        return {
            cards: gameFEStatus.selectedCards,
            actualCard,
            originId: getMyPlayerId(),
            targetIds: gameFEStatus.selectedTargetPlayers.map((targetPlayer: Player) => targetPlayer.playerId)
        }
    } else if (actualCardWithFEInfo.noNeedSetTargetDueToImDefaultTarget) {
        return {
            cards: gameFEStatus.selectedCards,
            actualCard,
            originId: getMyPlayerId(),
            targetId: getMyPlayerId(),
        }
    } else if (actualCardWithFEInfo.canOnlyHaveOneTarget) {
        return {
            cards: gameFEStatus.selectedCards,
            actualCard,
            originId: getMyPlayerId(),
            targetId: gameFEStatus.selectedTargetPlayers[0].playerId,
        }
    } else if (actualCardWithFEInfo.noNeedSetTargetDueToTargetAll) {
        return {
            cards: gameFEStatus.selectedCards,
            actualCard,
            originId: getMyPlayerId(),
        }
    }
}

const generateNoResponse = () => {
    return {
        originId: getMyPlayerId(),
        chooseToResponse: false
    }
}

const generateYesResponse = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): EmitResponseData => {
    const info = getMyResponseInfo(gameStatus, gameFEStatus)

    return {
        chooseToResponse: true,
        cards: gameFEStatus.selectedCards,
        actualCard: gameFEStatus.actualCard!,
        originId: getMyPlayerId(),
        targetId: (info as BasicCardResponseInfo).targetId,
        wuxieTargetCardId: (info as WuXieResponseInfo)?.wuxieTargetCardId,
        skillTargetIds: (info as SkillResponseInfo)?.skillTargetIds
    }
}

const generateThrowData = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): EmitThrowData => {
    return {cards: gameFEStatus.selectedCards, playerId: getMyPlayerId()}
}

const generateActualCard = (gameFEStatus: GameFEStatus) => {
    if (getIsZhangBaSheMaoSelected(gameFEStatus)) {
        return {
            huase: gameFEStatus.selectedCards[0].huase,
            huase2: gameFEStatus.selectedCards[1].huase,
            cardId: uuidv4(),
            key: CARD_CONFIG.SHA.key,
        }
    } else {
        const card = JSON.parse(JSON.stringify(gameFEStatus.selectedCards[0]))
        card.cardId = uuidv4()
        return card
    }
}

export {
    generateAction,
    generateNoResponse,
    generateYesResponse,
    generateThrowData,
    generateActualCard
}
