import sizeConfig from "../config/sizeConfig.json";
import textConfig from "../config/textConfig.json";
import {getIsMyPlayTurn, getIsMyResponseTurn, getCanPlayInMyTurn, getMyUserId, uuidv4} from "../utils/utils";
import {socket} from "../socket";
import emitMap from "../config/emitMap.json";

export class ControlButtons {
    constructor(gamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;

        this.cardBtnsX = sizeConfig.background.width / 2;
        this.cardBtnsY = sizeConfig.background.height - sizeConfig.controlCard.height - sizeConfig.background.height * 0.12;
        this.btnRightOffset = 180;

        this.prev_isMyPlayTurn = false;

        this.okBtnGroup = {};
        this.cancelBtnGroup = {};
        this.endBtnGroup = {};

        this.drawOkButton();
        this.drawEndButton();
        this.drawCancelButton();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addObserver(this);
    }


    drawOkButton() {
        this.okBtnImg = this.gamingScene.add.image(
            this.cardBtnsX,
            this.cardBtnsY,
            'white').setInteractive({cursor: 'pointer'});
        this.okBtnImg.displayHeight = sizeConfig.okBtn.height;
        this.okBtnImg.displayWidth = sizeConfig.okBtn.width;
        this.okBtnImg.setAlpha(0)
        this.okBtnGroup.img = this.okBtnImg

        this.okText = this.gamingScene.add.text(
            this.cardBtnsX,
            this.cardBtnsY,
            textConfig.OK.CH,
            {fill: "#fff", align: "center"}
        )
        this.okText.setPadding(0, 5, 0, 0);
        this.okText.setOrigin(0.5, 0.5);
        this.okText.setAlpha(0)
        this.okBtnGroup.text = this.okText
    }

    drawCancelButton() {
        this.cancelBtnImg = this.gamingScene.add.image(
            this.cardBtnsX + this.btnRightOffset,
            this.cardBtnsY,
            'white').setInteractive({cursor: 'pointer'});
        this.cancelBtnImg.displayHeight = sizeConfig.cancelBtn.height;
        this.cancelBtnImg.displayWidth = sizeConfig.cancelBtn.width;
        this.cancelBtnImg.setAlpha(0)
        this.cancelBtnGroup.img = this.cancelBtnImg

        this.cancelText = this.gamingScene.add.text(
            this.cardBtnsX + this.btnRightOffset,
            this.cardBtnsY,
            textConfig.CANCEL.CH,
            {fill: "#fff", align: "center"}
        )
        this.cancelText.setPadding(0, 5, 0, 0);
        this.cancelText.setOrigin(0.5, 0.5);
        this.cancelText.setAlpha(0)
        this.cancelBtnGroup.text = this.cancelText
    }

    drawEndButton() {
        this.endBtnImg = this.gamingScene.add.image(
            this.cardBtnsX + this.btnRightOffset,
            this.cardBtnsY,
            'white').setInteractive({cursor: 'pointer'});
        this.endBtnImg.displayHeight = sizeConfig.endRoundBtn.height;
        this.endBtnImg.displayWidth = sizeConfig.endRoundBtn.width;
        this.endBtnImg.setAlpha(0)
        this.endBtnGroup.img = this.endBtnImg

        this.endBtnText = this.gamingScene.add.text(
            this.cardBtnsX + this.btnRightOffset,
            this.cardBtnsY,
            textConfig.END.CH,
            {fill: "#fff", align: "center"}
        )
        this.endBtnText.setPadding(0, 5, 0, 0);
        this.endBtnText.setOrigin(0.5, 0.5);
        this.endBtnText.setAlpha(0)
        this.endBtnGroup.text = this.endBtnText
    }

