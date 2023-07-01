import {sizeConfig} from "../../config/sizeConfig";
import colorConfig from "../../config/colorConfig.json";
import {sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import differenceBy from "lodash/differenceBy";
import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {EQUIPMENT_CARDS_CONFIG} from "../../config/cardConfig";
import {getIsMyThrowTurn, getCanPlayInMyTurn, getIsMyResponseTurn} from "../../utils/stage/stageUtils";
import {uuidv4} from "../../utils/uuid";
import {getNeedSelectCardsNumber, getSelectedCardNumber} from "../../utils/validationUtils";
import {getInMyPlayTurnCanPlayCardNamesClourse} from "../../utils/cardNamesClourseUtils";
import {Card} from "../../types/card";
import {BasicCardResponseInfo} from "../../types/responseInfo";
import {getMyCardPosition} from "../../utils/position/cardPositionUtils";
import {getMyResponseInfo} from "../../utils/response/responseUtils";

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

        const position = getMyCardPosition(this._index);
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
        this.onCardDisableChange(this.gamingScene.gameStatusObserved.gameStatus!, this.gamingScene.gameFEStatusObserved.gameFEStatus!)
    }

    bindEvent() {
        this.cardImgObj!.on('pointerdown', () => {
                if (this._cardDisable) { // 弃牌阶段 ControlCard 不set _cardDisable 只在点击时做数量判断
                    return
                }

                const gameFEStatusObserved = this.gamingScene.gameFEStatusObserved;
                const curFEStatus = gameFEStatusObserved.gameFEStatus!;
                const curStatus = this.gamingScene.gameStatusObserved.gameStatus!;

                const canPlayInMyTurn = getCanPlayInMyTurn(curStatus);
                const isMyResponseTurn = getIsMyResponseTurn(curStatus);
                const isMyThrowTurn = getIsMyThrowTurn(curStatus);

                const needSelectCardsNumber = getNeedSelectCardsNumber(curStatus, curFEStatus);
                const haveSelectCardsNumber = getSelectedCardNumber(curFEStatus);
                const haveSelectedEnoughThrowCard = haveSelectCardsNumber >= needSelectCardsNumber;

                if (!canPlayInMyTurn && !isMyResponseTurn && !isMyThrowTurn) {
                    return
                }

                if (canPlayInMyTurn || isMyResponseTurn) {
                    // 选中再点击就是反选
                    if (curFEStatus.selectedCards.map(c => c.cardId).includes(this.card.cardId)) {
                        gameFEStatusObserved.unselectCard(this.card, this._index)
                    } else { // 选中
                        if (!haveSelectedEnoughThrowCard) {
                            const needGenerateActualCard = haveSelectCardsNumber == (needSelectCardsNumber - 1)
                            gameFEStatusObserved.selectCard(this.card, this._index, {needGenerateActualCard})
                        }
                    }
                } else if (isMyThrowTurn) {
                    if (curFEStatus.selectedCards.map(c => c.cardId).includes(this.card.cardId)) {
                        gameFEStatusObserved.unselectCard(this.card, this._index)
                    } else {
                        if (!haveSelectedEnoughThrowCard) {
                            gameFEStatusObserved.selectCard(this.card, this._index)
                        }
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

    onCardDisableChange(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        const setCardDisable = () => {
            // @ts-ignore
            this.cardImgObj!.setTint(this.disableTint)
            this._cardDisable = true
        }

        const setCardAble = () => {
            // @ts-ignore
            this.cardImgObj!.setTint(this.ableTint)
            this._cardDisable = false
        }

        const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
        const isMyResponseTurn = getIsMyResponseTurn(gameStatus);
        const isMyThrowTurn = getIsMyThrowTurn(gameStatus);

        if (canPlayInMyTurn) {
            if (gameFEStatus.selectedSkillName == EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.CN) {
                setCardAble()
                return
            }

            const canPlayCardNames = getInMyPlayTurnCanPlayCardNamesClourse(gameStatus.players[getMyPlayerId()])()
            if (!canPlayCardNames.includes(this.card.CN)) {
                setCardDisable()
                return
            }
        }

        if (isMyResponseTurn) {
            const {cardIsAbleValidate} = (getMyResponseInfo(gameStatus, gameFEStatus) as BasicCardResponseInfo)
            if (!cardIsAbleValidate(this.card)) {
                setCardDisable()
                return
            }
        }

        if (isMyThrowTurn) {
            setCardAble()
            return
        }

        setCardAble()
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