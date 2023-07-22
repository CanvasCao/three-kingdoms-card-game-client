import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {GamingScene} from "../../types/phaser";
import {CARD_CONFIG, CARD_NUM_DESC, EQUIPMENT_TYPE} from "../../config/cardConfig";
import {getI18Lan, I18LANS} from "../../i18n/i18nUtils";
import {Card} from "../../types/card";
import {getCardColor} from "../cardUtils";

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

    const background = gamingScene.add.image(x, y, 'white')
    isMe && background.setInteractive();
    // @ts-ignore
    background.setTint(COLOR_CONFIG.card);
    background.displayHeight = equipmentCardHeight;
    background.displayWidth = equipmentCardWidth;
    background.setAlpha(1)
    background.setOrigin(0, 0)

    const distanceText = gamingScene.add.text(x, y, '',
        // @ts-ignore
        {fill: "#000"}
    );
    distanceText.setPadding(padding + 5, paddingHorizontal, padding + 1, paddingHorizontal);
    distanceText.setFontSize(fontSize)
    distanceText.setAlpha(1)
    if (card.equipmentType == EQUIPMENT_TYPE.MINUS_HORSE || card.equipmentType == EQUIPMENT_TYPE.PLUS_HORSE) {
        distanceText.setText(card.distanceDesc!)
    } else if (card.equipmentType == EQUIPMENT_TYPE.WEAPON) {
        distanceText.setText((getI18Lan() == I18LANS.EN ? card.distance?.toString() : card.distanceDesc)!)
    }


    const nameText = gamingScene.add.text(x + equipmentCardWidth * 0.23, y, '',
        {
            // @ts-ignore
            fill: "#000",
            align: "justify",
            wordWrap: {width: equipmentCardWidth * 0.7}
        }
    );
    nameText.setPadding(padding + 0, paddingHorizontal, padding + 0, paddingHorizontal);
    nameText.setFontSize(fontSize)
    nameText.setAlpha(1)
    nameText.setText((getI18Lan() == I18LANS.EN ?
            CARD_CONFIG[card.key].EN.substring(0, 8) + '..' :
            CARD_CONFIG[card.key].CN
    ))


    const huaseNumText = gamingScene.add.text(x + equipmentCardWidth * 0.85, y, '',
        // @ts-ignore
        {fill: "#000", align: "center"}
    );
    huaseNumText.setPadding(padding + 0, paddingHorizontal, padding + 0, paddingHorizontal);
    huaseNumText.setFontSize(fontSize)
    huaseNumText.setAlpha(1)
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