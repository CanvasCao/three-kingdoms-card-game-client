import sizeConfig from "../../config/sizeConfig.json";
import textConfig from "../../config/textConfig.json";
import {
    getIsMyResponseCardTurn,
    getCanPlayInMyTurn,
    getMyPlayerId,
    uuidv4,
    getMyResponseInfo,
    getIsMyThrowTurn,
    getNeedThrowCardNumber,
    getAmendTargetMinMax
} from "../../utils/gameStatusUtils";
import emitMap from "../../config/emitMap.json";
import {BtnGroup, GamingScene} from "../../types/phaser";
import Phaser from "phaser";
import {GameFEStatus} from "../../types/gameFEStatus";
import {GameStatus} from "../../types/gameStatus";
import {attachFEInfoToCard} from "../../utils/cardUtils";
import {generateAction, generateResponse, generateThrowData} from "../../utils/emitDataGenerator";

export class ControlButtons {
    obId: string;
    gamingScene: GamingScene;

    cardBtnsX: number;
    cardBtnsY: number;
    btnRightOffset: number;

    _isMyResponseCardTurn?: boolean;
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

        this.cardBtnsX = sizeConfig.playersArea.width * 0.8 / 2;
        this.cardBtnsY = sizeConfig.playersArea.height - sizeConfig.background.height * 0;
        this.btnRightOffset = 180;

        this._isMyResponseCardTurn;
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
            textConfig.OK.CN,
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
            textConfig.CANCEL.CN,
            // @ts-ignore
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

        this.endText = this.gamingScene.add.text(
            this.cardBtnsX + this.btnRightOffset,
            this.cardBtnsY,
            textConfig.END.CN,
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
            if (this._isMyResponseCardTurn) {
                this.gamingScene.socket.emit(
                    emitMap.RESPONSE,
                    {
                        originId: getMyPlayerId(),
                    }
                )
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            } else if (this._canPlayInMyTurn) {
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            }
        });

        this.okBtnImg!.on('pointerdown', () => {
            const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
            const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;

            if (this._isMyResponseCardTurn) {
                if (!this.canClickOkBtnInMyResponseCardStage(gameStatus, gameFEStatus)) {
                    return
                }

                this.gamingScene.socket.emit(
                    emitMap.RESPONSE,
                    generateResponse(gameStatus, gameFEStatus),
                )
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            } else if (this._canPlayInMyTurn) {
                if (!this.canClickOkBtnInMyPlayStage(gameStatus,gameFEStatus)) {
                    return
                }

                this.gamingScene.socket.emit(
                    emitMap.ACTION,
                    generateAction(gameStatus, gameFEStatus)
                )
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            } else if (this._isMyThrowTurn) {
                if (!this.canClickOkBtnInMyThrowStage(gameStatus, gameFEStatus)) {
                    return
                }

                this.gamingScene.socket.emit(
                    emitMap.THROW,
                    generateThrowData(gameStatus, gameFEStatus)
                )
                this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
            }
        });

        this.endBtnImg!.on('pointerdown', () => {
            this.gamingScene.socket.emit(emitMap.GO_NEXT_STAGE)
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
        if (gameFEStatus?.actualCard && gameFEStatus.selectedCards.length > 0) {
            const targetMinMaxNumber = getAmendTargetMinMax(gameStatus, gameFEStatus);
            const ifSelectedTargetsQualified = gameFEStatus.selectedTargetPlayers.length >= targetMinMaxNumber.min
                && gameFEStatus.selectedTargetPlayers.length <= targetMinMaxNumber.max;
            return ifSelectedTargetsQualified;
        }
        return false
    }

    canClickOkBtnInMyResponseCardStage(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        if (!gameFEStatus?.actualCard) {
            return
        }
        const {cardNames: needResponseCardNames} = getMyResponseInfo(gameStatus)!
        return needResponseCardNames.includes(gameFEStatus.actualCard.CN)
    }

    canClickOkBtnInMyThrowStage(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        const myPlayer = gameStatus.players[getMyPlayerId()];
        const needThrowCardNumber = getNeedThrowCardNumber(myPlayer);
        return gameFEStatus.selectedCards.length == needThrowCardNumber
    }

    hideAllBtns() {
        this.hideBtn(this.okBtnGroup);
        this.hideBtn(this.cancelBtnGroup)
        this.hideBtn(this.endBtnGroup)
    }

    setButtonStatusByGameStatus(gameStatus: GameStatus) {
        this._isMyResponseCardTurn = getIsMyResponseCardTurn(gameStatus);
        this._canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
        this._isMyThrowTurn = getIsMyThrowTurn(gameStatus);

        if (this._canPlayInMyTurn) {
            this.showBtn(this.okBtnGroup)
            this.disableBtn(this.okBtnGroup)
            this.showBtn(this.endBtnGroup)
        } else if (this._isMyResponseCardTurn) {
            this.showBtn(this.okBtnGroup)
            this.disableBtn(this.okBtnGroup)
            this.showBtn(this.cancelBtnGroup)
        } else if (this._isMyThrowTurn) {
            this.showBtn(this.okBtnGroup)
            this.disableBtn(this.okBtnGroup)
            this.hideBtn(this.cancelBtnGroup)
            this.hideBtn(this.endBtnGroup)
        } else {
            this.hideAllBtns();
        }
    }

    setButtonStatusByGameFEStatus(gameFEStatus: GameFEStatus) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!
        if (this._canPlayInMyTurn) {
            this.canClickOkBtnInMyPlayStage(gameStatus, gameFEStatus) ? this.showBtn(this.okBtnGroup) : this.disableBtn(this.okBtnGroup)

            if (gameFEStatus.selectedCards.length > 0) {
                this.showBtn(this.cancelBtnGroup)
                this.hideBtn(this.endBtnGroup)
            } else {
                this.hideBtn(this.cancelBtnGroup)
                this.showBtn(this.endBtnGroup)
            }
        } else if (this._isMyResponseCardTurn) {
            this.canClickOkBtnInMyResponseCardStage(gameStatus, gameFEStatus) ? this.showBtn(this.okBtnGroup) : this.disableBtn(this.okBtnGroup)
            this.showBtn(this.cancelBtnGroup)
            this.hideBtn(this.endBtnGroup)
        } else if (this._isMyThrowTurn) {
            this.canClickOkBtnInMyThrowStage(gameStatus, gameFEStatus) ? this.showBtn(this.okBtnGroup) : this.disableBtn(this.okBtnGroup)
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        this.setButtonStatusByGameStatus(gameStatus)
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        this.setButtonStatusByGameFEStatus(gameFEStatus);
    }

}