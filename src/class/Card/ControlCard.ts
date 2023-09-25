import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {getIsMyThrowTurn, getCanPlayInMyTurn, getIsMyResponseCardOrSkillTurn} from "../../utils/stage/stageUtils";
import {uuidv4} from "../../utils/uuid";
import {
    getIsControlCardAble,
    getNeedSelectCardsMinMax,
    getSelectedCardNumber
} from "../../utils/validation/validationUtils";
import {Card} from "../../types/card";
import {getMyCardPosition} from "../../utils/position/cardPositionUtils";
import { cardDuration } from "../../config/animationConfig";

export class ControlCard {
    obId: string;
    gamingScene: GamingScene;
    card: Card;
    _index: number;
    cardInitStartX: number;
    cardInitStartY: number;
    cardInitEndX: number;
    cardInitEndY: number;

    _cardDisable: boolean; // 只有出牌和相应阶段会set _cardDisable true
    isMoving: boolean;
    isDestoryed: boolean;

    cardObjGroup: PhaserGameObject[];
    cardImgObj: Phaser.GameObjects.Image | null;

    _selected: boolean;

    constructor(gamingScene: GamingScene, card: Card) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;

        // 初始化index
        this._index = this.gamingScene.controlCardsManager!._playerCards.findIndex(c => c.cardId == this.card.cardId);

        const position = getMyCardPosition(this._index);
        this.cardInitEndX = position.x;
        this.cardInitEndY = position.y;

        this.cardInitStartX = this.cardInitEndX + 200
        this.cardInitStartY = this.cardInitEndY

        // inner state
        this._cardDisable = false;
        this.isMoving = false;
        this.isDestoryed = false;

        // phaser obj
        this.cardObjGroup = [];
        this.cardImgObj = null;

        // prev state
        this._selected = false;

        this.drawCard();
        this.bindEvent();
        this.fadeIn();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }

    drawCard() {
        const curFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
        const curStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        const {cardImgObj, allCardObjects} = sharedDrawFrontCard(
            this.gamingScene,
            this.card,
            {x: this.cardInitStartX, y: this.cardInitStartY}
        )
        this.cardImgObj = cardImgObj;
        this.cardObjGroup = this.cardObjGroup.concat(allCardObjects)
        this.onCardDisableChange(curStatus, curFEStatus)
    }

    bindEvent() {
        this.cardImgObj!.on('pointerdown', () => {
                if (this._cardDisable) {
                    return
                }

                const gameFEStatusObserved = this.gamingScene.gameFEStatusObserved;
                const curFEStatus = gameFEStatusObserved.gameFEStatus!;
                const curStatus = this.gamingScene.gameStatusObserved.gameStatus!;

                const canPlayInMyTurn = getCanPlayInMyTurn(curStatus);
                const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(curStatus);
                const isMyThrowTurn = getIsMyThrowTurn(curStatus);

                const needSelectCardsNumber = getNeedSelectCardsMinMax(curStatus, curFEStatus).max;
                const haveSelectCardsNumber = getSelectedCardNumber(curFEStatus);
                const haveSelectedEnoughThrowCard = haveSelectCardsNumber >= needSelectCardsNumber;

                // 选中再点击就是反选
                if (curFEStatus.selectedCards.map(c => c.cardId).includes(this.card.cardId)) {
                    gameFEStatusObserved.unselectCard(this.card)
                } else { // 选中
                    if (!haveSelectedEnoughThrowCard) {
                        const selectEnoughCard = haveSelectCardsNumber == (needSelectCardsNumber - 1)
                        const needGenerateActualCard = (selectEnoughCard && !isMyThrowTurn)
                        gameFEStatusObserved.selectCard(this.card, {needGenerateActualCard})
                    }
                }
            }
        );
    }

    adjustLocation(currentIndex: number) {
        if (this.isMoving) {
            return
        }

        // 这张牌重新查询自己在手牌的新位置 位置不同就调整位置
        const diff = currentIndex - this._index;
        if (diff == 0) {
            return;
        }

        this.isMoving = true;
        this.cardObjGroup.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    // @ts-ignore
                    value: obj.x + diff * (sizeConfig.controlCard.width + sizeConfig.controlCardMargin),
                    duration: 100,
                },
                onComplete: () => {
                    this.isMoving = false;
                    this._index = currentIndex;
                }
            });
        });
    }

    fadeIn() {
        this.isMoving = true;
        this.cardObjGroup.forEach((obj, index) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: this.cardInitEndX + (obj?.getData("offsetX")),
                    duration: cardDuration,
                },
                y: {
                    value: this.cardInitEndY + (obj?.getData("offsetY")),
                    duration: cardDuration,
                },
                onComplete: () => {
                    this.isMoving = false;
                }
            });
        })
    }

    onCardDisableChange(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        const setCardDisable = () => {
            this.cardObjGroup.forEach((obj) => {
                // @ts-ignore
               if(obj.setTint) obj?.setTint(COLOR_CONFIG.disableCard)
            })
            this._cardDisable = true
        }

        const setCardAble = () => {
            this.cardObjGroup.forEach((obj) => {
                // @ts-ignore
                if(obj.clearTint) obj?.clearTint()
            })
            this._cardDisable = false
        }

        const isAble = getIsControlCardAble(gameStatus, gameFEStatus, this.card)
        isAble ? setCardAble() : setCardDisable()
    }

    destoryAll() {
        // TODO 好像是Phaser的bug 只能遍历到两个child
        // this.group.getChildren().forEach((child,i) => {
        //     console.log(child,i)
        //     child.destroy()
        // })
        this.isDestoryed = true;

        this.cardObjGroup.forEach((obj) => {
            obj?.destroy();
        })
        this.gamingScene.gameStatusObserved.removeObserver(this);
        this.gamingScene.gameFEStatusObserved.removeSelectedStatusObserver(this);
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const currentIndex = gameStatus.players[getMyPlayerId()].cards.findIndex((c) => c.cardId == this.card.cardId);
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;

        // 这张牌重新查询自己在手牌的新位置 没有就destory自己
        if (currentIndex == -1) {
            this.destoryAll();
            return;
        }
        this.adjustLocation(currentIndex);

        this.onCardDisableChange(gameStatus, gameFEStatus);
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;

        this.onCardSelectedChange(gameFEStatus);
        this.onCardDisableChange(gameStatus, gameFEStatus);
    }

    onCardSelectedChange(gameFEStatus: GameFEStatus) {
        if (this.isDestoryed) {
            return;
        }

        const isSelected = !!gameFEStatus.selectedCards.find((c) => c.cardId == this.card.cardId)
        if (this._selected == isSelected) return;
        if (this.isMoving) return;
        const whenSelectedMoveDistance = 20;

        this.isMoving = true;
        this.cardObjGroup.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                y: {
                    // @ts-ignore
                    value: isSelected ? (obj.y - whenSelectedMoveDistance) : (obj.y + whenSelectedMoveDistance),
                    duration: 100,
                },
                onComplete: () => {
                    this.isMoving = false;
                    this._selected = isSelected
                }
            });
        });
    }
}