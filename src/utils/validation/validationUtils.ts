import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {
    getCanPlayInMyTurn,
    getIsMyPlayTurn,
    getIsMyResponseCardOrSkillTurn,
    getIsMyThrowTurn
} from "../stage/stageUtils";
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
import {Skill} from "../../types/skill";
import {isBoolean} from "lodash";
import {CARD_CONFIG_WITH_FE_INFO} from "../../config/cardConfigWithFEInfo";

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
    const selectedSkillKey = gameFEStatus.selectedSkillKey;

    if (selectedSkillKey === EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key) {
        return {min: 2, max: 2};
    }

    if (canPlayInMyTurn) {
        if ([SKILL_NAMES_CONFIG.SHU001_REN_DE.key,
            SKILL_NAMES_CONFIG.WU001_ZHI_HENG.key].includes(selectedSkillKey)) {
            return {min: 1, max: 100};
        }

        if ([SKILL_NAMES_CONFIG.WU005_FAN_JIAN.key].includes(selectedSkillKey)) {
            return {min: 0, max: 0};
        }

        if ([SKILL_NAMES_CONFIG.WU008_JIE_YIN.key].includes(selectedSkillKey)) {
            return {min: 2, max: 2};
        }

        return {min: 1, max: 1};
    }

    if (isMyResponseCardOrSkillTurn) {
        if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            if (gameStatus.skillResponse!.chooseToReleaseSkill === undefined) {
                return {min: 0, max: 0};
            } else if (gameStatus.skillResponse!.chooseToReleaseSkill == true) {
                if (gameStatus.skillResponse?.skillKey === EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key ||
                    gameStatus.skillResponse?.skillKey === SKILL_NAMES_CONFIG.WEI003_GANG_LIE.key) {
                    return {min: 2, max: 2};
                } else if (gameStatus.skillResponse?.skillKey === SKILL_NAMES_CONFIG.WEI004_TU_XI.key) {
                    return {min: 0, max: 0};
                } else if (gameStatus.skillResponse?.skillKey === SKILL_NAMES_CONFIG.WEI006_YI_JI.key) {
                    return {min: 1, max: 2};
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
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
    const isMyThrowTurn = getIsMyThrowTurn(gameStatus);
    const responseType = getResponseType(gameStatus)
    const actualCard = gameFEStatus?.actualCard
    const selectedSkillKey = gameFEStatus?.selectedSkillKey

    if (isMyResponseCardOrSkillTurn) {
        if (responseType == RESPONSE_TYPE_CONFIG.SKILL && gameStatus.skillResponse!.chooseToReleaseSkill) {
            switch (gameStatus.skillResponse!.skillKey) {
                case SKILL_NAMES_CONFIG.WU006_LIU_LI.key:
                case SKILL_NAMES_CONFIG.WEI006_YI_JI.key:
                    return {min: 1, max: 1}
                case SKILL_NAMES_CONFIG.WEI004_TU_XI.key:
                    return {min: 1, max: 2}
                default:
                    return {min: 0, max: 0}
            }
        }

        return {min: 0, max: 0}
    }

    if (canPlayInMyTurn) {
        if ([SKILL_NAMES_CONFIG.SHU001_REN_DE.key,
            SKILL_NAMES_CONFIG.WU005_FAN_JIAN.key,
            SKILL_NAMES_CONFIG.WU008_JIE_YIN.key,
            SKILL_NAMES_CONFIG.QUN001_QING_NANG.key,
        ].includes(selectedSkillKey)
        ) {
            return {min: 1, max: 1}
        }

        if ([SKILL_NAMES_CONFIG.QUN003_LI_JIAN.key].includes(selectedSkillKey)
        ) {
            return {min: 2, max: 2}
        }

        if (ALL_SHA_CARD_KEYS.includes(gameFEStatus.actualCard?.key)
            && mePlayer.weaponCard?.key == EQUIPMENT_CARDS_CONFIG.FANG_TIAN_HUA_JI.key
            && mePlayer.cards.length == 1
            && ALL_SHA_CARD_KEYS.includes(mePlayer.cards[0].key)
        ) {
            return {min: 1, max: 3}
        }

        if (actualCard) {
            return attachFEInfoToCard(actualCard)!.targetMinMax;
        }
    }

    return {min: 0, max: 0}
}

const getCanSelectEquipmentInTheory = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, card: Card) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
    const responseType = getResponseType(gameStatus)
    const eqCardKey = card.key;
    const cardResponse = gameStatus.cardResponse;

    if (gameFEStatus.selectedSkillKey == SKILL_NAMES_CONFIG.SHU002_WU_SHENG.key) {
        // 出过杀不能用诸葛连弩当杀
        if (eqCardKey == EQUIPMENT_CARDS_CONFIG.ZHU_GE_LIAN_NU.key) {
            return !(gameStatus.players[getMyPlayerId()].shaTimes > 0)
        }

        // 借刀杀人 用武器距离不够时
        if (isMyResponseCardOrSkillTurn && responseType == RESPONSE_TYPE_CONFIG.CARD) {
            const cardResponse = gameStatus.cardResponse;
            if (cardResponse?.actionActualCard?.key == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key) {
                const originPlayer = gameStatus.players[cardResponse.originId]
                const targetPlayer = gameStatus.players[cardResponse.targetId]

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
    } else if (gameFEStatus.selectedSkillKey == SKILL_NAMES_CONFIG.WU006_GUO_SE.key) {
        return [CARD_HUASE.FANGKUAI].includes(card.huase)
    } else if (gameFEStatus.selectedSkillKey == SKILL_NAMES_CONFIG.QUN001_JI_JIU.key) {
        return [CARD_HUASE.HONGTAO, CARD_HUASE.FANGKUAI].includes(card.huase)
    } else if ([
        SKILL_NAMES_CONFIG.WU001_ZHI_HENG.key,
        SKILL_NAMES_CONFIG.QUN003_LI_JIAN.key
    ].includes(gameFEStatus.selectedSkillKey)) {
        return true
    }

    // 响应
    else if (isMyResponseCardOrSkillTurn) {
        if (responseType === RESPONSE_TYPE_CONFIG.SKILL && gameStatus.skillResponse!.chooseToReleaseSkill) {
            if (gameStatus.skillResponse!.skillKey == SKILL_NAMES_CONFIG.WU006_LIU_LI.key) {
                return true
            } else if (gameStatus.skillResponse!.skillKey == EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key &&
                eqCardKey !== EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key) {
                return true
            }
        }

        if (responseType === RESPONSE_TYPE_CONFIG.CARD &&
            [SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.key,
                SCROLL_CARDS_CONFIG.JUE_DOU.key,
                SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key].includes(cardResponse?.actionActualCard?.key || '') &&
            !gameFEStatus.selectedSkillKey && // 选中技能就不能选丈八蛇矛
            eqCardKey == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key
        ) {
            return true
        }
    }

    // 出牌
    else if (canPlayInMyTurn) {
        if (!gameFEStatus.selectedSkillKey && // 选中技能就不能选丈八蛇矛
            eqCardKey == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key &&
            getCanPlayerPlaySha(gameStatus.players[getMyPlayerId()])
        ) {
            return true;
        }
    } else {
        return false;
    }
}

const getIsBoardPlayerAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, targetPlayer: Player) => {
    const actualCard = gameFEStatus?.actualCard;
    const actualCardKey = actualCard?.key || '';
    const mePlayer = gameStatus.players[getMyPlayerId()];
    const targetPlayerIsMe = mePlayer.playerId == targetPlayer.playerId
    const myAttackDistance = getPlayerAttackRangeNumber(gameFEStatus, mePlayer)
    const distanceBetweenMeAndTarget = getPlayersDistanceFromAToB(gameStatus, gameFEStatus, mePlayer, targetPlayer)
    const selectedTargetNumber = getSelectedTargetNumber(gameFEStatus)
    const responseType = getResponseType(gameStatus)
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus)
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus)

    const needSelectPlayersMinMax = getNeedSelectPlayersMinMax(gameStatus, gameFEStatus)
    if (needSelectPlayersMinMax.max == 0) { // 不用选择目标的情况下 BoardPlayerAble永远都是able
        return true
    }

    if (gameFEStatus.selectedSkillKey === SKILL_NAMES_CONFIG.SHU001_REN_DE.key) {
        return !targetPlayerIsMe
    }

    if (gameFEStatus.selectedSkillKey === SKILL_NAMES_CONFIG.WU008_JIE_YIN.key) {
        return targetPlayer.currentBlood < targetPlayer.maxBlood && targetPlayer.gender == 1
    }

    if (gameFEStatus.selectedSkillKey === SKILL_NAMES_CONFIG.QUN001_QING_NANG.key) {
        return targetPlayer.currentBlood < targetPlayer.maxBlood
    }

    if (gameFEStatus.selectedSkillKey === SKILL_NAMES_CONFIG.QUN003_LI_JIAN.key) {
        return targetPlayer.gender == 1
    }

    if (isMyResponseCardOrSkillTurn) {
        // 确定响应技能后
        if (responseType == RESPONSE_TYPE_CONFIG.SKILL && gameStatus.skillResponse!.chooseToReleaseSkill) {
            const skillKey = gameStatus.skillResponse!.skillKey
            if (skillKey === SKILL_NAMES_CONFIG.WU006_LIU_LI.key &&
                getSelectedCardNumber(gameFEStatus) == 1) {
                const onGoingUseStrikeEvent = findOnGoingUseStrikeEvent(gameStatus)!
                // 不能流离给杀的来源
                if (onGoingUseStrikeEvent.originId === targetPlayer.playerId) {
                    return false
                }
                // 不能流离自己
                if (targetPlayerIsMe) {
                    return false
                }
                // 不能流离给距离之外的角色
                if (myAttackDistance < distanceBetweenMeAndTarget) {
                    return false
                }
            } else if (skillKey === SKILL_NAMES_CONFIG.WEI004_TU_XI.key) {
                if (mePlayer.playerId == targetPlayer.playerId) {
                    return false
                }
                return targetPlayer.cards.length
            } else if (skillKey === SKILL_NAMES_CONFIG.WEI006_YI_JI.key) {
                return mePlayer.playerId !== targetPlayer.playerId
            }
            return true
        }
    }

    if (canPlayInMyTurn) {
        // 杀
        if (ALL_SHA_CARD_KEYS.includes(actualCardKey)) {
            if (targetPlayerIsMe) {
                return false
            }
            if (myAttackDistance < distanceBetweenMeAndTarget) {
                return false
            }
            return true
        }
        // 借刀杀人
        else if (actualCardKey == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key) {
            if (selectedTargetNumber == 0) {
                if (targetPlayerIsMe) {
                    return false
                }
                if (!getIfPlayerHasWeapon(targetPlayer)) {
                    return false
                }
                return true
            } else if (selectedTargetNumber == 1) {
                let attackDistance, distanceBetweenAAndB;
                const weaponOwnerPlayer = gameFEStatus.selectedTargetPlayers[0];
                attackDistance = getPlayerAttackRangeNumber(gameFEStatus, weaponOwnerPlayer);
                distanceBetweenAAndB = getPlayersDistanceFromAToB(gameStatus, gameFEStatus, weaponOwnerPlayer, targetPlayer)
                if (attackDistance < distanceBetweenAAndB) {
                    return false
                }
                return true
            }
        }
        // 乐不思蜀
        else if (actualCardKey == DELAY_SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key) {
            if (targetPlayerIsMe) {
                return false
            }
            if (targetPlayer.cantBeTargetKeys?.includes(SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key)) {
                return false
            }
            if (targetPlayer.pandingSigns.find((sign: PandingSign) =>
                sign.actualCard.key == DELAY_SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key)) {
                return false
            }
            return true
        }
        // 兵粮寸断
        else if (actualCardKey == DELAY_SCROLL_CARDS_CONFIG.BING_LIANG_CUN_DUAN.key) {
            const bingLiangRange = mePlayer.bingLiangRange || 1
            if (targetPlayerIsMe) {
                return false
            }
            if (bingLiangRange < distanceBetweenMeAndTarget) {
                return false
            }
            return true
        }
        // 过河拆桥
        else if (actualCardKey == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key) {
            if (targetPlayerIsMe) {
                return false
            }
            if (!getIfPlayerHasAnyCards(targetPlayer)) {
                return false
            }
            return true
        }
        // 顺手牵羊
        else if (actualCardKey == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key) {
            const shunRange = mePlayer.shunRange || 1
            if (targetPlayerIsMe) {
                return false
            }
            if (targetPlayer.cantBeTargetKeys?.includes(SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key)) {
                return false
            }
            if (!getIfPlayerHasAnyCards(targetPlayer)) {
                return false
            }
            if (shunRange < distanceBetweenMeAndTarget) {
                return false
            }
            return true
        } else if (actualCardKey == SCROLL_CARDS_CONFIG.JUE_DOU.key) {
            if (targetPlayerIsMe) {
                return false
            }
            return true
        }
        return true
    }
}

const getIsControlCardAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, card: Partial<Card>) => {
    const res = getIsControlCardAbleByGameFEStatus(gameStatus, gameFEStatus, card)
    if (isBoolean(res)) {
        return res
    }
    return getIsControlCardAbleByGameStatus(gameStatus, card)
}

const getIsControlCardAbleByGameFEStatus = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, card: Partial<Card>) => {
    const selectedSkillKey = gameFEStatus.selectedSkillKey;
    if ([EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key,
        SKILL_NAMES_CONFIG.SHU001_REN_DE.key,
        SKILL_NAMES_CONFIG.WU001_ZHI_HENG.key,
        SKILL_NAMES_CONFIG.WU008_JIE_YIN.key,
        SKILL_NAMES_CONFIG.QUN001_QING_NANG.key,
        SKILL_NAMES_CONFIG.QUN003_LI_JIAN.key,
    ].includes(selectedSkillKey)) {
        return true
    }

    if ([SKILL_NAMES_CONFIG.SHU002_WU_SHENG.key, SKILL_NAMES_CONFIG.QUN001_JI_JIU.key].includes(selectedSkillKey)) {
        return [CARD_HUASE.HONGTAO, CARD_HUASE.FANGKUAI].includes(card.huase!)
    }

    if ([SKILL_NAMES_CONFIG.WEI007_QING_GUO.key, SKILL_NAMES_CONFIG.WU002_QI_XI.key].includes(selectedSkillKey)) {
        return [CARD_HUASE.HEITAO, CARD_HUASE.CAOHUA].includes(card.huase!)
    }

    if (selectedSkillKey == SKILL_NAMES_CONFIG.SHU005_LONG_DAN.key) {
        if (getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHA.key})) {
            return [BASIC_CARDS_CONFIG.SHAN.key].includes(card.key!)
        } else if (getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHAN.key})) {
            return ALL_SHA_CARD_KEYS.includes(card.key!)
        }
    }

    if (selectedSkillKey == SKILL_NAMES_CONFIG.WU006_GUO_SE.key) {
        return [CARD_HUASE.FANGKUAI].includes(card.huase!)
    }
}

