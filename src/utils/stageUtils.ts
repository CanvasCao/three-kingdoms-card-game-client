import {GameStatus} from "../types/gameStatus";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {BASIC_CARDS_CONFIG, EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {GAME_STAGE, STAGE_NAMES} from "../config/gameConfig";

const getIsMyPlayTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && STAGE_NAMES[gameStatus.stage.stageIndex] == GAME_STAGE.PLAY;
}
const getIsMyThrowTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && STAGE_NAMES[gameStatus.stage.stageIndex] == GAME_STAGE.THROW;
}
const getIsMyResponseCardTurn = (gameStatus: GameStatus) => {
    if (gameStatus.taoResStages.length > 0) {
        return gameStatus.taoResStages[0]?.originId == getMyPlayerId();
    }
    if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length) {
        return gameStatus.wuxieSimultaneousResStage.hasWuxiePlayerIds.includes(getMyPlayerId())
    }
    if (gameStatus.scrollResStages?.length > 0) {
        // 不需要判断isEffect 如果没有人想出无懈可击 锦囊肯定生效了
        return gameStatus.scrollResStages[0].originId == getMyPlayerId() &&
            ([SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN,
                SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN,
                SCROLL_CARDS_CONFIG.JUE_DOU.CN,
                SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN,
            ].includes(gameStatus.scrollResStages[0].actualCard.CN))
    }
    if (gameStatus.shanResStages.length > 0) {
        return gameStatus.shanResStages[0]?.originId == getMyPlayerId();
    }
    if (gameStatus.weaponResStages.length > 0) {
        return gameStatus.weaponResStages[0]?.originId == getMyPlayerId();
    }
    return false;
}
const getCanPlayInMyTurn = (gameStatus: GameStatus) => {
    return gameStatus.shanResStages.length <= 0 &&
        gameStatus.taoResStages.length <= 0 &&
        gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length <= 0 &&
        gameStatus.scrollResStages.length <= 0 &&
        gameStatus.weaponResStages.length <= 0 &&
        getIsMyPlayTurn(gameStatus);
}

const getMyResponseInfo = (gameStatus: GameStatus):
    {
        cardNames: string[],
        targetId?: string,
        wuxieTargetCardId?: string
    } | undefined => {
    if (gameStatus.taoResStages.length > 0) {
        return {
            targetId: gameStatus.taoResStages[0].targetId,
            cardNames: [BASIC_CARDS_CONFIG.TAO.CN],
        }
    } else if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length > 0) {
        const chainItem = gameStatus.wuxieSimultaneousResStage.wuxieChain[gameStatus.wuxieSimultaneousResStage.wuxieChain.length - 1]
        return {
            cardNames: [SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN],
            wuxieTargetCardId: chainItem.actualCard.cardId,// 为了校验无懈可击是否冲突
        }
    } else if (gameStatus.shanResStages.length > 0) {
        return {
            targetId: gameStatus.shanResStages[0].targetId,
            cardNames: [BASIC_CARDS_CONFIG.SHAN.CN],
        }
    } else if (gameStatus.scrollResStages.length > 0) {
        const curScrollResStage = gameStatus.scrollResStages[0]
        if (!curScrollResStage.isEffect) {
            throw new Error(curScrollResStage.actualCard.CN + "未生效")
        }

        let needResponseCardNames: string[] = [];
        switch (curScrollResStage.actualCard.CN) {
            case SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN:
                needResponseCardNames = [BASIC_CARDS_CONFIG.SHAN.CN];
                break;
            case SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN:
            case SCROLL_CARDS_CONFIG.JUE_DOU.CN:
            case SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN:
                needResponseCardNames = [BASIC_CARDS_CONFIG.SHA.CN, BASIC_CARDS_CONFIG.LEI_SHA.CN, BASIC_CARDS_CONFIG.HUO_SHA.CN,];
                break;
        }
        return {
            targetId: curScrollResStage.targetId,
            cardNames: needResponseCardNames,
        }
    } else if (gameStatus.weaponResStages.length > 0) {
        if (gameStatus.weaponResStages[0].weaponCardName == EQUIPMENT_CARDS_CONFIG.QING_LONG_YAN_YUE_DAO.CN) {
            return {
                targetId: gameStatus.weaponResStages[0].targetId,
                cardNames: [BASIC_CARDS_CONFIG.SHA.CN, BASIC_CARDS_CONFIG.LEI_SHA.CN, BASIC_CARDS_CONFIG.HUO_SHA.CN,],
            }
        }
    }
}

export {
    // my turn for UI and getCanPlayInMyTurn
    getIsMyPlayTurn,

    // 我需要出牌的状态
    getIsMyResponseCardTurn, // response 包括闪桃无懈可击 不包括弃牌
    getIsMyThrowTurn,
    getCanPlayInMyTurn,

    getMyResponseInfo
}
