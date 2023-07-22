import {GameStatus} from "../types/gameStatus";
import {
    BASIC_CARDS_CONFIG,
    CARD_CONFIG,
    CARD_HUASE,
    CARD_LOCATION,
    CARD_TYPE,
    SCROLL_CARDS_CONFIG
} from "../config/cardConfig";
import {EmitNotifyAddToPublicCardData} from "../types/emit";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {i18Config} from "../i18n/i18Config";
import {i18} from "../i18n/i18nUtils";
import {Card, CardAreaType} from "../types/card";
import {ADD_TO_PUBLIC_CARD_TYPE} from "../config/emitConfig";
import {SKILL_NAMES_CONFIG} from "../config/skillsConfig";

const attachFEInfoToCard = (card: Card): Card | undefined => {
    if (!card) {
        return
    }

    if (card.key == SCROLL_CARDS_CONFIG.HUO_GONG.key || card.key == SCROLL_CARDS_CONFIG.TIE_SUO_LIAN_HUAN.key) {
        card.canClickMySelfAsFirstTarget = true
    } else {
        card.canClickMySelfAsFirstTarget = false
    }

    if (card.key == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key || card.key == SCROLL_CARDS_CONFIG.TIE_SUO_LIAN_HUAN.key) {
        card.canClickMySelfAsSecondTarget = true
    } else {
        card.canClickMySelfAsSecondTarget = false
    }

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
    // 1.可以多目标 2.前端无目标 因为以自己为目标 3.单目标 4.所有人都是目标
    // 5.双目标
    // 6.我的回合不能出的牌(无需标记)
    if (card.type == CARD_TYPE.EQUIPMENT) {
        card.targetMinMax = {min: 0, max: 0}
        card.noNeedSetTargetDueToImDefaultTarget = true
    } else if ([
        // 2.
        BASIC_CARDS_CONFIG.TAO.key,
        BASIC_CARDS_CONFIG.JIU.key,
        SCROLL_CARDS_CONFIG.SHAN_DIAN.key,
        SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.key,

        // 6.
        BASIC_CARDS_CONFIG.SHAN.key,
        SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.key,

        // 4.
        SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key,
        SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.key,
        SCROLL_CARDS_CONFIG.TAO_YUAN_JIE_YI.key,
        SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.key,
    ].includes(card.key)) {
        card.targetMinMax = {min: 0, max: 0}

        // 2.
        if ([
            BASIC_CARDS_CONFIG.TAO.key,
            BASIC_CARDS_CONFIG.JIU.key,
            SCROLL_CARDS_CONFIG.SHAN_DIAN.key,
            SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.key,
        ].includes(card.key)) {
            card.noNeedSetTargetDueToImDefaultTarget = true
        }

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

        // 1.
        if ([
            BASIC_CARDS_CONFIG.SHA.key,
            BASIC_CARDS_CONFIG.LEI_SHA.key,
            BASIC_CARDS_CONFIG.HUO_SHA.key,
            SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key,
            SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key,
        ].includes(card.key)) {
            card.couldHaveMultiTarget = true
        }
        // 3.
        else {
            card.canOnlyHaveOneTarget = true
        }
    } else if ([
        SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key,
        SCROLL_CARDS_CONFIG.TIE_SUO_LIAN_HUAN.key,
    ].includes(card.key)) {
        card.targetMinMax = {min: 2, max: 2}
        card.needAActionToB = true;
    } else {
        throw new Error(card.key + "未在attachFEInfoToCard设置")
    }
    return card
}

const getIsToOtherPlayerCardFaceFront = (cardAreaType: CardAreaType, fromPlayerId: string, toPlayerId: string,) => {
    // 别人摸牌 FaceFront false
    if (fromPlayerId == CARD_LOCATION.PAIDUI) {
        return false
    }

    // 我给别人 别人给我 FaceFront true
    if (getMyPlayerId() == fromPlayerId || getMyPlayerId() == toPlayerId) {
        return true
    }

    // 顺手牵羊/借刀杀人
    // 是手牌FaceFront false
    // 武器/判定 FaceFront true
    return (cardAreaType !== CARD_LOCATION.HAND)
}

const getCardColor = (huase: string) => {
    return [CARD_HUASE.HONGTAO, CARD_HUASE.FANGKUAI].includes(huase) ? '#f00' : '#000'
}

const generatePublicCardMessage = (
    gameStatus: GameStatus,
    {type, fromId, originId, targetId, pandingPlayerId, pandingNameKey, skillNameKey}:
        EmitNotifyAddToPublicCardData) => {
    if (skillNameKey) {
        const player = gameStatus.players[originId]!
        const skillName = i18(SKILL_NAMES_CONFIG[player.heroId][skillNameKey])
        const originName = player.playerName;
        return `${originName} ${skillName}`
    } else if (type == ADD_TO_PUBLIC_CARD_TYPE.PLAY) {
        const originName = gameStatus.players[originId].playerName;

        // AOE
        if (!targetId) return i18(i18Config.PUBLIC_CARD_MESSAGE_PLAY_NO_TARGET, {name: originName});

        const targetName = gameStatus.players[targetId].playerName;
        if (originId == targetId) {
            return i18(i18Config.PUBLIC_CARD_MESSAGE_PLAY_NO_TARGET, {name: originName});
        } else if (originId && originId !== targetId) {
            return i18(i18Config.PUBLIC_CARD_MESSAGE_PLAY_HAVE_TARGET, {originName, targetName});
        }
    } else if (type == ADD_TO_PUBLIC_CARD_TYPE.PANDING) {
        const pandingPlayer = gameStatus.players[pandingPlayerId]
        const pandingName = i18(CARD_CONFIG[pandingNameKey] || SKILL_NAMES_CONFIG[pandingPlayer.heroId][pandingNameKey])
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
    getCardColor,
    generatePublicCardMessage
}
