import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {GamingScene} from "../../types/phaser";
import {CARD_CONFIG, CARD_NUM_DESC, EQUIPMENT_TYPE} from "../../config/cardConfig";
import {i18, isLanEn} from "../../i18n/i18nUtils";
import {Card} from "../../types/card";
import {getCardColor} from "../cardUtils";
import {TOOL_TIP_CARD_TYPE} from "../../config/toolTipConfig";
import {getCardText, limitStringLengthWithEllipsis, splitText} from "../string/stringUtils";
import {TOOL_TIP_CARD_MAX_LENGTH} from "../../config/stringConfig";

const sharedDrawEquipment = (
    gamingScene: GamingScene,
    card: Card,
    {x, y, depth = 0, isMe = false}: {
        x: number,
        y: number,
        depth?: number,
        alpha?: number,
        isMe?: boolean
    }) => {
    const padding = 1;
    const paddingHorizontal = padding + (isMe ? 4 : 1)
    const equipmentCardWidth = isMe ? sizeConfig.controlEquipment.width : sizeConfig.player.width * 0.8
    const equipmentCardHeight = isMe ? sizeConfig.controlEquipment.height - 4 : 15
    const fontSize = isMe ? 14 : sizeConfig.player.height / 16;

    const selectedStroke = gamingScene.add.graphics();
    // @ts-ignore
    selectedStroke.lineStyle(3, COLOR_CONFIG.selectedCardStroke, 1);
    selectedStroke.strokeRect(x + sizeConfig.controlCardSelectedOffsetX, y,
        equipmentCardWidth,
        equipmentCardHeight);
    selectedStroke.setAlpha(0)

    const background = gamingScene.add.image(x + equipmentCardWidth / 2,
        y + equipmentCardHeight / 2,
        'card').setInteractive()
    background.displayHeight = equipmentCardHeight;
    background.displayWidth = equipmentCardWidth;
    background.setData('hoverData', {
        card,
        text: splitText(getCardText(card), TOOL_TIP_CARD_MAX_LENGTH),
        toolTipType: TOOL_TIP_CARD_TYPE.EQUIPMENT,
    })

    // @ts-ignore
    const distanceText = gamingScene.add.text(x + equipmentCardWidth * 0.02, y, '', {fill: COLOR_CONFIG.black});
    distanceText.setPadding(padding + 5, paddingHorizontal, padding + 1, paddingHorizontal);
    distanceText.setFontSize(fontSize)
    if (card.equipmentType == EQUIPMENT_TYPE.MINUS_HORSE || card.equipmentType == EQUIPMENT_TYPE.PLUS_HORSE) {
        distanceText.setText(card.distanceDesc!)
    } else if (card.equipmentType == EQUIPMENT_TYPE.WEAPON) {
        distanceText.setText((isLanEn() ? card.distance?.toString() : card.distanceDesc)!)
    }

    const text = limitStringLengthWithEllipsis(i18(CARD_CONFIG[card.key]), 10)
    const nameText = gamingScene.add.text(x + equipmentCardWidth * 0.2, y, text,
        {
            // @ts-ignore
            fill: "#000",
            align: "left",
            wordWrap: {width: equipmentCardWidth * 0.7}
        }
    );
    nameText.setPadding(padding + 0, paddingHorizontal, padding + 0, paddingHorizontal);
    nameText.setFontSize(fontSize)

    const huaseNumText = gamingScene.add.text(x + equipmentCardWidth * 0.8, y, '',
        // @ts-ignore
        {fill: COLOR_CONFIG.black, align: "center"}
    );
    huaseNumText.setPadding(padding + 0, paddingHorizontal, padding + 0, paddingHorizontal);
    huaseNumText.setFontSize(fontSize)
    // @ts-ignore
    huaseNumText.setText(CARD_NUM_DESC[card.number] + card.huase)
    huaseNumText.setColor(getCardColor(card.huase))

    return {
        selectedStroke,
        background,
        distanceText,
        nameText,
        huaseNumText,
    }
}

export {
    sharedDrawEquipment,
}