import {BOARD_TYPE} from '../../config/boardConfig';
import {CARD_LOCATION, SCROLL_CARDS_CONFIG} from '../../config/cardConfig';
import {RESPONSE_TYPE_CONFIG, RESPONSE_TYPE_CONFIG_VALUES} from '../../config/responseTypeConfig';
import {SKILL_NAMES} from '../../config/skillsConfig'
import { i18Config } from '../../i18n/i18Config';
import { i18 } from '../../i18n/i18nUtils';
import {GameStatus} from '../../types/gameStatus';
import { Player } from '../../types/player';
import {getMyPlayerId} from '../localstorage/localStorageUtils';

const getCardBoardType = (gameStatus: GameStatus, responseType: RESPONSE_TYPE_CONFIG_VALUES|undefined) => {
    if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
        const skillResponse = gameStatus.skillResponse;
        if (skillResponse &&
            skillResponse.playerId === getMyPlayerId() &&
            skillResponse.skillName == SKILL_NAMES.WEI["002"].FAN_KUI &&
            skillResponse.chooseToReleaseSkill) {
            return BOARD_TYPE.FAN_KUI;
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
        const curScrollResponse = gameStatus.scrollResponses?.[0];
        if (curScrollResponse &&
            curScrollResponse.originId == getMyPlayerId() &&
            curScrollResponse.isEffect &&
            [SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN, SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN].includes(curScrollResponse.actualCard.CN)) {
            return BOARD_TYPE.SHUN_CHAI;
        }
    }
}

const getCardBoardDisplayArea = (boardType: string) => {
    const allLocation = [CARD_LOCATION.HAND, CARD_LOCATION.EQUIPMENT, CARD_LOCATION.PANDING]
    if (boardType == BOARD_TYPE.SHUN_CHAI) {
        return allLocation
    } else if (boardType == BOARD_TYPE.FAN_KUI) {
        return [CARD_LOCATION.HAND, CARD_LOCATION.EQUIPMENT,]
    } else if (boardType == BOARD_TYPE.QI_LIN_GONG) {
        return [CARD_LOCATION.HORSE]
    }
    return allLocation;
}

const getCardBoardTargetPlayer=(gameStatus: GameStatus, responseType: RESPONSE_TYPE_CONFIG_VALUES|undefined)=>{
    if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
        return gameStatus.players[gameStatus.damageEvent.originId]
    } else if (responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
        const scrollResponse = gameStatus.scrollResponses[0]
        return gameStatus.players[scrollResponse.targetId]
    }
}

const getCardBoardTitle=(gameStatus: GameStatus, responseType: RESPONSE_TYPE_CONFIG_VALUES|undefined,targetPlayer:Player)=>{
    let titleName;

    // 反馈
    if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
        titleName = gameStatus.skillResponse!.skillName
    } else if (responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
        const scrollResponse = gameStatus.scrollResponses[0]!
        titleName = i18(scrollResponse.actualCard)
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