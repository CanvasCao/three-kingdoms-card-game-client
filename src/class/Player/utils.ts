import {GameStatus} from "../../types/gameStatus";
import {
    BASIC_CARDS_CONFIG,
    SCROLL_CARDS_CONFIG
} from "../../config/cardConfig";
import {getCurrentPlayer} from "../../utils/playerUtils";
import {getResponseType} from "../../utils/response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";
import {GAME_STAGE, STAGE_NAMES} from "../../config/gameConfig";

const getBoardPlayerThinkHint = (gameStatus: GameStatus, playerId: string) => {
    const responseType = getResponseType(gameStatus);
    const currentPlayer = getCurrentPlayer(gameStatus)
    const preText = "正在思考 "
    let hintText = '';

    if (responseType) {
        switch (responseType) {
            case RESPONSE_TYPE_CONFIG.TAO:
                if (gameStatus.taoResponses[0].originId == playerId) {
                    hintText = BASIC_CARDS_CONFIG.TAO.CN;
                }
                break;
            case  RESPONSE_TYPE_CONFIG.SHAN:
                if (gameStatus.shanResponse!.originId == playerId) {
                    hintText = BASIC_CARDS_CONFIG.SHAN.CN;
                }
                break;
            case  RESPONSE_TYPE_CONFIG.SKILL:
                if (gameStatus.skillResponse!.playerId == playerId) {
                    hintText = gameStatus.skillResponse?.skillName!
                }
                break;
            case RESPONSE_TYPE_CONFIG.WUXIE:
                if (gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.length) {
                    hintText = SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN
                }
                break;
            case RESPONSE_TYPE_CONFIG.WEAPON:
                if (gameStatus.weaponResponses[0].originId == playerId) {
                    hintText = gameStatus.weaponResponses[0].weaponCardName
                }
                break;
            case RESPONSE_TYPE_CONFIG.SCROLL:
                const curScrollResponse = gameStatus.scrollResponses[0]
                if (curScrollResponse.originId == playerId) {
                    hintText = curScrollResponse.actualCard.CN
                }
                break;
        }
    } else if (STAGE_NAMES[gameStatus.stage.stageIndex] === GAME_STAGE.PLAY && currentPlayer.playerId == playerId) {
        hintText = "出牌"
    } else if (STAGE_NAMES[gameStatus.stage.stageIndex] === GAME_STAGE.THROW && currentPlayer.playerId == playerId) {
        hintText = "弃牌"
    }

    if (hintText) {
        return preText + hintText
    } else {
        return ''
    }
}


export {
    getBoardPlayerThinkHint
}