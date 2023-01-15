import {sizeConfig} from "../../config/sizeConfig";
import {
    getMyPlayerId,
    uuidv4,
} from "../../utils/gameStatusUtils";
import {GamingScene} from "../../types/phaser";
import {Card, GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {EQUIPMENT_TYPE} from "../../config/cardConfig";
import {sharedDrawEquipment} from "../../utils/drawEquipmentUtils";

export class ControlEquipmentCard {
    obId: string;
    gamingScene: GamingScene;
    equipmentType: string;

    _cardId: string;
    _selected: boolean;

    distanceText: Phaser.GameObjects.Text | null;
    nameText: Phaser.GameObjects.Text | null;
    huaseNumText: Phaser.GameObjects.Text | null;


    constructor(gamingScene: GamingScene, equipmentType: string) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.equipmentType = equipmentType;

        // inner state
        this._cardId = '';
        this._selected = false;


        // phaser obj
        this.distanceText = null;
        this.nameText = null;
        this.huaseNumText = null;


        this.drawEquipmentCard();

        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }

    drawEquipmentCard() {
        const map = {
            [EQUIPMENT_TYPE.WEAPON]: 0,
            [EQUIPMENT_TYPE.SHIELD]: 1,
            [EQUIPMENT_TYPE.PLUS_HORSE]: 2,
            [EQUIPMENT_TYPE.MINUS_HORSE]: 3,
        }
        const offsetY = map[this.equipmentType] * sizeConfig.controlEquipment.height;
        const {
            distanceText,
            nameText,
            huaseNumText,
        } = sharedDrawEquipment(this.gamingScene, undefined, {
            x: 5,
            y: sizeConfig.playersArea.height + offsetY + 10,
            isMe: true
        })

        this.distanceText = distanceText;
        this.nameText = nameText;
        this.huaseNumText = huaseNumText;
    }

    bindEvent() {
        this.distanceText!.on('pointerdown', () => {
                // this.gamingScene.gameFEStatusObserved.setSelectedGameEFStatus(curFEStatus);
            }
        );
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const myPlayer = gameStatus.players[getMyPlayerId()];
        const map = {
            [EQUIPMENT_TYPE.WEAPON]: 'weaponCard',
            [EQUIPMENT_TYPE.SHIELD]: 'shieldCard',
            [EQUIPMENT_TYPE.PLUS_HORSE]: 'plusHorseCard',
            [EQUIPMENT_TYPE.MINUS_HORSE]: 'minusHorseCard',
        }
        // @ts-ignore
        const card = myPlayer[map[this.equipmentType]] as Card

        if (card?.cardId == this._cardId) {
            return
        }

        if (card) {
            this.distanceText!.setText(card.distanceDesc || '')
            this.nameText!.setText(card.CN)
            this.huaseNumText!.setText(card.cardNumDesc + card.huase)
        }
        this.gamingScene.tweens.add({
            targets: [this.distanceText, this.nameText, this.huaseNumText],
            alpha: {
                value: card ? 1 : 0,
                duration: 0,
            },
        });
        this._cardId = card?.cardId;
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {

    }
}