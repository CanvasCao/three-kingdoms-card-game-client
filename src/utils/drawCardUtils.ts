import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {GamingScene} from "../types/phaser";
import {Card} from "../types/gameStatus";

// tint
const disableTint = colorConfig.disableCard;
const ableTint = colorConfig.card;
const cardHuaseNumberObjOffsetX = -sizeConfig.controlCard.width / 2
const cardHuaseNumberObjOffsetY = -sizeConfig.controlCard.height / 2

const sharedDrawCard = (
    gamingScene: GamingScene,
    card: Card,
    {x, y}: { x: number, y: number }) => {
    // background
    const cardImgObj = gamingScene.add.image(
        x,
        y,
        'white').setInteractive({cursor: 'pointer'});
    cardImgObj.displayHeight = sizeConfig.controlCard.height;
    cardImgObj.displayWidth = sizeConfig.controlCard.width;
    cardImgObj.setAlpha(1)
    // @ts-ignore
    cardImgObj.setTint(ableTint);


    // cardName
    const cardNameObj = gamingScene.add.text(
        x,
        y,
        card.CN,
        // @ts-ignore
        {fill: "#000", align: "center"}
    )
    cardNameObj.setPadding(0, 5, 0, 0);
    cardNameObj.setOrigin(0.5, 0.5);
    cardNameObj.setAlpha(1)

    // huase + number
    const cardHuaseNumberObj = gamingScene.add.text(
        x + cardHuaseNumberObjOffsetX,
        y + cardHuaseNumberObjOffsetY,
        card.huase + ' ' + card.cardNumDesc,
        // @ts-ignore
        {fill: "#000", align: "center"}
    )
    cardHuaseNumberObj.setPadding(0, 5, 0, 0);
    cardHuaseNumberObj.setOrigin(0, 0);
    cardHuaseNumberObj.setAlpha(1);

    return {
        cardImgObj,
        cardNameObj,
        cardHuaseNumberObj
    }
}

export {
    sharedDrawCard
}