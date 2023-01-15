import {Card, GameStatus, Player} from "../types/gameStatus";
import {
    BASIC_CARDS_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    SCROLL_CARDS_CONFIG
} from "../config/cardConfig";
import {CARD_CONFIG_WITH_FE_INFO} from "../config/cardConfigWithFEInfo";
import {attachFEInfoToCard} from "./cardUtils";
import {GameFEStatus} from "../types/gameFEStatus";

function uuidv4() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function verticalRotationSting(s: string) {
    return s.split('').join('\r\n')
}

const getMyPlayerId = () => {
    const key = 'three-kingdom-player-id';
    const playerid = localStorage.getItem(key);
    if (playerid) {
        return playerid
    } else {
        const newUUID = uuidv4()
        localStorage.setItem(key, newUUID);
        return newUUID;
    }
}

const getIsMyPlayTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && gameStatus.stage.stageName == 'play';
}

const getIsMyThrowTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.playerId == getMyPlayerId() && gameStatus.stage.stageName == 'throw';
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
    return false;
}

const getCanPlayInMyTurn = (gameStatus: GameStatus) => {
    return gameStatus.shanResStages.length <= 0 &&
        gameStatus.taoResStages.length <= 0 &&
        gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length <= 0 &&
        gameStatus.scrollResStages.length <= 0 &&
        getIsMyPlayTurn(gameStatus);
}

// targetId wuxieTargetCardId cardName
const getMyResponseInfo = (gameStatus: GameStatus):
    {
        targetId: string,
        cardNames: string[],
        wuxieTargetCardId?: string
    } | undefined => {
    if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length > 0) {
        const chainItem = gameStatus.wuxieSimultaneousResStage.wuxieChain[gameStatus.wuxieSimultaneousResStage.wuxieChain.length - 1]
        return {
            targetId: chainItem.nextWuXieTargetId, // 我无懈可击的目标人
            cardNames: [SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN],
            wuxieTargetCardId: chainItem.actualCard.cardId,// 为了校验无懈可击是否冲突
        }
    } else if (gameStatus.taoResStages.length > 0) {
        return {
            targetId: gameStatus.taoResStages[0].targetId,
            cardNames: [BASIC_CARDS_CONFIG.TAO.CN],
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
    }
}

const getInMyPlayTurnCanPlayCardNamesClourse = (player: Player) => {
    let canPlayInMyTurnCardNames: string[];
    return () => {
        if (!canPlayInMyTurnCardNames) {
            canPlayInMyTurnCardNames = Object.values(CARD_CONFIG_WITH_FE_INFO).filter((c: Partial<Card>) => c.canPlayInMyTurn).map((c) => c.CN!)
        }

        let amendCanPlayInMyTurnCardNames: string[] = canPlayInMyTurnCardNames;
        if (player.maxBlood <= player.currentBlood) {
            amendCanPlayInMyTurnCardNames = amendCanPlayInMyTurnCardNames.filter((n) => n != BASIC_CARDS_CONFIG.TAO.CN)
        }

        if (player.pandingSigns.find((sign) => sign.actualCard.CN == SCROLL_CARDS_CONFIG.SHAN_DIAN.CN)) {
            amendCanPlayInMyTurnCardNames = amendCanPlayInMyTurnCardNames.filter((n) => n != SCROLL_CARDS_CONFIG.SHAN_DIAN.CN)
        }
        return amendCanPlayInMyTurnCardNames
    }
}

const getMyShaLimitTimes = (player: Player) => {
    if (player.weaponCard && (player.weaponCard.CN == EQUIPMENT_CARDS_CONFIG.ZHU_GE_LIAN_NU.CN)) {
        return Number.POSITIVE_INFINITY
    } else {
        return player.shaLimitTimes
    }
}

const getDistanceFromAToB = (APlayer: Player, BPlayer: Player, playerNumber: number) => {
    const tableDistance = Math.min(
        Math.abs(APlayer.location - BPlayer.location),
        Math.abs((APlayer.location + playerNumber) - BPlayer.location),
        Math.abs(APlayer.location - (BPlayer.location + playerNumber))
    )
    return tableDistance + (APlayer?.minusHorseCard?.horseDistance || 0) + (BPlayer?.plusHorseCard?.horseDistance || 0)
}

const getCanSelectMeAsFirstTargetCardNamesClosure = () => {
    let names: string[];
    return () => {
        if (!names) {
            names = Object.values(CARD_CONFIG_WITH_FE_INFO).filter((c: Partial<Card>) => c.canClickMySelfAsFirstTarget).map((c) => c.CN!)
        }
        return names
    }
}

const getCanSelectMeAsSecondTargetCardNamesClosure = () => {
    let names: string[];
    return () => {
        if (!names) {
            names = Object.values(CARD_CONFIG_WITH_FE_INFO).filter((c: Partial<Card>) => c.canClickMySelfAsSecondTarget).map((c) => c.CN!)
        }
        return names
    }
}

const getAmendTargetMinMax = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const mePlayer = gameStatus.players[getMyPlayerId()]
    if (mePlayer.weaponCard?.CN == EQUIPMENT_CARDS_CONFIG.FANG_TIAN_HUA_JI.CN && mePlayer.cards.length == 1) {
        return {min: 1, max: 3}
    }
    return attachFEInfoToCard(gameFEStatus.actualCard!)!.targetMinMax;
}

const getNeedThrowCardNumber = (player: Player) => {
    return player.cards.length - player.currentBlood
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

export {
    getMyPlayerId,

    // my turn for UI and getCanPlayInMyTurn
    getIsMyPlayTurn,

    // 我需要出牌的状态
    getIsMyResponseCardTurn, // response 包括闪桃无懈可击 不包括弃牌
    getIsMyThrowTurn,
    getCanPlayInMyTurn,

    // response
    getMyResponseInfo,

    // cal distance
    getDistanceFromAToB,

    // Player validate
    getCanSelectMeAsFirstTargetCardNamesClosure,
    getCanSelectMeAsSecondTargetCardNamesClosure,
    getAmendTargetMinMax,

    // play card validate
    getInMyPlayTurnCanPlayCardNamesClourse,
    getMyShaLimitTimes,

    // 弃牌
    getNeedThrowCardNumber,

    // validate scroll target
    getIfPlayerHasAnyCards,
    getIfPlayerHasAnyHandCards,
    getIfPlayerHasWeapon,

    uuidv4,
    verticalRotationSting
}