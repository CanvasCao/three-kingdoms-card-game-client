import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId, uuidv4} from "../utils/utils";

export class ControlButtons {
    constructor(gamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;

        this.cardX = sizeConfig.background.width / 2;
        this.cardY = sizeConfig.background.height - sizeConfig.controlCard.height;
        this.group = this.gamingScene.add.group();

        this.drawOkButton();
        // this.drawEndButton();
        this.drawCancelButton();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addObserver(this);
    }


    drawOkButton() {
        this.okBtnStroke = this.gamingScene.add.graphics();
        this.okBtnStroke.lineStyle(2, 0x000000, 1);
        this.okBtnStroke.strokeRect(this.cardX - 50 - sizeConfig.okBtn.width / 2,
            this.cardY - 60 - sizeConfig.okBtn.height / 2,
            sizeConfig.okBtn.width,
            sizeConfig.okBtn.height);

        this.okText = this.gamingScene.add.text(
            this.cardX - 50,
            this.cardY - 60,
            '确定',
            {fill: "#000", align: "center"}
        )
        this.okText.setPadding(0, 5, 0, 0);
        this.okText.setOrigin(0.5, 0.5);
        this.group.add(this.okBtnStroke)
        this.group.add(this.okText)
    }

    drawCancelButton() {
        this.cancelBtnStroke = this.gamingScene.add.graphics();
        this.cancelBtnStroke.lineStyle(2, 0x000000, 1);
        this.cancelBtnStroke.strokeRect(this.cardX + 50 - sizeConfig.cancelBtn.width / 2,
            this.cardY - 60 - sizeConfig.cancelBtn.height / 2,
            sizeConfig.cancelBtn.width,
            sizeConfig.cancelBtn.height);

        this.cancelText = this.gamingScene.add.text(
            this.cardX + 50,
            this.cardY - 60,
            '取消',
            {fill: "#000", align: "center"}
        )
        this.cancelText.setPadding(0, 5, 0, 0);
        this.cancelText.setOrigin(0.5, 0.5);
        this.group.add(this.cancelBtnStroke)
        this.group.add(this.cancelText)
    }

    bindEvent() {
    }

    gameStatusNotify(gameStatus) {
        this.group.getChildren().forEach((child) => {
            this.gamingScene.tweens.add({
                targets: child,
                alpha: {
                    value: (gameStatus.stage.userId == getMyUserId() && gameStatus.stage.stageName == 'play') ? 1 : 0,
                    duration:0
                },
                onComplete: () => {
                }
            });
        });
    }

    gameFEStatusNotify(gameFEStatus) {
    }
}
