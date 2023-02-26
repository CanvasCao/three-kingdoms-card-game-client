import {CARD_CONFIG_WITH_FE_INFO} from "../config/cardConfigWithFEInfo";
import {Card, Player} from "../types/gameStatus";
import {BASIC_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {getCanPlayerPlaySha} from "./playerUtils";

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

        if (!getCanPlayerPlaySha(player)) {
            amendCanPlayInMyTurnCardNames = amendCanPlayInMyTurnCardNames.filter((n) => {
                return n != BASIC_CARDS_CONFIG.SHA.CN && n != BASIC_CARDS_CONFIG.LEI_SHA.CN && n != BASIC_CARDS_CONFIG.HUO_SHA.CN
            })
        }

        return amendCanPlayInMyTurnCardNames
    }
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
export {getCanSelectMeAsSecondTargetCardNamesClosure};
export {getCanSelectMeAsFirstTargetCardNamesClosure};
export {getInMyPlayTurnCanPlayCardNamesClourse};