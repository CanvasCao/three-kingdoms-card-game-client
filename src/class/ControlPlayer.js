import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId, uuidv4} from "../utils/utils";

export class ControlPlayer {
    constructor(gamingScene, player = {}) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.maxBlood = player.maxBlood || 4;
        this.name = player.name;
        this.playerX = (sizeConfig.background.width - sizeConfig.controlPlayer.width / 2)
        this.playerY = (sizeConfig.background.height - sizeConfig.controlPlayer.height / 2)

        this.drawGreenBorder();
        this.drawPlayer();
        this.drawBloodBg();
        this.drawBloods();

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawGreenBorder() {
        this.imageStroke = this.gamingScene.add.graphics();
        this.imageStroke.lineStyle(10, 0x00ff00, 1);
        this.imageStroke.strokeRect(
            this.playerX - sizeConfig.controlPlayer.width / 2,
            this.playerY - sizeConfig.controlPlayer.height / 2,
            sizeConfig.controlPlayer.width,
            sizeConfig.controlPlayer.height);
        this.imageStroke.setAlpha(0);
    }

    drawPlayer() {
        this.playerImage = this.gamingScene.add.image(
            this.playerX,
            this.playerY,
            "SHU002");
        this.playerImage.displayHeight = sizeConfig.controlPlayer.height;
        this.playerImage.displayWidth = sizeConfig.controlPlayer.width;
    }

    drawBloodBg() {
        this.graphics = this.gamingScene.add.graphics();
        this.graphics.fillStyle(0x000, 1);
        this.graphics.fillRoundedRect(sizeConfig.background.width - 18,
            sizeConfig.background.height - 100,
            18,
            100, {
                tl: 4,
                tr: 0,
                bl: 0,
                br: 0
            });
    }

    drawBloods() {
        this.bloodImages = [];
        for (let i = 0; i < this.maxBlood; i++) {
            const bloodImage = this.gamingScene.add.image(
                sizeConfig.background.width - sizeConfig.blood.width / 2 + 10,
                sizeConfig.background.height - 10 - (sizeConfig.blood.height * 0.8 * i),
                "greenGouyu");
            bloodImage.displayHeight = sizeConfig.blood.height;
            bloodImage.displayWidth = sizeConfig.blood.width;
            this.bloodImages.push(bloodImage);
        }
    }

    gameStatusNotify(gameStatus) {
        if (gameStatus.stage.userId === getMyUserId()) {
            this.imageStroke.setAlpha(1);
        } else {
            this.imageStroke.setAlpha(0);
        }
    }
}
