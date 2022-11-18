import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId, uuidv4} from "../utils/utils";

export class Player {
    constructor(gamingScene, user) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.user = user;
        this.playerX = (sizeConfig.background.width / 2 - sizeConfig.player.width / 2);
        this.playerY = this.user.userId == getMyUserId() ? sizeConfig.player.height + 120 : sizeConfig.player.height - 60;
        this.bloodImages = [];
        this.isSelected = false;

        this.drawPlayer();
        this.drawGraphics();
        this.drawBlood();
        this.drawCardNumber();
        this.drawImageStroke();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawImageStroke() {
        this.imageStroke = this.gamingScene.add.graphics();
        this.imageStroke.lineStyle(2, 0x00ff00, 1);
        this.imageStroke.strokeRect(this.playerX - sizeConfig.player.width / 2,
            this.playerY - sizeConfig.player.height / 2,
            sizeConfig.player.width,
            sizeConfig.player.height);
        this.imageStroke.setAlpha(0);
    }

    drawCardNumber() {
        this.cardNumObj = this.gamingScene.add.text((
            this.playerX - sizeConfig.player.width / 2),
            this.playerY + sizeConfig.player.height / 2 - 22,
            0,
            {fill: "#000", align: "center"}
        );

        const padding = 2;
        this.cardNumObj.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.cardNumObj.setBackgroundColor("#fff")
    }

    drawBlood() {
        for (let i = 0; i < this.user.maxBlood; i++) {
            const bloodImage = this.gamingScene.add.image(
                this.playerX + sizeConfig.player.width / 2 - 7,
                this.playerY + sizeConfig.player.height / 2 - 10 - (sizeConfig.blood.height * 0.8 * 0.8 * i),
                "greenGouyu");
            bloodImage.displayHeight = sizeConfig.blood.height * 0.8;
            bloodImage.displayWidth = sizeConfig.blood.width * 0.8;
            this.bloodImages.push(bloodImage);
        }
    }

    bindEvent() {
        this.playerImage.on('pointerdown', () => {
            this.isSelected = !this.isSelected;
            this.imageStroke.setAlpha(this.isSelected ? 1 : 0);
        });
    }

    drawGraphics() {
        const graphicsW = 18 * 0.8
        const graphicsH = 100 * 0.8
        this.graphics = this.gamingScene.add.graphics();
        this.graphics.fillStyle(0x000, 1);
        this.graphics.fillRoundedRect(
            this.playerX + sizeConfig.player.width / 2 - graphicsW,
            this.playerY + sizeConfig.player.height / 2 - graphicsH,
            graphicsW,
            graphicsH, {
                tl: 4,
                tr: 0,
                bl: 0,
                br: 0
            });
    }

    drawPlayer() {
        this.playerImage = this.gamingScene.add.image(
            this.playerX,
            this.playerY,
            this.user.cardId).setInteractive();
        this.playerImage.displayHeight = sizeConfig.player.height;
        this.playerImage.displayWidth = sizeConfig.player.width;
    }

    gameStatusNotify(gameStatus) {
        if (gameStatus.stage.userId === this.user.userId) {
            this.imageStroke.setAlpha(1);
        } else {
            this.imageStroke.setAlpha(0);
        }
        const user = gameStatus.users[this.user.userId]
        this.cardNumObj.setText(user.cards.length)
    }
}