let canPlayInMyTurnCardKeys: string[];
const getIsControlCardAbleByGameStatus = (gameStatus: GameStatus, card: Partial<Card>) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
    const isMyThrowTurn = getIsMyThrowTurn(gameStatus);
    const mePlayer = gameStatus.players[getMyPlayerId()];

    if (canPlayInMyTurn) {
        if (!canPlayInMyTurnCardKeys) {
            canPlayInMyTurnCardKeys = Object.values(CARD_CONFIG_WITH_FE_INFO).filter((c: Card) => c.canPlayInMyTurn).map((c) => c.key)
        }

        let amendCanPlayInMyTurnCardKeys: string[] = canPlayInMyTurnCardKeys;
        if (mePlayer.maxBlood <= mePlayer.currentBlood) {
            amendCanPlayInMyTurnCardKeys = amendCanPlayInMyTurnCardKeys.filter((n) => n != BASIC_CARDS_CONFIG.TAO.key)
        }

        if (mePlayer.pandingSigns.find((sign) => sign.actualCard.key == SCROLL_CARDS_CONFIG.SHAN_DIAN.key)) {
            amendCanPlayInMyTurnCardKeys = amendCanPlayInMyTurnCardKeys.filter((n) => n != SCROLL_CARDS_CONFIG.SHAN_DIAN.key)
        }

        if (!getCanPlayerPlaySha(mePlayer)) {
            amendCanPlayInMyTurnCardKeys = amendCanPlayInMyTurnCardKeys.filter((n) => {
                return n != BASIC_CARDS_CONFIG.SHA.key && n != BASIC_CARDS_CONFIG.LEI_SHA.key && n != BASIC_CARDS_CONFIG.HUO_SHA.key
            })
        }
        return amendCanPlayInMyTurnCardKeys.includes(card.key!)
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
                case SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.key:
                    return ALL_SHA_CARD_KEYS.includes(card.key)
                default:
                    return false
            }
        } else if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            const skillKey = gameStatus.skillResponse!.skillKey;
            const chooseToReleaseSkill = gameStatus.skillResponse!.chooseToReleaseSkill;

            if (chooseToReleaseSkill == undefined) {
                return false
            }

            switch (skillKey) {
                case SKILL_NAMES_CONFIG.WEI002_GUI_CAI.key:
                case SKILL_NAMES_CONFIG.WEI003_GANG_LIE.key:
                case SKILL_NAMES_CONFIG.WU006_LIU_LI.key:
                case EQUIPMENT_CARDS_CONFIG.CI_XIONG_SHUANG_GU_JIAN.key:
                case EQUIPMENT_CARDS_CONFIG.GUAN_SHI_FU.key:
                case SKILL_NAMES_CONFIG.WEI003_GANG_LIE.key:
                    return true
                case EQUIPMENT_CARDS_CONFIG.QING_LONG_YAN_YUE_DAO.key:
                    return ALL_SHA_CARD_KEYS.includes(card.key)
                case SKILL_NAMES_CONFIG.WEI006_YI_JI.key:
                    return card.isYiJi
                default:
                    return false
            }
        } else if (responseType == RESPONSE_TYPE_CONFIG.CARD_BOARD) {
            return false
        } else if (responseType == RESPONSE_TYPE_CONFIG.WUXIE) {
            return [SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.key].includes(card.key!)
        }
    }

    if (isMyThrowTurn) {
        return true
    }

    return true
}

const getIsSkillAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, skill: Skill) => {
    const isMyPlayTurn = getIsMyPlayTurn(gameStatus);
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
    const mePlayer = gameStatus.players[getMyPlayerId()]

    if (skill.key == SKILL_NAMES_CONFIG.SHU002_WU_SHENG.key) {
        if (canPlayInMyTurn || isMyResponseCardOrSkillTurn) {
            return getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHA.key})
        }
    }

    if (skill.key == SKILL_NAMES_CONFIG.WEI007_QING_GUO.key) {
        if (isMyResponseCardOrSkillTurn) {
            return getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHAN.key})
        }
    }

    if ([SKILL_NAMES_CONFIG.WU002_QI_XI.key, SKILL_NAMES_CONFIG.WU006_GUO_SE.key].includes(skill.key)) {
        return canPlayInMyTurn
    }

    if (skill.key == SKILL_NAMES_CONFIG.WU004_KU_ROU.key) {
        if (canPlayInMyTurn) {
            return mePlayer.currentBlood > 0;
        }
    }

    if (skill.key == SKILL_NAMES_CONFIG.SHU005_LONG_DAN.key) {
        if (canPlayInMyTurn) {
            return getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHA.key})
        } else if (isMyResponseCardOrSkillTurn) {
            return getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHA.key}) ||
                getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHAN.key})
        }
    }

    if (skill.key == SKILL_NAMES_CONFIG.SHU001_REN_DE.key) {
        if (canPlayInMyTurn) {
            return mePlayer.cards.length > 0
        }
    }

    if ([SKILL_NAMES_CONFIG.WU001_ZHI_HENG.key,
        SKILL_NAMES_CONFIG.WU008_JIE_YIN.key,
        SKILL_NAMES_CONFIG.QUN001_QING_NANG.key,
        SKILL_NAMES_CONFIG.QUN003_LI_JIAN.key,
    ].includes(skill.key)) {
        if (canPlayInMyTurn) {
            const useSkillTimes = mePlayer.useSkillTimes[skill.key] || 0
            return useSkillTimes <= 0
        }
    }

    if (skill.key == SKILL_NAMES_CONFIG.WU005_FAN_JIAN.key) {
        if (canPlayInMyTurn) {
            const useSkillTimes = mePlayer.useSkillTimes[skill.key] || 0
            return useSkillTimes <= 0 && mePlayer.cards.length > 0
        }
    }

    if (skill.key == SKILL_NAMES_CONFIG.QUN001_JI_JIU.key) {
        if (!isMyPlayTurn && isMyResponseCardOrSkillTurn) {
            return getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.TAO.key})
        }
    }

    return false
}

export {
    getNeedSelectPlayersMinMax,
    getNeedSelectCardsMinMax,

    getIsBoardPlayerAble,
    getIsControlCardAble,
    getIsControlCardAbleByGameFEStatus,
    getIsControlCardAbleByGameStatus,
    getIsSkillAble,

    getCanSelectEquipmentInTheory,

    getSelectedCardNumber,
    getSelectedTargetNumber,
};
