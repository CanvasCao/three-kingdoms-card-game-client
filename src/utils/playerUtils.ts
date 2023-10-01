import {GameStatus} from "../types/gameStatus";
import {GameFEStatus} from "../types/gameFEStatus";
import {EQUIPMENT_CARDS_CONFIG} from "../config/cardConfig";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {isLanEn} from "../i18n/i18nUtils";
import {Player} from "../types/player";

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
    // 自带-1马的角色
    if (APlayer.minusHorseDistance) {
        distance = distance + (APlayer.minusHorseDistance)
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
        return player.shaTimes < (player.shaLimitTimes || 1)
    }
}

const getPlayerDisplayName = (gameStatus: GameStatus, playerId: string) => {
    const isMe = playerId == getMyPlayerId();
    const s = isLanEn() ? " (you)" : "（你）"
    return gameStatus.players[playerId].playerName + (isMe ? s : "");
}

const getCurrentPlayer = (gameStatus: GameStatus) => {
    return Object.values(gameStatus.players).find((u) => u.location == gameStatus.stage.currentLocation)
}

const getIsAllSelectHeroDone = (gameStatus: GameStatus) => {
    return Object.values(gameStatus.players).every((p) => p.heroId);
}

export {
    getIfPlayerHasAnyCards,
    getIfPlayerHasAnyHandCards,
    getIfPlayerHasAnyHandCardsOrEquipmentCards,
    getIfPlayerHasWeapon,
    getCanPlayerPlaySha,

    getPlayersDistanceFromAToB,
    getPlayerAttackRangeNumber,
    getPlayerDisplayName,
    getCurrentPlayer,

    getIsAllSelectHeroDone,
}
