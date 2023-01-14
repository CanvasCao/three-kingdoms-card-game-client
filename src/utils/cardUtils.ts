import {Card} from "../types/gameStatus";
import {BASIC_CARDS_CONFIG, CARD_TYPE, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {CardAreaType} from "../types/emit";
import {getMyPlayerId} from "./gameStatusUtils";
import {PAIDUI} from "../constants/constants";
import sizeConfig from "../config/sizeConfig.json";

export const attachFEInfoToCard = (card: Card) => {
    if (!card) {
        return
    }

    if (card.CN == SCROLL_CARDS_CONFIG.HUO_GONG.CN || card.CN == SCROLL_CARDS_CONFIG.TIE_SUO_LIAN_HUAN.CN) {
        card.canClickMySelfAsFirstTarget = true
    } else {
        card.canClickMySelfAsFirstTarget = false
    }

    if (card.CN == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN || card.CN == SCROLL_CARDS_CONFIG.TIE_SUO_LIAN_HUAN.CN) {
        card.canClickMySelfAsSecondTarget = true
    } else {
        card.canClickMySelfAsSecondTarget = false
    }

    if (card.CN == BASIC_CARDS_CONFIG.SHA.CN ||
        card.CN == BASIC_CARDS_CONFIG.LEI_SHA.CN ||
        card.CN == BASIC_CARDS_CONFIG.HUO_SHA.CN ||
        card.CN == BASIC_CARDS_CONFIG.TAO.CN ||
        card.type == CARD_TYPE.EQUIPMENT ||
        (card.type == CARD_TYPE.SCROLL && card.CN !== SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN)
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
        BASIC_CARDS_CONFIG.TAO.CN,
        SCROLL_CARDS_CONFIG.SHAN_DIAN.CN,
        SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.CN,

        // 6.
        BASIC_CARDS_CONFIG.SHAN.CN,
        SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN,

        // 4.
        SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN,
        SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN,
        SCROLL_CARDS_CONFIG.TAO_YUAN_JIE_YI.CN,
        SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.CN,
    ].includes(card.CN)) {
        card.targetMinMax = {min: 0, max: 0}

        // 2.
        if ([
            BASIC_CARDS_CONFIG.TAO.CN,
            SCROLL_CARDS_CONFIG.SHAN_DIAN.CN,
            SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.CN,
        ].includes(card.CN)) {
            card.noNeedSetTargetDueToImDefaultTarget = true
        }

        if ([
            SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN,
            SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN,
            SCROLL_CARDS_CONFIG.TAO_YUAN_JIE_YI.CN,
            SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.CN,
        ].includes(card.CN)) {
            card.noNeedSetTargetDueToTargetAll = true
        }

    } else if ([
        BASIC_CARDS_CONFIG.SHA.CN,
        BASIC_CARDS_CONFIG.LEI_SHA.CN,
        BASIC_CARDS_CONFIG.HUO_SHA.CN,
        SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN,
        SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN,

        SCROLL_CARDS_CONFIG.JUE_DOU.CN,
        SCROLL_CARDS_CONFIG.BING_LIANG_CUN_DUAN.CN,
        SCROLL_CARDS_CONFIG.HUO_GONG.CN,
        SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN,
    ].includes(card.CN)) {
        card.targetMinMax = {min: 1, max: 1}

        // 1.
        if ([
            BASIC_CARDS_CONFIG.SHA.CN,
            BASIC_CARDS_CONFIG.LEI_SHA.CN,
            BASIC_CARDS_CONFIG.HUO_SHA.CN,
            SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN,
            SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN,
        ].includes(card.CN)) {
            card.couldHaveMultiTarget = true
        }
        // 3.
        else {
            card.canOnlyHaveOneTarget = true
        }
    } else if ([
        SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN,
        SCROLL_CARDS_CONFIG.TIE_SUO_LIAN_HUAN.CN,
    ].includes(card.CN)) {
        card.targetMinMax = {min: 2, max: 2}
        card.needAActionToB = true;
    } else {
        throw new Error(card.CN + "未在attachFEInfoToCard设置")
    }
    return card
}


export const getIfToPlayerCardFaceFront = (cardAreaType: CardAreaType, fromPlayerId: string, toPlayerId: string,) => {
    if (fromPlayerId == PAIDUI) {
        return false
    }

    if (getMyPlayerId() == fromPlayerId || getMyPlayerId() == toPlayerId) {
        return true
    }

    // 顺手牵羊
    return (cardAreaType !== 'hand')
}

export const getControlCardPosition = (index: number) => {
    return {
        x: index * sizeConfig.controlCard.width + sizeConfig.controlCard.width / 2,
        y: sizeConfig.background.height - sizeConfig.controlCard.height / 2
    }
}