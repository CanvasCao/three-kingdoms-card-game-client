import gameConfig from "../config/gameConfig.json";

export class Card {
    constructor(gamingScene, initX, initY, cardName) {
        this.initX = initX;
        this.initY = initY;
        this.selected = false;

        const cardImgObj = gamingScene.add.image(
            initX,
            initY,
            cardName).setInteractive();

        cardImgObj.displayHeight = gameConfig.card.height;
        cardImgObj.displayWidth = gameConfig.card.width;

        cardImgObj.on('pointerdown', () => {
            this.selected=!this.selected;
            gamingScene.tweens.add({
                targets: cardImgObj,
                y: {
                    value: this.selected?(initY - gameConfig.card.height/2):initY,
                    duration: 200,
                    delay: 0
                }
            });
        });
    }
}
