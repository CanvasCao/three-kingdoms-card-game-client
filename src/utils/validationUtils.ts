import {GameStatus} from "../types/gameStatus";
import {GameFEStatus} from "../types/gameFEStatus";
import {getCanPlayInMyTurn, getIsMyResponseTurn, getIsMyThrowTurn} from "./stage/stageUtils";
import {getIsZhangBaSheMaoSelected} from "./weaponUtils";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {SKILL_NAMES} from "../config/skillsConfig";
import {EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {getCanPlayerPlaySha} from "./playerUtils";
import {getResponseType} from "./response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../config/responseTypeConfig";

const getSelectedCardNumber = (gameFEStatus: GameFEStatus) => {
    return gameFEStatus.selectedCards.length
}

const getSelectedTargetNumber = (gameFEStatus: GameFEStatus) => {
    return gameFEStatus.selectedTargetPlayers.length
}

const getNeedSelectCardsNumber = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseTurn = getIsMyResponseTurn(gameStatus);
    const isMyThrowTurn = getIsMyThrowTurn(gameStatus);
    const responseType = getResponseType(gameStatus);

    if (canPlayInMyTurn) {
        if (getIsZhangBaSheMaoSelected(gameFEStatus)) {
            return 2;
        }

        return 1;
    } else if (isMyResponseTurn) {
        if (getIsZhangBaSheMaoSelected(gameFEStatus)) {
            return 2;
        }

        if (responseType == RESPONSE_TYPE_CONFIG.SKILL &&
            gameStatus.skillResponse!.chooseToReleaseSkill === undefined) {
            return 0
        }

        return 1;
    } else if (isMyThrowTurn) {
        const myPlayer = gameStatus.players[getMyPlayerId()];
        return myPlayer.cards.length - myPlayer.currentBlood;
    }

    return 0
}

const getCanSelectEquipment = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, eqCardName: string) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseTurn = getIsMyResponseTurn(gameStatus);
    // const isMyThrowTurn = getIsMyThrowTurn(gameStatus);

    if (isMyResponseTurn) {
        const responseType = getResponseType(gameStatus)
        if (responseType === RESPONSE_TYPE_CONFIG.SKILL &&
            gameStatus.skillResponse!.skillName == SKILL_NAMES.WU["006"].LIU_LI &&
            gameStatus.skillResponse!.chooseToReleaseSkill
        ) {
            return true
        }

        if (responseType === RESPONSE_TYPE_CONFIG.SCROLL &&
            (gameStatus.scrollResponses[0].actualCard.CN == SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN ||
                gameStatus.scrollResponses[0].actualCard.CN == SCROLL_CARDS_CONFIG.JUE_DOU.CN ||
                gameStatus.scrollResponses[0].actualCard.CN == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN) &&
            eqCardName == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.CN
        ) {
            return true
        }
    } else if (canPlayInMyTurn) {
        if (eqCardName == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.CN &&
            getCanPlayerPlaySha(gameStatus.players[getMyPlayerId()])
        ) {
            return true;
        }
    } else {
        return false;
    }
}

export {
    // 选手牌 武器牌 或 点击OK 的时候校验数字
    getNeedSelectCardsNumber,
    getCanSelectEquipment,
    getSelectedCardNumber,
    getSelectedTargetNumber
};