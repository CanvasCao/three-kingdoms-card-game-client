import {Card, GameStatus} from "../../types/gameStatus";
import {GamingScene} from "../../types/phaser";
import sizeConfig from "../../config/sizeConfig.json";
import colorConfig from "../../config/colorConfig.json";
import {getMyPlayerId, uuidv4} from "../../utils/gameStatusUtils";
import {SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {sharedDrawFrontCard} from "../../utils/drawCardUtils";
import emitMap from "../../config/emitMap.json";
import {EmitWugufengdengData} from "../../types/emit";

const boardSize = {
    height: 320,
    width: 420,
}
const boardAlpha = 0.4;
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
    _stageId: string;
    _isEffect: boolean | undefined;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.maskImg;

        this.initX = sizeConfig.background.width / 2;
        this.initY = sizeConfig.background.height / 2 - 50;

        this.maskImg;
        this.boardImg;

        this.cardMessageObjs = [];
        this.destoryObjects = [];

        this._stageId = '';
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
        this.titleText = this.gamingScene.add.text(this.initX, this.initY - 138, '五谷丰登')
        this.titleText.setOrigin(0.5, 0.5)
        this.titleText.setAlpha(0)
        this.titleText.setPadding(0, 2, 0, 0)
        this.titleText.setDepth(boardDepth)
    }

    drawBottomText() {
        this.bottomText = this.gamingScene.add.text(this.initX, this.initY + 138, '')
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
                    if (gameStatus.scrollResStages?.[0].originId !== getMyPlayerId()) {
                        return;
                    }
                    if (gameStatus.wuxieSimultaneousResStage.hasWuxiePlayerIds.length > 0) {
                        return
                    }
                    if (card.wugefengdengSelectedPlayerId) {
                        return;
                    }
                    this.gamingScene.socket.emit(
                        emitMap.WUGU_BOARD_ACTION,
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

        if (gameStatus.wuxieSimultaneousResStage.hasWuxiePlayerIds.includes(getMyPlayerId())) {
            this.maskImg!.disableInteractive()
        } else {
            this.maskImg!.setInteractive()
        }

        if (show) {
            const hasWuxiePlayer = gameStatus.wuxieSimultaneousResStage.hasWuxiePlayerIds.length > 0;
            const originId = gameStatus.scrollResStages?.[0]?.originId;
            const bottomText = hasWuxiePlayer ?
                `${gameStatus.players[originId].name}即将选牌，正在询问无懈可击` :
                `${gameStatus.players[originId].name}正在选牌`
            this.bottomText?.setText(bottomText)
        }
    }

    updateCards(gameStatus: GameStatus) {
        this.destoryCards();
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
        const curScrollResStage = gameStatus.scrollResStages?.[0];
        const stageId = curScrollResStage?.stageId || '';
        const isEffect = curScrollResStage?.isEffect || undefined;
        if (this._stageId === stageId && this._isEffect === isEffect) {
            return;
        }

        const showBoard = curScrollResStage && curScrollResStage.actualCard.CN == SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.CN

        if (showBoard) {
            this.showBoard(true, gameStatus);
            this.updateCards(gameStatus);
        } else {
            this.showBoard(false, gameStatus);
            this.destoryCards();
        }

        this._stageId = stageId;
        this._isEffect = isEffect;
    }
}