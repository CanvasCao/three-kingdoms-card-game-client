import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId, uuidv4} from "../utils/utils";

export class ControlCard {
    constructor(gamingScene, card) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;

        this.index = this.gamingScene.controlCardsManager.userCards.findIndex((c) => c.cardId == this.card.cardId);
        this.cardX = this.index * sizeConfig.controlCard.width + sizeConfig.controlCard.width / 2;
        this.cardY = sizeConfig.background.height - sizeConfig.controlCard.height / 2;
        this.selected = false;
        this.clickable = true;
        this.group = this.gamingScene.add.group()

        this.drawBackground();
        this.drawCardName();
        this.drawHuaseNumber();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawBackground() {
        this.cardImgObj = this.gamingScene.add.image(
            this.cardX,
            this.cardY,
            'white').setInteractive();
        this.cardImgObj.displayHeight = sizeConfig.controlCard.height;
        this.cardImgObj.displayWidth = sizeConfig.controlCard.width;
        this.group.add(this.cardImgObj)
    }

    drawCardName() {
        this.cardNameObj = this.gamingScene.add.text(
            this.cardX,
            this.cardY,
            this.card.chineseName,
            {fill: "#000", align: "center"}
        )
        this.cardNameObj.setPadding(0, 5, 0, 0);
        this.cardNameObj.setOrigin(0.5, 0.5);
        this.group.add(this.cardNameObj)

    }

    drawHuaseNumber() {
        this.cardHuaseNumberObj = this.gamingScene.add.text(
            this.cardX - sizeConfig.controlCard.width / 2,
            this.cardY - sizeConfig.controlCard.height / 2,
            this.card.huase + ' ' + this.card.number,
            {fill: "#000", align: "center"}
        )
        this.cardHuaseNumberObj.setPadding(0, 5, 0, 0);
        this.cardHuaseNumberObj.setOrigin(0, 0);
        this.group.add(this.cardHuaseNumberObj)
    }

    bindEvent() {
        const moveDis = 30;
        const onClick = () => {
            if (!this.clickable) return;
            this.selected = !this.selected;
            this.group.getChildren().forEach((child) => {
                this.clickable = false;
                this.gamingScene.tweens.add({
                    targets: child,
                    y: {
                        value: this.selected ? (child.y - moveDis) : (child.y + moveDis),
                        duration: 100,
                    },
                    onComplete: () => {
                        this.clickable = true;
                    }
                });
            });
        }

        this.cardImgObj.on('pointerdown', onClick);
    }

    gameStatusNotify(gameStatus) {
        const index = this.gamingScene.controlCardsManager.userCards.findIndex((c) => c.cardId == this.card.cardId);
        if (index == -1) {
            this.cardNameObj.destroy()
            this.cardImgObj.destroy()
            this.cardHuaseNumberObj.destroy()
        }

        if (index !== this.index) {
            const diff = index - this.index;
            this.group.getChildren().forEach((child) => {
                this.clickable = false;
                this.gamingScene.tweens.add({
                    targets: child,
                    x: {
                        value: this.selected ? (child.x - diff * sizeConfig.controlCard.width) : (child.x + diff * sizeConfig.controlCard.width),
                        duration: 1000,
                    },
                    onComplete: () => {
                        this.clickable = true;
                        this.index = index;
                    }
                });
            });
        }

    }

}
