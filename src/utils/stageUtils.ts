import {GameStatus} from "../types/gameStatus";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {BASIC_CARDS_CONFIG, EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {GAME_STAGE, STAGE_NAMES} from "../config/gameConfig";
import {ResponseInfo} from "../types/responseInfo";
import {Card} from "../types/card";
import { SKILL_NAMES } from "../config/skillsConfig";

const getIsMyPlayTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && STAGE_NAMES[gameStatus.stage.stageIndex] == GAME_STAGE.PLAY;
}
const getIsMyThrowTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && STAGE_NAMES[gameStatus.stage.stageIndex] == GAME_STAGE.THROW;
}
const getIsMyResponseTurn = (gameStatus: GameStatus) => {
    if (gameStatus.shanResponse) {
        return gameStatus.shanResponse.originId == getMyPlayerId();
    }
    if (gameStatus.skillResponse) {
        return gameStatus.skillResponse.playerId == getMyPlayerId();
    }
    if (gameStatus.taoResponses.length > 0) {
        return gameStatus.taoResponses[0]?.originId == getMyPlayerId();
    }
    if (gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds?.length) {
        return gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.includes(getMyPlayerId())
    }
    if (gameStatus.scrollResponses?.length > 0) {
        // 不需要判断isEffect 如果没有人想出无懈可击 锦囊肯定生效了
        return gameStatus.scrollResponses[0].originId == getMyPlayerId() &&
            ([SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN,
                SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN,
                SCROLL_CARDS_CONFIG.JUE_DOU.CN,
                SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN,
            ].includes(gameStatus.scrollResponses[0].actualCard.CN))
    }
    if (gameStatus.weaponResponses.length > 0) {
        return gameStatus.weaponResponses[0]?.originId == getMyPlayerId();
    }
    return false;
}

const getCanPlayInMyTurn = (gameStatus: GameStatus) => {
    return !gameStatus.shanResponse &&
        !gameStatus.skillResponse &&
        gameStatus.taoResponses.length <= 0 &&
        gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds?.length <= 0 &&
        gameStatus.scrollResponses.length <= 0 &&
        gameStatus.weaponResponses.length <= 0 &&
        getIsMyPlayTurn(gameStatus);
}

const getMyResponseInfo = (gameStatus: GameStatus): ResponseInfo => {
    if (gameStatus.shanResponse) {
        return {
            targetId: gameStatus.shanResponse.targetId,
            cardValidate: (card) => [BASIC_CARDS_CONFIG.SHAN.CN].includes(card?.CN!),
            needResponseCard: true,
        }
    } else if (gameStatus.skillResponse) {
        const skillName = gameStatus.skillResponse.skillName;
        const chooseToReleaseSkill = gameStatus.skillResponse.chooseToReleaseSkill;
        let cardValidate = (card?: Card) => false
        let needResponseCard = true;
        if (skillName == SKILL_NAMES.SHU["006"].TIE_JI) {
            cardValidate = (card?: Card) => false
            needResponseCard = false;
        } else if (skillName == SKILL_NAMES.WEI["002"].GUI_CAI) {
            if (chooseToReleaseSkill == undefined) { // 是否发动鬼才
                cardValidate = (card?: Card) => false
                needResponseCard = false;
            } else if (chooseToReleaseSkill) { // 发动鬼才 选择手牌
                cardValidate = (card?: Card) => true
                needResponseCard = true;
            }
        }
        return {cardValidate, needResponseCard}
    } else if (gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds?.length > 0) {
        const wuxieChain = gameStatus.wuxieSimultaneousResponse.wuxieChain
        const lastChainItem = wuxieChain[wuxieChain.length - 1]
        return {
            wuxieTargetCardId: lastChainItem.actualCard.cardId,// 为了校验无懈可击是否冲突
            cardValidate: (card) => [SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN].includes(card?.CN!),
            needResponseCard: true,
        }
    } else if (gameStatus.taoResponses.length > 0) {
        return {
            targetId: gameStatus.taoResponses[0].targetId,
            cardValidate: (card) => [BASIC_CARDS_CONFIG.TAO.CN].includes(card?.CN!),
            needResponseCard: true,
        }
    } else if (gameStatus.scrollResponses.length > 0) {
        const curScrollResponse = gameStatus.scrollResponses[0]
        if (!curScrollResponse.isEffect) {
            throw new Error(curScrollResponse.actualCard.CN + "未生效")
        }

        let cardValidate = (card?: Card) => false
        switch (curScrollResponse.actualCard.CN) {
            case SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN:
                cardValidate = (card) => [BASIC_CARDS_CONFIG.SHAN.CN].includes(card?.CN!)
                break;
            case SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN:
            case SCROLL_CARDS_CONFIG.JUE_DOU.CN:
            case SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN:
                cardValidate = (card) => [
                    BASIC_CARDS_CONFIG.SHA.CN,
                    BASIC_CARDS_CONFIG.LEI_SHA.CN,
                    BASIC_CARDS_CONFIG.HUO_SHA.CN].includes(card?.CN!)
                break;
        }
        return {
            targetId: curScrollResponse.targetId,
            cardValidate,
            needResponseCard: true,
        }
    } else if (gameStatus.weaponResponses.length > 0) {
        if (gameStatus.weaponResponses[0].weaponCardName == EQUIPMENT_CARDS_CONFIG.QING_LONG_YAN_YUE_DAO.CN) {
            return {
                targetId: gameStatus.weaponResponses[0].targetId,
                cardValidate: (card) => [
                    BASIC_CARDS_CONFIG.SHA.CN,
                    BASIC_CARDS_CONFIG.LEI_SHA.CN,
                    BASIC_CARDS_CONFIG.HUO_SHA.CN].includes(card?.CN!),
                needResponseCard: true,
            }
        }
    }
}

export {
    // my turn for UI and getCanPlayInMyTurn
    getIsMyPlayTurn,

    // 我需要出牌的状态
    getIsMyResponseTurn, // response 包括闪桃无懈可击和技能 不包括弃牌
    getIsMyThrowTurn,
    getCanPlayInMyTurn,

    getMyResponseInfo
}
