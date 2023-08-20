import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {ResponseInfo} from "../../types/responseInfo";
import {
    ALL_SHA_CARD_KEYS,
    BASIC_CARDS_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    SCROLL_CARDS_CONFIG
} from "../../config/cardConfig";
import {Card} from "../../types/card";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {getSelectedCardNumber, getSelectedTargetNumber} from "../validation/validationUtils";
import {RESPONSE_TYPE_CONFIG, RESPONSE_TYPE_CONFIG_VALUES} from "../../config/responseTypeConfig";

const getResponseType = (gameStatus: GameStatus): RESPONSE_TYPE_CONFIG_VALUES | undefined => {
    if (gameStatus.taoResponses.length > 0) {
        return RESPONSE_TYPE_CONFIG.TAO;
    } else if (gameStatus.cardResponse) {
        return RESPONSE_TYPE_CONFIG.CARD;
    } else if (gameStatus.skillResponse) {
        return RESPONSE_TYPE_CONFIG.SKILL;
    } else if (gameStatus.cardBoardResponses.length > 0) {
        return RESPONSE_TYPE_CONFIG.CARD_BOARD;
    } else if (gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds?.length > 0) {
        return RESPONSE_TYPE_CONFIG.WUXIE;
    } else if (gameStatus.scrollResponses.length > 0) {
        return RESPONSE_TYPE_CONFIG.SCROLL;
    }
}

const getMyResponseInfo = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): ResponseInfo => {
    const responseType = getResponseType(gameStatus)
    if (responseType == RESPONSE_TYPE_CONFIG.TAO) {
        return {
            targetId: gameStatus.taoResponses[0].targetId,
            controlCardIsAbleValidate: (card) => [BASIC_CARDS_CONFIG.TAO.key].includes(card?.key!),
            okButtonIsAbleValidate: (gameFEStatus: GameFEStatus) => gameFEStatus.actualCard?.key === BASIC_CARDS_CONFIG.TAO.key
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.CARD) {
        const cardResponse = gameStatus.cardResponse!
        let controlCardIsAbleValidate = (card: Card) => false
        let okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => false

        switch (cardResponse.actionActualCard.key) {
            case SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.key:
            case BASIC_CARDS_CONFIG.SHA.key:
            case BASIC_CARDS_CONFIG.LEI_SHA.key:
            case BASIC_CARDS_CONFIG.HUO_SHA.key:
                controlCardIsAbleValidate = (card) => [BASIC_CARDS_CONFIG.SHAN.key].includes(card?.key!)
                okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => gameFEStatus.actualCard?.key === BASIC_CARDS_CONFIG.SHAN.key
                break;
            case SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key:
            case SCROLL_CARDS_CONFIG.JUE_DOU.key:
                controlCardIsAbleValidate = (card) => ALL_SHA_CARD_KEYS.includes(card?.key!)
                okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => ALL_SHA_CARD_KEYS.includes(gameFEStatus.actualCard?.key!)
                break;
        }

        return {
            targetId: cardResponse.targetId,
            controlCardIsAbleValidate,
            okButtonIsAbleValidate
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
        const skillNameKey = gameStatus.skillResponse!.skillNameKey;
        const chooseToReleaseSkill = gameStatus.skillResponse!.chooseToReleaseSkill;
        let controlCardIsAbleValidate = (card: Card) => false
        let okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => true

        if (chooseToReleaseSkill == undefined) {
            return {
                controlCardIsAbleValidate,
                okButtonIsAbleValidate,
            }
        }

        if (skillNameKey == SKILL_NAMES_CONFIG.WEI002_GUI_CAI.key) {
            controlCardIsAbleValidate = (card: Card) => true
            okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => getSelectedCardNumber(gameFEStatus) === 1
        } else if (skillNameKey == SKILL_NAMES_CONFIG.WEI004_TU_XI.key) {
            controlCardIsAbleValidate = (card: Card) => false
            okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => getSelectedTargetNumber(gameFEStatus) <= 2 &&
                getSelectedTargetNumber(gameFEStatus) >= 1
        } else if (skillNameKey == SKILL_NAMES_CONFIG.WU006_LIU_LI.key) {
            controlCardIsAbleValidate = (card: Card) => true
            okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) =>
                getSelectedCardNumber(gameFEStatus) === 1 &&
                getSelectedTargetNumber(gameFEStatus) === 1
        } else if (skillNameKey == EQUIPMENT_CARDS_CONFIG.CI_XIONG_SHUANG_GU_JIAN.key) {
            controlCardIsAbleValidate = (card: Card) => true
            okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => getSelectedCardNumber(gameFEStatus) === 1
        } else if (skillNameKey == EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key) {
            controlCardIsAbleValidate = (card: Card) => true
            okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => getSelectedCardNumber(gameFEStatus) === 2
        } else if (skillNameKey == EQUIPMENT_CARDS_CONFIG.QING_LONG_YAN_YUE_DAO.key) {
            controlCardIsAbleValidate = (card: Card) => ALL_SHA_CARD_KEYS.includes(card?.key!)
            okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => getSelectedCardNumber(gameFEStatus) === 1
        }
        return {
            controlCardIsAbleValidate,
            okButtonIsAbleValidate,
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.CARD_BOARD) {
        return {
            controlCardIsAbleValidate: (card) => false,
            okButtonIsAbleValidate: (gameFEStatus: GameFEStatus) => false
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.WUXIE) {
        const wuxieChain = gameStatus.wuxieSimultaneousResponse.wuxieChain
        const lastChainItem = wuxieChain[wuxieChain.length - 1]
        return {
            wuxieTargetCardId: lastChainItem.actualCard.cardId,// 为了校验无懈可击是否冲突
            controlCardIsAbleValidate: (card) => [SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.key].includes(card?.key!),
            okButtonIsAbleValidate: (gameFEStatus: GameFEStatus) => gameFEStatus.actualCard?.key === SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.key
        }
    } else if (responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
        const curScrollResponse = gameStatus.scrollResponses[0]
        if (!curScrollResponse.isEffect) {
            throw new Error(curScrollResponse.actualCard.key + "未生效")
        }

        let controlCardIsAbleValidate = (card: Card) => false
        let okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => false

        switch (curScrollResponse.actualCard.key) {
            case SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key:
                controlCardIsAbleValidate = (card) => ALL_SHA_CARD_KEYS.includes(card?.key!)
                okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => ALL_SHA_CARD_KEYS.includes(gameFEStatus.actualCard?.key!)
                break;
        }
        return {
            targetId: curScrollResponse.targetId,
            controlCardIsAbleValidate,
            okButtonIsAbleValidate
        }
    }
}
export {
    getMyResponseInfo,
    getResponseType
};