    bindEvent() {
        this.cancelBtnImg.on('pointerdown', () => {
            this.gamingScene.gameFEStatusObserved.resetGameEFStatus();
        });

        this.okBtnImg.on('pointerdown', () => {
            const gameFEgameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus
            if (!this.canClickOkBtnInMyPlayStage(gameFEgameFEStatus)) {
                return
            }

            this.gamingScene.socket.emit(
                emitMap.ACTION,
                {
                    cards: gameFEgameFEStatus.selectedCards,
                    actionCardName: gameFEgameFEStatus.selectedCards[0].name,
                    originId: getMyUserId(),
                    targetId: gameFEgameFEStatus.selectedTargetUsers[0].userId,
                }
            )
            this.gamingScene.gameFEStatusObserved.resetGameEFStatus();
        });

        this.endBtnImg.on('pointerdown', () => {
            this.gamingScene.socket.emit(emitMap.GO_NEXT_STAGE)
        });
    }

    // show 包含 able
    showBtn(group, cb) {
        this.gamingScene.tweens.add({
            targets: [group.img, group.text],
            alpha: {
                value: 1,
                duration: 50
            },
            onComplete: () => {
                cb && cb()
            }
        });
        group.img.setTint(0xcc0000)
    }

    hideBtn(group, cb) {
        this.gamingScene.tweens.add({
            targets: [group.img, group.text],
            alpha: {
                value: 0,
                duration: 50
            },
            onComplete: () => {
                cb && cb()
            }
        });
    }


    disableBtn(group) {
        group.img.setTint(0xcccccc)
    }

    canClickOkBtnInMyPlayStage(gameFEStatus) {
        return gameFEStatus.selectedCards.length > 0 && gameFEStatus.selectedTargetUsers.length > 0
    }

    canClickOkBtnInMyResponseStage(gameStatus, gameFEStatus) {
        return gameStatus.responseStages?.[0]?.cardNames?.includes(gameFEStatus.selectedCards?.[0]?.name)
    }

    hideAllBtns() {
        this.hideBtn(this.okBtnGroup);
        this.hideBtn(this.cancelBtnGroup)
        this.hideBtn(this.endBtnGroup)
    }

    setButtonStatusByGameStatus(gameStatus) {
        const isMyResponseTurn = getIsMyResponseTurn(gameStatus);
        const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
        this.isMyResponseTurn = isMyResponseTurn
        this.canPlayInMyTurn = canPlayInMyTurn

        if (canPlayInMyTurn) {
            // 我的出牌阶段
            this.showBtn(this.okBtnGroup)
            this.disableBtn(this.okBtnGroup)
            this.showBtn(this.endBtnGroup)
        } else if (isMyResponseTurn) {
            // 我的响应阶段
            this.showBtn(this.okBtnGroup)
            this.disableBtn(this.okBtnGroup)
            this.showBtn(this.cancelBtnGroup)
        } else {
            this.hideAllBtns();
        }
    }

    setButtonStatusByGameFEStatus(gameFEStatus) {
        if (this.canPlayInMyTurn) {
            this.canClickOkBtnInMyPlayStage(gameFEStatus) ? this.showBtn(this.okBtnGroup) : this.disableBtn(this.okBtnGroup)

            if (gameFEStatus.selectedCards.length > 0) {
                this.showBtn(this.cancelBtnGroup)
                this.hideBtn(this.endBtnGroup)
            } else {
                this.hideBtn(this.cancelBtnGroup)
                this.showBtn(this.endBtnGroup)
            }
        } else if (this.isMyResponseTurn) {
            this.canClickOkBtnInMyResponseStage(
                this.gamingScene.gameStatusObserved.gameStatus,
                gameFEStatus) ? this.showBtn(this.okBtnGroup) : this.disableBtn(this.okBtnGroup)

            this.showBtn(this.cancelBtnGroup)
            this.hideBtn(this.endBtnGroup)
        }
    }

    gameStatusNotify(gameStatus) {
        this.setButtonStatusByGameStatus(gameStatus)
    }

    gameFEStatusNotify(gameFEStatus) {
        this.setButtonStatusByGameFEStatus(gameFEStatus);
    }

}
