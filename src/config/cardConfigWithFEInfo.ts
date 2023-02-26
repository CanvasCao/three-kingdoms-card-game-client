import {Card} from "../types/gameStatus";
import {attachFEInfoToCard} from "../utils/cardUtils";
import {CARD_CONFIG} from "./cardConfig";

const addFEInfoToCardConfig = (cardConfig: { [key: string]: Partial<Card> }) => {
    Object.keys(cardConfig).forEach((key, index) => {
        let card = cardConfig[key] as Card
        attachFEInfoToCard(card);
    });
    return cardConfig
}

const CARD_CONFIG_WITH_FE_INFO = addFEInfoToCardConfig(CARD_CONFIG as { [key: string]: Partial<Card> });

export {
    CARD_CONFIG_WITH_FE_INFO,
}