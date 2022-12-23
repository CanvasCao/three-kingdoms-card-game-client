import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {
    getMyUserId,
    getIsMyPlayTurn,
    uuidv4,
    getIsMyResponseTurn,
    getCanPlayThisCardInMyPlayTurn,
    getIsOthersResponseTurn,
    getIsMyThrowTurn,
    getNeedThrowCardNumber
} from "../utils/utils";
import {BASIC_CARDS_CONFIG} from "../utils/cardConfig";
import {sharedDrawCard} from "../utils/drawCardUtils";
import differenceBy from "lodash/differenceBy";
import {GamingScene} from "../types/phaser";
import {Card, GameStatus} from "../types/gameStatus";
import {GameFEStatus} from "../types/gameFEStatus";

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

    _cardDisable: boolean;
    _stage: string;
    isMoving: boolean;

    group: Phaser.GameObjects.Group;
    cardNameObj: Phaser.GameObjects.Text | null;
    cardImgObj: Phaser.GameObjects.Image | null;
    cardHuaseNumberObj: Phaser.GameObjects.Text | null;

    cardHuaseNumberObjOffsetX: number;
    cardHuaseNumberObjOffsetY: number;

    _selected: boolean;

    constructor(gamingScene: GamingScene, card: Card) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;

        // 初始化index
        this._index = this.gamingScene.controlCardsManager!._userCards.findIndex((c: Card) => c.cardId == this.card.cardId);
        this.cardInitStartX = sizeConfig.background.width / 2
        this.cardInitStartY = sizeConfig.background.height / 2
        this.cardInitEndX = this._index * sizeConfig.controlCard.width + sizeConfig.controlCard.width / 2;
        this.cardInitEndY = sizeConfig.background.height - sizeConfig.controlCard.height / 2;


        // tint
        this.disableTint = colorConfig.disableCard;
        this.ableTint = colorConfig.card;

        // inner state
        this._cardDisable = false;
        this._stage = ''
        this.isMoving = false;

        // phaser obj
        this.group = this.gamingScene.add.group();
        this.cardNameObj = null;
        this.cardImgObj = null;
        this.cardHuaseNumberObj = null;

        // animationOffset
        this.cardHuaseNumberObjOffsetX = -sizeConfig.controlCard.width / 2
        this.cardHuaseNumberObjOffsetY = -sizeConfig.controlCard.height / 2

        // prev state
        this._selected = false;

        this.drawCard();
        this.fadeIn();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addObserver(this);
    }

    drawCard() {
        const {
            cardImgObj,
            cardNameObj,
            cardHuaseNumberObj
        } = sharedDrawCard(this.gamingScene, this.card, {x: this.cardInitStartX, y: this.cardInitStartY})
        this.cardImgObj = cardImgObj
        this.cardNameObj = cardNameObj
        this.cardHuaseNumberObj = cardHuaseNumberObj
        this.group.add(cardImgObj);
        this.group.add(cardNameObj);
        this.group.add(cardHuaseNumberObj);
        this.setCardDisableByGameStatus(this.gamingScene.gameStatusObserved.gameStatus!)
    }

    bindEvent() {
        this.cardImgObj!.on('pointerdown', () => {
                if (this._cardDisable) {
                    return
                }

                const curFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
                const curStatus = this.gamingScene.gameStatusObserved.gameStatus!;
                if (getIsOthersResponseTurn(curStatus!)) {
                    return
                }

                const isMyPlayTurn = getIsMyPlayTurn(curStatus);
                const isMyResponseTurn = getIsMyResponseTurn(curStatus);
                const isMyThrowTurn = getIsMyThrowTurn(curStatus);

                if (isMyPlayTurn || isMyResponseTurn) {
                    // 选中再点击就是反选
                    if (curFEStatus.selectedCards?.[0]?.cardId == this.card.cardId) {
                        curFEStatus.selectedCards = [];
                        curFEStatus.actualCard = null;
                        curFEStatus.selectedTargetUsers = [];
                    } else { // 选中
                        curFEStatus.selectedCards = [this.card];
                        curFEStatus.actualCard = this.card;
                        curFEStatus.selectedTargetUsers = [];
                    }
                } else if (isMyThrowTurn) {
                    if (curFEStatus.selectedCards.map((c: Card) => c.cardId).includes(this.card.cardId)) {
                        curFEStatus.selectedCards = differenceBy(curFEStatus.selectedCards, [this.card], 'cardId');
                    } else {
                        const myUser = curStatus.users[getMyUserId()];
                        const needThrowCardNumber = getNeedThrowCardNumber(myUser);
                        const haveSelectedEnoughThrowCard = curFEStatus.selectedCards.length >= needThrowCardNumber;
                        if (!haveSelectedEnoughThrowCard) {
                            curFEStatus.selectedCards.push(this.card);
                        }
                    }
                }
                this.gamingScene.gameFEStatusObserved.setGameEFStatus(curFEStatus);
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
        this.group.getChildren().forEach((child) => {
            this.gamingScene.tweens.add({
                targets: child,
                x: {
                    // @ts-ignore
                    value: child.x + diff * sizeConfig.controlCard.width,
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
        [this.cardImgObj, this.cardNameObj, this.cardHuaseNumberObj].forEach((obj, index) => {
            const offsetX = (index == 2) ? this.cardHuaseNumberObjOffsetX : 0;
            const offsetY = (index == 2) ? this.cardHuaseNumberObjOffsetY : 0;
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: this.cardInitEndX + offsetX,
                    duration: 500,
                },
                y: {
                    value: this.cardInitEndY + offsetY,
                    duration: 500,
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

    fadeOut() {
        this.isMoving = true;
        [this.cardImgObj, this.cardNameObj, this.cardHuaseNumberObj].forEach((obj, index) => {
            const offsetX = (index == 2) ? this.cardHuaseNumberObjOffsetX : 0;
            const offsetY = (index == 2) ? this.cardHuaseNumberObjOffsetY : 0;
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: sizeConfig.background.width / 2 + offsetX,
                    duration: 100,
                },
                y: {
                    value: sizeConfig.background.height / 2 + offsetY,
                    duration: 100,
                },
                onComplete: () => {
                    this.isMoving = false;
                    setTimeout(() => {
                        this.destoryAll();
                    }, 2000)
                }
            });
        })

    }

    setCardDisableByGameStatus(gameStatus: GameStatus) {
        const newStage = gameStatus.stage.stageName;
        const isMyPlayTurn = getIsMyPlayTurn(gameStatus);
        const isMyResponseTurn = getIsMyResponseTurn(gameStatus);
        const isMyThrowTurn = getIsMyThrowTurn(gameStatus);
        if (!isMyPlayTurn && !isMyResponseTurn && !isMyThrowTurn) {
            // @ts-ignore
            this.cardImgObj!.setTint(this.disableTint)
            this._cardDisable = true
            return
        }

        if (isMyPlayTurn) {
            const canPlayThisCardInMyPlayTurn = getCanPlayThisCardInMyPlayTurn(gameStatus.users[getMyUserId()], this.card)
            if (!canPlayThisCardInMyPlayTurn) {
                // @ts-ignore
                this.cardImgObj!.setTint(this.disableTint)
                this._cardDisable = true
                return
            }
        }

        if (isMyResponseTurn) {
            const canPlayCardNameInMyPlayTurn = gameStatus.taoResStages.length > 0 ?
                BASIC_CARDS_CONFIG.TAO.CN :
                BASIC_CARDS_CONFIG.SHAN.CN;

            if (canPlayCardNameInMyPlayTurn != this.card.CN) {
                // @ts-ignore
                this.cardImgObj!.setTint(this.disableTint)
                this._cardDisable = true
                return
            }
        }

        if (isMyThrowTurn && this._stage != "throw") {
            // @ts-ignore
            this.cardImgObj!.setTint(this.ableTint);
            this._cardDisable = false;
            return
        }

        // @ts-ignore
        this.cardImgObj!.setTint(this.ableTint);
        this._cardDisable = false;

        this._stage = newStage;
    }

    destoryAll() {
        // TODO 好像是Phaser的bug 只能遍历到两个child
        // this.group.getChildren().forEach((child,i) => {
        //     console.log(child,i)
        //     child.destroy()
        // })

        this.cardNameObj!.destroy()
        this.cardImgObj!.destroy()
        this.cardHuaseNumberObj!.destroy()
        this.gamingScene.gameStatusObserved.removeObserver(this);
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const currentIndex = gameStatus.users[getMyUserId()].cards.findIndex((c) => c.cardId == this.card.cardId);

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
        const isSelected = !!gameFEStatus.selectedCards.find((c) => c.cardId == this.card.cardId)
        if (this._selected == isSelected) return;
        if (this.isMoving) return;
        const whenSelectedMoveDistance = 30;

        this.group.getChildren().forEach((child) => {
            this.isMoving = true;
            this.gamingScene.tweens.add({
                targets: child,
                y: {
                    // @ts-ignore
                    value: isSelected ? (child.y - whenSelectedMoveDistance) : (child.y + whenSelectedMoveDistance),
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