import {GameStatus} from "../types/gameStatus";
import {EmitActionData, EmitResponseData, EmitThrowData} from "../types/emit";
import {attachFEInfoToCard} from "./cardUtils";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {GameFEStatus} from "../types/gameFEStatus";
import {getIsZhangBaSheMaoSelected} from "./weaponUtils";
import {uuidv4} from "./uuid";
import {Player} from "../types/player";
import {CARD_CONFIG, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {getWuxieTargetCardId} from "./response/responseUtils";
import {SKILL_NAMES_CONFIG} from "../config/skillsConfig";

const generateAction = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): (EmitActionData | undefined) => {
    const actualCard = JSON.parse(JSON.stringify(gameFEStatus.actualCard))
    const actualCardWithFEInfo = attachFEInfoToCard(actualCard)!;

    const baseAction = {
        cards: gameFEStatus.selectedCards,
        actualCard,
        originId: getMyPlayerId(),
        skillKey: gameFEStatus.selectedSkillKey
    }

    if (actualCardWithFEInfo.couldHaveMultiTarget || actualCardWithFEInfo.needAActionToB) {
        return {
            ...baseAction,
            targetIds: gameFEStatus.selectedTargetPlayers.map((targetPlayer: Player) => targetPlayer.playerId)
        }
    } else if (actualCardWithFEInfo.noNeedSetTargetDueToImDefaultTarget) {
        return {
            ...baseAction,
            targetId: getMyPlayerId(),
        }
    } else if (actualCardWithFEInfo.canOnlyHaveOneTarget) {
        return {
            ...baseAction,
            targetId: gameFEStatus.selectedTargetPlayers[0].playerId,
        }
    } else if (actualCardWithFEInfo.noNeedSetTargetDueToTargetAll) {
        return {
            ...baseAction,
        }
    }
}

const generateNoResponse = () => {
    return {
        originId: getMyPlayerId(),
        chooseToResponse: false
    }
}

const generateYesResponse = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): EmitResponseData => {
    return {
        chooseToResponse: true,
        cards: gameFEStatus.selectedCards,
        actualCard: gameFEStatus.actualCard!,
        originId: getMyPlayerId(),
        wuxieTargetCardId: getWuxieTargetCardId(gameStatus),
        skillTargetIds: gameFEStatus.selectedTargetPlayers?.map(p => p.playerId)
    }
}

const generateThrowData = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): EmitThrowData => {
    return {cards: gameFEStatus.selectedCards, playerId: getMyPlayerId()}
}

const generateActualCard = (gameFEStatus: GameFEStatus) => {
    if (getIsZhangBaSheMaoSelected(gameFEStatus)) {
        return {
            huase: gameFEStatus.selectedCards[0].huase,
            huase2: gameFEStatus.selectedCards[1].huase,
            cardId: uuidv4(),
            key: CARD_CONFIG.SHA.key,
        }
    } else if (gameFEStatus.selectedSkillKey === SKILL_NAMES_CONFIG.SHU002_WU_SHENG.key) {
        return {
            huase: gameFEStatus.selectedCards[0].huase,
            cardId: uuidv4(),
            key: CARD_CONFIG.SHA.key,
        }
    } else if (gameFEStatus.selectedSkillKey === SKILL_NAMES_CONFIG.WU002_QI_XI.key) {
        return {
            huase: gameFEStatus.selectedCards[0].huase,
            cardId: uuidv4(),
            key: SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key,
        }
    } else {
        const card = JSON.parse(JSON.stringify(gameFEStatus.selectedCards[0]))
        card.cardId = uuidv4()
        return card
    }
}

export {
    generateAction,
    generateNoResponse,
    generateYesResponse,
    generateThrowData,
    generateActualCard
}
