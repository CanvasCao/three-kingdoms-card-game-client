import {Card, GameStatus, User} from "../types/gameStatus";
import {BASIC_CARDS_CONFIG, CARD_TYPE, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {CARD_CONFIG_WITH_FE_INFO} from "../config/cardConfigWithFEInfo";
import {isNil} from "lodash";

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
        return gameStatus.scrollResStages[0].originId == getMyUserId() // 不需要判断isEffect 如果没有人想出无懈可击肯定生效了 && gameStatus.scrollResStages[0].isEffect;
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
const getMyResponseInfo = (gameStatus: GameStatus):
    {
        targetId: string,
        cardNames: string[],
        wuxieTargetCardId?: string
    } | undefined => {
    if (gameStatus.wuxieSimultaneousResStage?.hasWuxiePlayerIds?.length > 0) {
        const chainItem = gameStatus.wuxieSimultaneousResStage.wuxieChain[gameStatus.wuxieSimultaneousResStage.wuxieChain.length - 1]
        return {
            targetId: chainItem.originId, // 我无懈可击的目标人
            wuxieTargetCardId: chainItem.actualCard.cardId,// 我无懈可击的目标卡
            cardNames: [SCROLL_CARDS_CONFIG.WU_XIE_KE_JI.CN],
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

const getIfUserHasWeapon = (user: User) => {
    return user.weaponCard
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
    getCanSelectMeAsFirstTargetCardNamesClosure,
    getCanSelectMeAsSecondTargetCardNamesClosure,

    // play card validate
    getInMyPlayTurnCanPlayCardNamesClourse,

    // 弃牌
    getNeedThrowCardNumber,

    // validate scroll target
    getIfUserHasAnyCards,
    getIfUserHasAnyHandCards,
    getIfUserHasWeapon,

    uuidv4,
    verticalRotationSting
}