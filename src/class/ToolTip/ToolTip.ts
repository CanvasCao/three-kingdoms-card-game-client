import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {uuidv4} from "../../utils/uuid";
import {GameFEStatus} from "../../types/gameFEStatus";
import {Card} from "../../types/card";
import {TOOL_TIP_CARD_TYPE} from "../../config/toolTipConfig";
import {GameStatus} from "../../types/gameStatus";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";

export class ToolTip {
    obId: string;
    gamingScene: GamingScene;

    show: boolean;

    initX: number;
    initY: number;

    boardSize: { height: number, width: number };
    text?: Phaser.GameObjects.Text;
    bgLine?: Phaser.GameObjects.Graphics;
    bgFill?: Phaser.GameObjects.Graphics;
    timer?: number;
    card?: Card;
    toolTipType: string;

    // innerState
    _heroId: string

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene

        this.show = false;

        this.initX = sizeConfig.playersArea.width / 2;
        this.initY = sizeConfig.playersArea.height / 2;

        this.boardSize = {height: 200, width: 200};

        this.text;
        this.bgLine;
        this.bgFill;
        this.timer;
        this.card;
        this.toolTipType = '';

        this._heroId = ''

        this.drawBackground();
        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
        this.gamingScene.gameFEStatusObserved.addPublicCardsObserver(this);
    }

    drawBackground() {
        this.bgLine = this.gamingScene.add.graphics();
        this.bgFill = this.gamingScene.add.graphics();
        this.bgLine.setDepth(DEPTH_CONFIG.HOVER)
        this.bgFill.setDepth(DEPTH_CONFIG.HOVER)

        this.text = this.gamingScene.add.text(this.initX, this.initY, '')
        this.text.setPadding(0, 6, 0, 1);
        this.text.setAlpha(0);
        this.text.setFontSize(14)
        this.text.setDepth(DEPTH_CONFIG.HOVER)
    }

    hoverInToShowToolTip({card, text, toolTipType, x, y}: { card?: Card, text: string, toolTipType: string, x: number, y: number }) {
        this.card = card;
        this.toolTipType = toolTipType;
        this._clearTimer();

        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
        // 选中的牌/装备 hover不可以有提示
        if ([TOOL_TIP_CARD_TYPE.CARD, TOOL_TIP_CARD_TYPE.EQUIPMENT].includes(toolTipType) &&
            gameFEStatus.selectedCards.map((c) => c.cardId).includes(card!.cardId)) {
            return
        }

        this.timer = setTimeout(() => {
            const fixedX = x; // 左Origin(0, 1); 右Origin(1, 1);
            (fixedX <= sizeConfig.playersArea.width / 2) ? this.text?.setOrigin(0, 1) : this.text?.setOrigin(1, 1)
            if (toolTipType === TOOL_TIP_CARD_TYPE.PLAYER) {
                this.text?.setOrigin(0.5, 1)
            }

            let offsetY = 0;
            if ([TOOL_TIP_CARD_TYPE.CARD, TOOL_TIP_CARD_TYPE.PUBLIC_CARD].includes(toolTipType)) {
                offsetY = -sizeConfig.controlCard.height / 2 - 10
            } else if (toolTipType == TOOL_TIP_CARD_TYPE.EQUIPMENT) {
                offsetY = -20
            } else if (toolTipType == TOOL_TIP_CARD_TYPE.SELECTING_HERO) {
                offsetY = -sizeConfig.selectHeroCard.height / 2 - 10
            }
            const fixedY = y + offsetY;
            this.text?.setAlpha(1)
            this.text?.setX(fixedX)
            this.text?.setY(fixedY)
            this.text?.setText(text)

            const bound = this.text?.getBounds()!
            const margin = 5
            const boundx = bound.x - margin
            const boundy = bound.y - margin
            const boundw = bound.width + margin * 2
            const boundh = bound.height + margin * 2

            this.bgLine?.lineStyle(2, Number(COLOR_CONFIG.card), 1);
            this.bgLine?.strokeRoundedRect(boundx, boundy, boundw, boundh, 2);
            this.bgFill?.fillStyle(Number(COLOR_CONFIG.black), 0.7);
            this.bgFill?.fillRoundedRect(boundx, boundy, boundw, boundh, 2);
            this.show = true;
        }, 1000) as unknown as number
    }

    clearAll() {
        this.show = false
        this.text?.setAlpha(0)
        this.bgLine?.clear()
        this.bgFill?.clear()
        this._clearTimer()
    }

    _clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        if (this._heroId) {
            return
        }

        const curheroId = gameStatus.players[getMyPlayerId()].heroId;
        if (curheroId) {
            this.clearAll()
        }

        this._heroId = curheroId
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        if (this.toolTipType == TOOL_TIP_CARD_TYPE.PUBLIC_CARD &&
            !gameFEStatus.publicCards.map((c) => c.cardId).includes(this.card!.cardId)) {
            this.clearAll()
        } else if ([TOOL_TIP_CARD_TYPE.CARD, TOOL_TIP_CARD_TYPE.EQUIPMENT].includes(this.toolTipType) &&
            gameFEStatus.selectedCards.map((c) => c.cardId).includes(this.card!.cardId)) {
            this.clearAll()
        }
    }
}