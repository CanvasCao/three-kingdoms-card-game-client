import {sizeConfig} from "../../config/sizeConfig";
import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {CARD_NUM_DESC, EQUIPMENT_CARDS_CONFIG, EQUIPMENT_TYPE} from "../../config/cardConfig";
import {sharedDrawEquipment} from "../../utils/draw/drawEquipmentUtils";
import {getCardColor} from "../../utils/cardUtils";
import {getCanPlayerPlaySha} from "../../utils/playerUtils";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {getCanPlayInMyTurn} from "../../utils/stageUtils";
import {uuidv4} from "../../utils/uuid";
import {Card} from "../../types/card";

const typeCardNameMap = {
    [EQUIPMENT_TYPE.WEAPON]: 'weaponCard',
    [EQUIPMENT_TYPE.SHIELD]: 'shieldCard',
    [EQUIPMENT_TYPE.PLUS_HORSE]: 'plusHorseCard',
    [EQUIPMENT_TYPE.MINUS_HORSE]: 'minusHorseCard',
}

export class EquipmentCard {
    obId: string;
    gamingScene: GamingScene;
    equipmentType: keyof typeof EQUIPMENT_TYPE;
    playerId: string;
    card: Card;
    cardId: string;
    isMe: boolean;

    isDestoryed: boolean;

    _isSelected: boolean;

    selectedStroke: Phaser.GameObjects.Graphics | null;
    background: Phaser.GameObjects.Image | null;
    distanceText: Phaser.GameObjects.Text | null;
    nameText: Phaser.GameObjects.Text | null;
    huaseNumText: Phaser.GameObjects.Text | null;
    cardObjgroup: Phaser.GameObjects.GameObject[]

    constructor(gamingScene: GamingScene, card: Card, playerId: string) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;
        this.cardId = card.cardId;
        this.equipmentType = card.equipmentType!;
        this.playerId = playerId;
        this.isMe = playerId === getMyPlayerId()

        this.isDestoryed = false;

        // inner state
        this._isSelected = false;

        // phaser obj
        this.selectedStroke = null;
        this.background = null;
        this.distanceText = null;
        this.nameText = null;
        this.huaseNumText = null;
        this.cardObjgroup = [];

        this.drawEquipmentCard();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }

    drawEquipmentCard() {
        const indexMap = {
            [EQUIPMENT_TYPE.WEAPON]: 0,
            [EQUIPMENT_TYPE.SHIELD]: 1,
            [EQUIPMENT_TYPE.PLUS_HORSE]: 2,
            [EQUIPMENT_TYPE.MINUS_HORSE]: 3,
        }

        const offsetIndex = indexMap[this.equipmentType];
        let positionX;
        let positionY;
        if (this.isMe) {
            positionX = 5;
            positionY = sizeConfig.playersArea.height + offsetIndex * sizeConfig.controlEquipment.height + 10;
        } else {
            const boardPlayer = this.gamingScene.boardPlayers.find(bp => bp.playerId === this.playerId)!;
            const playerPositionX = boardPlayer.positionX;
            const playerPositionY = boardPlayer.positionY;
            positionX = playerPositionX - sizeConfig.player.width / 2;
            positionY = playerPositionY + offsetIndex * 16 + 22;
        }

        const {
            selectedStroke,
            background,
            distanceText,
            nameText,
            huaseNumText,
        } = sharedDrawEquipment(this.gamingScene, this.card, {
            x: positionX,
            y: positionY,
            isMe: this.isMe,
        })

        this.selectedStroke = selectedStroke;
        this.background = background;
        this.distanceText = distanceText;
        this.nameText = nameText;
        this.huaseNumText = huaseNumText;

        this.cardObjgroup.push(background)
        this.cardObjgroup.push(distanceText)
        this.cardObjgroup.push(nameText)
        this.cardObjgroup.push(huaseNumText)

    }

    bindEvent() {
        this.background!.on('pointerdown', () => {
                if (this.isDestoryed) {
                    return;
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

    destoryAll() {
        this.isDestoryed = true;

        this.cardObjgroup.forEach((obj) => {
            obj?.destroy();
        })
        this.gamingScene.gameStatusObserved.removeObserver(this);
        this.gamingScene.gameFEStatusObserved.removeSelectedStatusObserver(this);
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
        const player = gameStatus.players[this.playerId];
        // @ts-ignore
        const equipmentCard = player[typeCardNameMap[this.equipmentType]] as Card

        if (equipmentCard.cardId !== this.cardId) {
            this.destoryAll();
        }
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        // 不是我的武器牌不可能选中
        if (this.playerId !== getMyPlayerId()) {
            return;
        }

        const isSelected = !!gameFEStatus.selectedWeaponCard && (gameFEStatus.selectedWeaponCard?.cardId === this.card?.cardId);
        if (this._isSelected == isSelected) return;

        this.cardObjgroup.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    // @ts-ignore
                    value: isSelected ? (obj.x + sizeConfig.controlSelectedOffsetX) : (obj.x - sizeConfig.controlSelectedOffsetX),
                    duration: 0,
                },
                onComplete: () => {
                    this.selectedStroke!.setAlpha(isSelected ? 1 : 0);
                    this._isSelected = isSelected
                }
            });
        });
    }
}