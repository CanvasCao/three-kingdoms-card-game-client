import {CARD_CONFIG, PLAYER_CARD_AREA, EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from '../../config/cardConfig';
import {SKILL_NAMES_CONFIG} from '../../config/skillsConfig'
import {i18Config} from '../../i18n/i18Config';
import {i18} from '../../i18n/i18nUtils';
import {GameStatus} from '../../types/gameStatus';
import {Player} from '../../types/player';

const getCardBoardDisplayArea = (gameStatus: GameStatus) => {
    const curCardBoardResponse = gameStatus.cardBoardResponses[0];
    const cardBoardContentKey = curCardBoardResponse.cardBoardContentKey;
    const allLocation = [PLAYER_CARD_AREA.HAND, PLAYER_CARD_AREA.WEAPON, PLAYER_CARD_AREA.SHEILD, PLAYER_CARD_AREA.HORSE, PLAYER_CARD_AREA.PANDING]

    if ([SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key, SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key].includes(cardBoardContentKey)) {
        return allLocation
    } else if ([SKILL_NAMES_CONFIG.WEI002_FAN_KUI.key, EQUIPMENT_CARDS_CONFIG.HAN_BIN_JIAN.key].includes(cardBoardContentKey)) {
        return [PLAYER_CARD_AREA.HAND, PLAYER_CARD_AREA.WEAPON, PLAYER_CARD_AREA.SHEILD, PLAYER_CARD_AREA.HORSE]
    } else if (cardBoardContentKey == EQUIPMENT_CARDS_CONFIG.QI_LIN_GONG.key) {
        return [PLAYER_CARD_AREA.HORSE]
    } else if (cardBoardContentKey == SKILL_NAMES_CONFIG.WEI004_TU_XI.key) {
        return [PLAYER_CARD_AREA.HAND]
    }
    return allLocation;
}

const getCardBoardTitle = (gameStatus: GameStatus, targetPlayer: Player) => {
    const curCardBoardResponse = gameStatus.cardBoardResponses[0];
    const cardBoardContentKey = curCardBoardResponse.cardBoardContentKey;
    let titleName = i18(CARD_CONFIG[cardBoardContentKey]) || i18(SKILL_NAMES_CONFIG[cardBoardContentKey])
    return i18(i18Config.PLAYER_CARD_BOARD_TITLE, {
        titleName,
        playerName: gameStatus.players[targetPlayer!.playerId].playerName
    })
}

export {
    getCardBoardDisplayArea,
    getCardBoardTitle
}