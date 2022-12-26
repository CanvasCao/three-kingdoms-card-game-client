import {Card} from "../types/gameStatus";
import {CARD_CONFIG} from "./cardConfig";
import {attachFEInfoToCard} from "./cardUtils";

const addFEInfoToCardConfig = (cardConfig: { [key: string]: Partial<Card> }) => {
    Object.keys(cardConfig).forEach((key, index) => {
        let card = cardConfig[key] as Card
        attachFEInfoToCard(card);
    });
    return cardConfig
}

const CARD_CONFIG_WITH_FE_INFO = addFEInfoToCardConfig(CARD_CONFIG);

export {
    CARD_CONFIG_WITH_FE_INFO,
}