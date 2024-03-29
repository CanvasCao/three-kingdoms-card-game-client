import {GameStatus} from "../types/gameStatus";
import {
    BASIC_CARDS_CONFIG,
    CARD_CONFIG,
    CARD_HUASE,
    CARD_TYPE,
    SCROLL_CARDS_CONFIG,
} from "../config/cardConfig";
import {EmitNotifyAddToPublicCardData} from "../types/emit";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {i18Config} from "../i18n/i18Config";
import {i18} from "../i18n/i18nUtils";
import {Card} from "../types/card";
import {ADD_TO_PUBLIC_CARD_TYPE} from "../config/emitConfig";
import {SKILL_NAMES_CONFIG} from "../config/skillsConfig";
import {COLOR_CONFIG} from "../config/colorConfig";

const attachFEInfoToCard = (card: Card): Card | undefined => {
    if (!card) {
        return
    }

    // 我的回合能出的牌
    if (card.key == BASIC_CARDS_CONFIG.SHA.key ||
        card.key == BASIC_CARDS_CONFIG.LEI_SHA.key ||
        card.key == BASIC_CARDS_CONFIG.HUO_SHA.key ||
        card.key == BASIC_CARDS_CONFIG.TAO.key ||
        card.key == BASIC_CARDS_CONFIG.JIU.key ||
        card.type == CARD_TYPE.EQUIPMENT ||
        (card.type == CARD_TYPE.SCROLL && card.key !== SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.key)
    ) {
        card.canPlayInMyTurn = true
    } else {
        card.canPlayInMyTurn = false
    }


    // 暂时 只需要我的回合可以出的牌 因为我的响应阶段目前不需要指定目标
    // 1.前端无目标 因为以自己为目标 2.所有人都是目标
    // 3.必须双目标

    if (card.type == CARD_TYPE.EQUIPMENT) {
        card.targetMinMax = {min: 0, max: 0}
        card.noNeedSetTargetDueToImDefaultTarget = true
    } else if ([
        // 1.
        BASIC_CARDS_CONFIG.TAO.key,
        BASIC_CARDS_CONFIG.JIU.key,
        SCROLL_CARDS_CONFIG.SHAN_DIAN.key,
        SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.key,

        // 无目标.
        BASIC_CARDS_CONFIG.SHAN.key,
        SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.key,

        // 2.
        SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key,
        SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.key,
        SCROLL_CARDS_CONFIG.TAO_YUAN_JIE_YI.key,
        SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.key,
    ].includes(card.key)) {
        card.targetMinMax = {min: 0, max: 0}

        // 1.
        if ([
            BASIC_CARDS_CONFIG.TAO.key,
            BASIC_CARDS_CONFIG.JIU.key,
            SCROLL_CARDS_CONFIG.SHAN_DIAN.key,
            SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.key,
        ].includes(card.key)) {
            card.noNeedSetTargetDueToImDefaultTarget = true
        }

        // 2.
        if ([
            SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key,
            SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.key,
            SCROLL_CARDS_CONFIG.TAO_YUAN_JIE_YI.key,
            SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.key,
        ].includes(card.key)) {
            card.noNeedSetTargetDueToTargetAll = true
        }

    } else if ([
        BASIC_CARDS_CONFIG.SHA.key,
        BASIC_CARDS_CONFIG.LEI_SHA.key,
        BASIC_CARDS_CONFIG.HUO_SHA.key,
        SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key,
        SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key,

        SCROLL_CARDS_CONFIG.JUE_DOU.key,
        SCROLL_CARDS_CONFIG.BING_LIANG_CUN_DUAN.key,
        SCROLL_CARDS_CONFIG.HUO_GONG.key,
        SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key,
    ].includes(card.key)) {
        card.targetMinMax = {min: 1, max: 1}
    } else if ([
        SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key,
    ].includes(card.key)) {
        // 3。
        card.targetMinMax = {min: 2, max: 2}
    } else if ([
        SCROLL_CARDS_CONFIG.TIE_SUO_LIAN_HUAN.key,
    ].includes(card.key)) {
        card.targetMinMax = {min: 0, max: 2}
    } else {
        throw new Error(card.key + "未在attachFEInfoToCard设置")
    }
    return card
}

const getIsToOtherPlayerCardFaceFront = (fromPlayerId: string, toPlayerId: string, isPublic: boolean) => {
    if ([fromPlayerId, toPlayerId].includes(getMyPlayerId())) {
        return true
    }

    return isPublic
}

const getCardColorString = (huase: string) => {
    return [CARD_HUASE.HONGTAO, CARD_HUASE.FANGKUAI].includes(huase) ? COLOR_CONFIG.redString : COLOR_CONFIG.blackString
}

const generatePublicCardMessage = (
    gameStatus: GameStatus,
    {fromId, originId, targetIds, pandingPlayerId, pandingNameKey, type, skillKey}:
        EmitNotifyAddToPublicCardData) => {
    if (skillKey) {
        const player = gameStatus.players[fromId]!
        const skillName = i18(SKILL_NAMES_CONFIG[skillKey]) || i18(CARD_CONFIG[skillKey])
        const originName = player.playerName;
        return `${originName} ${skillName}`
    } else if (type == ADD_TO_PUBLIC_CARD_TYPE.PLAY) {
        const originName = gameStatus.players[fromId].playerName;

        // AOE
        if (!targetIds) return i18(i18Config.PUBLIC_CARD_MESSAGE_PLAY_NO_TARGET, {name: originName});

        if (originId == targetIds[0]) {
            return i18(i18Config.PUBLIC_CARD_MESSAGE_PLAY_NO_TARGET, {name: originName});
        } else {
            return i18(i18Config.PUBLIC_CARD_MESSAGE_PLAY_HAVE_TARGET, {
                originName, targetName: targetIds.map((targetId) => {
                    return gameStatus.players[targetId].playerName
                }).join(' ')
            });
        }
    } else if (pandingNameKey && pandingPlayerId) {
        const pandingPlayer = gameStatus.players[pandingPlayerId]
        const pandingName = i18(CARD_CONFIG[pandingNameKey] || SKILL_NAMES_CONFIG[pandingNameKey])
        return i18(i18Config.PUBLIC_CARD_MESSAGE_PLAY_PANDING_RESULT, {
            playerName: pandingPlayer.playerName,
            pandingName
        });
    } else if (type == ADD_TO_PUBLIC_CARD_TYPE.THROW) {
        return i18(i18Config.PUBLIC_CARD_MESSAGE_PLAY_THROW, {name: gameStatus.players[fromId].playerName});
    } else if (type == ADD_TO_PUBLIC_CARD_TYPE.CHAI) {
        return i18(i18Config.PUBLIC_CARD_MESSAGE_PLAY_CHAI, {name: gameStatus.players[fromId].playerName});
    }
    return ''
}

export {
    attachFEInfoToCard,
    getIsToOtherPlayerCardFaceFront,
    getCardColorString,
    generatePublicCardMessage
}
