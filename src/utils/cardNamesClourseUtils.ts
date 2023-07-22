import {CARD_CONFIG_WITH_FE_INFO} from "../config/cardConfigWithFEInfo";
import {BASIC_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {getCanPlayerPlaySha} from "./playerUtils";
import {Card} from "../types/card";
import {Player} from "../types/player";

const getInMyPlayTurnCanPlayCardNamesClourse = (player: Player) => {
    let canPlayInMyTurnCardNames: string[];
    return () => {
        if (!canPlayInMyTurnCardNames) {
            canPlayInMyTurnCardNames = Object.values(CARD_CONFIG_WITH_FE_INFO).filter((c: Partial<Card>) => c.canPlayInMyTurn).map((c) => c.key!)
        }

        let amendCanPlayInMyTurnCardNames: string[] = canPlayInMyTurnCardNames;
        if (player.maxBlood <= player.currentBlood) {
            amendCanPlayInMyTurnCardNames = amendCanPlayInMyTurnCardNames.filter((n) => n != BASIC_CARDS_CONFIG.TAO.key)
        }

        if (player.pandingSigns.find((sign) => sign.actualCard.key == SCROLL_CARDS_CONFIG.SHAN_DIAN.key)) {
            amendCanPlayInMyTurnCardNames = amendCanPlayInMyTurnCardNames.filter((n) => n != SCROLL_CARDS_CONFIG.SHAN_DIAN.key)
        }

        if (!getCanPlayerPlaySha(player)) {
            amendCanPlayInMyTurnCardNames = amendCanPlayInMyTurnCardNames.filter((n) => {
                return n != BASIC_CARDS_CONFIG.SHA.key && n != BASIC_CARDS_CONFIG.LEI_SHA.key && n != BASIC_CARDS_CONFIG.HUO_SHA.key
            })
        }

        return amendCanPlayInMyTurnCardNames
    }
}
const getCanSelectMeAsFirstTargetCardNamesClosure = () => {
    let names: string[];
    return () => {
        if (!names) {
            names = Object.values(CARD_CONFIG_WITH_FE_INFO).filter((c: Partial<Card>) => c.canClickMySelfAsFirstTarget).map((c) => c.key!)
        }
        return names
    }
}
const getCanSelectMeAsSecondTargetCardNamesClosure = () => {
    let names: string[];
    return () => {
        if (!names) {
            names = Object.values(CARD_CONFIG_WITH_FE_INFO).filter((c: Partial<Card>) => c.canClickMySelfAsSecondTarget).map((c) => c.key!)
        }
        return names
    }
}
export {getCanSelectMeAsSecondTargetCardNamesClosure};
export {getCanSelectMeAsFirstTargetCardNamesClosure};
export {getInMyPlayTurnCanPlayCardNamesClourse};