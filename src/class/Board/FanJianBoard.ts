import {GameStatus} from "../../types/gameStatus";
import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {CARD_HUASE} from "../../config/cardConfig";
import {uuidv4} from "../../utils/uuid";
import {i18} from "../../i18n/i18nUtils";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {BaseBoard} from "./BaseBoard";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {cloneDeep, isEqual} from "lodash";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitFanJianBoardData} from "../../types/emit";

const boardSize = {
    height: 380,
    width: 480,
}

export class FanJianBoard {
    obId: string;
    gamingScene: GamingScene;
    boardContent: PhaserGameObject[];

    // innerState
    _fanjianBoardResponse: object | undefined;

    baseBoard: BaseBoard;
    initX: number;
    initY: number;


    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.boardContent = []

        this.baseBoard = new BaseBoard(gamingScene, {
            boardSize,
        });
        this.initX = this.baseBoard.initX;
        this.initY = this.baseBoard.initY;

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawHuase() {
        [CARD_HUASE.HEITAO, CARD_HUASE.CAOHUA, CARD_HUASE.HONGTAO, CARD_HUASE.FANGKUAI].forEach((huase, i) => {
            const huaseText = this.gamingScene.add.text(
                this.initX + 100 * i - 150,
                this.initY, huase)
                .setDepth(DEPTH_CONFIG.BOARD)
                .setOrigin(0.5, 0.5)
                .setFontSize(100)
                .setInteractive({cursor: "pointer"})
                .setColor(i < 2 ? COLOR_CONFIG.blackString : COLOR_CONFIG.redString)
                .setStroke(COLOR_CONFIG.whiteString, 2)

            huaseText.on('pointerdown', () => {
                const data: EmitFanJianBoardData = {huase}
                this.gamingScene.socket.emit(
                    EMIT_TYPE.FAN_JIAN_BOARD_ACTION,
                    data
                )
            })

            this.boardContent = this.boardContent.concat(huaseText)
        })
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const fanJianBoardResponse = gameStatus?.fanJianBoardResponse;
        if (isEqual(this._fanjianBoardResponse, fanJianBoardResponse)) {
            return;
        }

        const showBoard = fanJianBoardResponse?.originId == getMyPlayerId();
        if (showBoard && !this.baseBoard.show) {
            this.boardContent = []
            this.baseBoard.showBoard();

            const title = i18(SKILL_NAMES_CONFIG.WU005_FAN_JIAN)
            this.baseBoard.setTitle(title)
            this.drawHuase()

            this.baseBoard.addContent(this.boardContent);
        } else if (!showBoard && this.baseBoard.show) {
            this.baseBoard.hideBoard();
        }

        this._fanjianBoardResponse = cloneDeep(fanJianBoardResponse);
    }
}