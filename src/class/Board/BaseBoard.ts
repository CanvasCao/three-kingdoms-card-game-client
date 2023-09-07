import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {isLanEn} from "../../i18n/i18nUtils";


type BaseBoardProps = {
    boardSize: { height: number, width: number },
}

export class BaseBoard {
    gamingScene: GamingScene;

    initX: number;
    initY: number;

    show: boolean;

    boardSize: { height: number, width: number }

    boardImg?: Phaser.GameObjects.Image;
    titleText?: Phaser.GameObjects.Text;
    bottomText?: Phaser.GameObjects.Text;
    border?: Phaser.GameObjects.Graphics;

    dragObjects: PhaserGameObject[];

    constructor(gamingScene: GamingScene, {boardSize}: BaseBoardProps) {
        this.gamingScene = gamingScene

        this.initX = sizeConfig.playersArea.width / 2;
        this.initY = sizeConfig.playersArea.height / 2;

        this.show = false;

        this.boardSize = boardSize;

        this.boardImg;

        this.dragObjects = [];
    }

    drawBackground() {
        this.boardImg = this.gamingScene.add.image(this.initX, this.initY, 'white')
        this.boardImg.setTint(Number(COLOR_CONFIG.boardBg))
        this.boardImg.displayHeight = this.boardSize.height;
        this.boardImg.displayWidth = this.boardSize.width;
        this.boardImg.setDepth(DEPTH_CONFIG.BOARD)
        this.boardImg.setInteractive({draggable: true, cursor: "grab"});
        this.dragObjects.push(this.boardImg);


        this.border = this.gamingScene.add.graphics();
        const lineWidth = 3; // 描边线的宽度
        this.border.lineStyle(lineWidth, Number(COLOR_CONFIG.white), 1);
        this.border.strokeRoundedRect(this.boardImg.x - this.boardImg.displayWidth / 2 - lineWidth / 2,
            this.boardImg.y - this.boardImg.displayHeight / 2 - lineWidth / 2,
            this.boardImg.displayWidth + lineWidth,
            this.boardImg.displayHeight + lineWidth, 10);
        this.border.setDepth(DEPTH_CONFIG.BOARD)
        this.dragObjects.push(this.border);
    }

    drawTitle() {
        this.titleText = this.gamingScene.add.text(this.initX, this.initY - 158, '')
        this.titleText.setOrigin(0.5, 0.5)
        this.titleText.setPadding(0, 2, 0, 0)
        this.titleText.setDepth(DEPTH_CONFIG.BOARD)
        this.titleText.setFontSize(isLanEn() ? 18 : 24)

        this.dragObjects.push(this.titleText);
    }

    drawBottom() {
        this.bottomText = this.gamingScene.add.text(this.initX, this.initY + 158, '', {align: "center"})
        this.bottomText.setOrigin(0.5, 0.5)
        this.bottomText.setPadding(0, 2, 0, 0)
        this.bottomText.setDepth(DEPTH_CONFIG.BOARD)

        this.dragObjects.push(this.bottomText);
    }

    addContent(boardContent: PhaserGameObject[]) {
        boardContent.forEach((obj) => {
            this.dragObjects.push(obj);
        })
    }

    setTitle(text: string) {
        this.titleText?.setText(text)
    }

    setBottom(text: string) {
        this.bottomText?.setText(text)
    }

    removeContent() {
        this.dragObjects.forEach((obj) => {
            obj.destroy();
        })
    }

    showBoard() {
        this.show = true;
        this.drawBackground();
        this.drawTitle();
        this.drawBottom();
        this.bindDragEvent();
    }

    hideBoard() {
        this.show = false
        this.removeContent()
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