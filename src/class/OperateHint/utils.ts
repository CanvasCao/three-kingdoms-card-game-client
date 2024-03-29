import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {i18} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {
    ALL_SHA_CARD_KEYS,
    CARD_CONFIG,
    DELAY_SCROLL_CARDS_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    EQUIPMENT_TYPE,
    SCROLL_CARDS_CONFIG
} from "../../config/cardConfig";
import {getNeedSelectCardsMinMax, getNeedSelectPlayersMinMax} from "../../utils/validation/validationUtils";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {getCurrentPlayer, getPlayerDisplayName} from "../../utils/playerUtils";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {getResponseType} from "../../utils/response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";
import {findOnGoingUseStrikeEvent} from "../../utils/event/eventUtils";

const getCanPlayInMyTurnOperationHint = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const actualCard = gameFEStatus.actualCard
    const actualCardKey = actualCard?.key || ''
    const actualCardName = actualCard ? i18(CARD_CONFIG[actualCard.key]) : '';
    const equipmentType = actualCard?.equipmentType;
    const selectedSkillKey = gameFEStatus.selectedSkillKey;

    // 没有选择牌
    if (!actualCard && !selectedSkillKey) {
        return (i18(i18Config.PLEASE_SELECT_A_CARD))
    }
    // 基本牌
    else if (ALL_SHA_CARD_KEYS.includes(actualCardKey)) {
        const minMax = getNeedSelectPlayersMinMax(gameStatus, gameFEStatus)
        const replaceNumber = (minMax.min == minMax.max) ? minMax.min : `${minMax.min}-${minMax.max}`;
        return (i18(i18Config.SELECT_SHA, {number: replaceNumber}))
    } else if (actualCardKey == CARD_CONFIG.TAO.key) {
        return (i18(i18Config.SELECT_TAO))
    }
    // 装备牌
    else if (equipmentType == EQUIPMENT_TYPE.WEAPON || equipmentType == EQUIPMENT_TYPE.SHIELD) {
        return (i18(i18Config.SELECT_WEAPON_OR_SHEILD, {name: actualCardName}))
    } else if (equipmentType == EQUIPMENT_TYPE.MINUS_HORSE) {
        return (i18(i18Config.SELECT_MINUS_HORSE, {name: actualCardName}))
    } else if (equipmentType == EQUIPMENT_TYPE.PLUS_HORSE) {
        return (i18(i18Config.SELECT_PLUS_HORSE, {name: actualCardName}))
    }
    // 即时锦囊
    else if (actualCardKey == SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.key) {
        return (i18(i18Config.SELECT_WU_ZHONG_SHENG_YOU))
    } else if (actualCardKey == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key) {
        return (i18(i18Config.SELECT_JIE_DAO_SHA_REN))
    } else if (actualCardKey == SCROLL_CARDS_CONFIG.JUE_DOU.key) {
        return (i18(i18Config.SELECT_JUE_DOU))
    } else if ([
        SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key,
        SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.key,
        SCROLL_CARDS_CONFIG.TAO_YUAN_JIE_YI.key,
        SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.key,
    ].includes(actualCardKey)) {
        return (i18(i18Config.SELECT_AOE, {name: actualCardName}))
    } else if (actualCardKey == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key) {
        return (i18(i18Config.SELECT_GUO_HE_CHAI_QIAO))
    } else if (actualCardKey == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key) {
        return (i18(i18Config.SELECT_SHUN_SHOU_QIAN_YANG))
    }
    // 延时锦囊
    else if (actualCardKey == SCROLL_CARDS_CONFIG.SHAN_DIAN.key) {
        return (i18(i18Config.SELECT_SHAN_DIAN))
    } else if (actualCardKey == SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key) {
        return (i18(i18Config.SELECT_LE_BU_SI_SHU))
    } else if (actualCardKey == SCROLL_CARDS_CONFIG.BING_LIANG_CUN_DUAN.key) {
        return (i18(i18Config.SELECT_BING_LIANG_CUN_DUAN))
    }

    // 武器
    else if (selectedSkillKey == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key) {
        return (i18(i18Config.SELECT_ZHANG_BA_SHE_MAO))
    }

    // 技能
    else if (!!selectedSkillKey) {
        return (i18(i18Config.PLEASE_SELECT_A_CARD))
    } else {
        console.log(actualCard)
        throw Error(`${actualCard?.key}出牌时没有操作提示`)
    }
}

