import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {sizeConfig} from "../../config/sizeConfig";
import Phaser from "phaser";
import {uuidv4} from "../../utils/uuid";
import {Player} from "../../types/player";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";

import {getBoardPlayerThinkHint} from './utils'
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";

export class BoardPlayerThinkingHint {
    obId: string;
    gamingScene: GamingScene;
    playerId: string;
    thinkingHint?: Phaser.GameObjects.Text;
    playerPosition: { x: number, y: number };
    isMe: boolean;
    countDownBg?: Phaser.GameObjects.Graphics
    countDownContent?: Phaser.GameObjects.Graphics
    timer?: number

    constructor(gamingScene: GamingScene, player: Player) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.thinkingHint;
        this.playerId = player.playerId;
        this.playerPosition = player.playerPosition;
        this.isMe = this.playerId === getMyPlayerId();
        this.countDownBg;
        this.countDownContent;

        if (this.isMe) {
            return
        }

        this.drawOperateHint();

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawOperateHint() {
        this.thinkingHint = this.gamingScene.add.text(
            this.playerPosition.x,
            this.playerPosition.y + sizeConfig.player.height / 2 + 5,
            "",
            // @ts-ignore
            {fill: "#fff", align: "center"}
        )
        this.thinkingHint.setPadding(0, 5, 0, 0);
        this.thinkingHint.setOrigin(0.5, 0.5);
        this.thinkingHint.setAlpha(1)
        this.thinkingHint.setFontSize(12)
        this.thinkingHint.setDepth(DEPTH_CONFIG.THINKING_HINT)
        this.thinkingHint.setShadow(1, 1, '#000', 10, true, true)
    }

    startCountDown() {
        this.countDownBg = this.gamingScene.add.graphics();
        this.countDownContent = this.gamingScene.add.graphics();
        // @ts-ignore
        this.countDownBg!.fillStyle(COLOR_CONFIG.black);
        this.countDownBg!.fillRect(this.playerPosition.x - sizeConfig.player.width / 2,
            this.playerPosition.y + sizeConfig.player.height / 2 + 10,
            sizeConfig.player.width,
            5);

        let percentage = 100
        this.timer = setInterval(() => {
            this.countDownContent?.clear()
            // @ts-ignore
            this.countDownContent!.fillGradientStyle(COLOR_CONFIG.countDownTop, COLOR_CONFIG.countDownTop, COLOR_CONFIG.countDownBottom, COLOR_CONFIG.countDownBottom);
            this.countDownContent!.fillRect(this.playerPosition.x - sizeConfig.player.width / 2,
                this.playerPosition.y + sizeConfig.player.height / 2 + 10,
                sizeConfig.player.width * percentage / 100,
                5);
            percentage = percentage - 0.025
            if (percentage <= 0) {
                percentage = 100
            }
        }, 10) as unknown as number
    }

    destoryAll() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.countDownBg?.destroy()
        this.countDownContent?.destroy()
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const boardPlayerThinkHint = getBoardPlayerThinkHint(gameStatus, this.playerId)

        this.destoryAll()
        this.thinkingHint?.setText(boardPlayerThinkHint)
        if (boardPlayerThinkHint) {
            this.startCountDown();
        } else {

        }
    }
}

