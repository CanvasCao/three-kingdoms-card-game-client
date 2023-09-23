import {GameStatus} from "../../types/gameStatus";
import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitHeroSelectBoardData} from "../../types/emit";
import {uuidv4} from "../../utils/uuid";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {BaseBoard} from './BaseBoard'
import {i18, isLanEn} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {getHeroText, splitText} from "../../utils/string/stringUtils";
import {TOOL_TIP_HERO_MAX_LENGTH_CN, TOOL_TIP_HERO_MAX_LENGTH_EN} from "../../config/stringConfig";
import {TOOL_TIP_CARD_TYPE} from "../../config/toolTipConfig";

const boardSize = {
    height: 380,
    width: 490,
}

const gridOffset = {
    line1: {y: -55},
    line2: {y: -55 + sizeConfig.selectHeroCard.height + sizeConfig.boardCardMargin},
}

export class HeroSelectBoard {
    obId: string;
    gamingScene: GamingScene;
    boardContent: PhaserGameObject[];

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
        const heros = gameStatus.players[getMyPlayerId()].canSelectHeros;

        [...heros].forEach((hero, index) => {
            const {heroId} = hero
            const offsetY = (index) > 3 ? gridOffset.line2.y : gridOffset.line1.y;
            const modIndex = index % 4;

            const cardImgObj = this.gamingScene.add.image(
                this.initX + -140 + modIndex * (sizeConfig.selectHeroCard.width + sizeConfig.boardCardMargin),
                this.initY + offsetY,
                heroId).setInteractive({cursor: "pointer"});
            cardImgObj.displayHeight = sizeConfig.selectHeroCard.height;
            cardImgObj.displayWidth = sizeConfig.selectHeroCard.width;
            cardImgObj.setDepth(DEPTH_CONFIG.BOARD)

            cardImgObj.setData('hoverData', {
                text: splitText(getHeroText(hero), isLanEn() ? TOOL_TIP_HERO_MAX_LENGTH_EN : TOOL_TIP_HERO_MAX_LENGTH_CN),
                toolTipType: TOOL_TIP_CARD_TYPE.SELECTING_HERO,
            })
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

        const curheroId = gameStatus.players[getMyPlayerId()].heroId;

        if (!curheroId && !this.baseBoard.show) {
            this.baseBoard.showBoard();
            this.baseBoard.setTitle(i18(i18Config.HERO_SELECT_BOARD_TITLE))

            this.drawContent(gameStatus);
            this.baseBoard.addContent(this.boardContent);
        } else if (this.baseBoard.show && curheroId) {
            this.baseBoard.hideBoard();
        }

        this._heroId = curheroId
    }
}