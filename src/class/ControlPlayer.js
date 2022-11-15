import sizeConfig from "../config/sizeConfig.json";

export class ControlPlayer {
    constructor(gamingScene, params = {}) {
        this.gamingScene = gamingScene;
        this.blood = params.blood || 4;
        this.name = params.name;

        this.playerImage = this.gamingScene.add.image(
            (sizeConfig.background.width - sizeConfig.controlPlayer.width / 2) - 20,
            (sizeConfig.background.height - sizeConfig.controlPlayer.height / 2),
            "SHU002");
        this.playerImage.displayHeight = sizeConfig.controlPlayer.height;
        this.playerImage.displayWidth = sizeConfig.controlPlayer.width;

        this.bloodImages = [];
        for (let i = 0; i <= (this.blood - 1); i++) {
            const bloodImage = this.gamingScene.add.image(
                sizeConfig.background.width - sizeConfig.blood.width / 2 - 14,
                sizeConfig.background.height - sizeConfig.blood.height - sizeConfig.blood.height * i,
                "greenGouyu");
            bloodImage.displayHeight = sizeConfig.blood.height;
            bloodImage.displayWidth = sizeConfig.blood.width;
            this.bloodImages.push(bloodImage);
        }
    }
}
