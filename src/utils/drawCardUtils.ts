import {sizeConfig} from "../config/sizeConfig";
import colorConfig from "../config/colorConfig.json";
import {GamingScene} from "../types/phaser";
import {Card} from "../types/gameStatus";
import {verticalRotationSting} from "./gameStatusUtils";
import {
    cardHuaseNumberObjOffsetX,
    cardHuaseNumberObjOffsetY,
    cardNameObjOffsetX,
    cardNameObjOffsetY
} from "../config/cardContentOffsetConfig";
import {CARD_HUASE} from "../config/cardConfig";
import {getCardColor} from "./cardUtils";

// tint
const disableTint = colorConfig.disableCard;
const ableTint = colorConfig.card;

const sharedDrawFrontCard = (
    gamingScene: GamingScene,
    card: Card,
    {x, y, message = '', depth = 0, alpha = 1}: {
        x: number,
        y: number,
        message?: string,
        depth?: number,
        alpha?: number
    }) => {
    // background
    const cardImgObj = gamingScene.add.image(x, y, 'white').setInteractive();
    cardImgObj.displayHeight = sizeConfig.controlCard.height;
    cardImgObj.displayWidth = sizeConfig.controlCard.width;
    cardImgObj.setAlpha(alpha)
    // @ts-ignore
    cardImgObj.setTint(ableTint);
    cardImgObj.setDepth(depth)
    cardImgObj.setData("offsetX", 0)
    cardImgObj.setData("offsetY", 0)

    // cardName
    const cardNameObj = gamingScene.add.text(
        x + cardNameObjOffsetX,
        y + cardNameObjOffsetY,
        card.CN,
        // @ts-ignore
        {fontFamily: 'CustomFont', fill: "#000", align: "center"}
    )
    cardNameObj.setPadding(0, 5, 0, 0);
    cardNameObj.setOrigin(0.5, 0.5);
    cardNameObj.setAlpha(alpha)
    cardNameObj.setFontSize(14)
    cardNameObj.setDepth(depth)
    cardNameObj.setData("offsetX", cardNameObjOffsetX)
    cardNameObj.setData("offsetY", cardNameObjOffsetY)


    // huase + number
    const cardHuaseNumberObj = gamingScene.add.text(
        x + cardHuaseNumberObjOffsetX,
        y + cardHuaseNumberObjOffsetY,
        (card.cardNumDesc + '\r\n' + card.huase),
        // @ts-ignore
        {fontFamily: 'CustomFont', fill: getCardColor(card.huase), align: "center"}
    )
    cardHuaseNumberObj.setPadding(0, 5, 0, 0);
    cardHuaseNumberObj.setOrigin(0, 0);
    cardHuaseNumberObj.setAlpha(alpha);
    cardHuaseNumberObj.setFontSize(12)
    cardHuaseNumberObj.setDepth(depth)
    cardHuaseNumberObj.setData("offsetX", cardHuaseNumberObjOffsetX)
    cardHuaseNumberObj.setData("offsetY", cardHuaseNumberObjOffsetY)

    // message
    let cardMessageObj
    cardMessageObj = gamingScene.add.text(x, y, message,
        {
            // @ts-ignore
            fill: "#000",
            align: "center",
            wordWrap: {width: sizeConfig.controlCard.width * 1.1, useAdvancedWrap: true}
        }
    )
    cardMessageObj.setPadding(0, 5, 0, 0);
    cardMessageObj.setOrigin(0.5, 0.5);
    cardMessageObj.setFontSize(12);
    cardMessageObj.setAlpha(1)
    cardMessageObj.setDepth(depth)
    cardMessageObj.setData("offsetX", 0)
    cardMessageObj.setData("offsetY", 0)

    return {
        cardImgObj,
        cardNameObj,
        cardHuaseNumberObj,
        cardMessageObj
    }
}


const sharedDrawBackCard = (
    gamingScene: GamingScene,
    card: Card,
    {
        x,
        y,
        depth = 0,
        offsetX = 0,
        offsetY = 0,
    }: {
        x: number,
        y: number,
        depth?: number,
        offsetX?: number,
        offsetY?: number,
    }) => {

    const cardImgObj = gamingScene.add.image(x, y, 'cardBg').setInteractive()
    cardImgObj.displayHeight = sizeConfig.controlCard.height;
    cardImgObj.displayWidth = sizeConfig.controlCard.width;
    cardImgObj.setDepth(depth)
    cardImgObj.setAlpha(1)
    cardImgObj.setData("offsetX", offsetX)
    cardImgObj.setData("offsetY", offsetY)

    return {
        cardImgObj,
    }
}

export {
    sharedDrawFrontCard,
    sharedDrawBackCard
}