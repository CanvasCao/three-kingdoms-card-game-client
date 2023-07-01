import {sizeConfig} from "../../config/sizeConfig";
import {EMIT_TYPE} from "../../config/emitConfig";
import {BtnGroup, GamingScene} from "../../types/phaser";
import Phaser from "phaser";
import {GameFEStatus} from "../../types/gameFEStatus";
import {GameStatus} from "../../types/gameStatus";
import {
    generateAction,
    generateYesResponse,
    generateThrowData,
    generateNoResponse
} from "../../utils/emitDataGenerator";
import {getMyResponseInfo, getCanPlayInMyTurn} from "../../utils/stageUtils";
import {getIsMyResponseTurn} from "../../utils/stageUtils";
import {getIsMyThrowTurn} from "../../utils/stageUtils";
import {uuidv4} from "../../utils/uuid";
import {getNeedSelectCardsNumber, getSelectedCardNumber, getSelectedTargetNumber} from "../../utils/validationUtils";
import {i18} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {BaseResponseInfo} from "../../types/responseInfo";
import {getTargetPlayersNumberMinMax} from "../../utils/playerUtils";

export class ControlButtons {
    obId: string;
    gamingScene: GamingScene;

    cardBtnsX: number;
    cardBtnsY: number;
    btnOffset: number;
    endBtnOffset: number;

    _isMyResponseTurn?: boolean;
    _canPlayInMyTurn?: boolean;
    _isMyThrowTurn?: boolean;

    okBtnGroup: BtnGroup;
    cancelBtnGroup: BtnGroup;
    endBtnGroup: BtnGroup;

    okBtnImg?: Phaser.GameObjects.Image;
    okText?: Phaser.GameObjects.Text;
    cancelBtnImg?: Phaser.GameObjects.Image;
    cancelText?: Phaser.GameObjects.Text;
    endBtnImg?: Phaser.GameObjects.Image;
    endText?: Phaser.GameObjects.Text;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;

        this.cardBtnsX = sizeConfig.playersArea.width / 2;
        this.cardBtnsY = sizeConfig.playersArea.height - sizeConfig.background.height * 0.04;
        this.btnOffset = 100;
        this.endBtnOffset = 150;

        this._isMyResponseTurn;
        this._canPlayInMyTurn;
        this._isMyThrowTurn;

        this.okBtnGroup = {};
        this.cancelBtnGroup = {};
        this.endBtnGroup = {};

