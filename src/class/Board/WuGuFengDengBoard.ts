import {GameStatus} from "../../types/gameStatus";
import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import colorConfig from "../../config/colorConfig.json";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {CARD_CONFIG, SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitWugufengdengData} from "../../types/emit";
import {uuidv4} from "../../utils/uuid";
import {i18} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {getPlayerDisplayName} from "../../utils/playerUtils";
import {Card} from "../../types/card";

const boardSize = {
    height: 380,
    width: 420,
}
const boardAlpha = 0.8;
const boardDepth = 100;
const cardMargin = 5

const gridOffset = {
    line1: {y: -55},
    line2: {y: -55 + sizeConfig.controlCard.height + cardMargin},
}

export class WuGuFengDengBoard {
    obId: string;
    gamingScene: GamingScene;

    initX: number;
    initY: number;

    maskImg?: Phaser.GameObjects.Image;
    boardImg?: Phaser.GameObjects.Image;
    titleText?: Phaser.GameObjects.Text;
    bottomText?: Phaser.GameObjects.Text;

    cardMessageObjs: Phaser.GameObjects.Text[];
    destoryObjects: (Phaser.GameObjects.Image | Phaser.GameObjects.Text)[];

    // innerState 联合主键
    _boardObserveId: string;
    _isEffect: boolean | undefined;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.maskImg;

        this.initX = sizeConfig.playersArea.width / 2;
        this.initY = sizeConfig.playersArea.height / 2;

        this.maskImg;
        this.boardImg;

        this.cardMessageObjs = [];
        this.destoryObjects = [];

        this._boardObserveId = '';
        this._isEffect = undefined;


        this.drawBackground();
        this.drawTitle();
        this.drawBottomText();

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawBackground() {
        this.maskImg = this.gamingScene.add.image(0, 0, 'white').setInteractive()
        this.maskImg.displayHeight = sizeConfig.background.height;
        this.maskImg.displayWidth = sizeConfig.background.width;
        this.maskImg.setAlpha(0)
        this.maskImg.setOrigin(0, 0)
        this.maskImg.setDepth(boardDepth)

        this.boardImg = this.gamingScene.add.image(this.initX, this.initY, 'white')
        // @ts-ignore
        this.boardImg.setTint("0x000000")
        this.boardImg.displayHeight = boardSize.height;
        this.boardImg.displayWidth = boardSize.width;
        this.boardImg.setAlpha(0)
        this.boardImg.setDepth(boardDepth)
    }

    drawTitle() {
        this.titleText = this.gamingScene.add.text(this.initX, this.initY - 158,
            i18(CARD_CONFIG.WU_GU_FENG_DENG)
        )
        this.titleText.setOrigin(0.5, 0.5)
        this.titleText.setAlpha(0)
        this.titleText.setPadding(0, 2, 0, 0)
        this.titleText.setDepth(boardDepth)
    }

    drawBottomText() {
        this.bottomText = this.gamingScene.add.text(this.initX, this.initY + 158, '', {align: "center"})
        this.bottomText.setOrigin(0.5, 0.5)
        this.bottomText.setAlpha(0)
        this.bottomText.setPadding(0, 2, 0, 0)
        this.bottomText.setDepth(boardDepth)
    }

    drawWugufengdengCards(gameStatus: GameStatus) {
        gameStatus.wugufengdengCards.forEach((card, index) => {
            const offsetY = (index) > 3 ? gridOffset.line2.y : gridOffset.line1.y;
            const modIndex = index % 4;
            const {cardNameObj, cardHuaseNumberObj, cardImgObj, cardMessageObj} = sharedDrawFrontCard(this.gamingScene, card, {
                x: this.initX - 125 + modIndex * (sizeConfig.controlCard.width + cardMargin),
                y: this.initY + offsetY,
                depth: boardDepth,
                message: card.wugefengdengSelectedPlayerId ? gameStatus.players[card.wugefengdengSelectedPlayerId].name : '',
            })

            if (card.wugefengdengSelectedPlayerId) {
                // @ts-ignore
                cardImgObj.setTint(colorConfig.disableCard)
            }
            this.destoryObjects.push(cardNameObj);
            this.destoryObjects.push(cardHuaseNumberObj);
            this.destoryObjects.push(cardImgObj);
            this.destoryObjects.push(cardMessageObj);

            cardImgObj.on('pointerdown', () => {
                    if (gameStatus.scrollResponses?.[0].originId !== getMyPlayerId()) {
                        return;
                    }
                    if (gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.length > 0) {
                        return
                    }
                    if (card.wugefengdengSelectedPlayerId) {
                        return;
                    }
                    if (!gameStatus.scrollResponses?.[0].isEffect) {
                        return;
                    }
                    this.gamingScene.socket.emit(
                        EMIT_TYPE.WUGU_BOARD_ACTION,
                        this.getEmitWugufengdengData(card)
                    )
                }
            )
        })
    }

    showBoard(show: boolean, gameStatus: GameStatus) {
        this.maskImg!.setAlpha(show ? 0.0001 : 0) // 配合setInteractive 阻止冒泡
        this.boardImg!.setAlpha(show ? boardAlpha : 0)
        this.titleText!.setAlpha(show ? 1 : 0);
        this.bottomText!.setAlpha(show ? 1 : 0);

        if (gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.includes(getMyPlayerId())) {
            this.maskImg!.disableInteractive()
        } else {
            this.maskImg!.setInteractive()
        }

        if (show) {
            const hasWuxiePlayer = gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.length > 0;
            const originId = gameStatus.scrollResponses?.[0]?.originId;
            const bottomText = hasWuxiePlayer ?
                i18(i18Config.WU_GU_FENG_DENG_WAIT_WU_XIE, {name: getPlayerDisplayName(gameStatus, originId)}) :
                i18(i18Config.WU_GU_FENG_DENG_CHOOSING, {name: getPlayerDisplayName(gameStatus, originId)})
            this.bottomText?.setText(bottomText)
        }
    }

    drawCards(gameStatus: GameStatus) {
        this.drawWugufengdengCards(gameStatus);
    }

    destoryCards() {
        this.destoryObjects.forEach((o) => o.destroy());
    }

    getEmitWugufengdengData(card: Card): EmitWugufengdengData {
        return {
            playerId: getMyPlayerId(),
            card: card,
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const curScrollResponse = gameStatus.scrollResponses?.[0];
        const boardObserveId = curScrollResponse?.boardObserveId || '';
        const isEffect = curScrollResponse?.isEffect || undefined;
        if (this._boardObserveId === boardObserveId && this._isEffect === isEffect) {
            return;
        }

        const showBoard = curScrollResponse?.actualCard?.CN === SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.CN

        if (showBoard) {
            this.showBoard(true, gameStatus);
            this.drawCards(gameStatus);
        } else {
            this.showBoard(false, gameStatus);
            this.destoryCards();
        }

        this._boardObserveId = boardObserveId;
        this._isEffect = isEffect;
    }
}