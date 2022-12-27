import {Card, GameStatus, User} from "../types/gameStatus";
import {BASIC_CARDS_CONFIG, CARD_TYPE, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {CARD_CONFIG_WITH_FE_INFO} from "../config/cardConfigWithFEInfo";

// const getRelativePositionToCanvas = (gameObject, camera) => {
//     return {
//         x: (gameObject.x - camera.worldView.x) * camera.zoom,
//         y: (gameObject.y - camera.worldView.y) * camera.zoom
//     }
// }

function uuidv4() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function verticalRotationSting(s: string) {
    return s.split('').join('\r\n')
}

const getMyUserId = () => {
    const key = 'three-kingdom-user-id';
    const userid = localStorage.getItem(key);
    if (userid) {
        return userid
    } else {
        const newUUID = uuidv4()
        localStorage.setItem(key, newUUID);
        return newUUID;
    }
}

const getIsMyPlayTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.userId == getMyUserId() && gameStatus.stage.stageName == 'play';
}

const getIsMyThrowTurn = (gameStatus: GameStatus) => {
    return gameStatus.stage.userId == getMyUserId() && gameStatus.stage.stageName == 'throw';
}

const getIsMyResponseCardTurn = (gameStatus: GameStatus) => {
    if (gameStatus.taoResStages.length > 0) {
        return gameStatus.taoResStages[0]?.originId == getMyUserId();
    }
    if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length) {
        return gameStatus.wuxieSimultaneousResStage.hasWuxiePlayerIds.includes(getMyUserId())
    }
    if (gameStatus.scrollResStages?.length > 0) {
        return gameStatus.scrollResStages[0].originId == getMyUserId();
    }
    if (gameStatus.shanResStages.length > 0) {
        return gameStatus.shanResStages[0]?.originId == getMyUserId();
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
const getMyResponseInfo = (gameStatus: GameStatus): {
    targetId: string,
    cardName: string,
    wuxieTargetCardId?: string
} | undefined => {
    if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length > 0) {
        const chainItem = gameStatus.wuxieSimultaneousResStage.wuxieChain[gameStatus.wuxieSimultaneousResStage.wuxieChain.length - 1]
        return {
            targetId: chainItem.originId, // 我无懈可击的目标人
            wuxieTargetCardId: chainItem.actualCard.cardId,// 我无懈可击的目标卡
            cardName: SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN,
        }
    }
    if (gameStatus.taoResStages.length > 0) {
        return {
            targetId: gameStatus.taoResStages[0].targetId,
            cardName: BASIC_CARDS_CONFIG.TAO.CN,
        }
    }
    if (gameStatus.scrollResStages.length > 0) {
        let needResponseCardName = '';
        switch (gameStatus.scrollResStages[0].actualCard.CN) {
            case SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN:
                needResponseCardName = BASIC_CARDS_CONFIG.SHAN.CN;
                break;
            case SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN:
            case SCROLL_CARDS_CONFIG.JUE_DOU.CN:
                needResponseCardName = BASIC_CARDS_CONFIG.SHA.CN;
                break;
        }

        return {
            targetId: gameStatus.scrollResStages[0].targetId,
            cardName: needResponseCardName,
        }
    }
    if (gameStatus.shanResStages.length > 0) {
        return {
            targetId: gameStatus.shanResStages[0].targetId,
            cardName: BASIC_CARDS_CONFIG.SHAN.CN,
        }
    }
}

const getIsMyScrollEffectTurn = (gameStatus: GameStatus) => {
    if (gameStatus.scrollResStages.length > 0) {
        return gameStatus.scrollResStages[0].isEffect && gameStatus.scrollResStages[0]?.originId == getMyUserId();
    }
}

const getInMyPlayTurnCanPlayCardNamesClourse = (user: User) => {
    let canPlayInMyTurnCardNames: string[];
    return () => {
        if (!canPlayInMyTurnCardNames) {
            canPlayInMyTurnCardNames = Object.values(CARD_CONFIG_WITH_FE_INFO).filter((c: Partial<Card>) => c.canPlayInMyTurn).map((c) => c.CN!)
        }

        let amendCanPlayInMyTurnCardNames: string[] = canPlayInMyTurnCardNames;
        if (user.maxBlood <= user.currentBlood) {
            amendCanPlayInMyTurnCardNames = amendCanPlayInMyTurnCardNames.filter((n) => n != BASIC_CARDS_CONFIG.TAO.CN)
        }

        if (user.pandingSigns.find((sign) => sign.actualCard.CN == SCROLL_CARDS_CONFIG.SHAN_DIAN.CN)) {
            amendCanPlayInMyTurnCardNames = amendCanPlayInMyTurnCardNames.filter((n) => n != SCROLL_CARDS_CONFIG.SHAN_DIAN.CN)
        }
        return amendCanPlayInMyTurnCardNames
    }
}

const getDistanceFromAToB = (AUser: User, BUser: User, userNumber: number) => {
    const tableDistance = Math.min(
        Math.abs(AUser.location - BUser.location),
        Math.abs((AUser.location + userNumber) - BUser.location),
        Math.abs(AUser.location - (BUser.location + userNumber))
    )
    return tableDistance + (AUser?.minusHorseCard?.horseDistance || 0) + (BUser?.plusHorseCard?.horseDistance || 0)
}

// const getIsEquipmentCard = (card: Card) => {
//     return CARD_TYPE.EQUIPMENT == card.type
// }

const getCanSelectMeAsTargetCardNamesClosure = () => {
    let names: string[];
    return () => {
        if (!names) {
            names = Object.values(CARD_CONFIG_WITH_FE_INFO).filter((c: Partial<Card>) => c.canClickMySelfAsTarget).map((c) => c.CN!)
        }
        return names
    }
}

const getNeedThrowCardNumber = (user: User) => {
    return user.cards.length - user.currentBlood
}

const getIfUserHasAnyCards = (user: User) => {
    return user.cards.length ||
        user.pandingSigns.length ||
        user.plusHorseCard ||
        user.minusHorseCard ||
        user.shieldCard ||
        user.weaponCard
}

const getIfUserHasAnyHandCards = (user: User) => {
    return user.cards.length > 0
}

export {
    getMyUserId,

    // my turn for UI and getCanPlayInMyTurn
    getIsMyPlayTurn,

    // 我需要出牌的状态
    getIsMyResponseCardTurn, // response 包括闪桃无懈可击 不包括弃牌
    getIsMyThrowTurn,
    getCanPlayInMyTurn,

    // 我需要响应锦囊 但是不出牌的状态
    getIsMyScrollEffectTurn,

    // other
    getMyResponseInfo,

    // cal distance
    getDistanceFromAToB,

    // card type
    // getIsEquipmentCard,

    // Player validate
    getCanSelectMeAsTargetCardNamesClosure,

    // play card validate
    getInMyPlayTurnCanPlayCardNamesClourse,

    // 弃牌
    getNeedThrowCardNumber,

    // validate scroll target
    getIfUserHasAnyCards,
    getIfUserHasAnyHandCards,

    uuidv4,
    verticalRotationSting
}