const getIsMyResponseTurnOperationHint = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const responseType = getResponseType(gameStatus);
    if (responseType == RESPONSE_TYPE_CONFIG.TAO) {
        const targetId = gameStatus.taoResponses[0].targetId;
        const number = gameStatus.taoResponses[0].cardNumber;
        const name = getPlayerDisplayName(gameStatus, targetId);
        return i18(i18Config.RESPONSE_TAO, {number, name})
    } else if (responseType == RESPONSE_TYPE_CONFIG.CARD) {
        const cardResponse = gameStatus.cardResponse!
        const {cardNumber: number, targetId, actionActualCard} = cardResponse
        const actionCardKey = actionActualCard?.key
        const name = getPlayerDisplayName(gameStatus, targetId);

        if (ALL_SHA_CARD_KEYS.includes(actionCardKey)) {
            return (number == 1) ?
                i18(i18Config.RESPONSE_SHAN, {name}) :
                i18(i18Config.RESPONSE_MULTI_SHAN, {name, number})
        } else if (actionCardKey == SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.key) {
            return i18(i18Config.RESPONSE_WAN_JIAN_QI_FA, {name})
        } else if (actionCardKey == SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key) {
            return i18(i18Config.RESPONSE_NAN_MAN_RU_QIN, {name})
        } else if (actionCardKey == SCROLL_CARDS_CONFIG.JUE_DOU.key) {
            return i18(i18Config.RESPONSE_JUE_DOU, {name, number})
        } else if (actionCardKey == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key) {
            const originName = getPlayerDisplayName(gameStatus, getCurrentPlayer(gameStatus)!.playerId)
            const targetName = getPlayerDisplayName(gameStatus, targetId)
            return i18(i18Config.RESPONSE_JIE_DAO_SHA_REN, {originName, targetName})
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
        const skillKey = gameStatus.skillResponse!.skillKey;
        const skillName = i18(SKILL_NAMES_CONFIG[skillKey]) || i18(CARD_CONFIG[skillKey])
        const chooseToReleaseSkill = gameStatus.skillResponse!.chooseToReleaseSkill;

        if (chooseToReleaseSkill === undefined) {
            return i18(i18Config.RESPONSE_SKILL_OR_NOT, {skillName})
        } else if (chooseToReleaseSkill) {
            if (skillKey == SKILL_NAMES_CONFIG.WEI002_GUI_CAI.key) {
                return i18(i18Config.RESPONSE_SKILL_GUI_CAI)
            } else if (skillKey == SKILL_NAMES_CONFIG.WEI003_GANG_LIE.key) {
                return i18(i18Config.RESPONSE_SKILL_GANG_LIE)
            } else if (skillKey == SKILL_NAMES_CONFIG.WEI004_TU_XI.key) {
                return i18(i18Config.RESPONSE_SKILL_TU_XI)
            } else if (skillKey == SKILL_NAMES_CONFIG.WEI006_YI_JI.key) {
                return i18(i18Config.RESPONSE_SKILL_YI_JI)
            } else if (skillKey == SKILL_NAMES_CONFIG.WU006_LIU_LI.key) {
                return i18(i18Config.RESPONSE_SKILL_LIU_LI)
            } else if (skillKey == EQUIPMENT_CARDS_CONFIG.CI_XIONG_SHUANG_GU_JIAN.key) {
                const onGoingUseStrikeEvent = findOnGoingUseStrikeEvent(gameStatus)!
                const player = gameStatus.players[onGoingUseStrikeEvent.originId]!
                return i18(i18Config.RESPONSE_SKILL_CI_XIONG_SHUANG_GU_JIAN, {name: getPlayerDisplayName(gameStatus, player.playerId)})
            } else if (skillKey == EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key) {
                return i18(i18Config.RESPONSE_SKILL_GUAN_SHI_FU)
            } else if (skillKey == EQUIPMENT_CARDS_CONFIG.QING_LONG_YAN_YUE_DAO.key) {
                return i18(i18Config.RESPONSE_SKILL_QING_LONG_YAN_YUE_DAO)
            }
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.CARD_BOARD) {
        const cardBoardContentKey = gameStatus.cardBoardResponses[0].cardBoardContentKey
        if (cardBoardContentKey == SKILL_NAMES_CONFIG.WEI002_FAN_KUI.key) {
            return i18(i18Config.RESPONSE_SKILL_FAN_KUI)
        } else if (cardBoardContentKey == EQUIPMENT_CARDS_CONFIG.HAN_BIN_JIAN.key) {
            return i18(i18Config.RESPONSE_SKILL_HAN_BIN_JIAN)
        } else if (cardBoardContentKey == EQUIPMENT_CARDS_CONFIG.QI_LIN_GONG.key) {
            return i18(i18Config.RESPONSE_SKILL_QI_LIN_GONG)
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.FAN_JIAN_BOARD) {

    } else if (responseType == RESPONSE_TYPE_CONFIG.WUXIE) {
        if (gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds.includes(getMyPlayerId())) {
            const scrollStorage = gameStatus.scrollStorages?.[0];
            let name, cardName;

            if (scrollStorage) { // 锦囊的无懈可击
                name = getPlayerDisplayName(gameStatus, scrollStorage.cardTakeEffectOnPlayerId);
                cardName = i18(CARD_CONFIG[scrollStorage.actualCard.key])
            } else { // 判定牌的无懈可击
                const currentPlayer = getCurrentPlayer(gameStatus)!;
                const needPandingSigns = currentPlayer.judgedShandian ?
                    currentPlayer.pandingSigns.filter((sign) => sign.actualCard.key !== DELAY_SCROLL_CARDS_CONFIG.SHAN_DIAN.key) :
                    currentPlayer.pandingSigns;
                name = getPlayerDisplayName(gameStatus, currentPlayer.playerId)
                cardName = i18(CARD_CONFIG[needPandingSigns[0].card.key])
            }

            const wuxieChain = gameStatus.wuxieSimultaneousResponse.wuxieChain;
            if (wuxieChain?.length % 2 == 0) {
                return i18(i18Config.RESPONSE_WU_XIE_TO_MAKE_IT_EFFECTIVE, {name, cardName})
            } else {
                return i18(i18Config.RESPONSE_WU_XIE_TO_MAKE_IT_INEFFECTIVE, {name, cardName})
            }
        } else {
            return i18(i18Config.WAIT_WU_XIE)
        }
    } else {
        console.log(gameStatus)
        throw Error(`响应牌时没有操作提示`)
    }
}

const getIsMyThrowTurnOperationHint = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const number = getNeedSelectCardsMinMax(gameStatus, gameFEStatus).min
    return i18(i18Config.SELECT_THROW_CARDS, {number})
}

export {
    getCanPlayInMyTurnOperationHint,
    getIsMyResponseTurnOperationHint,
    getIsMyThrowTurnOperationHint
}