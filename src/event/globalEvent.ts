import {sizeConfig} from "../config/sizeConfig";
import {TOOL_TIP_CARD_TYPE} from "../config/toolTipConfig";
import {GamingScene} from "../types/phaser";

const bindGlobalHoverEvent = (gamingScene: GamingScene) => {
    gamingScene.input.on('pointerover', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image[]) => {
        const curObj = gameObject?.[0];
        if (!curObj) {
            return
        }

        const hoverData = curObj?.getData("hoverData");
        if (hoverData) {
            const {card, toolTipType, text} = hoverData
            let x = 0, y = 0;
            if (toolTipType === TOOL_TIP_CARD_TYPE.PLAYER) {
                x = sizeConfig.playersArea.width / 2
                y = sizeConfig.playersArea.height * 0.9
            } else {
                x = curObj.x;
                y = curObj.y
            }
            gamingScene.toolTip?.hoverInToShowToolTip({
                card, text, toolTipType, x, y,
            });
        }
    });

    gamingScene.input.on('pointerout', () => {
        gamingScene.toolTip?.clearAll();
    });
}


export {
    bindGlobalHoverEvent
}