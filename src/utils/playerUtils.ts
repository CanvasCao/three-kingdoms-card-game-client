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
import {getIsMyResponseTurn} from "./stageUtils";

const getPlayersDistanceFromAToB = (APlayer: Player, BPlayer: Player, playerNumber: number) => {
    const tableDistance = Math.min(
        Math.abs(APlayer.location - BPlayer.location),
        Math.abs((APlayer.location + playerNumber) - BPlayer.location),
        Math.abs(APlayer.location - (BPlayer.location + playerNumber))
    )
    return tableDistance + (APlayer?.minusHorseCard?.horseDistance || 0) + (BPlayer?.plusHorseCard?.horseDistance || 0)
}
const getIfPlayerAble = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, targetPlayer: Player) => {
    const actualCardName = gameFEStatus?.actualCard?.CN || '';
    const mePlayer = gameStatus.players[getMyPlayerId()];
    const distanceBetweenMeAndTarget = getPlayersDistanceFromAToB(mePlayer, targetPlayer, Object.keys(gameStatus.players).length)

    // 响应技能和锦囊
    if (getIsMyResponseTurn(gameStatus) && gameStatus.skillResponse) {
        const onGoingUseStrikeEvent = findOnGoingUseStrikeEvent(gameStatus)!
        if (
            gameStatus.skillResponse.skillName === SKILL_NAMES.WU["006"].LIU_LI &&
            gameStatus.skillResponse.chooseToReleaseSkill
        ) {
            if (onGoingUseStrikeEvent.originId === targetPlayer.playerId) {
                return false
            }
            let myAttackDistance = mePlayer?.weaponCard?.distance || 1
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
        if (gameFEStatus.selectedTargetPlayers.length == 0) {
            if (getIfPlayerHasWeapon(targetPlayer)) {
                return true
            } else {
                return false
            }
        } else if (gameFEStatus.selectedTargetPlayers.length == 1) {
            let attackDistance, distanceBetweenAAndB;
            const daoOwnerPlayer = gameFEStatus.selectedTargetPlayers[0];
            attackDistance = daoOwnerPlayer?.weaponCard?.distance || 1;
            distanceBetweenAAndB = getPlayersDistanceFromAToB(daoOwnerPlayer, targetPlayer, Object.keys(gameStatus.players).length)
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

export {
    getIfPlayerAble,
    getIfPlayerHasAnyCards,
    getIfPlayerHasAnyHandCards,
    getIfPlayerHasWeapon,
    getCanPlayerPlaySha,

    getPlayersDistanceFromAToB,
    getPlayerDisplayName,
    getCurrentPlayer,
}

