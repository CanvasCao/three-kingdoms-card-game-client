import {sizeConfig} from "../config/sizeConfig";
import colorConfig from "../config/colorConfig.json";
import {GamingScene} from "../types/phaser";
import {Card} from "../types/gameStatus";

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
    const fontSize = isMe ? 14 : sizeConfig.player.height / 16;
    const distanceText = gamingScene.add.text(x, y, card?.distanceDesc || '',
        // @ts-ignore
        {fill: "#000", align: "left", fixedWidth: equipmentCardWidth}
    );

    distanceText.setPadding(padding + 5, paddingHorizontal, padding + 1, paddingHorizontal);
    // @ts-ignore
    distanceText.setBackgroundColor(colorConfig.cardString)
    distanceText.setFontSize(fontSize)
    distanceText.setAlpha(alpha)

    const nameText = gamingScene.add.text(x + equipmentCardWidth * 0.23, y,
        card?.CN || '',
        // @ts-ignore
        {fill: "#000", align: "justify"}
    );
    nameText.setPadding(padding + 0, paddingHorizontal, padding + 0, paddingHorizontal);
    nameText.setFontSize(fontSize)
    nameText.setAlpha(alpha)

    const huaseNumText = gamingScene.add.text(x + equipmentCardWidth * 0.75, y,
        (card?.cardNumDesc || '') + (card?.huase || ''),
        // @ts-ignore
        {fill: "#000", align: "center"}
    );
    huaseNumText.setPadding(padding + 0, paddingHorizontal, padding + 0, paddingHorizontal);
    huaseNumText.setFontSize(fontSize)
    huaseNumText.setAlpha(alpha)

    return {
        distanceText,
        nameText,
        huaseNumText,
    }
}

export {
    sharedDrawEquipment,
}