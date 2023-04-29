import {sizeConfig} from "../../config/sizeConfig";
import colorConfig from "../../config/colorConfig.json";
import {GamingScene} from "../../types/phaser";
import {
    cardHuaseNumberObjOffsetX,
    cardHuaseNumberObjOffsetY,
    cardMessageObjOffsetY,
    cardNameObjOffsetX,
    cardNameObjOffsetY
} from "../../config/cardContentOffsetConfig";
import {getCardColor} from "../cardUtils";
import {getI18Lan, i18, I18LANS} from "../../i18n/i18nUtils";
import {CARD_NUM_DESC} from "../../config/cardConfig";
import {Card} from "../../types/card";

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
        i18(card),
        {
            fontFamily: 'CustomFont',
            // @ts-ignore
            fill: "#000",
            align: "center",
            wordWrap: {width: sizeConfig.controlCard.width * 0.75, useAdvancedWrap: false}
        }
    )
    cardNameObj.setPadding(0, 6, 0, 1);
    cardNameObj.setOrigin(0.5, 0.5);
    cardNameObj.setAlpha(alpha)
    cardNameObj.setFontSize((getI18Lan() == I18LANS.EN) ? 12 : 14)
    cardNameObj.setDepth(depth)
    cardNameObj.setData("offsetX", cardNameObjOffsetX)
    cardNameObj.setData("offsetY", cardNameObjOffsetY)


    // huase + number
    // @ts-ignore
    const cardHuaseNumberObj = gamingScene.add.text(
        x + cardHuaseNumberObjOffsetX,
        y + cardHuaseNumberObjOffsetY,
        // @ts-ignore
        (CARD_NUM_DESC[card?.number] + '\r\n' + card.huase),
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
    cardMessageObj = gamingScene.add.text(x, y + cardMessageObjOffsetY, message,
        {
            // @ts-ignore
            fill: "#000",
            align: "center",
            wordWrap: {width: sizeConfig.controlCard.width * 1, useAdvancedWrap: true}
        }
    )
    cardMessageObj.setPadding(0, 5, 0, 0);
    cardMessageObj.setOrigin(0.5, 1);
    cardMessageObj.setFontSize((getI18Lan() == I18LANS.EN) ? 10 : 12);
    cardMessageObj.setAlpha(1)
    cardMessageObj.setDepth(depth)
    cardMessageObj.setData("offsetX", 0)
    cardMessageObj.setData("offsetY", cardMessageObjOffsetY)

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