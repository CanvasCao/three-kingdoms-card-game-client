import {sizeConfig} from "../../config/sizeConfig";
import colorConfig from "../../config/colorConfig.json";
import {GamingScene} from "../../types/phaser";
import {Card} from "../../types/gameStatus";
import {CARD_NUM_DESC} from "../../config/cardConfig";
import {getI18Lan, i18Lans} from "../../i18n/i18nUtils";

const sharedDrawEquipment = (
    gamingScene: GamingScene,
    card: Card | undefined,
    {x, y, depth = 0, alpha = 1, isMe = false}: {
        x: number,
        y: number,
        depth?: number,
        alpha?: number,
        isMe?: boolean
    }) => {
    const padding = 1;
    const paddingHorizontal = padding + (isMe ? 4 : 1)
    const equipmentCardWidth = isMe ? sizeConfig.controlEquipment.width : sizeConfig.player.width * 0.8
    const equipmentCardHeight = isMe ? sizeConfig.controlEquipment.height - 4 : 16
    const fontSize = isMe ? 14 : sizeConfig.player.height / 16;

    const selectedStroke = gamingScene.add.graphics();
    // @ts-ignore
    selectedStroke.lineStyle(3, colorConfig.selectedCardStroke, 1);
    selectedStroke.strokeRect(x + sizeConfig.controlSelectedOffsetX, y,
        equipmentCardWidth,
        equipmentCardHeight);
    selectedStroke.setAlpha(alpha)

    const background = gamingScene.add.image(x, y, 'white')
    isMe && background.setInteractive();
    // @ts-ignore
    background.setTint(colorConfig.card);
    background.displayHeight = equipmentCardHeight;
    background.displayWidth = equipmentCardWidth;
    background.setAlpha(alpha)
    background.setOrigin(0, 0)

    const distanceText = gamingScene.add.text(x, y, card?.distanceDesc || '',
        // @ts-ignore
        {fill: "#000"}
    );
    distanceText.setPadding(padding + 5, paddingHorizontal, padding + 1, paddingHorizontal);
    distanceText.setFontSize(fontSize)
    distanceText.setAlpha(alpha)

    const nameText = gamingScene.add.text(x + equipmentCardWidth * 0.23, y,
        (getI18Lan() == i18Lans.EN ? card?.EN : card?.CN) || '',
        {
            // @ts-ignore
            fill: "#000",
            align: "justify",
            wordWrap: {width: equipmentCardWidth * 0.7}
        }
    );
    nameText.setPadding(padding + 0, paddingHorizontal, padding + 0, paddingHorizontal);
    nameText.setFontSize(fontSize)
    nameText.setAlpha(alpha)

    const huaseNumText = gamingScene.add.text(x + equipmentCardWidth * 0.85, y,
        // @ts-ignore
        (CARD_NUM_DESC[card?.number] || '') + (card?.huase || ''),
        // @ts-ignore
        {fill: "#000", align: "center"}
    );
    huaseNumText.setPadding(padding + 0, paddingHorizontal, padding + 0, paddingHorizontal);
    huaseNumText.setFontSize(fontSize)
    huaseNumText.setAlpha(alpha)

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