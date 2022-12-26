import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {GamingScene} from "../types/phaser";
import {Card} from "../types/gameStatus";
import {verticalRotationSting} from "./gameStatusUtils";

// tint
const disableTint = colorConfig.disableCard;
const ableTint = colorConfig.card;
const cardHuaseNumberObjOffsetX = -sizeConfig.controlCard.width / 2
const cardHuaseNumberObjOffsetY = -sizeConfig.controlCard.height / 2

const sharedDrawCard = (
    gamingScene: GamingScene,
    card: Card,
    {x, y, message}: { x: number, y: number, message?: string }) => {
    // background
    const cardImgObj = gamingScene.add.image(x, y, 'white').setInteractive({cursor: 'pointer'});
    cardImgObj.displayHeight = sizeConfig.controlCard.height;
    cardImgObj.displayWidth = sizeConfig.controlCard.width;
    cardImgObj.setAlpha(1)
    // @ts-ignore
    cardImgObj.setTint(ableTint);


    // cardName
    const cardNameObj = gamingScene.add.text(x, y, card.CN,
        // @ts-ignore
        {fontFamily: 'CustomFont', fill: "#000", align: "center"}
    )
    cardNameObj.setPadding(0, 5, 0, 0);
    cardNameObj.setOrigin(0.5, 0.5);
    cardNameObj.setAlpha(1)

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

    // meaasge
    let cardMessageObj
    if (message) {
        cardMessageObj = gamingScene.add.text(x, y + sizeConfig.controlCard.height / 2, message,
            {
                // @ts-ignore
                fill: "#000",
                align: "center",
                wordWrap: {width: sizeConfig.controlCard.width * 0.7, useAdvancedWrap: true}
            }
        )
        cardMessageObj.setPadding(0, 5, 0, 0);
        cardMessageObj.setOrigin(0.5, 1);
        cardMessageObj.setFontSize(9);
        cardMessageObj.setAlpha(1)
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