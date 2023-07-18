import {GameStatus} from "../../types/gameStatus";
import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitHeroSelectBoardData} from "../../types/emit";
import {uuidv4} from "../../utils/uuid";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";

const boardSize = {
    height: 380,
    width: 490,
}
const cardMargin = 10

const gridOffset = {
    line1: {y: -55},
    line2: {y: -55 + sizeConfig.controlCard.height + cardMargin},
}

export class HeroSelectBoard {
    obId: string;
    gamingScene: GamingScene;

    initX: number;
    initY: number;

    isShow: boolean;

    maskImg?: Phaser.GameObjects.Image;
    boardImg?: Phaser.GameObjects.Image;
    titleText?: Phaser.GameObjects.Text;
    graphics?: Phaser.GameObjects.Graphics;

    dragObjects: (Phaser.GameObjects.Image | Phaser.GameObjects.Text | Phaser.GameObjects.Graphics)[];
    destoryObjects: (Phaser.GameObjects.Image | Phaser.GameObjects.Text | Phaser.GameObjects.Graphics)[];

    // innerState
    _heroId: string;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.maskImg;

        this.initX = sizeConfig.playersArea.width / 2;
        this.initY = sizeConfig.playersArea.height / 2;

        this.isShow = false;
        this.maskImg;
        this.boardImg;

        this.dragObjects = [];
        this.destoryObjects = [];

        this._heroId = '';


        this.drawBackground();
        this.drawTitle();

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawBackground() {
        this.maskImg = this.gamingScene.add.image(0, 0, 'white').setInteractive()
        this.maskImg.displayHeight = sizeConfig.background.height;
        this.maskImg.displayWidth = sizeConfig.background.width;
        this.maskImg.setAlpha(0)
        this.maskImg.setOrigin(0, 0)
        this.maskImg.setDepth(DEPTH_CONFIG.BOARD)


        this.boardImg = this.gamingScene.add.image(this.initX, this.initY, 'white')
        this.boardImg.setTint(Number(COLOR_CONFIG.grey111))
        this.boardImg.displayHeight = boardSize.height;
        this.boardImg.displayWidth = boardSize.width;
        this.boardImg.setAlpha(0)
        this.boardImg.setDepth(DEPTH_CONFIG.BOARD)
        this.boardImg.setInteractive({draggable: true, cursor: "grab"});
        this.dragObjects.push(this.boardImg);

        this.graphics = this.gamingScene.add.graphics();
        const lineWidth = 2; // 描边线的宽度
        this.graphics.lineStyle(lineWidth, Number(COLOR_CONFIG.line), 1);
        this.graphics.strokeRect(this.boardImg.x - this.boardImg.displayWidth / 2 - lineWidth / 2,
            this.boardImg.y - this.boardImg.displayHeight / 2 - lineWidth / 2,
            this.boardImg.displayWidth + lineWidth,
            this.boardImg.displayHeight + lineWidth);
        this.graphics.setAlpha(0)
        this.graphics.setDepth(DEPTH_CONFIG.BOARD)
        this.dragObjects.push(this.graphics);

        // @ts-ignore
        this.gamingScene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            const deltaX = dragX - gameObject.x;
            const deltaY = dragY - gameObject.y;
            this.dragObjects.forEach(obj => {
                obj.x += deltaX;
                obj.y += deltaY;
            });
        });
    }

    drawTitle() {
        this.titleText = this.gamingScene.add.text(this.initX, this.initY - 158, '选将')
        this.titleText.setOrigin(0.5, 0.5)
        this.titleText.setAlpha(0)
        this.titleText.setPadding(0, 2, 0, 0)
        this.titleText.setDepth(DEPTH_CONFIG.BOARD)

        this.dragObjects.push(this.titleText);
    }


    drawHeroCards(gameStatus: GameStatus) {
        const heroList = gameStatus.players[getMyPlayerId()].canSelectHeroIds;

        [...heroList].forEach((heroId, index) => {
            const offsetY = (index) > 3 ? gridOffset.line2.y : gridOffset.line1.y;
            const modIndex = index % 4;

            const cardImgObj = this.gamingScene.add.image(
                this.initX + -140 + modIndex * (sizeConfig.selectHero.width + cardMargin),
                this.initY + offsetY,
                heroId).setInteractive({cursor: "pointer"});
            cardImgObj.displayHeight = sizeConfig.selectHero.height;
            cardImgObj.displayWidth = sizeConfig.selectHero.width;
            cardImgObj.setDepth(DEPTH_CONFIG.BOARD)

            this.destoryObjects.push(cardImgObj);
            this.dragObjects.push(cardImgObj);

            cardImgObj.on('pointerdown', () => {
                    this.gamingScene.socket.emit(
                        EMIT_TYPE.HERO_SELECT_BOARD_ACTION,
                        this.getEmitHeroSelectBoardData(heroId)
                    )
                }
            )
        })
    }

    showBoard(show: boolean) {
        this.maskImg!.setAlpha(show ? 0.0001 : 0) // 配合setInteractive 阻止冒泡
        this.boardImg!.setAlpha(show ? 1 : 0)
        this.titleText!.setAlpha(show ? 1 : 0);
        this.graphics!.setAlpha(show ? 1 : 0);
    }

    destoryCards() {
        this.destoryObjects.forEach((o) => o.destroy());
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

        if (!heroId) {
            this.showBoard(true);
            this.drawHeroCards(gameStatus);
            this.isShow = true // 防止重复drawHeroCards
        } else if (!this._heroId && heroId) {
            this.showBoard(false);
            this.destoryCards();
            this.isShow = false
        }

        this._heroId = heroId
    }
}