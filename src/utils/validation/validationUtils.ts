import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {
    getCanPlayInMyTurn,
    getIsMyPlayTurn,
    getIsMyResponseCardOrSkillTurn,
    getIsMyThrowTurn
} from "../stage/stageUtils";
import {getIsZhangBaSheMaoSelected} from "../weaponUtils";
import {getMyPlayerId} from "../localstorage/localStorageUtils";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {
    ALL_SHA_CARD_KEYS,
    BASIC_CARDS_CONFIG,
    CARD_HUASE,
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
import {getResponseType} from "../response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";
import {attachFEInfoToCard} from "../cardUtils";
import {Player} from "../../types/player";
import {findOnGoingUseStrikeEvent} from "../event/eventUtils";
import {Card, PandingSign} from "../../types/card";
import {
    getCanSelectMeAsFirstTargetCardNamesClosure,
    getCanSelectMeAsSecondTargetCardNamesClosure, getInMyPlayTurnCanPlayCardNamesClourse
} from "../cardNamesClourseUtils";
import {Skill} from "../../types/skill";
import {isBoolean} from "lodash";

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

    if (getIsZhangBaSheMaoSelected(gameFEStatus)) {
        return {min: 2, max: 2};
    }

    if (canPlayInMyTurn) {
        return {min: 1, max: 1};
    }

    if (isMyResponseCardOrSkillTurn) {
        if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            if (gameStatus.skillResponse!.chooseToReleaseSkill === undefined) {
                return {min: 0, max: 0};
            } else if (gameStatus.skillResponse!.chooseToReleaseSkill == true) {
                if (gameStatus.skillResponse?.skillNameKey === EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key ||
                    gameStatus.skillResponse?.skillNameKey === SKILL_NAMES_CONFIG.WEI003_GANG_LIE.key) {
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

    if (getIsMyResponseCardOrSkillTurn(gameStatus)) {
        if (responseType == RESPONSE_TYPE_CONFIG.SKILL && gameStatus.skillResponse!.chooseToReleaseSkill) {
            switch (gameStatus.skillResponse!.skillNameKey) {
                case SKILL_NAMES_CONFIG.WU006_LIU_LI.key:
                    return {min: 1, max: 1}
                case SKILL_NAMES_CONFIG.WEI004_TU_XI.key:
                    return {min: 1, max: 2}
                default:
                    return {min: 0, max: 0}
            }
        }

        return {min: 0, max: 0}
    }

    if (ALL_SHA_CARD_KEYS.includes(gameFEStatus.actualCard?.key)
        && mePlayer.weaponCard?.key == EQUIPMENT_CARDS_CONFIG.FANG_TIAN_HUA_JI.key
        && mePlayer.cards.length == 1
        && ALL_SHA_CARD_KEYS.includes(mePlayer.cards[0].key)
    ) {
        return {min: 1, max: 3}
    }

    if (getIsMyPlayTurn(gameStatus)) {
        if (gameFEStatus.actualCard) {
            return attachFEInfoToCard(gameFEStatus.actualCard!)!.targetMinMax;
        }
    }

    return {min: 0, max: 0}
}

const getCanSelectEquipmentInTheory = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, card: Card) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
    const responseType = getResponseType(gameStatus)
    const eqCardKey = card.key;

    if (gameFEStatus.selectedSkillKey == SKILL_NAMES_CONFIG.SHU002_WU_SHENG.key) {
        // 出过杀不能用诸葛连弩当杀
        if (eqCardKey == EQUIPMENT_CARDS_CONFIG.ZHU_GE_LIAN_NU.key) {
            return !(gameStatus.players[getMyPlayerId()].shaTimes > 0)
        }

        // 借刀杀人 用武器距离不够时
        if (isMyResponseCardOrSkillTurn && responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
            const curScrollResponse = gameStatus.scrollResponses?.[0];
            if (curScrollResponse?.actualCard?.key == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key) {
                const originPlayer = gameStatus.players[curScrollResponse.originId]
                const targetPlayer = gameStatus.players[curScrollResponse.targetId]

                const fakeGameFEStatus = {selectedCards: [card]} as GameFEStatus
                const myAttackDistance = getPlayerAttackRangeNumber(fakeGameFEStatus, originPlayer)
                const distanceBetweenMeAndTarget = getPlayersDistanceFromAToB(gameStatus, fakeGameFEStatus, originPlayer, targetPlayer)

                if (myAttackDistance >= distanceBetweenMeAndTarget) {
                    return true
                } else {
                    return false
                }
            }
        }

        return [CARD_HUASE.HONGTAO, CARD_HUASE.FANGKUAI].includes(card.huase)
    } else if (gameFEStatus.selectedSkillKey == SKILL_NAMES_CONFIG.WU002_QI_XI.key) {
        return [CARD_HUASE.HEITAO, CARD_HUASE.CAOHUA].includes(card.huase)
    } else if (isMyResponseCardOrSkillTurn) {
        if (responseType === RESPONSE_TYPE_CONFIG.SKILL && gameStatus.skillResponse!.chooseToReleaseSkill) {
            if (gameStatus.skillResponse!.skillNameKey == SKILL_NAMES_CONFIG.WU006_LIU_LI.key) {
                return true
            } else if (gameStatus.skillResponse!.skillNameKey == EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key &&
                eqCardKey !== EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key) {
                return true
            }
        }

        if (responseType === RESPONSE_TYPE_CONFIG.CARD &&
            (gameStatus.cardResponse?.actionActualCard.key == SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key ||
                gameStatus.cardResponse?.actionActualCard.key == SCROLL_CARDS_CONFIG.JUE_DOU.key) &&
            eqCardKey == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key
        ) {
            return true
        }

        if (responseType === RESPONSE_TYPE_CONFIG.SCROLL &&
            gameStatus.scrollResponses[0].actualCard.key == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key &&
            eqCardKey == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key
        ) {
            return true
        }
    } else if (canPlayInMyTurn) {
        if (eqCardKey == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key &&
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

    // 确定响应技能后
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
        const bingLiangRange = mePlayer.bingLiangRange || 1
        if (bingLiangRange >= distanceBetweenMeAndTarget) {
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
        const shunRange = mePlayer.shunRange || 1
        if (getIfPlayerHasAnyCards(targetPlayer) && shunRange >= distanceBetweenMeAndTarget) {
            return true
        } else {
            return false
        }
    } else {
        return true
    }
}

const getIsControlCardAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, card: Partial<Card>) => {
    const res = getIsControlCardAbleByGameFEStatus(gameFEStatus, card)
    if (isBoolean(res)) {
        return res
    }
    return getIsControlCardAbleByGameStatus(gameStatus, card)
}

const getIsControlCardAbleByGameFEStatus = (gameFEStatus: GameFEStatus, card: Partial<Card>) => {
    if (gameFEStatus.selectedSkillKey == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key) {
        return true
    }

    if (gameFEStatus.selectedSkillKey == SKILL_NAMES_CONFIG.SHU002_WU_SHENG.key) {
        return [CARD_HUASE.HONGTAO, CARD_HUASE.FANGKUAI].includes(card.huase!)
    }

    if (gameFEStatus.selectedSkillKey == SKILL_NAMES_CONFIG.WU002_QI_XI.key) {
        return [CARD_HUASE.HEITAO, CARD_HUASE.CAOHUA].includes(card.huase!)
    }
}

const getIsControlCardAbleByGameStatus = (gameStatus: GameStatus, card: Partial<Card>) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
    const isMyThrowTurn = getIsMyThrowTurn(gameStatus);

    if (canPlayInMyTurn) {
        const canPlayCardNames = getInMyPlayTurnCanPlayCardNamesClourse(gameStatus.players[getMyPlayerId()])()
        return canPlayCardNames.includes(card.key!)
    }

    if (isMyResponseCardOrSkillTurn) {
        const responseType = getResponseType(gameStatus)
        if (responseType == RESPONSE_TYPE_CONFIG.TAO) {
            return [BASIC_CARDS_CONFIG.TAO.key].includes(card.key!)
        } else if (responseType == RESPONSE_TYPE_CONFIG.CARD) {
            const cardResponse = gameStatus.cardResponse!

            switch (cardResponse.actionActualCard.key) {
                case SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.key:
                case BASIC_CARDS_CONFIG.SHA.key:
                case BASIC_CARDS_CONFIG.LEI_SHA.key:
                case BASIC_CARDS_CONFIG.HUO_SHA.key:
                    return [BASIC_CARDS_CONFIG.SHAN.key].includes(card.key!)

                case SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key:
                case SCROLL_CARDS_CONFIG.JUE_DOU.key:
                    return ALL_SHA_CARD_KEYS.includes(card.key)
                default:
                    return false
            }
        } else if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            const skillNameKey = gameStatus.skillResponse!.skillNameKey;
            const chooseToReleaseSkill = gameStatus.skillResponse!.chooseToReleaseSkill;

            if (chooseToReleaseSkill == undefined) {
                return false
            }

            switch (skillNameKey) {
                case SKILL_NAMES_CONFIG.WEI002_GUI_CAI.key:
                case SKILL_NAMES_CONFIG.WEI003_GANG_LIE.key:
                case SKILL_NAMES_CONFIG.WU006_LIU_LI.key:
                case EQUIPMENT_CARDS_CONFIG.CI_XIONG_SHUANG_GU_JIAN.key:
                case EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key:
                case SKILL_NAMES_CONFIG.WEI003_GANG_LIE.key:
                    return true
                case EQUIPMENT_CARDS_CONFIG.QING_LONG_YAN_YUE_DAO.key:
                    return ALL_SHA_CARD_KEYS.includes(card.key)
                default:
                    return false
            }
        } else if (responseType == RESPONSE_TYPE_CONFIG.CARD_BOARD) {
            return false
        } else if (responseType == RESPONSE_TYPE_CONFIG.WUXIE) {
            return [SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.key].includes(card.key!)
        } else if (responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
            const curScrollResponse = gameStatus.scrollResponses[0]

            switch (curScrollResponse.actualCard.key) {
                case SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key:
                    return ALL_SHA_CARD_KEYS.includes(card.key)
                default:
                    return false
            }
        }
    }

    if (isMyThrowTurn) {
        return true
    }

    return true
}

const getIsSkillAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, skill: Skill) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
    if (skill.key == SKILL_NAMES_CONFIG.SHU002_WU_SHENG.key) {
        if (canPlayInMyTurn || isMyResponseCardOrSkillTurn) {
            return getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHA.key}) // 不考虑前端点击（丈八蛇矛） 只计算当前是否可以出杀
        }
    }
    if (skill.key == SKILL_NAMES_CONFIG.WU002_QI_XI.key) {
        if (canPlayInMyTurn) {
            return getIsControlCardAbleByGameStatus(gameStatus, {key: SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key})
        }
    }
    return false
}

const getCanISelectMySelfAsTarget = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    // mePlayer的_disable大部分情况是false（除了借刀） 所以在这里validate这张卡能否以自己为目标
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
    getIsControlCardAbleByGameStatus,
    getIsControlCardAbleByGameFEStatus,
    getIsSkillAble,

    getCanSelectEquipmentInTheory,

    getSelectedCardNumber,
    getSelectedTargetNumber,

    getCanISelectMySelfAsTarget
};
