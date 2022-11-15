import sizeConfig from "../config/sizeConfig.json";

export class Player {
    constructor(gamingScene, user) {
        this.gamingScene = gamingScene;
        this.user = user;
        this.cardNum = null;

        this.playerX = (sizeConfig.background.width / 2 - sizeConfig.player.width / 2);
        this.playerY = this.user.index == 0 ? sizeConfig.player.height + 200 : sizeConfig.player.height;

        this.playerImage = gamingScene.add.image(
            this.playerX,
            this.playerY,
            this.user.cardId);
        this.playerImage.displayHeight = sizeConfig.player.height;
        this.playerImage.displayWidth = sizeConfig.player.width;


    }

    addCards(cards) {
        this.user.cards = this.user.cards.concat(cards);

        this.cardNum = this.gamingScene.add.text((
            this.playerX - sizeConfig.player.width / 2),
            this.playerY + sizeConfig.player.height / 2 - 24,
            this.user.cards.length,
            {fill: "#000", align: "center"}
        );

        const padding = 2;
        this.cardNum.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.cardNum.setBackgroundColor("#fff")
    }

}
