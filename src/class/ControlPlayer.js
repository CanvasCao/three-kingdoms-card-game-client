import sizeConfig from "../config/sizeConfig.json";

export class ControlPlayer {
    constructor(gamingScene, player = {}) {
        this.gamingScene = gamingScene;
        this.maxBlood = player.maxBlood || 4;
        this.name = player.name;

        this.playerImage = this.gamingScene.add.image(
            (sizeConfig.background.width - sizeConfig.controlPlayer.width / 2),
            (sizeConfig.background.height - sizeConfig.controlPlayer.height / 2),
            "SHU002");
        this.playerImage.displayHeight = sizeConfig.controlPlayer.height;
        this.playerImage.displayWidth = sizeConfig.controlPlayer.width;

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
}
