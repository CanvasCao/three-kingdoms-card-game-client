import {GameStatus} from "../types/gameStatus";
import {GameFEStatus} from "../types/gameFEStatus";
import {i18} from "../i18n/i18nUtils";
import {i18Config} from "../i18n/i18Config";
import {
    CARD_CONFIG,
    DELAY_SCROLL_CARDS_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    EQUIPMENT_TYPE,
    SCROLL_CARDS_CONFIG
} from "../config/cardConfig";
import {getNeedSelectControlCardNumber} from "./cardValidation";
import {getMyResponseInfo} from "./stageUtils";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {getAmendCardTargetMinMax} from "./cardUtils";
import {getCurrentPlayer, getPlayerDisplayName} from "./playerUtils";

const getCanPlayInMyTurnOperationHint = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const actualCard = gameFEStatus.actualCard
    const actualCardCNName = actualCard?.CN || ''
    const actualCardName = actualCard ? i18(actualCard) : '';
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
    } else if (gameStatus.shanResponse) {
        const targetId = gameStatus.shanResponse.targetId;
        const name = getPlayerDisplayName(gameStatus, targetId);
        return i18(i18Config.RESPONSE_SHAN, {name})
    } else if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length > 0) {
        const wuxieChain = gameStatus.wuxieSimultaneousResStage.wuxieChain;

        if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds.includes(getMyPlayerId())) {
            const scrollStage = gameStatus.scrollResStages?.[0];
            if (scrollStage) { // 锦囊的无懈可击
                let name;
                if (wuxieChain?.length == 1) {
                    name = getPlayerDisplayName(gameStatus, scrollStage.cardTakeEffectOnPlayerId);
                } else if (wuxieChain?.length > 1) {
                    const lastWuxieChainItem = wuxieChain[wuxieChain.length - 1];
                    name = getPlayerDisplayName(gameStatus, lastWuxieChainItem.cardFromPlayerId);
                }
                return i18(i18Config.RESPONSE_WU_XIE, {name})
            } else { // 判定牌的无懈可击
                const currentPlayer = getCurrentPlayer(gameStatus);
                let name;
                const needPandingSigns = currentPlayer.judgedShandian ?
                    currentPlayer.pandingSigns.filter((sign) => sign.actualCard.CN !== DELAY_SCROLL_CARDS_CONFIG.SHAN_DIAN.CN) :
                    currentPlayer.pandingSigns;

                if (wuxieChain?.length == 1) {
                    name = currentPlayer.name;
                    return i18(i18Config.RESPONSE_PANDING_WU_XIE, {
                        name,
                        cardName: i18(needPandingSigns[0].card)
                    })
                } else if (wuxieChain?.length > 1) {
                    const lastWuxieChainItem = wuxieChain[wuxieChain.length - 1];
                    name = getPlayerDisplayName(gameStatus, lastWuxieChainItem.cardFromPlayerId);
                    return i18(i18Config.RESPONSE_WU_XIE, {name})
                }
            }
        } else {
            return i18(i18Config.WAIT_WU_XIE)
        }
    } else if (gameStatus.scrollResStages.length > 0) {
        const stage = gameStatus.scrollResStages[0]
        if (!stage.isEffect) {
            throw new Error(stage.actualCard.CN + "未生效")
        }
        if (stage.actualCard.CN == SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN) {
            const name = getPlayerDisplayName(gameStatus, stage.targetId)
            return i18(i18Config.RESPONSE_WAN_JIAN_QI_FA, {name})
        } else if (stage.actualCard.CN == SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN) {
            const name = getPlayerDisplayName(gameStatus, stage.targetId)
            return i18(i18Config.RESPONSE_NAN_MAN_RU_QIN, {name})
        } else if (stage.actualCard.CN == SCROLL_CARDS_CONFIG.JUE_DOU.CN) {
            const name = getPlayerDisplayName(gameStatus, stage.targetId)
            return i18(i18Config.RESPONSE_JUE_DOU, {name})
        } else if (stage.actualCard.CN == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN) {
            const originName = getPlayerDisplayName(gameStatus, getCurrentPlayer(gameStatus).playerId)
            const targetName = getPlayerDisplayName(gameStatus, stage.targetId)
            return i18(i18Config.RESPONSE_JIE_DAO_SHA_REN, {originName, targetName})
        }
    } else if (gameStatus.weaponResStages.length > 0) {
        if (gameStatus.weaponResStages[0].weaponCardName == EQUIPMENT_CARDS_CONFIG.QING_LONG_YAN_YUE_DAO.CN) {
            return i18(i18Config.RESPONSE_QING_LONG_YAN_YUE_DAO)
        }
    } else {
        console.log(gameStatus)
        throw Error(`响应牌时没有操作提示`)
    }
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