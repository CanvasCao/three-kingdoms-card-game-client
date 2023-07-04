import {GameStatus} from "../types/gameStatus";
import {GameFEStatus} from "../types/gameFEStatus";
import {
    ALL_SHA_CARD_NAMES,
    DELAY_SCROLL_CARDS_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    SCROLL_CARDS_CONFIG
} from "../config/cardConfig";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {getI18Lan, I18LANS} from "../i18n/i18nUtils";
import {PandingSign} from "../types/card";
import {Player} from "../types/player";
import {SKILL_NAMES} from "../config/skillsConfig";
import {findOnGoingUseStrikeEvent} from "./event/eventUtils";
import {getIsMyPlayTurn, getIsMyResponseTurn} from "./stage/stageUtils";
import {getSelectedCardNumber, getSelectedTargetNumber} from "./validationUtils";
import {attachFEInfoToCard} from "./cardUtils";

const getPlayersDistanceFromAToB = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, APlayer: Player, BPlayer: Player) => {
    const playerNumber = Object.keys(gameStatus.players).length
    let distance = Math.min(
        Math.abs(APlayer.location - BPlayer.location),
        Math.abs((APlayer.location + playerNumber) - BPlayer.location),
        Math.abs(APlayer.location - (BPlayer.location + playerNumber))
    )
    const minusHorseCard = APlayer?.minusHorseCard;

    // -1参与距离计算的前提是 -1没有被选中
    if (minusHorseCard && !gameFEStatus.selectedCards.map(c => c.cardId).includes(minusHorseCard.cardId)) {
        distance + (APlayer?.minusHorseCard?.horseDistance || 0)
    }
    return distance + (BPlayer?.plusHorseCard?.horseDistance || 0)
}

const getPlayerAttackRangeNumber = (gameFEStatus: GameFEStatus, player: Player) => {
    const weaponCard = player?.weaponCard;
    if (weaponCard && !gameFEStatus.selectedCards.map(c => c.cardId).includes(weaponCard.cardId)) {
        return player?.weaponCard?.distance!
    }

    return 1
}

const getIfPlayerAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, targetPlayer: Player) => {
    const actualCardName = gameFEStatus?.actualCard?.CN || '';
    const mePlayer = gameStatus.players[getMyPlayerId()];
    const myAttackDistance = getPlayerAttackRangeNumber(gameFEStatus, mePlayer)
    const distanceBetweenMeAndTarget = getPlayersDistanceFromAToB(gameStatus, gameFEStatus, mePlayer, targetPlayer)
    const selectedTargetNumber = getSelectedTargetNumber(gameFEStatus)

    // 响应技能和锦囊
    if (getIsMyResponseTurn(gameStatus) && gameStatus?.skillResponse) {
        const onGoingUseStrikeEvent = findOnGoingUseStrikeEvent(gameStatus)!
        if (
            gameStatus?.skillResponse?.skillName === SKILL_NAMES.WU["006"].LIU_LI &&
            gameStatus?.skillResponse?.chooseToReleaseSkill &&
            getSelectedCardNumber(gameFEStatus) == 1
        ) {
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
    if (gameStatus.scrollResponses[0]) {
        return true
    }

    // 使用牌的时候
    // 杀
    if (ALL_SHA_CARD_NAMES.includes(actualCardName)) {
        let myAttackDistance = mePlayer?.weaponCard?.distance || 1
        if (myAttackDistance >= distanceBetweenMeAndTarget) {
            return true
        } else {
            return false
        }
    }
    // 借刀杀人
    else if (actualCardName == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN) {
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
    else if (actualCardName == DELAY_SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN) {
        if (targetPlayer.pandingSigns.find((sign: PandingSign) => sign.actualCard.CN == DELAY_SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN)) {
            return false
        } else {
            return true
        }
    }
    // 兵粮寸断
    else if (actualCardName == DELAY_SCROLL_CARDS_CONFIG.BING_LIANG_CUN_DUAN.CN) {
        if (1 >= distanceBetweenMeAndTarget) {
            return true
        } else {
            return false
        }
    }
    // 过河拆桥 顺手牵羊
    else if (actualCardName == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN) {
        if (getIfPlayerHasAnyCards(targetPlayer)) {
            return true
        } else {
            return false
        }
    } else if (actualCardName == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN) {
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
    if (player.weaponCard && (player.weaponCard.CN == EQUIPMENT_CARDS_CONFIG.ZHU_GE_LIAN_NU.CN)) {
        return true
    } else {
        const shaLimitTimes = 1
        return player.shaTimes < shaLimitTimes
    }
}

const getPlayerDisplayName = (gameStatus: GameStatus, playerId: string) => {
    const isMe = playerId == getMyPlayerId();
    const s = getI18Lan() == I18LANS.EN ? " (you)" : "（你）"
    return gameStatus.players[playerId].name + (isMe ? s : "");
}

const getCurrentPlayer = (gameStatus: GameStatus) => {
    return gameStatus.players[gameStatus.stage.playerId]
}

const getNeedTargetPlayersNumberMinMax = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const mePlayer = gameStatus.players[getMyPlayerId()]

    if (gameStatus.skillResponse?.skillName === SKILL_NAMES.WU["006"].LIU_LI
        && gameStatus.skillResponse.chooseToReleaseSkill
    ) {
        return {min: 1, max: 1}
    }
    if (getIsMyPlayTurn(gameStatus) && mePlayer.weaponCard?.CN == EQUIPMENT_CARDS_CONFIG.FANG_TIAN_HUA_JI.CN
        && mePlayer.cards.length == 1
        && ALL_SHA_CARD_NAMES.includes(mePlayer.cards[0].CN)
    ) {
        return {min: 1, max: 3}
    }
    return attachFEInfoToCard(gameFEStatus.actualCard!)!.targetMinMax;
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

    getNeedTargetPlayersNumberMinMax
}
