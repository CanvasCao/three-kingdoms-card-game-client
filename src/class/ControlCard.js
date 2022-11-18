import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId, uuidv4} from "../utils/utils";

export class ControlCard {
    constructor(gamingScene, card) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;

        // 初始化index
        this.index = this.gamingScene.controlCardsManager.userCards.findIndex((c) => c.cardId == this.card.cardId);
        this.cardX = this.index * sizeConfig.controlCard.width + sizeConfig.controlCard.width / 2;
        this.cardY = sizeConfig.background.height - sizeConfig.controlCard.height / 2;
        this.curSelected = false;
        this.isMoving = false;
        this.fadeInDistance = 1000;
        this.group = this.gamingScene.add.group();

        this.drawBackground();
        this.drawCardName();
        this.drawHuaseNumber();
        this.fadeInAll();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addObserver(this);
    }

    drawBackground() {
        this.cardImgObj = this.gamingScene.add.image(
            this.cardX + this.fadeInDistance,
            this.cardY,
            'white').setInteractive();
        this.cardImgObj.displayHeight = sizeConfig.controlCard.height;
        this.cardImgObj.displayWidth = sizeConfig.controlCard.width;
        this.cardImgObj.setAlpha(0)
        this.group.add(this.cardImgObj)
    }

    drawCardName() {
        this.cardNameObj = this.gamingScene.add.text(
            this.cardX + this.fadeInDistance,
            this.cardY,
            this.card.chineseName,
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
            this.card.huase + ' ' + this.card.number,
            {fill: "#000", align: "center"}
        )
        this.cardHuaseNumberObj.setPadding(0, 5, 0, 0);
        this.cardHuaseNumberObj.setOrigin(0, 0);
        this.cardHuaseNumberObj.setAlpha(0);

        this.group.add(this.cardHuaseNumberObj)
    }

    bindEvent() {
        const onClick = () => {
            const curStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus
            curStatus.selectedCards = [this.card];
            this.gamingScene.gameFEStatusObserved.setGameEFStatus(curStatus);
        }

        this.cardImgObj.on('pointerdown', onClick);
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

    fadeInAll() {
        this.isMoving = true;
        this.group.getChildren().forEach((child) => {
            this.gamingScene.tweens.add({
                targets: child,
                x: {
                    value: child.x - this.fadeInDistance,
                    duration: 500,
                },
                alpha: {
                    value: 1
                },
                onComplete: () => {
                    this.isMoving = false;
                }
            });
        });
    }

    destoryAll() {
        this.cardNameObj.destroy()
        this.cardImgObj.destroy()
        this.cardHuaseNumberObj.destroy()
        this.gamingScene.gameStatusObserved.removeObserver(this);
    }

    gameStatusNotify(gameStatus) {
        this.currentIndex = gameStatus.users[getMyUserId()].cards.findIndex((c) => c.cardId == this.card.cardId);

        if (this.currentIndex == -1) {
            this.destoryAll();
            return;
        }

        if (this.currentIndex !== this.index) {
            this.adjustLocation();
        }
    }

    gameFEStatusNotify(gameFEStatus) {
        const isSelected = !!gameFEStatus.selectedCards.find((c) => c.cardId == this.card.cardId)
        if (this.curSelected == isSelected) return;
        if (this.isMoving) return;
        const moveDis = 30;

        this.group.getChildren().forEach((child) => {
            this.isMoving = true;
            this.gamingScene.tweens.add({
                targets: child,
                y: {
                    value: isSelected ? (child.y - moveDis) : (child.y + moveDis),
                    duration: 0,
                },
                onComplete: () => {
                    this.isMoving = false;
                    this.curSelected = isSelected
                }
            });
        });


    }

}
