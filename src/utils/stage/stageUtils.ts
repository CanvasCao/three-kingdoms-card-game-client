import {GameStatus} from "../../types/gameStatus";
import {getMyPlayerId} from "../localstorage/localStorageUtils";
import {SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {STAGE_NAME} from "../../config/gameConfig";
import {getResponseType} from "../response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";
import {getCurrentPlayer} from "../playerUtils";

const getIsMyPlayTurn = (gameStatus: GameStatus) => {
    return getCurrentPlayer(gameStatus)?.playerId == getMyPlayerId() && gameStatus.stage.stageName == STAGE_NAME.PLAY;
}
const getIsMyThrowTurn = (gameStatus: GameStatus) => {
    return getCurrentPlayer(gameStatus)?.playerId == getMyPlayerId() && gameStatus.stage.stageName == STAGE_NAME.THROW;
}

const getIsMyResponseCardOrSkillTurn = (gameStatus: GameStatus) => {
    const responseType = getResponseType(gameStatus)

    if (responseType === RESPONSE_TYPE_CONFIG.TAO) {
        return gameStatus.taoResponses[0]?.originId == getMyPlayerId();
    }
    if (responseType === RESPONSE_TYPE_CONFIG.CARD) {
        return gameStatus.cardResponse!.originId == getMyPlayerId();
    }
    if (responseType === RESPONSE_TYPE_CONFIG.SKILL) {
        return gameStatus.skillResponse!.playerId == getMyPlayerId();
    }
    if (responseType === RESPONSE_TYPE_CONFIG.WUXIE) {
        return gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.includes(getMyPlayerId())
    }
    return false;
}

const getCanPlayInMyTurn = (gameStatus: GameStatus) => {
    return !gameStatus.cardResponse &&
        !gameStatus.skillResponse &&
        gameStatus.taoResponses.length <= 0 &&
        gameStatus.cardBoardResponses.length <= 0 &&
        !gameStatus.fanjianBoardResponse &&
        gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds?.length <= 0 &&
        gameStatus.scrollStorages.length <= 0 &&
        getIsMyPlayTurn(gameStatus);
}

export {
    getIsMyPlayTurn,
    getCanPlayInMyTurn,
    getIsMyResponseCardOrSkillTurn,
    getIsMyThrowTurn,

}
