import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId, uuidv4} from "../utils/utils";

export class Player {
    constructor(gamingScene, user) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.user = user;
        this.playerX = (sizeConfig.background.width / 2);
        this.playerY = this.user.userId == getMyUserId() ? sizeConfig.player.height + 180 : sizeConfig.player.height - 60;
        this.bloodImages = []; //从下往上
        this.currentBlood = this.user.currentBlood;
        this.cardNumber = 0;
        this.isCurSelected = false;

        this.drawMyTurnStroke();
        this.drawSelectedStroke();
        this.drawPlayer();
        this.drawBloodsBg();
        this.drawBloods();
        this.setBloods(this.user.currentBlood);
        this.drawCardNumber();
        this.drawStageText();
        this.drawEquipment();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addObserver(this);
    }

    drawMyTurnStroke() {
        this.myTurnStroke = this.gamingScene.add.graphics();
        this.myTurnStroke.lineStyle(10, 0x00ff00, 1);
        this.myTurnStroke.strokeRect(this.playerX - sizeConfig.player.width / 2,
            this.playerY - sizeConfig.player.height / 2,
            sizeConfig.player.width,
            sizeConfig.player.height);
        this.myTurnStroke.setAlpha(0);
    }

    drawSelectedStroke() {
        this.selectedStroke = this.gamingScene.add.graphics();
        this.selectedStroke.lineStyle(10, 0xffff00, 1);
        this.selectedStroke.strokeRect(this.playerX - sizeConfig.player.width / 2,
            this.playerY - sizeConfig.player.height / 2,
            sizeConfig.player.width,
            sizeConfig.player.height);
        this.selectedStroke.setAlpha(0);
    }

    drawCardNumber() {
        this.cardNumObj = this.gamingScene.add.text((
            this.playerX - sizeConfig.player.width / 2),
            this.playerY + sizeConfig.player.height / 2 - 22,
            this.cardNumber,
            {fill: "#000", align: "center"}
        );

        const padding = 2;
        this.cardNumObj.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.cardNumObj.setBackgroundColor("#fff")
    }

    drawBloods() {
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

    drawStageText() {
        this.stageText = this.gamingScene.add.text(
            this.playerX,
            this.playerY + sizeConfig.player.height / 2 + 5,
            "",
            {fill: "#000", align: "center"}
        );

        this.stageText.setOrigin(0.5, 0.5)
        const padding = 2;
        this.stageText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.stageText.setBackgroundColor("#fff")
        this.stageText.setFontSize(12)
    }

    drawEquipment() {
        // this.weaponText = this.gamingScene.add.text(
        //     this.playerX,
        //     this.playerY + sizeConfig.player.height / 2 + 5,
        //     "",
        //     {fill: "#000", align: "center"}
        // );
        //
        // this.weaponText.setOrigin(0.5, 0.5)
        // const padding = 2;
        // this.weaponText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        // this.weaponText.setBackgroundColor("#fff")
        // this.weaponText.setFontSize(12)
    }

    setBloods(number) {
        for (let i = 0; i < this.bloodImages.length; i++) {
            const bloodNumber = i + 1;
            const alpha = (bloodNumber > number) ? 0 : 1

            this.gamingScene.tweens.add({
                targets: this.bloodImages[i],
                alpha: {
                    value: alpha,
                    duration: 500,
                    // ease: "Bounce.easeIn"
                    ease: "Bounce.easeInOut"
                }
            });
        }
    }

    bindEvent() {
        this.playerImage.on('pointerdown', () => {
            if (this.gamingScene.gameFEStatusObserved.gameFEStatus.selectedCards <= 0) {
                return;
            }

            const curStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus
            curStatus.selectedTargetUsers = [this.user];
            this.gamingScene.gameFEStatusObserved.setGameEFStatus(curStatus);
        });
    }

    drawBloodsBg() {
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
            this.user.cardId).setInteractive({cursor: 'pointer'});
        this.playerImage.displayHeight = sizeConfig.player.height;
        this.playerImage.displayWidth = sizeConfig.player.width;
    }

    gameStatusNotify(gameStatus) {
        const user = gameStatus.users[this.user.userId]
        if (gameStatus.stage.userId === this.user.userId) {
            this.myTurnStroke.setAlpha(1);
            this.stageText.setAlpha(1);
            this.stageText.setText(gameStatus.stage.stageNameCN + '...')
        } else {
            this.myTurnStroke.setAlpha(0);
            this.stageText.setAlpha(0)
        }
        if (this.cardNumber != user.cards.length) {
            this.cardNumObj.setText(user.cards.length)
            this.cardNumber = user.cards.length
        }
        if (this.currentBlood != user.currentBlood) {
            this.setBloods(user.currentBlood)
            this.currentBlood = user.currentBlood
        }

    }

    gameFEStatusNotify(gameFEStatus) {
        const isSelected = !!gameFEStatus.selectedTargetUsers.find((u) => u.userId == this.user.userId)
        this.selectedStroke.setAlpha(isSelected ? 1 : 0);
    }
}