        this.drawOkButton();
        this.drawEndButton();
        this.drawCancelButton();
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }


    drawOkButton() {
        this.okBtnImg = this.gamingScene.add.image(
            this.cardBtnsX - this.btnOffset,
            this.cardBtnsY,
            'white').setInteractive();
        this.okBtnImg.displayHeight = sizeConfig.okBtn.height;
        this.okBtnImg.displayWidth = sizeConfig.okBtn.width;
        this.okBtnImg.setAlpha(0)
        this.okBtnGroup.img = this.okBtnImg

        this.okText = this.gamingScene.add.text(
            this.cardBtnsX - this.btnOffset,
            this.cardBtnsY,
            i18(i18Config.OK),
            // @ts-ignore
            {fill: "#fff", align: "center"}
        )
        this.okText.setPadding(0, 5, 0, 0);
        this.okText.setOrigin(0.5, 0.5);
        this.okText.setAlpha(0)
        this.okBtnGroup.text = this.okText
    }

    drawCancelButton() {
        this.cancelBtnImg = this.gamingScene.add.image(
            this.cardBtnsX + this.btnOffset,
            this.cardBtnsY,
            'white').setInteractive();
        this.cancelBtnImg.displayHeight = sizeConfig.cancelBtn.height;
        this.cancelBtnImg.displayWidth = sizeConfig.cancelBtn.width;
        this.cancelBtnImg.setAlpha(0)
        this.cancelBtnGroup.img = this.cancelBtnImg

        this.cancelText = this.gamingScene.add.text(
            this.cardBtnsX + this.btnOffset,
            this.cardBtnsY,
            i18(i18Config.CANCEL),
            // @ts-ignore
            {fill: "#fff", align: "center"}
        )
        this.cancelText.setPadding(0, 5, 0, 0);
        this.cancelText.setOrigin(0.5, 0.5);
        this.cancelText.setAlpha(0)
        this.cancelBtnGroup.text = this.cancelText
    }

    drawEndButton() {
        const offsetX = this.btnOffset + this.endBtnOffset
        this.endBtnImg = this.gamingScene.add.image(
            this.cardBtnsX + offsetX,
            this.cardBtnsY,
            'white').setInteractive();
        this.endBtnImg.displayHeight = sizeConfig.endRoundBtn.height;
        this.endBtnImg.displayWidth = sizeConfig.endRoundBtn.width;
        this.endBtnImg.setAlpha(0)
        this.endBtnGroup.img = this.endBtnImg

        this.endText = this.gamingScene.add.text(
            this.cardBtnsX + offsetX,
            this.cardBtnsY,
            i18(i18Config.END),
            // @ts-ignore
            {fill: "#fff", align: "center"}
        )
        this.endText.setPadding(0, 5, 0, 0);
        this.endText.setOrigin(0.5, 0.5);
        this.endText.setAlpha(0)
        this.endBtnGroup.text = this.endText
    }

    bindEvent() {
        this.cancelBtnImg!.on('pointerdown', () => {
            if (this._isMyResponseTurn) {
                this.gamingScene.socket.emit(
                    EMIT_TYPE.RESPONSE,
                    generateNoResponse()
                )
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            } else if (this._canPlayInMyTurn || this._isMyThrowTurn) {
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            }
        });

        this.okBtnImg!.on('pointerdown', () => {
            const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
            const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;

            if (this._canPlayInMyTurn) {
                if (!this.canClickOkBtnInMyPlayStage(gameStatus, gameFEStatus)) {
                    return
                }

                this.gamingScene.socket.emit(
                    EMIT_TYPE.ACTION,
                    generateAction(gameStatus, gameFEStatus)
                )
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            } else if (this._isMyResponseTurn) {
                if (!this.canClickOkBtnInMyResponseStage(gameStatus, gameFEStatus)) {
                    return
                }

                this.gamingScene.socket.emit(
                    EMIT_TYPE.RESPONSE,
                    generateYesResponse(gameStatus, gameFEStatus),
                )
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            } else if (this._isMyThrowTurn) {
                if (!this.canClickOkBtnInMyThrowStage(gameStatus, gameFEStatus)) {
                    return
                }

                this.gamingScene.socket.emit(
                    EMIT_TYPE.THROW,
                    generateThrowData(gameStatus, gameFEStatus)
                )
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            }
        });

        this.endBtnImg!.on('pointerdown', () => {
            this.gamingScene.socket.emit(EMIT_TYPE.GO_NEXT_STAGE)
        });
    }

    // show 包含 able
    showBtn(group: BtnGroup, cb?: Function) {
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
        group.img!.setTint(0xcc0000)
    }

    hideBtn(group: BtnGroup, cb?: Function) {
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


    disableBtn(group: BtnGroup) {
        group.img!.setTint(0xcccccc)
    }

    canClickOkBtnInMyPlayStage(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        if (gameFEStatus?.actualCard) {
            const targetMinMaxNumber = getTargetPlayersNumberMinMax(gameStatus, gameFEStatus);
            const ifSelectedTargetsQualified = getSelectedTargetNumber(gameFEStatus) >= targetMinMaxNumber.min
                && getSelectedTargetNumber(gameFEStatus) <= targetMinMaxNumber.max;
            return ifSelectedTargetsQualified;
        }
        return false
    }

    canClickOkBtnInMyResponseStage(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        const {okButtonIsAbleValidate} = getMyResponseInfo(gameStatus, gameFEStatus) as BaseResponseInfo
        return okButtonIsAbleValidate(gameFEStatus)
    }

    canClickOkBtnInMyThrowStage(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        return getSelectedCardNumber(gameFEStatus) == getNeedSelectCardsNumber(gameStatus, gameFEStatus)
    }

    showAllBtns() {
        this.showBtn(this.okBtnGroup);
        this.showBtn(this.cancelBtnGroup)
        this.showBtn(this.endBtnGroup)
    }

    hideAllBtns() {
        this.hideBtn(this.okBtnGroup);
        this.hideBtn(this.cancelBtnGroup)
        this.hideBtn(this.endBtnGroup)
    }

    setButtonStatusByGameStatus(gameStatus: GameStatus) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!

        this._isMyResponseTurn = getIsMyResponseTurn(gameStatus);
        this._canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
        this._isMyThrowTurn = getIsMyThrowTurn(gameStatus);

        (this._canPlayInMyTurn || this._isMyResponseTurn || this._isMyThrowTurn) ? this.showAllBtns() : this.hideAllBtns()

        if (this._canPlayInMyTurn) {
            this.disableBtn(this.okBtnGroup)
            this.disableBtn(this.cancelBtnGroup)

            this.showBtn(this.endBtnGroup)
        } else if (this._isMyResponseTurn) {
            const needSelectCardsNumber = getNeedSelectCardsNumber(gameStatus, gameFEStatus)
            if (needSelectCardsNumber) { // 我的响应回合需要选牌
                this.disableBtn(this.okBtnGroup)
            }

            this.hideBtn(this.endBtnGroup)
        } else if (this._isMyThrowTurn) {
            this.disableBtn(this.okBtnGroup)
            this.disableBtn(this.cancelBtnGroup)

            this.hideBtn(this.endBtnGroup)
        } else {
            this.hideAllBtns();
        }
    }

    setButtonStatusByGameFEStatus(gameFEStatus: GameFEStatus) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!
        if (this._canPlayInMyTurn) {
            this.canClickOkBtnInMyPlayStage(gameStatus, gameFEStatus) ?
                this.showBtn(this.okBtnGroup) :
                this.disableBtn(this.okBtnGroup)
        } else if (this._isMyResponseTurn) {
            this.canClickOkBtnInMyResponseStage(gameStatus, gameFEStatus) ?
                this.showBtn(this.okBtnGroup) :
                this.disableBtn(this.okBtnGroup)
        } else if (this._isMyThrowTurn) {
            this.canClickOkBtnInMyThrowStage(gameStatus, gameFEStatus) ?
                this.showBtn(this.okBtnGroup) :
                this.disableBtn(this.okBtnGroup)
        }

        if (this._canPlayInMyTurn || this._isMyThrowTurn) {
            if (getSelectedCardNumber(gameFEStatus) > 0) {
                this.showBtn(this.cancelBtnGroup)
            } else {
                this.disableBtn(this.cancelBtnGroup)
            }
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        this.setButtonStatusByGameStatus(gameStatus)
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        this.setButtonStatusByGameFEStatus(gameFEStatus);
    }

}
