import {CARD_CONFIG, CARD_LOCATION, EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from '../../config/cardConfig';
import {SKILL_NAMES_CONFIG} from '../../config/skillsConfig'
import {i18Config} from '../../i18n/i18Config';
import {i18} from '../../i18n/i18nUtils';
import {GameStatus} from '../../types/gameStatus';
import {Player} from '../../types/player';

const getCardBoardDisplayArea = (gameStatus: GameStatus) => {
    const curCardBoardResponse = gameStatus.cardBoardResponses[0];
    const cardBoardContentKey = curCardBoardResponse.cardBoardContentKey;
    const allLocation = [CARD_LOCATION.HAND, CARD_LOCATION.EQUIPMENT, CARD_LOCATION.PANDING]

    if ([SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key, SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key].includes(cardBoardContentKey)) {
        return allLocation
    } else if (cardBoardContentKey == SKILL_NAMES_CONFIG.WEI002_FAN_KUI.key) {
        return [CARD_LOCATION.HAND, CARD_LOCATION.EQUIPMENT,]
    } else if (cardBoardContentKey == EQUIPMENT_CARDS_CONFIG.QI_LIN_GONG.key) {
        return [CARD_LOCATION.HORSE]
    }
    return allLocation;
}

const getCardBoardTitle = (gameStatus: GameStatus, targetPlayer: Player) => {
    const curCardBoardResponse = gameStatus.cardBoardResponses[0];
    const cardBoardContentKey = curCardBoardResponse.cardBoardContentKey;
    let titleName;

    if (cardBoardContentKey == SKILL_NAMES_CONFIG.WEI002_FAN_KUI.key) {
        titleName = i18(SKILL_NAMES_CONFIG[gameStatus.skillResponse!.skillNameKey])
    } else if (cardBoardContentKey == EQUIPMENT_CARDS_CONFIG.QI_LIN_GONG.key) {
        titleName = i18(CARD_CONFIG[gameStatus.skillResponse!.skillNameKey])
    } else if ([SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key, SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key].includes(cardBoardContentKey)) {
        titleName = i18(CARD_CONFIG[curCardBoardResponse.cardBoardContentKey])
    }
    return i18(i18Config.PLAYER_CARD_BOARD_TITLE, {
        titleName,
        playerName: gameStatus.players[targetPlayer!.playerId].playerName
    })
}

export {
    getCardBoardDisplayArea,
    getCardBoardTitle
}