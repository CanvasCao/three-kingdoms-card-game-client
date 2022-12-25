import {Card, GameStatus, User, GameStatusUsers} from "../types/gameStatus";
import {BASIC_CARDS_CONFIG, CARD_TYPE, SCROLL_CARDS_CONFIG} from "./cardConfig";

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
    if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length) {
        return gameStatus.wuxieSimultaneousResStage.hasWuxiePlayerIds.includes(getMyUserId())
    }
    if (gameStatus.taoResStages.length > 0) {
        return gameStatus.taoResStages[0]?.originId == getMyUserId();
    }
    if (gameStatus.shanResStages.length > 0) {
        return gameStatus.shanResStages[0]?.originId == getMyUserId();
    }
    return false;
}

const getCanPlayInMyTurn = (gameStatus: GameStatus) => {
    return gameStatus.shanResStages.length <= 0 &&
        gameStatus.taoResStages.length <= 0 &&
        gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length == 0 &&
        getIsMyPlayTurn(gameStatus);
}

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

const getCanPlayThisCardInMyPlayTurn = (user: User, card: Card) => {
    if (getIsEquipmentCard(card)) {
        return true
    }

    const cards = [
        BASIC_CARDS_CONFIG.SHA.CN,
        BASIC_CARDS_CONFIG.LEI_SHA.CN,
        BASIC_CARDS_CONFIG.HUO_SHA.CN,

        SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN,
        SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN,
        SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.CN,
    ]
    if (user.maxBlood > user.currentBlood) {
        cards.push(BASIC_CARDS_CONFIG.TAO.CN)
    }

    if (!user.pandingSigns.find((sign) => sign.actualCard.CN == SCROLL_CARDS_CONFIG.SHAN_DIAN.CN)) {
        cards.push(SCROLL_CARDS_CONFIG.SHAN_DIAN.CN)
    }

    return cards.includes(card.CN)
}

const getHowManyTargetsNeed = (actualCard: Card) => {
    if (getIsEquipmentCard(actualCard)) {
        return {min: 0, max: 0}
    }
    if ([SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN, SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN].includes(actualCard.CN)) {
        return {min: 1, max: 1}
    }
    if ([BASIC_CARDS_CONFIG.SHA.CN, BASIC_CARDS_CONFIG.LEI_SHA.CN, BASIC_CARDS_CONFIG.HUO_SHA.CN].includes(actualCard.CN)) {
        return {min: 1, max: 3}
    }
    if ([BASIC_CARDS_CONFIG.TAO.CN,
        SCROLL_CARDS_CONFIG.SHAN_DIAN.CN,
        SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.CN,
        SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN].includes(actualCard.CN)) {
        return {min: 0, max: 0}
    }
    return {min: 100, max: 100}
}

const getDistanceBetweenMeAndTarget = (users: GameStatusUsers, targetUserId: string) => {
    const meUser = users[getMyUserId()];
    const targetUser = users[targetUserId];
    const userNumber = Object.keys(users).length;

    const tableDistance = Math.min(
        Math.abs(meUser.location - targetUser.location),
        Math.abs(meUser.location + userNumber - targetUser.location),
        Math.abs(meUser.location - (targetUser.location + userNumber))
    )
    return tableDistance + (meUser?.minusHorseCard?.horseDistance || 0) + (targetUser?.plusHorseCard?.horseDistance || 0)
}

const getIsEquipmentCard = (card: Card) => {
    return CARD_TYPE.EQUIPMENT == card.type
}

const getCantSelectMeAsTargetCardNames = () => {
    return [
        BASIC_CARDS_CONFIG.SHA.CN, BASIC_CARDS_CONFIG.LEI_SHA.CN, BASIC_CARDS_CONFIG.HUO_SHA.CN,
        SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN, SCROLL_CARDS_CONFIG.BING_LIANG_CUN_DUAN.CN,
        SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN, SCROLL_CARDS_CONFIG.JUE_DOU
    ]
}

const getNeedThrowCardNumber = (user: User) => {
    return user.cards.length - user.currentBlood
}

const getIfUserHasAnyCard = (user: User) => {
    return user.cards.length ||
        user.pandingSigns.length ||
        user.plusHorseCard ||
        user.minusHorseCard ||
        user.shieldCard ||
        user.weaponCard
}

export {
    getMyUserId,

    // my turn for UI
    getIsMyPlayTurn,

    // 我需要出牌的状态
    getIsMyResponseCardTurn, // response 包括闪桃无懈可击 不包括弃牌
    getIsMyThrowTurn,
    getCanPlayInMyTurn,

    // 我需要响应锦囊 但是不出牌的状态
    getIsMyScrollEffectTurn,

    // other
    getMyResponseInfo,
    getCanPlayThisCardInMyPlayTurn,

    // cal distance
    getDistanceBetweenMeAndTarget,

    // card type
    getIsEquipmentCard,

    // Player class validate target
    getCantSelectMeAsTargetCardNames,
    getHowManyTargetsNeed,

    // 弃牌
    getNeedThrowCardNumber,

    // validate 锦囊 target
    getIfUserHasAnyCard,

    uuidv4
}