import {sizeConfig} from "../../config/sizeConfig";
import {GamingScene} from "../../types/phaser";
import {Card, GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {CARD_NUM_DESC, EQUIPMENT_CARDS_CONFIG, EQUIPMENT_TYPE} from "../../config/cardConfig";
import {sharedDrawEquipment} from "../../utils/draw/drawEquipmentUtils";
import {getCardColor} from "../../utils/cardUtils";
import {getCanPlayerPlaySha} from "../../utils/playerUtils";
import {getMyPlayerId} from "../../utils/localStorageUtils";
import {getCanPlayInMyTurn} from "../../utils/stageUtils";
import {uuidv4} from "../../utils/uuid";
import {getI18Lan, i18Lans} from "../../i18n/i18nUtils";

const typeCardNameMap = {
    [EQUIPMENT_TYPE.WEAPON]: 'weaponCard',
    [EQUIPMENT_TYPE.SHIELD]: 'shieldCard',
    [EQUIPMENT_TYPE.PLUS_HORSE]: 'plusHorseCard',
    [EQUIPMENT_TYPE.MINUS_HORSE]: 'minusHorseCard',
}

export class ControlEquipmentCard {
    obId: string;
    gamingScene: GamingScene;
    equipmentType: string;
    card: Card | null;

    _cardId: string;
    _selected: boolean;

    selectedStroke: Phaser.GameObjects.Graphics | null;
    background: Phaser.GameObjects.Image | null;
    distanceText: Phaser.GameObjects.Text | null;
    nameText: Phaser.GameObjects.Text | null;
    huaseNumText: Phaser.GameObjects.Text | null;
    group: Phaser.GameObjects.GameObject[]

    constructor(gamingScene: GamingScene, equipmentType: string) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.equipmentType = equipmentType;
        this.card = null;

        // inner state
        this._cardId = '';
        this._selected = false;


        // phaser obj
        this.selectedStroke = null;
        this.background = null;
        this.distanceText = null;
        this.nameText = null;
        this.huaseNumText = null;
        this.group = [];

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
            selectedStroke,
            background,
            distanceText,
            nameText,
            huaseNumText,
        } = sharedDrawEquipment(this.gamingScene, undefined, {
            x: 5,
            y: sizeConfig.playersArea.height + offsetY + 10,
            isMe: true,
            alpha: 0,
        })

        this.selectedStroke = selectedStroke;
        this.background = background;
        this.distanceText = distanceText;
        this.nameText = nameText;
        this.huaseNumText = huaseNumText;
        this.group.push(background)
        this.group.push(distanceText)
        this.group.push(nameText)
        this.group.push(huaseNumText)
    }

    bindEvent() {
        this.background!.on('pointerdown', () => {
                if (!this.card) {
                    return
                }

                if (this.card.CN !== EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.CN) {
                    return;
                }

                const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
                if (!getCanPlayerPlaySha(gameStatus.players[getMyPlayerId()])) {
                    return;
                }

                if (!getCanPlayInMyTurn(gameStatus)) {
                    return;
                }

                const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
                if (gameFEStatus.selectedWeaponCard) {
                    this.gamingScene.gameFEStatusObserved.resetSelectedStatus()
                } else {
                    gameFEStatus.selectedWeaponCard = this.card;
                    this.gamingScene.gameFEStatusObserved.setSelectedGameEFStatus(gameFEStatus)
                }
            }
        );
    }

    hideCard() {
        this.group.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                alpha: {
                    value: 0,
                    duration: 0,
                },
            });
        });
    }

    showCard() {
        if (!this.card) {
            return
        }
        this.background?.setAlpha(1)

        if (this.card.equipmentType == EQUIPMENT_TYPE.MINUS_HORSE || this.card.equipmentType == EQUIPMENT_TYPE.PLUS_HORSE) {
            this.distanceText!.setText(this.card?.distanceDesc!)
        } else if (this.card.equipmentType == EQUIPMENT_TYPE.WEAPON) {
            this.distanceText!.setText((getI18Lan() == i18Lans.EN ? this.card?.distance?.toString() : this.card?.distanceDesc)!)
        }
        this.nameText!.setText((getI18Lan() == i18Lans.EN ? this.card?.EN?.substring(0, 7) + '...' : this.card?.CN))

        // @ts-ignore
        this.huaseNumText!.setText(CARD_NUM_DESC[this.card.number] + this.card.huase)
        this.huaseNumText!.setColor(getCardColor(this.card.huase))

        this.group.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                alpha: {
                    value: 1,
                    duration: 0,
                },
            });
        });
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
        const myPlayer = gameStatus.players[getMyPlayerId()];
        // @ts-ignore
        this.card = myPlayer[typeCardNameMap[this.equipmentType]] as Card

        if (this.card?.cardId == this._cardId) {
            return
        }

        if (this.card) {
            this.showCard();
        } else {
            this.hideCard();
        }

        this._cardId = this.card?.cardId;
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        const isSelected = !!gameFEStatus.selectedWeaponCard && (gameFEStatus.selectedWeaponCard?.cardId === this.card?.cardId);
        if (this._selected == isSelected) return;

        this.group.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    // @ts-ignore
                    value: isSelected ? (obj.x + sizeConfig.controlSelectedOffsetX) : (obj.x - sizeConfig.controlSelectedOffsetX),
                    duration: 0,
                },
                onComplete: () => {
                    this.selectedStroke!.setAlpha(isSelected ? 1 : 0);
                    this._selected = isSelected
                }
            });
        });
    }
}