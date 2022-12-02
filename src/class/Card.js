import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {
    getMyUserId,
    getIsMyPlayTurn,
    uuidv4,
    getIsMyResponseTurn,
    getCanPlayThisCardInMyPlayTurn, getIsOthersResponseTurn
} from "../utils/utils";
import {BASIC_CARDS_CONFIG} from "../utils/cardConfig";

export class Card {
    constructor(gamingScene, card) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;

        // 初始化index
        this.index = this.gamingScene.controlCardsManager.userCards.findIndex((c) => c.cardId == this.card.cardId);
        this.cardX = this.index * sizeConfig.controlCard.width + sizeConfig.controlCard.width / 2;
        this.cardY = sizeConfig.background.height - sizeConfig.controlCard.height / 2;

        this.disableTint = colorConfig.disableCard;
        this.ableTint = colorConfig.card;
        this.cardDisable = true;
        this.isMoving = false;
        this.fadeInDistance = 1000;
        this.group = this.gamingScene.add.group();

        this._selected = false;

        this.drawBackground();
        this.drawCardName();
        this.drawHuaseNumber();
        this.initFadeIn();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addObserver(this);
    }

    drawBackground() {
        this.cardImgObj = this.gamingScene.add.image(
            this.cardX + this.fadeInDistance,
            this.cardY,
            'white').setInteractive({cursor: 'pointer'});
        this.cardImgObj.displayHeight = sizeConfig.controlCard.height;
        this.cardImgObj.displayWidth = sizeConfig.controlCard.width;
        this.cardImgObj.setAlpha(0)
        this.cardImgObj.setTint(this.ableTint);
        this.group.add(this.cardImgObj);
        this.setCardDisable(this.gamingScene.gameStatusObserved.gameStatus)
    }

    drawCardName() {
        this.cardNameObj = this.gamingScene.add.text(
            this.cardX + this.fadeInDistance,
            this.cardY,
            this.card.CN,
            {fill: "#000", align: "center"}
        )
        this.cardNameObj.setPadding(0, 5, 0, 0);
        this.cardNameObj.setOrigin(0.5, 0.5);
        this.cardNameObj.setAlpha(0)
        this.group.add(this.cardNameObj)
    }

    drawHuaseNumber() {
        this.cardHuaseNumberObj = this.gamingScene.add.text(
            this.cardX - sizeConfig.controlCard.width / 2 + this.fadeInDistance,
            this.cardY - sizeConfig.controlCard.height / 2,
            this.card.huase + ' ' + this.card.cardNumDesc,
            {fill: "#000", align: "center"}
        )
        this.cardHuaseNumberObj.setPadding(0, 5, 0, 0);
        this.cardHuaseNumberObj.setOrigin(0, 0);
        this.cardHuaseNumberObj.setAlpha(0);
        this.group.add(this.cardHuaseNumberObj)
    }

    bindEvent() {
        this.cardImgObj.on('pointerdown', () => {
            if (this.cardDisable) {
                return
            }

            const curFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
            const curStatus = this.gamingScene.gameStatusObserved.gameStatus;

            if (getIsOthersResponseTurn(curStatus)) {
                return
            }

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
            this.gamingScene.gameFEStatusObserved.setGameEFStatus(curFEStatus);
        });
    }

    adjustLocation() {
        if (this.isMoving) {
            return
        }

        const diff = this.currentIndex - this.index;
        this.isMoving = true;
        this.group.getChildren().forEach((child) => {
            this.gamingScene.tweens.add({
                targets: child,
                x: {
                    value: child.x + diff * sizeConfig.controlCard.width,
                    duration: 100,
                },
                onComplete: () => {
                    this.isMoving = false;
                    this.index = this.currentIndex;
                }
            });
        });
    }

    initFadeIn() {
        this.isMoving = true;
        this.group.getChildren().forEach((child) => {
            this.gamingScene.tweens.add({
                targets: child,
                x: {
                    value: child.x - this.fadeInDistance,
                    duration: 500,
                },
                alpha: {
                    value: 1,
                    duration: 500,
                },
                onComplete: () => {
                    this.isMoving = false;
                }
            });
        });
    }

    setCardDisable(gameStatus) {
        const isMyPlayTurn = getIsMyPlayTurn(gameStatus);
        const isMyResponseTurn = getIsMyResponseTurn(gameStatus);
        if (!isMyPlayTurn && !isMyResponseTurn) {
            this.cardImgObj.setTint(this.disableTint)
            this.cardDisable = true
            return
        }

        if (isMyPlayTurn) {
            const canPlayThisCardInMyPlayTurn = getCanPlayThisCardInMyPlayTurn(gameStatus.users[getMyUserId()], this.card)
            if (!canPlayThisCardInMyPlayTurn) {
                this.cardImgObj.setTint(this.disableTint)
                this.cardDisable = true
                return
            }
        }

        if (isMyResponseTurn) {
            const canPlayCardNameInMyPlayTurn = gameStatus.taoResStages.length > 0 ? BASIC_CARDS_CONFIG.TAO.CN : BASIC_CARDS_CONFIG.SHAN.CN
            if (canPlayCardNameInMyPlayTurn != this.card.CN) {
                this.cardImgObj.setTint(this.disableTint)
                this.cardDisable = true
                return
            }
        }

        this.cardImgObj.setTint(this.ableTint);
        this.cardDisable = false
    }

    destoryAll() {
        // TODO 好像是Phaser的bug 只能遍历到两个child
        // this.group.getChildren().forEach((child,i) => {
        //     console.log(child,i)
        //     child.destroy()
        // })

        this.cardNameObj.destroy()
        this.cardImgObj.destroy()
        this.cardHuaseNumberObj.destroy()
        this.gamingScene.gameStatusObserved.removeObserver(this);
    }

    gameStatusNotify(gameStatus) {
        this.currentIndex = gameStatus.users[getMyUserId()].cards.findIndex((c) => c.cardId == this.card.cardId);

        // 这张牌重新查询自己在手牌的新位置 没有就destory自己
        if (this.currentIndex == -1) {
            this.destoryAll();
            return;
        }

        // 这张牌重新查询自己在手牌的新位置 位置不同就调整位置
        if (this.currentIndex !== this.index) {
            this.adjustLocation();
        }

        this.setCardDisable(gameStatus);
    }

    gameFEStatusNotify(gameFEStatus) {
        const isSelected = !!gameFEStatus.selectedCards.find((c) => c.cardId == this.card.cardId)
        if (this._selected == isSelected) return;
        if (this.isMoving) return;
        const whenSelectedMoveDistance = 30;

        this.group.getChildren().forEach((child) => {
            this.isMoving = true;
            this.gamingScene.tweens.add({
                targets: child,
                y: {
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
