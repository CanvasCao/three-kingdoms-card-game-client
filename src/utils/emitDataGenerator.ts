import {GameStatus} from "../types/gameStatus";
import {EmitActionData, EmitResponseData, EmitThrowData} from "../types/emit";
import {attachFEInfoToCard} from "./cardUtils";
import {getMyPlayerId} from "./localstorage/localStorageUtils";
import {GameFEStatus} from "../types/gameFEStatus";
import {uuidv4} from "./uuid";
import {Player} from "../types/player";
import {BASIC_CARDS_CONFIG, CARD_CONFIG, EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {getResponseType, getWuxieTargetCardId} from "./response/responseUtils";
import {SKILL_NAMES_CONFIG} from "../config/skillsConfig";
import {getIsControlCardAbleByGameStatus} from "./validation/validationUtils";
import {RESPONSE_TYPE_CONFIG} from "../config/responseTypeConfig";

const generateAction = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): (EmitActionData | undefined) => {
    const actualCard = gameFEStatus.actualCard ? JSON.parse(JSON.stringify(gameFEStatus.actualCard)) : undefined

    const baseAction = {
        cards: gameFEStatus.selectedCards,
        actualCard,
        originId: getMyPlayerId(),
        skillKey: gameFEStatus.selectedSkillKey
    }

    if (!actualCard) {
        return {
            ...baseAction,
            targetIds: gameFEStatus.selectedTargetPlayers.map((targetPlayer: Player) => targetPlayer.playerId)
        }
    }

    const actualCardWithFEInfo = attachFEInfoToCard(actualCard)!;
    if (actualCardWithFEInfo.couldHaveMultiTarget || actualCardWithFEInfo.needAActionToB) {
        return {
            ...baseAction,
            targetIds: gameFEStatus.selectedTargetPlayers.map((targetPlayer: Player) => targetPlayer.playerId)
        }
    } else if (actualCardWithFEInfo.noNeedSetTargetDueToImDefaultTarget) {
        return {
            ...baseAction,
            targetIds: [getMyPlayerId()],
        }
    } else if (actualCardWithFEInfo.canOnlyHaveOneTarget) {
        return {
            ...baseAction,
            targetIds: [gameFEStatus.selectedTargetPlayers[0].playerId],
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
    const responseType = getResponseType(gameStatus);
    const skillKey = gameStatus?.skillResponse?.skillKey;
    return {
        chooseToResponse: true,
        cards: gameFEStatus.selectedCards,
        actualCard: gameFEStatus.actualCard,
        originId: getMyPlayerId(),
        wuxieTargetCardId: getWuxieTargetCardId(gameStatus),
        skillTargetIds: gameFEStatus.selectedTargetPlayers?.map(p => p.playerId),
        skillKey: (responseType == RESPONSE_TYPE_CONFIG.SKILL) ? skillKey : gameFEStatus?.selectedSkillKey
    }
}

const generateThrowData = (gameStatus: GameStatus, gameFEStatus: GameFEStatus): EmitThrowData => {
    return {cards: gameFEStatus.selectedCards, playerId: getMyPlayerId()}
}

const generateActualCard = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const selectedSkillKey = gameFEStatus.selectedSkillKey;

    if (!selectedSkillKey) {
        const card = JSON.parse(JSON.stringify(gameFEStatus.selectedCards[0]))
        card.cardId = uuidv4()
        return card
    }

    switch (selectedSkillKey) {
        case EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key:
            return {
                huase: gameFEStatus.selectedCards[0].huase,
                huase2: gameFEStatus.selectedCards[1].huase,
                cardId: uuidv4(),
                key: BASIC_CARDS_CONFIG.SHA.key,
                type: BASIC_CARDS_CONFIG.SHA.type,
            }
        case SKILL_NAMES_CONFIG.SHU002_WU_SHENG.key:
            return {
                huase: gameFEStatus.selectedCards[0].huase,
                cardId: uuidv4(),
                key: BASIC_CARDS_CONFIG.SHA.key,
                type: BASIC_CARDS_CONFIG.SHA.type,
            }
        case SKILL_NAMES_CONFIG.SHU005_LONG_DAN.key:
            if (getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHA.key})) {
                return {
                    huase: gameFEStatus.selectedCards[0].huase,
                    cardId: uuidv4(),
                    key: BASIC_CARDS_CONFIG.SHA.key,
                    type: BASIC_CARDS_CONFIG.SHA.type,
                }
            } else if (getIsControlCardAbleByGameStatus(gameStatus, {key: BASIC_CARDS_CONFIG.SHAN.key})) {
                return {
                    huase: gameFEStatus.selectedCards[0].huase,
                    cardId: uuidv4(),
                    key: BASIC_CARDS_CONFIG.SHAN.key,
                    type: BASIC_CARDS_CONFIG.SHAN.type,
                }
            }
            return null;
        case SKILL_NAMES_CONFIG.WU002_QI_XI.key:
            return {
                huase: gameFEStatus.selectedCards[0].huase,
                cardId: uuidv4(),
                key: SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key,
                type: SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.type,
            }
        case SKILL_NAMES_CONFIG.WU006_GUO_SE.key:
            return {
                huase: gameFEStatus.selectedCards[0].huase,
                cardId: uuidv4(),
                key: SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key,
                type: SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.type,
            }
        default:
            return null
    }
}

export {
    generateAction,
    generateNoResponse,
    generateYesResponse,
    generateThrowData,
    generateActualCard
}
