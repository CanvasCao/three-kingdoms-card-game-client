import gameConfig from "../config/gameConfig.json";

export class MyPlayer {
    constructor(gamingScene, params = {}) {
        this.blood = params.blood || 4;
        this.name = params.name;

        this.playerImage = gamingScene.add.image(
            (gameConfig.background.width - gameConfig.player.width / 2) - 20,
            (gameConfig.background.height - gameConfig.player.height / 2),
            "SHU002");
        this.playerImage.displayHeight = gameConfig.player.height;
        this.playerImage.displayWidth = gameConfig.player.width;
        // this.playerImage.setCrop( 50, 40, 160, 230);

        this.nameObj = gamingScene.add.text((
            gameConfig.background.width - gameConfig.player.width) - 20,
            (gameConfig.background.height - gameConfig.player.height) - 20,
            this.name,
            {fill: "#000", align: "center"}
        );
        this.nameObj.setPadding(0,5,0,0);

        this.bloodImages = [];
        for (let i = 0; i <= (this.blood - 1); i++) {
            const bloodImage = gamingScene.add.image(
                gameConfig.background.width - gameConfig.blood.width / 2 + 10,
                gameConfig.background.height - gameConfig.blood.height / 2 - gameConfig.blood.height * i,
                "greenGouyu");
            bloodImage.displayHeight = gameConfig.blood.height;
            bloodImage.displayWidth = gameConfig.blood.width;
            this.bloodImages.push(bloodImage);
        }
    }
}
