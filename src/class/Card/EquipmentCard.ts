import {sizeConfig} from "../../config/sizeConfig";
import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {EQUIPMENT_CARDS_CONFIG, EQUIPMENT_TYPE, EQ_TYPE_CARD_NAME_MAP} from "../../config/cardConfig";
import {sharedDrawEquipment} from "../../utils/draw/drawEquipmentUtils";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {uuidv4} from "../../utils/uuid";
import {Card} from "../../types/card";
import {getCanSelectEquipment, getNeedSelectCardsNumber, getSelectedCardNumber} from "../../utils/cardValidation";


export class EquipmentCard {
    obId: string;
    gamingScene: GamingScene;
    card: Card;
    equipmentType: keyof typeof EQUIPMENT_TYPE;
    playerId: string;
    cardName: string;
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
        this.cardName = card.CN;
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

        this.drawEquipmentCard(card);
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        if (this.isMe) {
            this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
        }
    }

    drawEquipmentCard(card: Card) {
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
        } = sharedDrawEquipment(this.gamingScene, card, {
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

                const gameFEStatusObserved = this.gamingScene.gameFEStatusObserved;
                const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
                const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;

                const canSelectEquipment = getCanSelectEquipment(gameStatus, gameFEStatus, this.cardName);
                if (!canSelectEquipment) return;

                const needSelectCardsNumber = getNeedSelectCardsNumber(gameStatus, gameFEStatus);
                const haveSelectCardsNumber = getSelectedCardNumber(gameFEStatus);
                const haveSelectedEnoughCard = haveSelectCardsNumber >= needSelectCardsNumber;

                // 已经选中技能 或者响应技能 的情况下 一定是要打出武器
                const haveSelectedSkillAndItsNotZhangBaSheMao = gameFEStatus.selectedSkillName && (gameFEStatus.selectedSkillName !== EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.CN)
                if (haveSelectedSkillAndItsNotZhangBaSheMao || gameStatus.skillResponse) {
                    // @ts-ignore
                    if (gameFEStatus.selectedCards[EQ_TYPE_CARD_NAME_MAP[(this.equipmentType)]]) { // 已经选中
                        gameFEStatusObserved.unselectEquipmentCard(this.card)
                    } else { // 还没选中
                        if (!haveSelectedEnoughCard) {
                            gameFEStatusObserved.selectEquipmentCard(this.card)
                        }
                    }
                }
                // 没有选中技能 或者响应技能 是要选中丈八蛇矛
                else {
                    if (gameFEStatus.selectedSkillName == this.cardName) {
                        gameFEStatusObserved.unselectSkill()
                    } else {
                        gameFEStatusObserved.selectSkill(this.cardName)
                    }
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
        const player = gameStatus.players[this.playerId];
        // @ts-ignore
        const newEquipmentCard = player[EQ_TYPE_CARD_NAME_MAP[this.equipmentType]] as Card
        if (!newEquipmentCard) {
            this.destoryAll();
        }
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        // 不是我的武器牌不可能选中
        if (this.playerId !== getMyPlayerId()) {
            return;
        }

        let isSelected = false;
        if (gameFEStatus.selectedSkillName === EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.CN &&
            this.cardName === EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.CN) {
            isSelected = true
        }
        // @ts-ignore
        if (gameFEStatus.selectedCards[EQ_TYPE_CARD_NAME_MAP[this.equipmentType]].cardId == this.cardId) {
            isSelected = true
        }

        if (this._isSelected == isSelected) return;

        this.cardObjgroup.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    // @ts-ignore
                    value: isSelected ? (obj.x + sizeConfig.controlSelectedOffsetX) : (obj.x - sizeConfig.controlSelectedOffsetX),
                    duration: 100,
                },
                onComplete: () => {
                    // this.selectedStroke!.setAlpha(isSelected ? 1 : 0);
                    this._isSelected = isSelected
                }
            });
        });
    }
}