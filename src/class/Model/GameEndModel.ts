import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {GameStatus} from "../../types/gameStatus";
import {uuidv4} from "../../utils/uuid";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {config} from "../Gaming/Gaming";
import {i18} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import { socket } from "../../socket";
import { EMIT_TYPE } from "../../config/emitConfig";

export class GameEndModel {
    obId: string;
    gamingScene: GamingScene;

    boardImg?: Phaser.GameObjects.Image;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawBackground() {
        this.boardImg = this.gamingScene.add.image(sizeConfig.background.width / 2, sizeConfig.background.height / 2, 'white')
        this.boardImg.setTint(Number(COLOR_CONFIG.black))
        this.boardImg.setAlpha(0.5)
        this.boardImg.displayHeight = sizeConfig.background.height;
        this.boardImg.displayWidth = sizeConfig.background.width;
        this.boardImg.setDepth(DEPTH_CONFIG.WINNER_MODAL)
        this.boardImg.setOrigin(0.5, 0.5)
        this.boardImg.setInteractive();
    }

    drawWinOrLose(gameStatus: GameStatus) {
        const winnerTeamName = gameStatus?.gameEnd.winnerTeamName;
        const myTeamName = gameStatus.players[getMyPlayerId()].teamName
        const s = (winnerTeamName != myTeamName) ? "LOSS !!!" : "VICTORY !!!"

        const text = this.gamingScene.add.text(
            sizeConfig.background.width / 2,
            sizeConfig.background.height / 2 - 120,
            s,
            // @ts-ignore
            {fill: COLOR_CONFIG.yellowString})
        text.setFontSize(80)
        text.setOrigin(0.5, 0.5)
        text.setDepth(DEPTH_CONFIG.WINNER_MODAL)
    }

    drawName(gameStatus: GameStatus) {
        const playerName = gameStatus.players[getMyPlayerId()].playerName;
        const text = this.gamingScene.add.text(sizeConfig.background.width / 2, sizeConfig.background.height / 2, playerName,
            // @ts-ignore
            {fill: COLOR_CONFIG.whiteString})
        text.setFontSize(60)
        text.setOrigin(0.5, 0.5)
        text.setDepth(DEPTH_CONFIG.WINNER_MODAL)
    }

    drawContinue(gameStatus: GameStatus) {
        const text = this.gamingScene.add.text(sizeConfig.background.width / 2 , sizeConfig.background.height / 2+ 100, `——————${i18(i18Config.CONTINUE)}——————`,
            // @ts-ignore
            {fill: COLOR_CONFIG.yellowString}).setInteractive({cursor: "pointer"})
        text.setFontSize(30)
        text.setOrigin(0.5, 0.5)
        text.setDepth(DEPTH_CONFIG.WINNER_MODAL)

        text.on('pointerdown', () => {
            $('.page').hide();
            $('#roomsPage').css('display', 'flex');
            socket.emit(EMIT_TYPE.REFRESH_ROOMS);

            $("#canvas").html('');
            new Phaser.Game(config);
        })
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const showBoard = !!gameStatus?.gameEnd
        if (showBoard) {
            this.drawBackground();
            this.drawWinOrLose(gameStatus);
            this.drawName(gameStatus);
            this.drawContinue(gameStatus);
        }
    }
}