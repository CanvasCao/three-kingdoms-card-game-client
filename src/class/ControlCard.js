import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId, uuidv4} from "../utils/utils";

export class ControlCard {
    constructor(gamingScene, card) {
        this.uuid = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;
        this.cardX = this.gamingScene.controlCards.length * sizeConfig.controlCard.width + sizeConfig.controlCard.width / 2;
        this.cardY = sizeConfig.background.height - sizeConfig.controlCard.height / 2;
        this.selected = false;
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
        const onClick = () => {
            this.selected = !this.selected;
            this.group.getChildren().forEach((child) => {
                this.gamingScene.tweens.add({
                    targets: child,
                    y: {
                        value: this.selected ? (child.y - sizeConfig.controlCard.height / 2) : (child.y + sizeConfig.controlCard.height / 2),
                        duration: 0,
                    }
                });
            });
        }

        this.cardImgObj.on('pointerdown', onClick);
    }

    gameStatusNotify(gameStatus) {
        if (gameStatus.stage.userId == getMyUserId() && gameStatus.stage.stageName == 'play') {

        }
    }

}
