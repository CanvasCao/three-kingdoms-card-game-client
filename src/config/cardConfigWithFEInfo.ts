import {attachFEInfoToCard} from "../utils/cardUtils";
import {CARD_CONFIG} from "./cardConfig";
import {Card} from "../types/card";

const addFEInfoToCardConfig = (cardConfig: { [key: string]: Card }) => {
    Object.keys(cardConfig).forEach((key, index) => {
        let card = cardConfig[key] as Card
        attachFEInfoToCard(card);
    });
    return cardConfig
}

const CARD_CONFIG_WITH_FE_INFO = addFEInfoToCardConfig(CARD_CONFIG as { [key: string]:Card });

export {
    CARD_CONFIG_WITH_FE_INFO,
}