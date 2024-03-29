import {GameStatus} from "../../types/gameStatus";
import {
    BASIC_CARDS_CONFIG,
    CARD_CONFIG,
    SCROLL_CARDS_CONFIG
} from "../../config/cardConfig";
import {getCurrentPlayer} from "../../utils/playerUtils";
import {getResponseType} from "../../utils/response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";
import {STAGE_NAME, STAGE_NAME_CONFIG} from "../../config/gameConfig";
import {i18, isLanEn} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";

const getBoardPlayerThinkHintText = (gameStatus: GameStatus, playerId: string) => {
    const currentPlayer = getCurrentPlayer(gameStatus)
    const stageName = gameStatus.stage.stageName
    const responseType = getResponseType(gameStatus);
    const preText = i18(i18Config.IS_THINKING)
    let hintText = '';

    if (!gameStatus.players[playerId].heroId) {
        hintText = isLanEn() ? 'choosing a hero' : '选将'
    } else if (responseType) {
        switch (responseType) {
            case RESPONSE_TYPE_CONFIG.TAO:
                if (gameStatus.taoResponses[0].originId == playerId) {
                    hintText = i18(BASIC_CARDS_CONFIG.TAO);
                }
                break;
            case RESPONSE_TYPE_CONFIG.CARD:
                if (gameStatus.cardResponse!.originId == playerId) {
                    hintText = i18(CARD_CONFIG[gameStatus.cardResponse!.actionActualCard.key!]);
                }
                break;
            case RESPONSE_TYPE_CONFIG.SKILL:
                if (gameStatus.skillResponse!.playerId == playerId) {
                    const skillKeyName = gameStatus.skillResponse?.skillKey!
                    hintText = i18(SKILL_NAMES_CONFIG[skillKeyName]) || i18(CARD_CONFIG[skillKeyName])
                }
                break;
            case RESPONSE_TYPE_CONFIG.CARD_BOARD:
                if (gameStatus.cardBoardResponses[0].originId == playerId) {
                    const cardBoardContentKey = gameStatus.cardBoardResponses[0].cardBoardContentKey!
                    hintText = i18(SKILL_NAMES_CONFIG[cardBoardContentKey]) || i18(CARD_CONFIG[cardBoardContentKey])
                }
                break;
            case RESPONSE_TYPE_CONFIG.FAN_JIAN_BOARD:
                if (gameStatus.fanJianBoardResponse!.originId == playerId) {
                    hintText = i18(SKILL_NAMES_CONFIG.WU005_FAN_JIAN)
                }
                break;
            case RESPONSE_TYPE_CONFIG.GUAN_XING_BOARD:
                if (gameStatus.guanXingBoardResponse!.originId == playerId) {
                    hintText = i18(SKILL_NAMES_CONFIG.SHU004_GUAN_XING)
                }
                break;
            case RESPONSE_TYPE_CONFIG.WUXIE:
                if (gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.length) {
                    hintText = i18(SCROLL_CARDS_CONFIG.WU_XIE_KE_JI)
                }
                break;
        }
    } else if (stageName === STAGE_NAME.PLAY && currentPlayer?.playerId == playerId) {
        hintText = i18(STAGE_NAME_CONFIG.PLAY)
    } else if (stageName === STAGE_NAME.THROW && currentPlayer?.playerId == playerId) {
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