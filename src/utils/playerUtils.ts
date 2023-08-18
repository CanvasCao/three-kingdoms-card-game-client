import {GameStatus} from "../types/gameStatus";
import {GameFEStatus} from "../types/gameFEStatus";
import {
    ALL_SHA_CARD_KEYS,
    DELAY_SCROLL_CARDS_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    SCROLL_CARDS_CONFIG
} from "../config/cardConfig";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {getI18Lan, I18LANS} from "../i18n/i18nUtils";
import {PandingSign} from "../types/card";
import {Player} from "../types/player";
import {SKILL_NAMES_CONFIG} from "../config/skillsConfig";
import {findOnGoingUseStrikeEvent} from "./event/eventUtils";
import {getIsMyPlayTurn, getIsMyResponseCardOrSkillTurn} from "./stage/stageUtils";
import {getSelectedCardNumber, getSelectedTargetNumber} from "./validationUtils";
import {attachFEInfoToCard} from "./cardUtils";
import {getResponseType} from "./response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../config/responseTypeConfig";

const getPlayersDistanceFromAToB = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, APlayer: Player, BPlayer: Player) => {
    const alivePlayers = Object.values(gameStatus.players).filter((p) => !p.isDead).sort((a, b) => a.location - b.location)
    const APlayerNewLocation = alivePlayers.findIndex((p) => p.playerId === APlayer.playerId)
    const BPlayerNewLocation = alivePlayers.findIndex((p) => p.playerId === BPlayer.playerId)

    let distance = Math.min(
        Math.abs(APlayerNewLocation - BPlayerNewLocation),
        Math.abs((APlayerNewLocation + alivePlayers.length) - BPlayerNewLocation),
        Math.abs(APlayerNewLocation - (BPlayerNewLocation + alivePlayers.length))
    )

    const minusHorseCard = APlayer?.minusHorseCard;
    // -1参与距离计算的前提是 -1没有被选中
    if (minusHorseCard && !gameFEStatus.selectedCards.map(c => c.cardId).includes(minusHorseCard.cardId)) {
        distance = distance + (APlayer?.minusHorseCard?.horseDistance || 0)
    }

    if (BPlayer?.plusHorseCard?.horseDistance) {
        distance = distance + (BPlayer?.plusHorseCard?.horseDistance)
    }

    return distance
}

const getPlayerAttackRangeNumber = (gameFEStatus: GameFEStatus, player: Player) => {
    const weaponCard = player?.weaponCard;
    if (weaponCard && !gameFEStatus.selectedCards.map(c => c.cardId).includes(weaponCard.cardId)) {
        return player?.weaponCard?.distance!
    }

    return 1
}

const getIfPlayerAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, targetPlayer: Player) => {
    const actualCardName = gameFEStatus?.actualCard?.key || '';
    const mePlayer = gameStatus.players[getMyPlayerId()];
    const myAttackDistance = getPlayerAttackRangeNumber(gameFEStatus, mePlayer)
    const distanceBetweenMeAndTarget = getPlayersDistanceFromAToB(gameStatus, gameFEStatus, mePlayer, targetPlayer)
    const selectedTargetNumber = getSelectedTargetNumber(gameFEStatus)
    const responseType = getResponseType(gameStatus)
    const isMyResponseTurn = getIsMyResponseCardOrSkillTurn(gameStatus)

    // 我响应技能
    if (isMyResponseTurn && responseType == RESPONSE_TYPE_CONFIG.SKILL) {
        if (
            gameStatus.skillResponse!.skillNameKey === SKILL_NAMES_CONFIG.WU006_LIU_LI.key &&
            gameStatus.skillResponse!.chooseToReleaseSkill &&
            getSelectedCardNumber(gameFEStatus) == 1
        ) {
            const onGoingUseStrikeEvent = findOnGoingUseStrikeEvent(gameStatus)!
            // 不能流离给杀的来源
            if (onGoingUseStrikeEvent.originId === targetPlayer.playerId) {
                return false
            }

            if (myAttackDistance < distanceBetweenMeAndTarget) {
                return false
            }
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

const getIfPlayerHasAnyCards = (player: Player) => {
    return player.cards.length ||
        player.pandingSigns.length ||
        player.plusHorseCard ||
        player.minusHorseCard ||
        player.shieldCard ||
        player.weaponCard
}

const getIfPlayerHasWeapon = (player: Player) => {
    return player.weaponCard
}

const getIfPlayerHasAnyHandCards = (player: Player) => {
    return player.cards.length > 0
}

const getIfPlayerHasAnyHandCardsOrEquipmentCards = (player: Player) => {
    return player.cards.length ||
        player.plusHorseCard ||
        player.minusHorseCard ||
        player.shieldCard ||
        player.weaponCard
}

const getCanPlayerPlaySha = (player: Player) => {
    if (player.weaponCard && (player.weaponCard.key == EQUIPMENT_CARDS_CONFIG.ZHU_GE_LIAN_NU.key)) {
        return true
    } else {
        return player.shaTimes < (player.shaLimitTimes||1)
    }
}

const getPlayerDisplayName = (gameStatus: GameStatus, playerId: string) => {
    const isMe = playerId == getMyPlayerId();
    const s = getI18Lan() == I18LANS.EN ? " (you)" : "（你）"
    return gameStatus.players[playerId].playerName + (isMe ? s : "");
}

const getCurrentPlayer = (gameStatus: GameStatus) => {
    return gameStatus.players[gameStatus.stage.playerId]
}

const getNeedTargetPlayersNumberMinMax = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const mePlayer = gameStatus.players[getMyPlayerId()]
    const responseType = getResponseType(gameStatus)

    if (responseType == RESPONSE_TYPE_CONFIG.SKILL &&
        gameStatus.skillResponse!.skillNameKey === SKILL_NAMES_CONFIG.WU006_LIU_LI.key &&
        gameStatus.skillResponse!.chooseToReleaseSkill
    ) {
        return {min: 1, max: 1}
    }
    if (getIsMyPlayTurn(gameStatus) && mePlayer.weaponCard?.key == EQUIPMENT_CARDS_CONFIG.FANG_TIAN_HUA_JI.key
        && mePlayer.cards.length == 1
        && ALL_SHA_CARD_KEYS.includes(mePlayer.cards[0].key)
    ) {
        return {min: 1, max: 3}
    }
    return attachFEInfoToCard(gameFEStatus.actualCard!)!.targetMinMax;
}

let isAllSelectHeroDone = false
const getIsAllSelectHeroDone = (gameStatus: GameStatus) => {
    if (isAllSelectHeroDone) {
        return true
    }

    const done = Object.values(gameStatus.players).every((p) => p.heroId);
    if (done) {
        isAllSelectHeroDone = true
        return true
    } else {
        return false
    }
}

export {
    getIfPlayerAble,
    getIfPlayerHasAnyCards,
    getIfPlayerHasAnyHandCards,
    getIfPlayerHasAnyHandCardsOrEquipmentCards,
    getIfPlayerHasWeapon,
    getCanPlayerPlaySha,

    getPlayersDistanceFromAToB,
    getPlayerAttackRangeNumber,
    getPlayerDisplayName,
    getCurrentPlayer,

    getNeedTargetPlayersNumberMinMax,

    getIsAllSelectHeroDone,
}
