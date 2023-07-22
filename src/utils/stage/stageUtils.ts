import {GameStatus} from "../../types/gameStatus";
import {getMyPlayerId} from "../localstorage/localStorageUtils";
import {SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {STAGE_NAME, STAGE_NAMES} from "../../config/gameConfig";
import {getResponseType} from "../response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";

const getIsMyPlayTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && STAGE_NAMES[gameStatus.stage.stageIndex] == STAGE_NAME.PLAY;
}
const getIsMyThrowTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && STAGE_NAMES[gameStatus.stage.stageIndex] == STAGE_NAME.THROW;
}

const getIsMyResponseTurn = (gameStatus: GameStatus) => {
    const responseType = getResponseType(gameStatus)

    if (responseType === RESPONSE_TYPE_CONFIG.TAO) {
        return gameStatus.taoResponses[0]?.originId == getMyPlayerId();
    }
    if (responseType === RESPONSE_TYPE_CONFIG.SHAN) {
        return gameStatus.shanResponse!.originId == getMyPlayerId();
    }
    if (responseType === RESPONSE_TYPE_CONFIG.SKILL) {
        return gameStatus.skillResponse!.playerId == getMyPlayerId();
    }
    if (responseType === RESPONSE_TYPE_CONFIG.WUXIE) {
        return gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.includes(getMyPlayerId())
    }
    if (responseType === RESPONSE_TYPE_CONFIG.WEAPON) {
        return gameStatus.weaponResponses[0]?.originId == getMyPlayerId();
    }
    if (responseType === RESPONSE_TYPE_CONFIG.SCROLL) {
        // 不需要判断isEffect 如果没有人想出无懈可击 锦囊肯定生效了
        return gameStatus.scrollResponses[0].originId == getMyPlayerId() &&
            ([SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key,
                SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.key,
                SCROLL_CARDS_CONFIG.JUE_DOU.key,
                SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key,
            ].includes(gameStatus.scrollResponses[0].actualCard.key))
    }
    return false;
}

const getCanPlayInMyTurn = (gameStatus: GameStatus) => {
    return !gameStatus.shanResponse &&
        !gameStatus.skillResponse &&
        gameStatus.taoResponses.length <= 0 &&
        gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds?.length <= 0 &&
        gameStatus.scrollResponses.length <= 0 &&
        gameStatus.weaponResponses.length <= 0 &&
        getIsMyPlayTurn(gameStatus);
}

export {
    // my turn for UI and getCanPlayInMyTurn
    getIsMyPlayTurn,

    // 我需要出牌的状态
    getIsMyResponseTurn, // response 包括闪桃无懈可击和技能 不包括弃牌
    getIsMyThrowTurn,
    getCanPlayInMyTurn
}
