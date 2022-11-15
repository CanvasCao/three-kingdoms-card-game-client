import sizeConfig from "../config/sizeConfig.json";

export class ControlCard {
    constructor(gamingScene, card, index) {
        this.gamingScene = gamingScene;
        this.card = card;
        this.cardX = this.gamingScene.controlCards.length * sizeConfig.controlCard.width + sizeConfig.controlCard.width / 2;
        this.cardY = sizeConfig.background.height - sizeConfig.controlCard.height / 2;
        this.selected = false;
        this.group = this.gamingScene.add.group()

        this.cardImgObj = gamingScene.add.image(
            this.cardX,
            this.cardY,
            'white').setInteractive();
        this.cardImgObj.displayHeight = sizeConfig.controlCard.height;
        this.cardImgObj.displayWidth = sizeConfig.controlCard.width;
        this.group.add(this.cardImgObj)


        this.cardNameObj = this.gamingScene.add.text(
            this.cardX,
            this.cardY,
            this.card.chineseName,
            {fill: "#000", align: "center"}
        ).setInteractive()
        this.cardNameObj.setPadding(0, 5, 0, 0);
        this.cardNameObj.setOrigin(0.5, 0.5);
        this.group.add(this.cardNameObj)

        this.cardHuaseNumberObj = this.gamingScene.add.text(
            this.cardX - sizeConfig.controlCard.width / 2,
            this.cardY - sizeConfig.controlCard.height / 2,
            this.card.huase + ' ' + this.card.number,
            {fill: "#000", align: "center"}
        ).setInteractive()
        this.cardHuaseNumberObj.setPadding(0, 5, 0, 0);
        this.cardHuaseNumberObj.setOrigin(0, 0);
        this.group.add(this.cardHuaseNumberObj)

        const onClick = () => {
            this.selected = !this.selected;
            this.group.getChildren().forEach( (child) =>{
                gamingScene.tweens.add({
                    targets: child,
                    y: {
                        value: this.selected ? (child.y - sizeConfig.controlCard.height / 2) : (child.y + sizeConfig.controlCard.height / 2),
                        duration: 200,
                    }
                });
            });
        }

        this.cardImgObj.on('pointerdown', onClick);
        this.cardNameObj.on('pointerdown', onClick);
        this.cardHuaseNumberObj.on('pointerdown', onClick);


    }
}
