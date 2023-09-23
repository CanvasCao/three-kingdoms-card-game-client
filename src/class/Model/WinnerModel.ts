import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {GameStatus} from "../../types/gameStatus";
import {uuidv4} from "../../utils/uuid";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";

export class WinnerModel {
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

    drawWinner(gameStatus: GameStatus) {
        const mePlayer = gameStatus.players[getMyPlayerId()]
        const image = this.gamingScene.add.image(sizeConfig.background.width / 2 - sizeConfig.player.width * 2, sizeConfig.background.height / 2, mePlayer.heroId)
        image.displayHeight = sizeConfig.player.height * 1.5;
        image.displayWidth = sizeConfig.player.width * 1.5;
        image.setDepth(DEPTH_CONFIG.WINNER_MODAL)
    }

    drawWinOrLose(gameStatus: GameStatus) {
        const winnerTeamName = gameStatus?.winner.winnerTeamName;
        const myTeamName = gameStatus.players[getMyPlayerId()].teamName
        const s = (winnerTeamName != myTeamName) ? "LOSS !!!" : "VICTORY !!!"

        const text = this.gamingScene.add.text(sizeConfig.background.width / 2, sizeConfig.background.height / 2 - 200, s,
            // @ts-ignore
            {fill: COLOR_CONFIG.yellowString})
        text.setFontSize(100)
        text.setOrigin(0.5, 0.5)
        text.setDepth(DEPTH_CONFIG.WINNER_MODAL)
    }

    drawName(gameStatus: GameStatus) {
        const playerName = gameStatus.players[getMyPlayerId()].playerName;
        const text = this.gamingScene.add.text(sizeConfig.background.width / 2 + 100, sizeConfig.background.height / 2, playerName,
            // @ts-ignore
            {fill: COLOR_CONFIG.whiteString})
        text.setFontSize(60)
        text.setOrigin(0.5, 0.5)
        text.setDepth(DEPTH_CONFIG.WINNER_MODAL)
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const showBoard = !!gameStatus?.winner
        if (showBoard) {
            this.drawBackground();
            this.drawWinner(gameStatus);
            this.drawWinOrLose(gameStatus);
            this.drawName(gameStatus);
        }
    }
}