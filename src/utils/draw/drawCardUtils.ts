import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {GamingScene} from "../../types/phaser";
import {
    cardHuaseNumberObjOffsetX,
    cardHuaseNumberObjOffsetY,
    cardMessageObjOffsetY,
    cardNameObjOffsetBasicY,
    cardNameObjOffsetNonBasicY,
    cardNameObjOffsetX,
    cardTypeObjOffsetX,
    cardTypeObjOffsetY
} from "../../config/cardContentOffsetConfig";
import {getCardColorString} from "../cardUtils";
import {i18, isLanEn} from "../../i18n/i18nUtils";
import {
    CARD_CONFIG,
    CARD_NUM_DESC,
    CARD_TYPE,
    CARD_TYPE_CONFIG,
    EQUIPMENT_TYPE_CONFIG
} from "../../config/cardConfig";
import {Card} from "../../types/card";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {TOOL_TIP_CARD_TYPE} from "../../config/toolTipConfig";
import {getCardText, splitText} from "../string/stringUtils";
import {
    TOOL_TIP_CARD_MAX_LENGTH_CN,
    TOOL_TIP_CARD_MAX_LENGTH_EN
} from "../../config/stringConfig";
import {CARDS_SPRITE_CONFIG, CARDS_SPRITE_DISPLAY_SIZE} from "../../config/cardsSpriteConfig";

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
    const cardImgObj = gamingScene.add.image(x, y, 'cards');
    cardImgObj.displayHeight = CARDS_SPRITE_DISPLAY_SIZE.height;
    cardImgObj.displayWidth = CARDS_SPRITE_DISPLAY_SIZE.width;
    const cardsSprite = CARDS_SPRITE_CONFIG[card.key];
    const cropRect = new Phaser.Geom.Rectangle(cardsSprite.x, cardsSprite.y, cardsSprite.w, cardsSprite.h);
    cardImgObj.setDisplayOrigin(cardsSprite.x + cardsSprite.w / 2, cardsSprite.y + cardsSprite.h / 2)
        .setCrop(cropRect).setInteractive(cropRect, Phaser.Geom.Rectangle.Contains)
        .setDepth(depth)
        .setData("offsetX", 0)
        .setData("offsetY", 0)
        .setData("hoverData", {
            card,
            text: splitText(getCardText(card), isLanEn() ? TOOL_TIP_CARD_MAX_LENGTH_EN : TOOL_TIP_CARD_MAX_LENGTH_CN),
            toolTipType: isToPublic ? TOOL_TIP_CARD_TYPE.PUBLIC_CARD : TOOL_TIP_CARD_TYPE.CONTROL_CARD,
        })
    allCardObjects.push(cardImgObj)

    // cardName
    if (isLanEn()) {
        if (card.type !== CARD_TYPE.BASIC) {
            const cardNameBgObj = gamingScene.add.text(x, y - sizeConfig.controlCard.height / 2, '')
            cardNameBgObj
                .setDepth(depth)
                .setPadding(40, 10, 40, 10)
                .setData("offsetX", 0)
                .setData("offsetY", -sizeConfig.controlCard.height / 2)
                .setOrigin(0.5, 0)
                .setBackgroundColor(COLOR_CONFIG.cardString)
            allCardObjects.push(cardNameBgObj)
        }


        const cardNameObj = gamingScene.add.text(
            x + cardNameObjOffsetX,
            y + (card.type == CARD_TYPE.BASIC ? cardNameObjOffsetBasicY : cardNameObjOffsetNonBasicY),
            i18(CARD_CONFIG[card.key]),
            {
                // @ts-ignore
                fill: "#000",
                align: "center",
                wordWrap: {width: sizeConfig.controlCard.width * 0.8, useAdvancedWrap: false}
            }
        )
        const length = i18(CARD_CONFIG[card.key]).length;
        const fontSize = -8 / 25 * length + 368 / 23
        cardNameObj.setPadding(0, card.type == CARD_TYPE.BASIC ? 10 : 0, 0, card.type == CARD_TYPE.BASIC ? 10 : 0)
            .setOrigin(0.5, 0.5)
            .setFontSize(fontSize)
            .setDepth(depth)
            .setData("offsetX", cardNameObjOffsetX)
            .setData("offsetY", (card.type == CARD_TYPE.BASIC ? cardNameObjOffsetBasicY : cardNameObjOffsetNonBasicY))
            .setBackgroundColor(COLOR_CONFIG.cardString)
        allCardObjects.push(cardNameObj)
    }

    // huase + number
    const cardHuaseNumberObj = gamingScene.add.text(
        x + cardHuaseNumberObjOffsetX,
        y + cardHuaseNumberObjOffsetY,
        (CARD_NUM_DESC[card?.number] + '\r' + card.huase),
        // @ts-ignore
        {fill: getCardColorString(card.huase), align: "center"}
    )
    cardHuaseNumberObj.setPadding(0, 5, 0, 0)
        .setOrigin(0, 0)
        .setFontSize(14)
        .setDepth(depth)
        .setStroke(COLOR_CONFIG.whiteString, 1)
        .setData("offsetX", cardHuaseNumberObjOffsetX)
        .setData("offsetY", cardHuaseNumberObjOffsetY)
    allCardObjects.push(cardHuaseNumberObj)

    // card type message
    if (isLanEn()) {
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
            ).setPadding(0, 2, 0, 2)
                .setOrigin(0, 1)
                .setFontSize(9)
                .setDepth(depth)
                .setData("offsetX", cardTypeObjOffsetX)
                .setData("offsetY", cardTypeObjOffsetY)
                .setBackgroundColor(COLOR_CONFIG.cardString)
            allCardObjects.push(cardTypeObj)
        }
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
        .setStroke(COLOR_CONFIG.cardString, 3)
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