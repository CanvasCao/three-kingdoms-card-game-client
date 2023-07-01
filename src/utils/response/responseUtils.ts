import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {ResponseInfo} from "../../types/responseInfo";
import {
    ALL_SHA_CARD_NAMES,
    BASIC_CARDS_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    SCROLL_CARDS_CONFIG
} from "../../config/cardConfig";
import {Card} from "../../types/card";
import {SKILL_NAMES} from "../../config/skillsConfig";
import {getSelectedCardNumber, getSelectedTargetNumber} from "../validationUtils";

const getMyResponseInfo = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): ResponseInfo => {
    if (gameStatus.shanResponse) {
        return {
            targetId: gameStatus.shanResponse.targetId,
            cardIsAbleValidate: (card) => [BASIC_CARDS_CONFIG.SHAN.CN].includes(card?.CN!),
            okButtonIsAbleValidate: (gameFEStatus) => gameFEStatus.actualCard?.CN === BASIC_CARDS_CONFIG.SHAN.CN
        }
    } else if (gameStatus.skillResponse) {
        const skillName = gameStatus.skillResponse.skillName;
        const chooseToReleaseSkill = gameStatus.skillResponse.chooseToReleaseSkill;
        let cardIsAbleValidate = (card: Card) => false
        let okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => true

        if (skillName == SKILL_NAMES.SHU["006"].TIE_JI) {
        } else if (skillName == SKILL_NAMES.WEI["002"].GUI_CAI) {
            if (chooseToReleaseSkill == undefined) { // 是否发动鬼才
            } else if (chooseToReleaseSkill) { // 发动鬼才 选择手牌
                cardIsAbleValidate = (card: Card) => true
                okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => getSelectedCardNumber(gameFEStatus) === 1
            }
        } else if (skillName == SKILL_NAMES.WU["006"].LIU_LI) {
            if (chooseToReleaseSkill == undefined) {
            } else if (chooseToReleaseSkill) {
                cardIsAbleValidate = (card: Card) => true
                okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => getSelectedCardNumber(gameFEStatus) === 1 && getSelectedTargetNumber(gameFEStatus) === 1
            }
        }
        return {
            cardIsAbleValidate,
            okButtonIsAbleValidate,
            skillTargetIds: gameFEStatus.selectedTargetPlayers.map(p => p.playerId)
        }
    } else if (gameStatus.wuxieSimultaneousResponse?.hasWuxiePlayerIds?.length > 0) {
        const wuxieChain = gameStatus.wuxieSimultaneousResponse.wuxieChain
        const lastChainItem = wuxieChain[wuxieChain.length - 1]
        return {
            wuxieTargetCardId: lastChainItem.actualCard.cardId,// 为了校验无懈可击是否冲突
            cardIsAbleValidate: (card) => [SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN].includes(card?.CN!),
            okButtonIsAbleValidate: (gameFEStatus: GameFEStatus) => gameFEStatus.actualCard?.CN === SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN
        }
    } else if (gameStatus.taoResponses.length > 0) {
        return {
            targetId: gameStatus.taoResponses[0].targetId,
            cardIsAbleValidate: (card) => [BASIC_CARDS_CONFIG.TAO.CN].includes(card?.CN!),
            okButtonIsAbleValidate: (gameFEStatus: GameFEStatus) => gameFEStatus.actualCard?.CN === BASIC_CARDS_CONFIG.TAO.CN
        }
    } else if (gameStatus.scrollResponses.length > 0) {
        const curScrollResponse = gameStatus.scrollResponses[0]
        if (!curScrollResponse.isEffect) {
            throw new Error(curScrollResponse.actualCard.CN + "未生效")
        }

        let cardIsAbleValidate = (card: Card) => false
        let okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => false

        switch (curScrollResponse.actualCard.CN) {
            case SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN:
                cardIsAbleValidate = (card) => [BASIC_CARDS_CONFIG.SHAN.CN].includes(card?.CN!)
                okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => gameFEStatus.actualCard?.CN === BASIC_CARDS_CONFIG.SHAN.CN
                break;
            case SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN:
            case SCROLL_CARDS_CONFIG.JUE_DOU.CN:
            case SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN:
                cardIsAbleValidate = (card) => ALL_SHA_CARD_NAMES.includes(card?.CN!)
                okButtonIsAbleValidate = (gameFEStatus: GameFEStatus) => ALL_SHA_CARD_NAMES.includes(gameFEStatus.actualCard?.CN!)
                break;
        }
        return {
            targetId: curScrollResponse.targetId,
            cardIsAbleValidate,
            okButtonIsAbleValidate
        }
    } else if (gameStatus.weaponResponses.length > 0) {
        if (gameStatus.weaponResponses[0].weaponCardName == EQUIPMENT_CARDS_CONFIG.QING_LONG_YAN_YUE_DAO.CN) {
            return {
                targetId: gameStatus.weaponResponses[0].targetId,
                cardIsAbleValidate: (card) => ALL_SHA_CARD_NAMES.includes(card?.CN!),
                okButtonIsAbleValidate: (gameFEStatus: GameFEStatus) => ALL_SHA_CARD_NAMES.includes(gameFEStatus.actualCard?.CN!)
            }
        }
    }
}
export {getMyResponseInfo};