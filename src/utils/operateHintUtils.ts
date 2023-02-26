import {GameStatus} from "../types/gameStatus";
import {GameFEStatus} from "../types/gameFEStatus";
import {getI18Lan, i18, i18Lans} from "../i18n/i18nUtils";
import {i18Config} from "../i18n/i18Config";
import {
    BASIC_CARDS_CONFIG,
    CARD_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    EQUIPMENT_TYPE,
    SCROLL_CARDS_CONFIG
} from "../config/cardConfig";
import {getNeedSelectControlCardNumber} from "./cardValidation";
import {getMyResponseInfo} from "./stageUtils";
import {getMyPlayerId} from "./localStorageUtils";
import {getAmendCardTargetMinMax} from "./cardUtils";
import {getPlayerDisplayName} from "./playerUtils";

const getCanPlayInMyTurnOperationHint = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const actualCard = gameFEStatus.actualCard
    const actualCardCNName = actualCard?.CN || ''
    const actualCardName = (getI18Lan() == i18Lans.EN) ? actualCard?.EN : actualCard?.CN;
    const equipmentType = actualCard?.equipmentType;
    const selectedWeaponCard = gameFEStatus.selectedWeaponCard;

    // 没有选择牌
    if (!actualCard && !selectedWeaponCard) {
        return (i18(i18Config.PLEASE_SELECT_A_CARD))
    }
    // 基本牌
    else if ([CARD_CONFIG.SHA.CN, CARD_CONFIG.LEI_SHA.CN, CARD_CONFIG.HUO_SHA.CN].includes(actualCardCNName)) {
        const minMax = getAmendCardTargetMinMax(gameStatus, gameFEStatus)
        const replaceNumber = (minMax.min == minMax.max) ? minMax.min : `${minMax.min}-${minMax.max}`;
        return (i18(i18Config.SELECT_SHA, {number: replaceNumber}))
    } else if (actualCardCNName == CARD_CONFIG.TAO.CN) {
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
    else if (actualCardCNName == SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.CN) {
        return (i18(i18Config.SELECT_WU_ZHONG_SHENG_YOU))
    } else if (actualCardCNName == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN) {
        return (i18(i18Config.SELECT_JIE_DAO_SHA_REN))
    } else if (actualCardCNName == SCROLL_CARDS_CONFIG.JUE_DOU.CN) {
        return (i18(i18Config.SELECT_JUE_DOU))
    } else if ([
        SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN,
        SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN,
        SCROLL_CARDS_CONFIG.TAO_YUAN_JIE_YI.CN,
        SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.CN,
    ].includes(actualCardCNName)) {
        return (i18(i18Config.SELECT_AOE, {name: actualCardName}))
    } else if (actualCardCNName == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN) {
        return (i18(i18Config.SELECT_GUO_HE_CHAI_QIAO))
    } else if (actualCardCNName == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN) {
        return (i18(i18Config.SELECT_SHUN_SHOU_QIAN_YANG))
    }
    // 延时锦囊
    else if (actualCardCNName == SCROLL_CARDS_CONFIG.SHAN_DIAN.CN) {
        return (i18(i18Config.SELECT_SHAN_DIAN))
    } else if (actualCardCNName == SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN) {
        return (i18(i18Config.SELECT_LE_BU_SI_SHU))
    } else if (actualCardCNName == SCROLL_CARDS_CONFIG.BING_LIANG_CUN_DUAN.CN) {
        return (i18(i18Config.SELECT_BING_LIANG_CUN_DUAN))
    } else if (selectedWeaponCard?.CN == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.CN) {
        return (i18(i18Config.SELECT_ZHANG_BA_SHE_MAO))
    } else {
        console.log(actualCard)
        throw Error(`${actualCard?.CN}出牌时没有操作提示`)
    }
}

const getIsMyResponseCardTurnOperationHint = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    if (gameStatus.taoResStages.length > 0) {
        const targetId = gameStatus.taoResStages[0].targetId;
        const number = gameStatus.taoResStages[0].cardNumber;
        const name = getPlayerDisplayName(gameStatus, targetId);
        return i18(i18Config.RESPONSE_TAO, {number, name})
    } else if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length > 0) {
        if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds.includes(getMyPlayerId())) {
            const stage = gameStatus.scrollResStages[0];
        } else {
            return i18(i18Config.WAIT_WU_XIE)
        }
    }
    // else if (gameStatus.shanResStages.length > 0) {
    //     return {
    //         targetId: gameStatus.shanResStages[0].targetId,
    //         cardNames: [BASIC_CARDS_CONFIG.SHAN.CN],
    //     }
    // } else if (gameStatus.scrollResStages.length > 0) {
    //     const curScrollResStage = gameStatus.scrollResStages[0]
    //     if (!curScrollResStage.isEffect) {
    //         throw new Error(curScrollResStage.actualCard.CN + "未生效")
    //     }
    //
    //     let needResponseCardNames: string[] = [];
    //     switch (curScrollResStage.actualCard.CN) {
    //         case SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN:
    //             needResponseCardNames = [BASIC_CARDS_CONFIG.SHAN.CN];
    //             break;
    //         case SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN:
    //         case SCROLL_CARDS_CONFIG.JUE_DOU.CN:
    //         case SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN:
    //             needResponseCardNames = [BASIC_CARDS_CONFIG.SHA.CN, BASIC_CARDS_CONFIG.LEI_SHA.CN, BASIC_CARDS_CONFIG.HUO_SHA.CN,];
    //             break;
    //     }
    //     return {
    //         targetId: curScrollResStage.targetId,
    //         cardNames: needResponseCardNames,
    //     }
    // } else if (gameStatus.weaponResStages.length > 0) {
    //     if (gameStatus.weaponResStages[0].weaponCardName == EQUIPMENT_CARDS_CONFIG.QING_LONG_YAN_YUE_DAO.CN) {
    //         return {
    //             targetId: gameStatus.weaponResStages[0].targetId,
    //             cardNames: [BASIC_CARDS_CONFIG.SHA.CN, BASIC_CARDS_CONFIG.LEI_SHA.CN, BASIC_CARDS_CONFIG.HUO_SHA.CN,],
    //         }
    //     }
    // }
}

const getIsMyThrowTurnOperationHint = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const number = getNeedSelectControlCardNumber(gameStatus, gameFEStatus)
    return i18(i18Config.SELECT_THROW_CARDS, {number})
}

export {
    getCanPlayInMyTurnOperationHint,
    getIsMyResponseCardTurnOperationHint,
    getIsMyThrowTurnOperationHint
}