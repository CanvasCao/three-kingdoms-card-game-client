import sizeConfig from "../../config/sizeConfig.json";
import colorConfig from "../../config/colorConfig.json";
import {
    getMyPlayerId,
    uuidv4,
    getIsMyResponseCardTurn,
    getInMyPlayTurnCanPlayCardNamesClourse,
    getIsMyThrowTurn,
    getNeedThrowCardNumber,
    getMyResponseInfo,
    getCanPlayInMyTurn
} from "../../utils/gameStatusUtils";
import {sharedDrawFrontCard} from "../../utils/drawCardUtils";
import differenceBy from "lodash/differenceBy";
import {GamingScene} from "../../types/phaser";
import {Card, GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {getControlCardPosition} from "../../utils/cardUtils";

export class ControlCard {
    obId: string;
    gamingScene: GamingScene;
    card: Card;
    _index: number;
    cardInitStartX: number;
    cardInitStartY: number;
    cardInitEndX: number;
    cardInitEndY: number;

    disableTint: string;
    ableTint: string;

    _cardDisable: boolean; // 只有出牌和相应阶段会set _cardDisable true
    isMoving: boolean;
    isDestoryed: boolean;

    cardObjgroup: Phaser.GameObjects.GameObject[];
    cardImgObj: Phaser.GameObjects.Image | null;

    _selected: boolean;

    constructor(gamingScene: GamingScene, card: Card) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;

        // 初始化index
        this._index = this.gamingScene.controlCardsManager!._playerCards.findIndex(c => c.cardId == this.card.cardId);

        const position = getControlCardPosition(this._index);
        this.cardInitEndX = position.x;
        this.cardInitEndY = position.y;

        this.cardInitStartX = this.cardInitEndX + 200
        this.cardInitStartY = this.cardInitEndY

        // tint
        this.disableTint = colorConfig.disableCard;
        this.ableTint = colorConfig.card;

        // inner state
        this._cardDisable = false;
        this.isMoving = false;
        this.isDestoryed = false;

        // phaser obj
        this.cardObjgroup = [];
        this.cardImgObj = null;

        // prev state
        this._selected = false;

        this.drawCard();
        this.fadeIn();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }

    drawCard() {
        const {
            cardImgObj,
            cardNameObj,
            cardHuaseNumberObj
        } = sharedDrawFrontCard(
            this.gamingScene,
            this.card,
            {
                x: this.cardInitStartX,
                y: this.cardInitStartY,
                alpha: 0
            }
        )
        this.cardImgObj = cardImgObj;
        this.cardObjgroup.push(cardImgObj);
        this.cardObjgroup.push(cardNameObj);
        this.cardObjgroup.push(cardHuaseNumberObj);
        this.setCardDisableByGameStatus(this.gamingScene.gameStatusObserved.gameStatus!, true)
    }

    bindEvent() {
        this.cardImgObj!.on('pointerdown', () => {
                if (this._cardDisable) { // 弃牌阶段 ControlCard 不set _cardDisable 只在点击时做数量判断
                    return
                }

                const curFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
                const curStatus = this.gamingScene.gameStatusObserved.gameStatus!;

                const canPlayInMyTurn = getCanPlayInMyTurn(curStatus);
                const isMyResponseCardTurn = getIsMyResponseCardTurn(curStatus);
                const isMyThrowTurn = getIsMyThrowTurn(curStatus);
                if (!canPlayInMyTurn && !isMyResponseCardTurn && !isMyThrowTurn) {
                    return
                }

                if (canPlayInMyTurn || isMyResponseCardTurn) {
                    // 选中再点击就是反选
                    if (curFEStatus.selectedCards.map(c => c.cardId).includes(this.card.cardId)) {
                        curFEStatus.selectedCards = [];
                        curFEStatus.selectedIndexes = [];
                        curFEStatus.actualCard = null;
                        curFEStatus.selectedTargetPlayers = [];
                    } else { // 选中
                        curFEStatus.selectedCards = [this.card];
                        curFEStatus.selectedIndexes = [this._index];
                        curFEStatus.actualCard = this.card;
                        curFEStatus.selectedTargetPlayers = [];
                    }
                } else if (isMyThrowTurn) {
                    if (curFEStatus.selectedCards.map(c => c.cardId).includes(this.card.cardId)) {
                        curFEStatus.selectedCards = differenceBy(curFEStatus.selectedCards, [this.card], 'cardId');
                    } else {
                        const myPlayer = curStatus.players[getMyPlayerId()];
                        const needThrowCardNumber = getNeedThrowCardNumber(myPlayer);
                        const haveSelectedEnoughThrowCard = curFEStatus.selectedCards.length >= needThrowCardNumber;
                        if (!haveSelectedEnoughThrowCard) {
                            curFEStatus.selectedCards.push(this.card);
                            curFEStatus.selectedIndexes.push(this._index);
                        }
                    }
                }
                this.gamingScene.gameFEStatusObserved.setSelectedGameEFStatus(curFEStatus);
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
        this.cardObjgroup.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    // @ts-ignore
                    value: obj.x + diff * sizeConfig.controlCard.width,
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
        this.cardObjgroup.forEach((obj, index) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: this.cardInitEndX + (obj?.getData("offsetX")),
                    duration: 300,
                },
                y: {
                    value: this.cardInitEndY + (obj?.getData("offsetY")),
                    duration: 300,
                },
                alpha: {
                    value: 1,
                    duration: 50,
                },
                onComplete: () => {
                    this.isMoving = false;
                }
            });
        })

    }

    setCardDisableByGameStatus(gameStatus: GameStatus, force = false) {
        const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
        const isMyResponseCardTurn = getIsMyResponseCardTurn(gameStatus);
        const isMyThrowTurn = getIsMyThrowTurn(gameStatus);

        if (canPlayInMyTurn) {
            const canPlayCardNames = getInMyPlayTurnCanPlayCardNamesClourse(gameStatus.players[getMyPlayerId()])()
            if (!canPlayCardNames.includes(this.card.CN)) {
                // @ts-ignore
                this.cardImgObj!.setTint(this.disableTint)
                this._cardDisable = true
                return
            }
        }

        if (isMyResponseCardTurn) {
            const needResponseCardNames = getMyResponseInfo(gameStatus)!.cardNames
            if (!needResponseCardNames.includes(this.card.CN)) {
                // @ts-ignore
                this.cardImgObj!.setTint(this.disableTint)
                this._cardDisable = true
                return
            }
        }

        // @ts-ignore
        this.cardImgObj!.setTint(this.ableTint);
        this._cardDisable = false;
    }

    destoryAll() {
        // TODO 好像是Phaser的bug 只能遍历到两个child
        // this.group.getChildren().forEach((child,i) => {
        //     console.log(child,i)
        //     child.destroy()
        // })
        this.isDestoryed = true;

        this.cardObjgroup.forEach((obj) => {
            obj?.destroy();
        })
        this.gamingScene.gameStatusObserved.removeObserver(this);
        this.gamingScene.gameFEStatusObserved.removeSelectedStatusObserver(this);
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const currentIndex = gameStatus.players[getMyPlayerId()].cards.findIndex((c) => c.cardId == this.card.cardId);

        // 这张牌重新查询自己在手牌的新位置 没有就destory自己
        if (currentIndex == -1) {
            this.destoryAll();
            return;
        }

        this.adjustLocation(currentIndex);

        this.setCardDisableByGameStatus(gameStatus);
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        this.setCardSelected(gameFEStatus);
    }

    setCardSelected(gameFEStatus: GameFEStatus) {
        if (this.isDestoryed) {
            return;
        }

        const isSelected = !!gameFEStatus.selectedCards.find((c) => c.cardId == this.card.cardId)
        if (this._selected == isSelected) return;
        if (this.isMoving) return;
        const whenSelectedMoveDistance = 30;

        this.isMoving = true;
        this.cardObjgroup.forEach((obj) => {
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