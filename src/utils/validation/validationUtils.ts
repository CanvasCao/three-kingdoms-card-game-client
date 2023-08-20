import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {
    getCanPlayInMyTurn,
    getIsMyResponseCardOrSkillTurn,
    getIsMyThrowTurn
} from "../stage/stageUtils";
import {getIsZhangBaSheMaoSelected} from "../weaponUtils";
import {getMyPlayerId} from "../localstorage/localStorageUtils";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {
    ALL_SHA_CARD_KEYS,
    DELAY_SCROLL_CARDS_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    SCROLL_CARDS_CONFIG
} from "../../config/cardConfig";
import {
    getCanPlayerPlaySha,
    getIfPlayerHasAnyCards,
    getIfPlayerHasWeapon,
    getPlayerAttackRangeNumber,
    getPlayersDistanceFromAToB
} from "../playerUtils";
import {getMyResponseInfo, getResponseType} from "../response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";
import {attachFEInfoToCard} from "../cardUtils";
import {Player} from "../../types/player";
import {findOnGoingUseStrikeEvent} from "../event/eventUtils";
import {Card, PandingSign} from "../../types/card";
import {
    getCanSelectMeAsFirstTargetCardNamesClosure,
    getCanSelectMeAsSecondTargetCardNamesClosure, getInMyPlayTurnCanPlayCardNamesClourse
} from "../cardNamesClourseUtils";
import {BasicCardResponseInfo} from "../../types/responseInfo";

const getSelectedCardNumber = (gameFEStatus: GameFEStatus) => {
    return gameFEStatus.selectedCards.length
}

const getSelectedTargetNumber = (gameFEStatus: GameFEStatus) => {
    return gameFEStatus.selectedTargetPlayers.length
}

const getNeedSelectCardsMinMax = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
    const isMyThrowTurn = getIsMyThrowTurn(gameStatus);
    const responseType = getResponseType(gameStatus);

    if (canPlayInMyTurn) {
        if (getIsZhangBaSheMaoSelected(gameFEStatus)) {
            return {min: 2, max: 2};
        }

        return {min: 1, max: 1};
    } else if (isMyResponseCardOrSkillTurn) {
        if (getIsZhangBaSheMaoSelected(gameFEStatus)) {
            return {min: 2, max: 2};
        }

        if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            if (gameStatus.skillResponse!.chooseToReleaseSkill === undefined) {
                return {min: 0, max: 0};
            } else if (gameStatus.skillResponse!.chooseToReleaseSkill == true) {
                if (gameStatus.skillResponse?.skillNameKey === EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key) {
                    return {min: 2, max: 2};
                }
            }
        }

        return {min: 1, max: 1};
    } else if (isMyThrowTurn) {
        const myPlayer = gameStatus.players[getMyPlayerId()];
        const throwNumber = myPlayer.cards.length - myPlayer.currentBlood;
        return {min: throwNumber, max: throwNumber};
    }

    return {min: 0, max: 0};
}

const getNeedSelectPlayersMinMax = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const mePlayer = gameStatus.players[getMyPlayerId()]
    const responseType = getResponseType(gameStatus)

    if (responseType == RESPONSE_TYPE_CONFIG.SKILL && gameStatus.skillResponse!.chooseToReleaseSkill) {
        if (gameStatus.skillResponse!.skillNameKey === SKILL_NAMES_CONFIG.WU006_LIU_LI.key) {
            return {min: 1, max: 1}
        } else if (gameStatus.skillResponse!.skillNameKey === SKILL_NAMES_CONFIG.WEI004_TU_XI.key) {
            return {min: 1, max: 2}
        }
    } else if (ALL_SHA_CARD_KEYS.includes(gameFEStatus.actualCard?.key)
        && mePlayer.weaponCard?.key == EQUIPMENT_CARDS_CONFIG.FANG_TIAN_HUA_JI.key
        && mePlayer.cards.length == 1
        && ALL_SHA_CARD_KEYS.includes(mePlayer.cards[0].key)
    ) {
        return {min: 1, max: 3}
    }

    if (gameFEStatus.actualCard) {
        return attachFEInfoToCard(gameFEStatus.actualCard!)!.targetMinMax;
    }

    return {min: 0, max: 0}
}

const getCanSelectEquipmentInTheory = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, eqCardName: string) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);

    if (isMyResponseCardOrSkillTurn) {
        const responseType = getResponseType(gameStatus)
        if (responseType === RESPONSE_TYPE_CONFIG.SKILL && gameStatus.skillResponse!.chooseToReleaseSkill) {
            if (gameStatus.skillResponse!.skillNameKey == SKILL_NAMES_CONFIG.WU006_LIU_LI.key) {
                return true
            } else if (gameStatus.skillResponse!.skillNameKey == EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key &&
                eqCardName !== EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key) {
                return true
            }
        }

        if (responseType === RESPONSE_TYPE_CONFIG.CARD &&
            (gameStatus.cardResponse?.actionActualCard.key == SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key ||
                gameStatus.cardResponse?.actionActualCard.key == SCROLL_CARDS_CONFIG.JUE_DOU.key) &&
            eqCardName == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key
        ) {
            return true
        }

        if (responseType === RESPONSE_TYPE_CONFIG.SCROLL &&
            gameStatus.scrollResponses[0].actualCard.key == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key &&
            eqCardName == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key
        ) {
            return true
        }
    } else if (canPlayInMyTurn) {
        if (eqCardName == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key &&
            getCanPlayerPlaySha(gameStatus.players[getMyPlayerId()])
        ) {
            return true;
        }
    } else {
        return false;
    }
}

const getIsBoardPlayerAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, targetPlayer: Player) => {
    const actualCardName = gameFEStatus?.actualCard?.key || '';
    const mePlayer = gameStatus.players[getMyPlayerId()];
    const myAttackDistance = getPlayerAttackRangeNumber(gameFEStatus, mePlayer)
    const distanceBetweenMeAndTarget = getPlayersDistanceFromAToB(gameStatus, gameFEStatus, mePlayer, targetPlayer)
    const selectedTargetNumber = getSelectedTargetNumber(gameFEStatus)
    const responseType = getResponseType(gameStatus)
    const isMyResponseTurn = getIsMyResponseCardOrSkillTurn(gameStatus)

    // 我响应技能
    if (isMyResponseTurn &&
        responseType == RESPONSE_TYPE_CONFIG.SKILL &&
        gameStatus.skillResponse!.chooseToReleaseSkill) {
        if (
            gameStatus.skillResponse!.skillNameKey === SKILL_NAMES_CONFIG.WU006_LIU_LI.key &&
            getSelectedCardNumber(gameFEStatus) == 1
        ) {
            const onGoingUseStrikeEvent = findOnGoingUseStrikeEvent(gameStatus)!
            // 不能流离给杀的来源
            if (onGoingUseStrikeEvent.originId === targetPlayer.playerId) {
                return false
            }
            // 不能流离自己
            if (mePlayer.playerId == targetPlayer.playerId) {
                return false
            }
            if (myAttackDistance < distanceBetweenMeAndTarget) {
                return false
            }
        } else if (gameStatus.skillResponse!.skillNameKey === SKILL_NAMES_CONFIG.WEI004_TU_XI.key) {
            if (mePlayer.playerId == targetPlayer.playerId) {
                return false
            }
            return targetPlayer.cards.length
        }
        return true
    }

    // 我响应锦囊
    if (isMyResponseTurn && responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
        return true
    }

    // 使用牌的时候
    // 杀
    if (ALL_SHA_CARD_KEYS.includes(actualCardName)) {
        let myAttackDistance = mePlayer?.weaponCard?.distance || 1
        if (myAttackDistance >= distanceBetweenMeAndTarget) {
            return true
        } else {
            return false
        }
    }
    // 借刀杀人
    else if (actualCardName == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key) {
        if (selectedTargetNumber == 0) {
            if (getIfPlayerHasWeapon(targetPlayer)) {
                return true
            } else {
                return false
            }
        } else if (selectedTargetNumber == 1) {
            let attackDistance, distanceBetweenAAndB;
            const weaponOwnerPlayer = gameFEStatus.selectedTargetPlayers[0];
            attackDistance = getPlayerAttackRangeNumber(gameFEStatus, weaponOwnerPlayer);
            distanceBetweenAAndB = getPlayersDistanceFromAToB(gameStatus, gameFEStatus, weaponOwnerPlayer, targetPlayer)
            if (attackDistance >= distanceBetweenAAndB) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    }
    // 乐不思蜀
    else if (actualCardName == DELAY_SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key) {
        if (targetPlayer.pandingSigns.find((sign: PandingSign) => sign.actualCard.key == DELAY_SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key)) {
            return false
        } else {
            return true
        }
    }
    // 兵粮寸断
    else if (actualCardName == DELAY_SCROLL_CARDS_CONFIG.BING_LIANG_CUN_DUAN.key) {
        if (1 >= distanceBetweenMeAndTarget) {
            return true
        } else {
            return false
        }
    }
    // 过河拆桥 顺手牵羊
    else if (actualCardName == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key) {
        if (getIfPlayerHasAnyCards(targetPlayer)) {
            return true
        } else {
            return false
        }
    } else if (actualCardName == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key) {
        if (getIfPlayerHasAnyCards(targetPlayer) && 1 >= distanceBetweenMeAndTarget) {
            return true
        } else {
            return false
        }
    } else {
        return true
    }
}

const getIsControlCardAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, card: Card) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
    const isMyThrowTurn = getIsMyThrowTurn(gameStatus);

    if (gameFEStatus.selectedSkillNameKey == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key) {
        return true
    }

    if (canPlayInMyTurn) {
        const canPlayCardNames = getInMyPlayTurnCanPlayCardNamesClourse(gameStatus.players[getMyPlayerId()])()
        if (!canPlayCardNames.includes(card.key)) {
            return false
        }
    }

    if (isMyResponseCardOrSkillTurn) {
        const {controlCardIsAbleValidate} = (getMyResponseInfo(gameStatus, gameFEStatus) as BasicCardResponseInfo)
        if (!controlCardIsAbleValidate(card)) {
            return false
        }
    }

    if (isMyThrowTurn) {
        return true
    }

    return true
}

const getCanISelectMySelfAsTarget = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    // 不用关心是谁的回合
    // 因为mePlayer的_disable 大部分情况是false（除了借刀） 所以在这里validate这张卡能否以自己为目标
    if (gameFEStatus.actualCard) {
        if (gameFEStatus.selectedTargetPlayers.length == 0) {
            if (!getCanSelectMeAsFirstTargetCardNamesClosure()().includes(gameFEStatus.actualCard.key)) {
                return false;
            }
        }
        if (gameFEStatus.selectedTargetPlayers.length == 1) {
            if (!getCanSelectMeAsSecondTargetCardNamesClosure()().includes(gameFEStatus.actualCard.key)) {
                return false;
            }
        }
    }
    return true
}

export {
    getNeedSelectPlayersMinMax,
    getNeedSelectCardsMinMax,

    getIsBoardPlayerAble,
    getIsControlCardAble,

    getCanSelectEquipmentInTheory,

    getSelectedCardNumber,
    getSelectedTargetNumber,

    getCanISelectMySelfAsTarget
};
