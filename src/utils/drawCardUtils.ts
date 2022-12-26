import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {GamingScene} from "../types/phaser";
import {Card} from "../types/gameStatus";
import {verticalRotationSting} from "./gameStatusUtils";
import {
    cardHuaseNumberObjOffsetX,
    cardHuaseNumberObjOffsetY,
    cardNameObjOffsetX,
    cardNameObjOffsetY
} from "../config/offsetConfig";

// tint
const disableTint = colorConfig.disableCard;
const ableTint = colorConfig.card;

const sharedDrawCard = (
    gamingScene: GamingScene,
    card: Card,
    {x, y, message, depth = 0}: {
        x: number,
        y: number,
        message?: string,
        depth?: number
    }) => {
    // background
    const cardImgObj = gamingScene.add.image(x, y, 'white').setInteractive({cursor: 'pointer'});
    cardImgObj.displayHeight = sizeConfig.controlCard.height;
    cardImgObj.displayWidth = sizeConfig.controlCard.width;
    cardImgObj.setAlpha(1)
    // @ts-ignore
    cardImgObj.setTint(ableTint);
    cardImgObj.setDepth(depth)


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
    cardNameObj.setAlpha(1)
    cardNameObj.setFontSize(14)
    cardNameObj.setDepth(depth)


    // huase + number
    const cardHuaseNumberObj = gamingScene.add.text(
        x + cardHuaseNumberObjOffsetX,
        y + cardHuaseNumberObjOffsetY,
        verticalRotationSting(card.cardNumDesc + card.huase),
        // @ts-ignore
        {fontFamily: 'CustomFont', fill: "#000", align: "center"}
    )
    cardHuaseNumberObj.setPadding(0, 5, 0, 0);
    cardHuaseNumberObj.setOrigin(0, 0);
    cardHuaseNumberObj.setAlpha(1);
    cardHuaseNumberObj.setFontSize(12)
    cardHuaseNumberObj.setDepth(depth)

    // meaasge
    let cardMessageObj
    if (message) {
        cardMessageObj = gamingScene.add.text(x, y + 20, message,
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
    }

    return {
        cardImgObj,
        cardNameObj,
        cardHuaseNumberObj,
        cardMessageObj
    }
}

export {
    sharedDrawCard
}