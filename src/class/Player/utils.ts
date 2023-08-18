import {GameStatus} from "../../types/gameStatus";
import {
    BASIC_CARDS_CONFIG,
    CARD_CONFIG,
    SCROLL_CARDS_CONFIG
} from "../../config/cardConfig";
import {getCurrentPlayer} from "../../utils/playerUtils";
import {getResponseType} from "../../utils/response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";
import {STAGE_NAME, STAGE_NAMES, STAGE_NAME_CONFIG} from "../../config/gameConfig";
import {i18} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";

const getBoardPlayerThinkHintText = (gameStatus: GameStatus, playerId: string) => {
    const responseType = getResponseType(gameStatus);
    const currentPlayer = getCurrentPlayer(gameStatus)
    const preText = i18(i18Config.IS_THINKING)
    let hintText = '';

    if (responseType) {
        switch (responseType) {
            case RESPONSE_TYPE_CONFIG.TAO:
                if (gameStatus.taoResponses[0].originId == playerId) {
                    hintText = i18(BASIC_CARDS_CONFIG.TAO);
                }
                break;
            case RESPONSE_TYPE_CONFIG.CARD:
                if (gameStatus.cardResponse!.originId == playerId) {
                    hintText = i18(CARD_CONFIG[gameStatus.cardResponse!.actionCardKey!]);
                }
                break;
            case RESPONSE_TYPE_CONFIG.SKILL:
                if (gameStatus.skillResponse!.playerId == playerId) {
                    const skillKeyName = gameStatus.skillResponse?.skillNameKey!
                    hintText = i18(SKILL_NAMES_CONFIG[skillKeyName]) || i18(CARD_CONFIG[skillKeyName])
                }
                break;
            case RESPONSE_TYPE_CONFIG.CARD_BOARD:
                if (gameStatus.cardBoardResponses[0].originId == playerId) {
                    const cardBoardContentKey = gameStatus.cardBoardResponses[0].cardBoardContentKey!
                    hintText = i18(SKILL_NAMES_CONFIG[cardBoardContentKey]) || i18(CARD_CONFIG[cardBoardContentKey])
                }
                break;
            case RESPONSE_TYPE_CONFIG.WUXIE:
                if (gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.length) {
                    hintText = i18(SCROLL_CARDS_CONFIG.WU_XIE_KE_JI)
                }
                break;
            case RESPONSE_TYPE_CONFIG.SCROLL:
                const curScrollResponse = gameStatus.scrollResponses[0]
                if (curScrollResponse.originId == playerId) {
                    hintText = i18(CARD_CONFIG[curScrollResponse.actualCard.key])
                }
                break;
        }
    } else if (STAGE_NAMES[gameStatus.stage.stageIndex] === STAGE_NAME.PLAY && currentPlayer.playerId == playerId) {
        hintText = i18(STAGE_NAME_CONFIG.PLAY)
    } else if (STAGE_NAMES[gameStatus.stage.stageIndex] === STAGE_NAME.THROW && currentPlayer.playerId == playerId) {
        hintText = i18(STAGE_NAME_CONFIG.THROW)
    }

    if (hintText) {
        return preText + ' ' + hintText
    } else {
        return ''
    }
}


export {
    getBoardPlayerThinkHintText
}