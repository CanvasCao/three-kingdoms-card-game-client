import {GameStatus} from "../../types/gameStatus";
import {RESPONSE_TYPE_CONFIG, RESPONSE_TYPE_CONFIG_VALUES} from "../../config/responseTypeConfig";

const getResponseType = (gameStatus: GameStatus): RESPONSE_TYPE_CONFIG_VALUES | undefined => {
    if (gameStatus.taoResponses.length > 0) {
        return RESPONSE_TYPE_CONFIG.TAO;
    } else if (gameStatus.cardResponse) {
        return RESPONSE_TYPE_CONFIG.CARD;
    } else if (gameStatus.skillResponse) {
        return RESPONSE_TYPE_CONFIG.SKILL;
    } else if (gameStatus.cardBoardResponses.length > 0) {
        return RESPONSE_TYPE_CONFIG.CARD_BOARD;
    } else if (gameStatus.fanjianBoardResponse) {
        return RESPONSE_TYPE_CONFIG.FAN_JIAN_BOARD;
    } else if (gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds?.length > 0) {
        return RESPONSE_TYPE_CONFIG.WUXIE;
    } else if (gameStatus.scrollResponses.length > 0) {
        return RESPONSE_TYPE_CONFIG.SCROLL;
    }
}

const getWuxieTargetCardId = (gameStatus: GameStatus) => {
    const responseType = getResponseType(gameStatus)
    if (responseType == RESPONSE_TYPE_CONFIG.WUXIE) {
        const wuxieChain = gameStatus.wuxieSimultaneousResponse.wuxieChain
        const lastChainItem = wuxieChain[wuxieChain.length - 1]
        return lastChainItem.actualCard.cardId// 为了校验无懈可击是否冲突
    }
}

export {
    getResponseType,
    getWuxieTargetCardId
};