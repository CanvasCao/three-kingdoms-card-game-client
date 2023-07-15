import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {getCurrentPlayer} from "../playerUtils";
import {getMyPlayerId} from "../localstorage/localStorageUtils";

const sharedDrawPlayerStroke = (
    gamingScene: GamingScene,
    {x, y, alpha = 1}: {
        x: number,
        y: number,
        alpha?: number
    }) => {
    const stroke = gamingScene.add.graphics();
    reDrawPlayerStroke(stroke, {
        // @ts-ignore
        x, y, alpha, color: COLOR_CONFIG.defaultStroke
    })
    return {
        stroke
    }
}

const reDrawPlayerStroke = (stroke: Phaser.GameObjects.Graphics, {x, y, alpha, color,lineWidth}: {
    x: number,
    y: number,
    alpha: number,
    color: number,
    lineWidth:number
}) => {
    // @ts-ignore
    stroke.clear()
    stroke.lineStyle(lineWidth, color, alpha);
    stroke.strokeRoundedRect(x, y,
        sizeConfig.player.width,
        sizeConfig.player.height,
        2);
    stroke.setAlpha(alpha);
    stroke.setDepth(2);
}

const getPlayerStrokeAlphaAndColor = (gameStatus: GameStatus, gameFEStatus: GameFEStatus, playerId: string) => {
    const isMe = playerId === getMyPlayerId()

    if (getCurrentPlayer(gameStatus).playerId === playerId && !isMe) {
        return {
            alpha: 1,
            lineWidth:4,
            color: COLOR_CONFIG.myTurnStroke
        }
    }
    if (!!gameFEStatus.selectedTargetPlayers.find((u) => u.playerId == playerId)) {
        return {
            alpha: 1,
            lineWidth:2,
            color: COLOR_CONFIG.selectedPlayerStroke
        }
    }

    return {
        alpha: 1,
        lineWidth:2,
        color: COLOR_CONFIG.defaultStroke
    }
}
export {
    sharedDrawPlayerStroke,reDrawPlayerStroke,
    getPlayerStrokeAlphaAndColor
}