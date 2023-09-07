import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {GamingScene} from "../../types/phaser";
import {
    cardDistanceObjOffsetX,
    cardDistanceObjOffsetY,
    cardHuaseNumberObjOffsetX,
    cardHuaseNumberObjOffsetY,
    cardMessageObjOffsetY,
    cardNameObjOffsetX,
    cardNameObjOffsetY,
    cardTypeObjOffsetX,
    cardTypeObjOffsetY
} from "../../config/cardContentOffsetConfig";
import {getCardColor} from "../cardUtils";
import {i18, isLanEn} from "../../i18n/i18nUtils";
import {
    CARD_CONFIG,
    CARD_NUM_DESC,
    CARD_TYPE,
    CARD_TYPE_CONFIG,
    EQUIPMENT_TYPE,
    EQUIPMENT_TYPE_CONFIG
} from "../../config/cardConfig";
import {Card} from "../../types/card";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {TOOL_TIP_CARD_TYPE} from "../../config/toolTipConfig";
import {getCardText, splitText} from "../string/stringUtils";
import {TOOL_TIP_CARD_MAX_LENGTH} from "../../config/stringConfig";

const sharedDrawFrontCard = (
    gamingScene: GamingScene,
    card: Card,
    {x, y, message = '', depth = DEPTH_CONFIG.CARD, isToPublic = false}: {
        x: number,
        y: number,
        message?: string,
        depth?: number,
        isToPublic?: boolean
    }) => {
    const allCardObjects = []

    // background
    const cardImgObj = gamingScene.add.image(x, y, 'card').setInteractive();
    cardImgObj.displayHeight = sizeConfig.controlCard.height;
    cardImgObj.displayWidth = sizeConfig.controlCard.width;
    cardImgObj.setDepth(depth)
    cardImgObj.setData("offsetX", 0)
    cardImgObj.setData("offsetY", 0)
    allCardObjects.push(cardImgObj)

    cardImgObj.on('pointerover', () => {
        gamingScene.toolTip?.hoverInToShowToolTip({
            card,
            text: splitText(getCardText(card), TOOL_TIP_CARD_MAX_LENGTH),
            toolTipType: isToPublic ? TOOL_TIP_CARD_TYPE.PUBLIC_CARD : TOOL_TIP_CARD_TYPE.CARD,
            x: cardImgObj.x,
            y: cardImgObj.y
        });
    })
    cardImgObj.on('pointerout', () => {
        gamingScene.toolTip?.clearAll();
    })

    // cardName
    const cardNameObj = gamingScene.add.text(
        x + cardNameObjOffsetX,
        y + cardNameObjOffsetY,
        i18(CARD_CONFIG[card.key]),
        {
            // @ts-ignore
            fill: "#000",
            align: "center",
            wordWrap: {width: sizeConfig.controlCard.width * 0.6, useAdvancedWrap: false}
        }
    )
    cardNameObj.setPadding(0, 6, 0, 1);
    cardNameObj.setOrigin(0.5, 0.5);
    cardNameObj.setFontSize(isLanEn() ? 10 : 14)
    cardNameObj.setDepth(depth)
    cardNameObj.setData("offsetX", cardNameObjOffsetX)
    cardNameObj.setData("offsetY", cardNameObjOffsetY)
    allCardObjects.push(cardNameObj)


    // huase + number
    const cardHuaseNumberObj = gamingScene.add.text(
        x + cardHuaseNumberObjOffsetX,
        y + cardHuaseNumberObjOffsetY,
        (CARD_NUM_DESC[card?.number] + '\r\n' + card.huase),
        // @ts-ignore
        {fontFamily: 'CustomFont', fill: getCardColor(card.huase), align: "center"}
    )
    cardHuaseNumberObj.setPadding(0, 5, 0, 0);
    cardHuaseNumberObj.setOrigin(0, 0);
    cardHuaseNumberObj.setFontSize(12)
    cardHuaseNumberObj.setDepth(depth)
    cardHuaseNumberObj.setStroke(COLOR_CONFIG.whiteString, 2)
    cardHuaseNumberObj.setData("offsetX", cardHuaseNumberObjOffsetX)
    cardHuaseNumberObj.setData("offsetY", cardHuaseNumberObjOffsetY)
    allCardObjects.push(cardHuaseNumberObj)

    // card type message
    let cardTypeObjMessage = '';
    if (card.type == CARD_TYPE.EQUIPMENT) {
        cardTypeObjMessage = `${i18(CARD_TYPE_CONFIG[card.type])}/${i18(EQUIPMENT_TYPE_CONFIG[card.equipmentType!])}`
    } else if (card.type == CARD_TYPE.SCROLL) {
        cardTypeObjMessage = `${i18(CARD_TYPE_CONFIG[card.type])}`
    }
    if (cardTypeObjMessage) {
        const cardTypeObj = gamingScene.add.text(x + cardTypeObjOffsetX, y + cardTypeObjOffsetY, cardTypeObjMessage,
            // @ts-ignore
            {fill: COLOR_CONFIG.redString}
        ).setPadding(0, 5, 0, 0)
            .setOrigin(0, 1)
            .setFontSize(isLanEn() ? 9 : 12)
            .setDepth(depth)
            .setData("offsetX", cardTypeObjOffsetX)
            .setData("offsetY", cardTypeObjOffsetY)
        allCardObjects.push(cardTypeObj)
    }

    let cardDistanceObjMessage = ''
    if (card.equipmentType == EQUIPMENT_TYPE.WEAPON) {
        cardDistanceObjMessage = card.distance!.toString()
    } else if (card.equipmentType == EQUIPMENT_TYPE.PLUS_HORSE || card.equipmentType == EQUIPMENT_TYPE.MINUS_HORSE) {
        cardDistanceObjMessage = card.distanceDesc!
    }
    if (cardDistanceObjMessage) {
        const cardDistanceObj = gamingScene.add.text(x + cardDistanceObjOffsetX, y + cardDistanceObjOffsetY
            , cardDistanceObjMessage,
            // @ts-ignore
            {fill: COLOR_CONFIG.blackString}
        )
        cardDistanceObj.setPadding(0, 5, 0, 0);
        cardDistanceObj.setOrigin(1, 1);
        cardDistanceObj.setFontSize(30);
        cardDistanceObj.setDepth(depth)
        cardDistanceObj.setStroke(COLOR_CONFIG.whiteString, 5)
        cardDistanceObj.setData("offsetX", cardDistanceObjOffsetX)
        cardDistanceObj.setData("offsetY", cardDistanceObjOffsetY)
        allCardObjects.push(cardDistanceObj)
    }

    // message
    const cardMessageObj = gamingScene.add.text(x, y + cardMessageObjOffsetY, message,
        {
            // @ts-ignore
            fill: COLOR_CONFIG.blackString,
            align: "center",
            wordWrap: {width: sizeConfig.controlCard.width * 1, useAdvancedWrap: true}
        }).setPadding(0, 5, 0, 0)
        .setOrigin(0.5, 1)
        .setFontSize(isLanEn() ? 10 : 12)
        .setDepth(depth)
        .setStroke(COLOR_CONFIG.cardString, 2)
        .setData("offsetX", 0)
        .setData("offsetY", cardMessageObjOffsetY)
    allCardObjects.push(cardMessageObj)

    // cardPandingEffect  ✓✕
    const cardPandingEffectObj = gamingScene.add.text(x, y, "",
        {
            // @ts-ignore
            fill: COLOR_CONFIG.greenString,
        }).setPadding(0, 5, 0, 0)
        .setOrigin(0.5, 0.5)
        .setFontSize(60)
        .setDepth(depth)
        .setData("offsetX", 0)
        .setData("offsetY", 0)
    allCardObjects.push(cardPandingEffectObj)

    return {
        cardImgObj,
        cardNameObj,
        cardHuaseNumberObj,
        cardMessageObj,
        cardPandingEffectObj,

        allCardObjects
    }
}

const sharedDrawBackCard = (
    gamingScene: GamingScene,
    card: Card,
    {
        x,
        y,
        depth = DEPTH_CONFIG.CARD,
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
    // offsetX offsetY 是为了多张牌同时移动的位移
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