import {GameStatus} from "../../types/gameStatus";
import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitHeroSelectBoardData} from "../../types/emit";
import {uuidv4} from "../../utils/uuid";
import {DEPTH_CONFIG} from "../../config/depthConfig";

const boardSize = {
    height: 380,
    width: 490,
}
const boardAlpha = 0.8;
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

    maskImg?: Phaser.GameObjects.Image;
    boardImg?: Phaser.GameObjects.Image;
    titleText?: Phaser.GameObjects.Text;

    destoryObjects: (Phaser.GameObjects.Image | Phaser.GameObjects.Text)[];

    // innerState
    _heroId: string;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.maskImg;

        this.initX = sizeConfig.playersArea.width / 2;
        this.initY = sizeConfig.playersArea.height / 2;

        this.maskImg;
        this.boardImg;

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
        // @ts-ignore
        this.boardImg.setTint("0x000000")
        this.boardImg.displayHeight = boardSize.height;
        this.boardImg.displayWidth = boardSize.width;
        this.boardImg.setAlpha(0)
        this.boardImg.setDepth(DEPTH_CONFIG.BOARD)
    }

    drawTitle() {
        this.titleText = this.gamingScene.add.text(this.initX, this.initY - 158, '选将')
        this.titleText.setOrigin(0.5, 0.5)
        this.titleText.setAlpha(0)
        this.titleText.setPadding(0, 2, 0, 0)
        this.titleText.setDepth(DEPTH_CONFIG.BOARD)
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
        this.boardImg!.setAlpha(show ? boardAlpha : 0)
        this.titleText!.setAlpha(show ? 1 : 0);
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
        } else if (!this._heroId && heroId) {
            this.showBoard(false);
            this.destoryCards();
        }

        this._heroId = heroId
    }
}