import {
    getCanPlayInMyTurn,
    getIsMyResponseCardTurn,
    getIsMyThrowTurn,
    getMyPlayerId,
    uuidv4
} from "../../utils/gameStatusUtils";
import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {sizeConfig} from "../../config/sizeConfig";
import {GameFEStatus} from "../../types/gameFEStatus";
import Phaser from "phaser";
import {i18, i18Config} from "../../i18n/i18Config";

export class OperateHint {
    obId: string;
    gamingScene: GamingScene;
    operateHint?: Phaser.GameObjects.Text;
    X: number;
    Y: number;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.operateHint;
        this.X = sizeConfig.playersArea.width / 2;
        this.Y = sizeConfig.playersArea.height - sizeConfig.background.height * 0.12;

        this.drawOperateHint();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }

    drawOperateHint() {
        this.operateHint = this.gamingScene.add.text(
            this.X,
            this.Y,
            i18(i18Config.PLEASE_PLAY_A_CARD),
            // @ts-ignore
            {fill: "#fff", align: "center", stroke: '#000', strokeThickness: 4}
        )
        this.operateHint.setPadding(0, 5, 0, 0);
        this.operateHint.setOrigin(0.5, 0.5);
        this.operateHint.setAlpha(0)
    }

    setText(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        // this._isMyResponseCardTurn = getIsMyResponseCardTurn(gameStatus);
        // this._canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
        // this._isMyThrowTurn = getIsMyThrowTurn(gameStatus);
        const _canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
        if (_canPlayInMyTurn) {
            this.operateHint?.setAlpha(1)
            this.operateHint?.setText(i18(i18Config.PLEASE_PLAY_A_CARD))
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
        this.setText(gameStatus, gameFEStatus)
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        this.setText(gameStatus, gameFEStatus)
    }
}
