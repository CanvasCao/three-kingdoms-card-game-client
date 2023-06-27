import differenceBy from 'lodash/differenceBy';
import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {EquipmentCard} from "../Card/EquipmentCard";
import {uuidv4} from "../../utils/uuid";
import {Card} from "../../types/card";

export class EquipmentmentCardsManager {
    obId: string;
    gamingScene: GamingScene;
    _allPlayerEquipmentCards: { [key: string]: Card[] };

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this._allPlayerEquipmentCards = {};

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    gameStatusNotify(gameStatus: GameStatus) {
        for (const playerId in gameStatus.players) {
            const player = gameStatus.players[playerId]
            const playerEquipmentCards = [player.weaponCard, player.shieldCard, player.minusHorseCard, player.plusHorseCard].filter(Boolean)
            if (!playerEquipmentCards.length) {
                continue
            }

            const needNewCards = differenceBy(playerEquipmentCards, this._allPlayerEquipmentCards[playerId] || [], 'cardId');
            this._allPlayerEquipmentCards[playerId] = playerEquipmentCards;

            needNewCards.forEach((card) => {
                new EquipmentCard(this.gamingScene, card, playerId);
            })
        }
    }
}
