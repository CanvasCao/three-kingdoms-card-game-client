import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {getI18Lan, i18, I18LANS} from "../../i18n/i18nUtils";
import {BASIC_CARDS_DESC_CONFIG, CARD_DESC_CONFIG} from "../../config/cardDescConfig";
import {uuidv4} from "../../utils/uuid";
import {GameFEStatus} from "../../types/gameFEStatus";
import {Card} from "../../types/card";

export class HoverBoard {
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
    card?: Card | null;

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

        this.drawBackground();
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
        this.gamingScene.gameFEStatusObserved.addPublicCardsObserver(this);
    }

    drawBackground() {
        this.bgLine = this.gamingScene.add.graphics();
        this.bgFill = this.gamingScene.add.graphics();
        this.bgLine.setDepth(DEPTH_CONFIG.HOVER)
        this.bgFill.setDepth(DEPTH_CONFIG.HOVER)

        this.text = this.gamingScene.add.text(
            this.initX,
            this.initY,
            BASIC_CARDS_DESC_CONFIG.SHA.EN
        )
        this.text.setPadding(0, 6, 0, 1);
        this.text.setAlpha(0);
        this.text.setFontSize((getI18Lan() == I18LANS.EN) ? 14 : 14)
        this.text.setDepth(DEPTH_CONFIG.HOVER)
    }

    hoverInStartToShowBoard({card, x, y}: { card: Card, x: number, y: number }) {
        this.card = card;
        this._clearTimer();
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        // 只有没选中的牌才可以有提示
        if (gameFEStatus.selectedCards.map((c) => c.cardId).includes(card.cardId)) {
            return
        }

        this.timer = setTimeout(() => {
            const fixedX = x; // 左Origin(0, 1); 右Origin(1, 1);
            fixedX <= sizeConfig.playersArea.width / 2 ? this.text?.setOrigin(0, 1) : this.text?.setOrigin(1, 1)

            const fixedY = y - sizeConfig.controlCard.height / 2 - 10;
            this.text?.setAlpha(1)
            this.text?.setX(fixedX)
            this.text?.setY(fixedY)
            this.text?.setText(i18(CARD_DESC_CONFIG[card.key]))

            const bound = this.text?.getBounds()!
            const margin = 5
            const boundx = bound.x - margin
            const boundy = bound.y - margin
            const boundw = bound.width + margin * 2
            const boundh = bound.height + margin * 2

            this.bgLine?.setAlpha(1);
            this.bgFill?.setAlpha(1);
            this.bgLine?.clear();
            this.bgFill?.clear();
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
        this.card = null;
        this._clearTimer()
    }

    _clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        if (!this.card) {
            return
        }

        // 手牌被选中/public card被清除
        if (
            gameFEStatus.selectedCards.map((c) => c.cardId).includes(this.card.cardId) ||
            !gameFEStatus.publicCards.map((c) => c.cardId).includes(this.card.cardId)
        ) {
            this.clearAll()
        }
    }
}