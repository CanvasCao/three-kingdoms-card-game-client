import {sizeConfig} from "../config/sizeConfig";
import colorConfig from "../config/colorConfig.json";
import {GamingScene} from "../types/phaser";
import {Card} from "../types/gameStatus";

const sharedDrawEquipment = (
    gamingScene: GamingScene,
    card: Card,
    {x, y, depth = 0, alpha = 1}: {
        x: number,
        y: number,
        depth?: number,
        alpha?: number
    }) => {
    const padding = 1;
    const fontSize = sizeConfig.player.height / 16;
    const distanceText = gamingScene.add.text(x, y, card.distanceDesc || '',
        // @ts-ignore
        {fill: "#000", align: "left", fixedWidth: sizeConfig.player.width * 0.8}
    );

    distanceText.setPadding(padding + 5, padding + 1, padding + 0, padding + 0);
    // @ts-ignore
    distanceText.setBackgroundColor(colorConfig.cardString)
    distanceText.setFontSize(fontSize)
    distanceText.setAlpha(1)

    const nameText = gamingScene.add.text(x + sizeConfig.player.width * 0.19, y,
        card.CN,
        // @ts-ignore
        {fill: "#000", align: "justify"}
    );
    nameText.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
    nameText.setFontSize(fontSize)
    nameText.setAlpha(1)

    const huaseNumText = gamingScene.add.text(x + sizeConfig.player.width * 0.6, y,
        card.cardNumDesc + card.huase,
        // @ts-ignore
        {fill: "#000", align: "center"}
    );
    huaseNumText.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
    huaseNumText.setFontSize(fontSize)
    huaseNumText.setAlpha(1)

    return {
        distanceText,
        nameText,
        huaseNumText,
    }
}

export {
    sharedDrawEquipment,
}