import {GameStatus} from "../../types/gameStatus";
import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {CARD_CONFIG} from "../../config/cardConfig";
import {sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {uuidv4} from "../../utils/uuid";
import {getI18Lan, i18, I18LANS} from "../../i18n/i18nUtils";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {BaseBoard} from "./BaseBoard";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {HERO_NAMES_CONFIG} from "../../config/heroConfig";
import {verticalRotationString} from "../../utils/string/stringUtils";
import {PANDING_EFFECT_CONFIG} from "../../config/pandingConfig";

const boardSize = {
    height: 380,
    width: 480,
}

export class PandingBoard {
    obId: string;
    gamingScene: GamingScene;
    boardContent: PhaserGameObject[];

    // innerState
    _pandingNameKey: string | undefined;
    _pandingResultCardId: string | undefined;

    baseBoard: BaseBoard;
    initX: number;
    initY: number;

    timer: number | undefined;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.boardContent = []

        this.baseBoard = new BaseBoard(gamingScene, {
            boardSize,
        });
        this.initX = this.baseBoard.initX;
        this.initY = this.baseBoard.initY;

        this.timer = undefined
        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawPandingResultCards(gameStatus: GameStatus) {
        const pandingResultCard = gameStatus.pandingEvent?.pandingResultCard
        if (!pandingResultCard) {
            return
        }

        const {allCardObjects} =
            sharedDrawFrontCard(this.gamingScene, pandingResultCard, {
                x: this.initX - 102,
                y: this.initY,
                depth: DEPTH_CONFIG.BOARD,
            })

        this.boardContent = this.boardContent.concat(allCardObjects)
    }

    drawPandingPlayerName(gameStatus: GameStatus) {
        const player = gameStatus.players[gameStatus.pandingEvent?.originId]
        if (!player) {
            return
        }
        const heroName = i18(HERO_NAMES_CONFIG[player.heroId])
        const text = this.gamingScene.add.text(
            this.initX - 192,
            this.initY,
            verticalRotationString(heroName), {align: 'center', padding: {top: 2}}
        ).setDepth(DEPTH_CONFIG.BOARD).setOrigin(0.5, 0.5)

        this.boardContent = this.boardContent.concat(text)
    }

    drawPandingEffect(gameStatus: GameStatus) {
        const pandingNameKey = gameStatus.pandingEvent?.pandingNameKey

        if (!pandingNameKey) {
            return
        }

        const effectTitle = getI18Lan() == I18LANS.EN ? "Effect" : '判定效果'
        const text2 = this.gamingScene.add.text(
            this.initX + 20,
            this.initY,
            verticalRotationString(effectTitle), {align: 'center'}
        ).setDepth(DEPTH_CONFIG.BOARD).setOrigin(0.5, 0.5)
        this.boardContent = this.boardContent.concat(text2)

        const text = this.gamingScene.add.text(
            this.initX + 130,
            this.initY,
            i18(PANDING_EFFECT_CONFIG[pandingNameKey]), {align: 'left', fontSize: 12, padding: {top: 2}}
        ).setDepth(DEPTH_CONFIG.BOARD).setOrigin(0.5, 0.5)
        this.boardContent = this.boardContent.concat(text)
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const pandingEvent = gameStatus.pandingEvent;
        const pandingNameKey = pandingEvent?.pandingNameKey
        const pandingResultCardId = pandingEvent?.pandingResultCard?.cardId

        if (this._pandingNameKey == pandingNameKey && this._pandingResultCardId == pandingResultCardId) {
            return;
        }

        const showBoard = pandingNameKey && pandingResultCardId

        if (showBoard) {
            this.boardContent = []
            this.baseBoard.hideBoard();
            this.baseBoard.showBoard();

            const title = i18(CARD_CONFIG[pandingNameKey]) || i18(SKILL_NAMES_CONFIG[pandingNameKey])
            this.baseBoard.setTitle(title)
            this.drawPandingPlayerName(gameStatus)
            this.drawPandingEffect(gameStatus)
            this.drawPandingResultCards(gameStatus)

            this.baseBoard.addContent(this.boardContent);
            if (this.timer) {
                clearTimeout(this.timer)
            }
        } else if (!showBoard && this.baseBoard.show) {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.baseBoard.hideBoard();
            }, 5000) as unknown as number
        }

        this._pandingNameKey = pandingNameKey;
        this._pandingResultCardId = pandingResultCardId;
    }
}