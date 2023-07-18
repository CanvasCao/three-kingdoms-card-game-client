import {GameStatus} from "../../types/gameStatus";
import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitHeroSelectBoardData} from "../../types/emit";
import {uuidv4} from "../../utils/uuid";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {BaseBoard} from './BaseBoard'

const boardSize = {
    height: 380,
    width: 490,
}

const gridOffset = {
    line1: {y: -55},
    line2: {y: -55 + sizeConfig.selectHeroCard.height + sizeConfig.selectHeroCardMargin},
}

export class HeroSelectBoard {
    obId: string;
    gamingScene: GamingScene;
    boardContent: (Phaser.GameObjects.Image | Phaser.GameObjects.Text | Phaser.GameObjects.Graphics)[];

    // innerState
    _heroId: string;

    baseBoard: BaseBoard;
    initX: number;
    initY: number;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.boardContent = [];
        this._heroId = '';

        this.baseBoard = new BaseBoard(gamingScene, {
            boardSize,
        });
        this.initX = this.baseBoard.initX;
        this.initY = this.baseBoard.initY;

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawContent(gameStatus: GameStatus) {
        const heroList = gameStatus.players[getMyPlayerId()].canSelectHeroIds;

        [...heroList].forEach((heroId, index) => {
            const offsetY = (index) > 3 ? gridOffset.line2.y : gridOffset.line1.y;
            const modIndex = index % 4;

            const cardImgObj = this.gamingScene.add.image(
                this.initX + -140 + modIndex * (sizeConfig.selectHeroCard.width + sizeConfig.selectHeroCardMargin),
                this.initY + offsetY,
                heroId).setInteractive({cursor: "pointer"});
            cardImgObj.displayHeight = sizeConfig.selectHeroCard.height;
            cardImgObj.displayWidth = sizeConfig.selectHeroCard.width;
            cardImgObj.setDepth(DEPTH_CONFIG.BOARD)

            cardImgObj.on('pointerdown', () => {
                    this.gamingScene.socket.emit(
                        EMIT_TYPE.HERO_SELECT_BOARD_ACTION,
                        this.getEmitHeroSelectBoardData(heroId)
                    )
                }
            )
            this.boardContent.push(cardImgObj);
        })
    }

    getEmitHeroSelectBoardData(heroId: string): EmitHeroSelectBoardData {
        return {
            playerId: getMyPlayerId(),
            heroId,
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        if (this._heroId) {
            delete this.gamingScene.heroSelectBoard
            return;
        }

        const heroId = gameStatus.players[getMyPlayerId()].heroId;

        if (!heroId && !this.baseBoard.show) {
            this.baseBoard.showBoard();
            this.drawContent(gameStatus);
            this.baseBoard.setTitle('选将')
            this.baseBoard.addContent(this.boardContent);
        } else if (!this._heroId && heroId) {
            this.baseBoard.hideBoard();
        }

        this._heroId = heroId
    }
}