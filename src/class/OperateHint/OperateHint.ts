import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {sizeConfig} from "../../config/sizeConfig";
import {GameFEStatus} from "../../types/gameFEStatus";
import Phaser from "phaser";
import {getIsMyResponseCardOrSkillTurn, getIsMyThrowTurn, getCanPlayInMyTurn} from "../../utils/stage/stageUtils";
import {uuidv4} from "../../utils/uuid";
import {
    getCanPlayInMyTurnOperationHint,
    getIsMyResponseTurnOperationHint,
    getIsMyThrowTurnOperationHint
} from "./utils";

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
            "",
            // @ts-ignore
            {fill: "#fff", align: "center", stroke: '#000', strokeThickness: 4}
        )
        this.operateHint.setPadding(0, 5, 0, 0);
        this.operateHint.setOrigin(0.5, 0.5);
        this.operateHint.setAlpha(0)
    }

    setText(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
        const isMyResponseCardOrSkillTurn = getIsMyResponseCardOrSkillTurn(gameStatus);
        const isMyThrowTurn = getIsMyThrowTurn(gameStatus);
        if (canPlayInMyTurn) {
            this.operateHint?.setAlpha(1);
            const text = getCanPlayInMyTurnOperationHint(gameStatus, gameFEStatus)
            this.operateHint?.setText(text)
        } else if (isMyResponseCardOrSkillTurn) {
            this.operateHint?.setAlpha(1);
            const text = getIsMyResponseTurnOperationHint(gameStatus, gameFEStatus)
            this.operateHint?.setText(text)
        } else if (isMyThrowTurn) {
            this.operateHint?.setAlpha(1);
            const text = getIsMyThrowTurnOperationHint(gameStatus, gameFEStatus)
            this.operateHint?.setText(text)
        } else {
            this.operateHint?.setAlpha(0);
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
