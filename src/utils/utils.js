import {CARD_CONFIG, CARD_TYPE} from "./cardConfig";

const getRelativePositionToCanvas = (gameObject, camera) => {
    return {
        x: (gameObject.x - camera.worldView.x) * camera.zoom,
        y: (gameObject.y - camera.worldView.y) * camera.zoom
    }
}

function uuidv4() {
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

const getIsMyPlayTurn = (gameStatus) => {
    return gameStatus.stage.userId == getMyUserId() && gameStatus.stage.stageName == 'play';
}

const getIsMyResponseTurn = (gameStatus) => {
    if (gameStatus.taoResStages.length > 0) {
        return gameStatus.taoResStages?.[0]?.originId == getMyUserId();
    }
    if (gameStatus.shanResStages.length > 0) {
        console.log(gameStatus.shanResStages?.[0]?.originId)
        console.log(getMyUserId())
        return gameStatus.shanResStages?.[0]?.originId == getMyUserId();
    }
    return false;
}

const getIsOthersResponseTurn = (gameStatus) => {
    if (gameStatus.taoResStages.length > 0) {
        return gameStatus.taoResStages[0]?.originId != getMyUserId();
    }
    if (gameStatus.shanResStages.length > 0) {
        return gameStatus.shanResStages[0]?.originId != getMyUserId();
    }
    return false;
}

const getCanPlayInMyTurn = (gameStatus) => {
    return gameStatus.shanResStages.length <= 0 && gameStatus.taoResStages.length <= 0 && getIsMyPlayTurn(gameStatus);
}

const getCanPlayThisCardInMyPlayTurn = (user, card) => {
    if ([CARD_TYPE.PLUS_HORSE, CARD_TYPE.MINUS_HORSE, CARD_TYPE.SHIELD, CARD_TYPE.WEAPON].includes(card.type)) {
        return true
    }

    const cards = [
        CARD_CONFIG.SHA.CN,CARD_CONFIG.LEI_SHA.CN,CARD_CONFIG.HUO_SHA.CN, CARD_CONFIG.GUO_HE_CHAI_QIAO.CN, CARD_CONFIG.LE_BU_SI_SHU.CN
    ]
    if (user.maxBlood > user.currentBlood) {
        cards.push(CARD_CONFIG.TAO.CN)
    }

    if (!user.pandingCards.find((c) => c.CN == CARD_CONFIG.SHAN_DIAN.CN)) {
        cards.push(CARD_CONFIG.SHAN_DIAN.CN)
    }

    return cards.includes(card.CN)
}

const getHowManyTargetsNeed = (actualCard) => {
    if ([CARD_TYPE.PLUS_HORSE, CARD_TYPE.MINUS_HORSE, CARD_TYPE.SHIELD, CARD_TYPE.WEAPON].includes(actualCard.type)) {
        return {min: 0, max: 0}
    }
    if ([CARD_CONFIG.GUO_HE_CHAI_QIAO.CN, CARD_CONFIG.LE_BU_SI_SHU.CN].includes(actualCard.CN)) {
        return {min: 1, max: 1}
    }
    if ([CARD_CONFIG.SHA.CN,CARD_CONFIG.LEI_SHA.CN,CARD_CONFIG.HUO_SHA.CN].includes(actualCard.CN)) {
        return {min: 2, max: 3}
    }
    if ([CARD_CONFIG.TAO.CN, CARD_CONFIG.SHAN_DIAN.CN].includes(actualCard.CN)) {
        return {min: 0, max: 0}
    }
    return {min: 100, max: 100}
}

const getDistanceBetweenMeAndTarget = (users, targetUserId) => {
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

const getIsEquipmentCard = (card) => {
    return [CARD_TYPE.PLUS_HORSE, CARD_TYPE.MINUS_HORSE, CARD_TYPE.SHIELD, CARD_TYPE.WEAPON].includes(card.type)
}

export {
    getIsMyPlayTurn,
    getIsMyResponseTurn,
    getIsOthersResponseTurn,
    getCanPlayInMyTurn,
    getMyUserId,
    getCanPlayThisCardInMyPlayTurn,
    getHowManyTargetsNeed,
    getDistanceBetweenMeAndTarget,
    getIsEquipmentCard,
    uuidv4
}