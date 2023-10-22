import {GameStatus} from "../../types/gameStatus";
import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {CARD_CONFIG} from "../../config/cardConfig";
import {sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {uuidv4} from "../../utils/uuid";
import {i18, isLanEn} from "../../i18n/i18nUtils";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {BaseBoard} from "./BaseBoard";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {HERO_NAMES_CONFIG} from "../../config/heroConfig";
import {splitText, verticalRotationString} from "../../utils/string/stringUtils";
import {PANDING_EFFECT_CONFIG} from "../../config/pandingConfig";
import {cloneDeep, isBoolean, isEqual} from "lodash";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {PANDING_EFFECT_LENGTH_EN, PANDING_EFFECT_LENGTH_CN} from "../../config/stringConfig";

const boardSize = {
    height: 380,
    width: 480,
}

export class PandingBoard {
    obId: string;
    gamingScene: GamingScene;
    boardContent: PhaserGameObject[];

    // innerState
    _pandingEvent: object | undefined;

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

        const takeEffect = gameStatus.pandingEvent.takeEffect
        const {allCardObjects, cardPandingEffectObj} =
            sharedDrawFrontCard(this.gamingScene, pandingResultCard, {
                x: this.initX - 102,
                y: this.initY,
                depth: DEPTH_CONFIG.BOARD,
            })
        if (isBoolean(takeEffect)) {
            cardPandingEffectObj.setText(takeEffect ? "✓" : "✕")
            cardPandingEffectObj.setFill(takeEffect ? COLOR_CONFIG.greenString : COLOR_CONFIG.redString)
        }

        this.boardContent = this.boardContent.concat(allCardObjects)
    }

    drawPandingPlayerName(gameStatus: GameStatus) {
        const player = gameStatus.players[gameStatus.pandingEvent?.originId]
        if (!player) {
            return
        }
        const pandingPlayerName = isLanEn() ? player.playerName : HERO_NAMES_CONFIG[player.heroId]?.CN
        const text = this.gamingScene.add.text(
            this.initX - 192,
            this.initY,
            verticalRotationString(pandingPlayerName), {align: 'center', padding: {top: 2}}
        ).setDepth(DEPTH_CONFIG.BOARD).setOrigin(0.5, 0.5)

        this.boardContent = this.boardContent.concat(text)
    }

    drawPandingEffect(gameStatus: GameStatus) {
        const pandingNameKey = gameStatus.pandingEvent?.pandingNameKey

        if (!pandingNameKey) {
            return
        }

        const effectTitle = this.gamingScene.add.text(
            this.initX + 20,
            this.initY,
            verticalRotationString(isLanEn() ? "Effect" : '判定效果')
        ).setDepth(DEPTH_CONFIG.BOARD).setOrigin(0.5, 0.5)
        this.boardContent = this.boardContent.concat(effectTitle)


        const effectContentString = i18(PANDING_EFFECT_CONFIG[pandingNameKey])
        const effectContent = this.gamingScene.add.text(
            this.initX + 140,
            this.initY,
            splitText(effectContentString, isLanEn() ? PANDING_EFFECT_LENGTH_EN : PANDING_EFFECT_LENGTH_CN), {
                align: 'left',
                fontSize: 12,
                padding: {top: 2}
            }
        ).setDepth(DEPTH_CONFIG.BOARD).setOrigin(0.5, 0.5)
        this.boardContent = this.boardContent.concat(effectContent)
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const pandingEvent = gameStatus?.pandingEvent;
        if (isEqual(this._pandingEvent, pandingEvent)) {
            return;
        }

        const pandingNameKey = pandingEvent?.pandingNameKey
        const showBoard = !!pandingNameKey
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
            }, 3000) as unknown as number
        }

        this._pandingEvent = cloneDeep(pandingEvent);
    }
}