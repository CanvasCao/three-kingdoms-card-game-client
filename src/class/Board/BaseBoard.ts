import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";


type BaseBoardProps = {
    boardSize: { height: number, width: number },
}

export class BaseBoard {
    gamingScene: GamingScene;

    initX: number;
    initY: number;

    show: boolean;

    boardSize: { height: number, width: number }

    maskImg?: Phaser.GameObjects.Image;
    boardImg?: Phaser.GameObjects.Image;
    titleText?: Phaser.GameObjects.Text;
    border?: Phaser.GameObjects.Graphics;

    dragObjects: (Phaser.GameObjects.Image | Phaser.GameObjects.Text | Phaser.GameObjects.Graphics)[];
    boardContent: (Phaser.GameObjects.Image | Phaser.GameObjects.Text | Phaser.GameObjects.Graphics)[];

    constructor(gamingScene: GamingScene, {boardSize}: BaseBoardProps) {
        this.gamingScene = gamingScene

        this.initX = sizeConfig.playersArea.width / 2;
        this.initY = sizeConfig.playersArea.height / 2;

        this.show = false;

        this.boardSize = boardSize;

        this.maskImg;
        this.boardImg;

        this.dragObjects = [];
        this.boardContent = [];

        this.drawBackground();
        this.drawTitle();
        this.bindDragEvent();
    }

    drawBackground() {
        this.maskImg = this.gamingScene.add.image(0, 0, 'white').setInteractive()
        this.maskImg.displayHeight = sizeConfig.background.height;
        this.maskImg.displayWidth = sizeConfig.background.width;
        this.maskImg.setAlpha(0)
        this.maskImg.setOrigin(0, 0)
        this.maskImg.setDepth(DEPTH_CONFIG.BOARD)


        this.boardImg = this.gamingScene.add.image(this.initX, this.initY, 'white')
        this.boardImg.setTint(Number(COLOR_CONFIG.boardBg))
        this.boardImg.displayHeight = this.boardSize.height;
        this.boardImg.displayWidth = this.boardSize.width;
        this.boardImg.setAlpha(0)
        this.boardImg.setDepth(DEPTH_CONFIG.BOARD)
        this.boardImg.setInteractive({draggable: true, cursor: "grab"});
        this.dragObjects.push(this.boardImg);

        this.border = this.gamingScene.add.graphics();
        const lineWidth = 3; // 描边线的宽度
        this.border.lineStyle(lineWidth, Number(COLOR_CONFIG.white), 1);
        this.border.strokeRoundedRect(this.boardImg.x - this.boardImg.displayWidth / 2 - lineWidth / 2,
            this.boardImg.y - this.boardImg.displayHeight / 2 - lineWidth / 2,
            this.boardImg.displayWidth + lineWidth,
            this.boardImg.displayHeight + lineWidth,10);
        this.border.setAlpha(0)
        this.border.setDepth(DEPTH_CONFIG.BOARD)

        this.dragObjects.push(this.border);
    }

    drawTitle() {
        this.titleText = this.gamingScene.add.text(this.initX, this.initY - 158, '选将')
        this.titleText.setOrigin(0.5, 0.5)
        this.titleText.setAlpha(0)
        this.titleText.setPadding(0, 2, 0, 0)
        this.titleText.setDepth(DEPTH_CONFIG.BOARD)
        this.titleText.setFontSize(24)

        this.dragObjects.push(this.titleText);
    }

    addContent(boardContent: (Phaser.GameObjects.Image | Phaser.GameObjects.Text | Phaser.GameObjects.Graphics)[]) {
        this.boardContent = boardContent
        boardContent.forEach((obj) => {
            obj.setData('insertedContent', true)
            this.dragObjects.push(obj);
        })
    }

    setTitle(title: string) {
        this.titleText?.setText(title)
    }

    removeContent() {
        this.dragObjects = this.dragObjects.filter((obj) => {
            return !obj.getData("insertedContent")
        })
        this.boardContent.forEach((obj) => {
            obj.destroy();
        })
    }

    showBoard() {
        this._showBoard(true)
    }

    hideBoard() {
        this._showBoard(false)
        this.removeContent()
    }

    _showBoard(show: boolean) {
        this.show = show
        this.maskImg!.setAlpha(show ? 0.0001 : 0) // 配合setInteractive 阻止冒泡
        this.boardImg!.setAlpha(show ? 1 : 0)
        this.titleText!.setAlpha(show ? 1 : 0);
        this.border!.setAlpha(show ? 1 : 0);
    }

    bindDragEvent() {
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
}