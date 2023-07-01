import {GameStatus} from "../../types/gameStatus";
import {getMyPlayerId} from "../localstorage/localStorageUtils";
import {SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {GAME_STAGE, STAGE_NAMES} from "../../config/gameConfig";

const getIsMyPlayTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && STAGE_NAMES[gameStatus.stage.stageIndex] == GAME_STAGE.PLAY;
}
const getIsMyThrowTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && STAGE_NAMES[gameStatus.stage.stageIndex] == GAME_STAGE.THROW;
}
const getIsMyResponseTurn = (gameStatus: GameStatus) => {
    if (gameStatus.shanResponse) {
        return gameStatus.shanResponse.originId == getMyPlayerId();
    }
    if (gameStatus.skillResponse) {
        return gameStatus.skillResponse.playerId == getMyPlayerId();
    }
    if (gameStatus.taoResponses.length > 0) {
        return gameStatus.taoResponses[0]?.originId == getMyPlayerId();
    }
    if (gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds?.length) {
        return gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.includes(getMyPlayerId())
    }
    if (gameStatus.scrollResponses?.length > 0) {
        // 不需要判断isEffect 如果没有人想出无懈可击 锦囊肯定生效了
        return gameStatus.scrollResponses[0].originId == getMyPlayerId() &&
            ([SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN,
                SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN,
                SCROLL_CARDS_CONFIG.JUE_DOU.CN,
                SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN,
            ].includes(gameStatus.scrollResponses[0].actualCard.CN))
    }
    if (gameStatus.weaponResponses.length > 0) {
        return gameStatus.weaponResponses[0]?.originId == getMyPlayerId();
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
