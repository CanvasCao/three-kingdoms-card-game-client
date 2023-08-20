import {sizeConfig} from "../../config/sizeConfig";
import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {EQUIPMENT_CARDS_CONFIG, EQUIPMENT_TYPE} from "../../config/cardConfig";
import {sharedDrawEquipment} from "../../utils/draw/drawEquipmentUtils";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {uuidv4} from "../../utils/uuid";
import {Card} from "../../types/card";
import {getCanSelectEquipment, getNeedSelectCardsNumber, getSelectedCardNumber} from "../../utils/validationUtils";


const EQ_TYPE_CARD_NAME_MAP = {
    [EQUIPMENT_TYPE.WEAPON]: "weaponCard",
    [EQUIPMENT_TYPE.SHIELD]: 'shieldCard',
    [EQUIPMENT_TYPE.PLUS_HORSE]: 'plusHorseCard',
    [EQUIPMENT_TYPE.MINUS_HORSE]: 'minusHorseCard'
}

export class EquipmentCard {
    obId: string;
    gamingScene: GamingScene;
    card: Card;
    equipmentType: keyof typeof EQUIPMENT_TYPE;
    playerId: string;
    cardNameKey: string;
    cardId: string;
    isMe: boolean;

    isDestoryed: boolean;

    _isSelected: boolean;

    selectedStroke: Phaser.GameObjects.Graphics | null;
    background: Phaser.GameObjects.Image | null;
    distanceText: Phaser.GameObjects.Text | null;
    nameText: Phaser.GameObjects.Text | null;
    huaseNumText: Phaser.GameObjects.Text | null;
    cardObjGroup: Phaser.GameObjects.GameObject[]

    constructor(gamingScene: GamingScene, card: Card, playerId: string) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;
        this.cardNameKey = card.key;
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
        this.cardObjGroup = [];

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
            positionY = playerPositionY + offsetIndex * 17 + 18;
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

        this.cardObjGroup.push(background)
        this.cardObjGroup.push(distanceText)
        this.cardObjGroup.push(nameText)
        this.cardObjGroup.push(huaseNumText)
    }

    bindEvent() {
        this.background!.on('pointerdown', () => {
                if (this.isDestoryed) {
                    return;
                }

                // 除了点击我的武器 其他都要触发点击用户
                if (this.playerId != getMyPlayerId()) {
                    this.gamingScene.boardPlayers.find(p => p.playerId === this.playerId)?.playerImage?.emit('pointerdown');
                }

                const gameFEStatusObserved = this.gamingScene.gameFEStatusObserved;
                const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
                const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;

                const canSelectEquipment = getCanSelectEquipment(gameStatus, gameFEStatus, this.cardNameKey);
                if (!canSelectEquipment) return;

                const needSelectCardsNumber = getNeedSelectCardsNumber(gameStatus, gameFEStatus);
                const haveSelectCardsNumber = getSelectedCardNumber(gameFEStatus);
                const haveSelectedEnoughCard = haveSelectCardsNumber >= needSelectCardsNumber;

                const haveSelectedSkillAndItsNotZhangBaSheMao = gameFEStatus.selectedSkillNameKey &&
                    (gameFEStatus.selectedSkillNameKey !== EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key)

                // 已经选中技能 或者 响应技能 的情况下 一定是要打出武器
                if (haveSelectedSkillAndItsNotZhangBaSheMao || gameStatus.skillResponse) {
                    if (gameFEStatus.selectedCards.map(c => c.cardId).includes(this.cardId)) { // 已经选中
                        gameFEStatusObserved.unselectCard(this.card)
                    } else { // 还没选中
                        if (!haveSelectedEnoughCard) {
                            const needGenerateActualCard = haveSelectCardsNumber == (needSelectCardsNumber - 1)
                            gameFEStatusObserved.selectCard(this.card, this.equipmentType, {needGenerateActualCard})
                        }
                    }
                }
                // 没有选中技能/响应技能/已经选中的是丈八蛇矛 是要选择/反选丈八蛇矛
                else {
                    if (gameFEStatus.selectedSkillNameKey == this.cardNameKey) {
                        gameFEStatusObserved.unselectSkill()
                    } else {
                        gameFEStatusObserved.selectSkill(this.cardNameKey)
                    }
                }
            }
        );
    }

    destoryAll() {
        this.isDestoryed = true;

        this.cardObjGroup.forEach((obj) => {
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
        if (gameFEStatus.selectedSkillNameKey === EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key &&
            this.cardNameKey === EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.key) {
            isSelected = true
        }
        // @ts-ignore
        if (gameFEStatus.selectedCards.map((c) => c.cardId).includes(this.cardId)) {
            isSelected = true
        }

        if (this._isSelected == isSelected) return;

        this.cardObjGroup.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    // @ts-ignore
                    value: isSelected ? (obj.x + sizeConfig.controlCardSelectedOffsetX) : (obj.x - sizeConfig.controlCardSelectedOffsetX),
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