import {BOARD_TYPE} from '../../config/boardConfig';
import {CARD_CONFIG, CARD_LOCATION, EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from '../../config/cardConfig';
import {RESPONSE_TYPE_CONFIG, RESPONSE_TYPE_CONFIG_VALUES} from '../../config/responseTypeConfig';
import {SKILL_NAMES_CONFIG} from '../../config/skillsConfig'
import {i18Config} from '../../i18n/i18Config';
import {i18} from '../../i18n/i18nUtils';
import {GameStatus} from '../../types/gameStatus';
import {Player} from '../../types/player';
import {getMyPlayerId} from '../localstorage/localStorageUtils';

const getCardBoardType = (gameStatus: GameStatus, responseType: RESPONSE_TYPE_CONFIG_VALUES | undefined) => {
    if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
        const skillResponse = gameStatus.skillResponse;
        if (skillResponse &&
            skillResponse.playerId === getMyPlayerId() &&
            skillResponse.chooseToReleaseSkill) {
            if (skillResponse.skillNameKey == SKILL_NAMES_CONFIG.WEI002_FAN_KUI.key) {
                return BOARD_TYPE.FAN_KUI;
            } else if (skillResponse.skillNameKey == EQUIPMENT_CARDS_CONFIG.QI_LIN_GONG.key) {
                return BOARD_TYPE.QI_LIN_GONG;
            }
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
        const curScrollResponse = gameStatus.scrollResponses?.[0];
        if (curScrollResponse &&
            curScrollResponse.originId == getMyPlayerId() &&
            curScrollResponse.isEffect) {
            if (SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key === curScrollResponse.actualCard.key) {
                return BOARD_TYPE.CHAI;
            } else if (SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key === curScrollResponse.actualCard.key) {
                return BOARD_TYPE.SHUN;
            }
        }
    }
}

const getCardBoardDisplayArea = (boardType: string) => {
    const allLocation = [CARD_LOCATION.HAND, CARD_LOCATION.EQUIPMENT, CARD_LOCATION.PANDING]
    if ([BOARD_TYPE.SHUN, BOARD_TYPE.CHAI].includes(boardType)) {
        return allLocation
    } else if (boardType == BOARD_TYPE.FAN_KUI) {
        return [CARD_LOCATION.HAND, CARD_LOCATION.EQUIPMENT,]
    } else if (boardType == BOARD_TYPE.QI_LIN_GONG) {
        return [CARD_LOCATION.HORSE]
    }
    return allLocation;
}

const getCardBoardTargetPlayer = (gameStatus: GameStatus, boardType: string) => {
    if (boardType == BOARD_TYPE.FAN_KUI) {
        return gameStatus.players[gameStatus.damageEvent.originId]
    } else if (boardType == BOARD_TYPE.QI_LIN_GONG) {
        return gameStatus.players[gameStatus.damageEvent.targetId]
    } else if ([BOARD_TYPE.SHUN, BOARD_TYPE.CHAI].includes(boardType)) {
        const scrollResponse = gameStatus.scrollResponses[0]
        return gameStatus.players[scrollResponse.targetId]
    }
}

const getCardBoardTitle = (gameStatus: GameStatus, boardType: string, targetPlayer: Player) => {
    let titleName;

    if (boardType == BOARD_TYPE.FAN_KUI) {
        titleName = i18(SKILL_NAMES_CONFIG[gameStatus.skillResponse!.skillNameKey])
    } else if (boardType == BOARD_TYPE.QI_LIN_GONG) {
        titleName = i18(CARD_CONFIG[gameStatus.skillResponse!.skillNameKey])
    } else if ([BOARD_TYPE.SHUN, BOARD_TYPE.CHAI].includes(boardType)) {
        const scrollResponse = gameStatus.scrollResponses[0]!
        titleName = i18(CARD_CONFIG[scrollResponse.actualCard.key])
    }
    return i18(i18Config.PLAYER_CARD_BOARD_TITLE, {
        titleName,
        playerName: gameStatus.players[targetPlayer!.playerId].playerName
    })
}

export {
    getCardBoardType,
    getCardBoardDisplayArea,
    getCardBoardTargetPlayer,
    getCardBoardTitle
}