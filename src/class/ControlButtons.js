import sizeConfig from "../config/sizeConfig.json";
import textConfig from "../config/textConfig.json";
import {
    getIsMyPlayTurn,
    getIsMyResponseTurn,
    getCanPlayInMyTurn,
    getMyUserId,
    uuidv4,
    getHowManyTargetsNeed, getIsEquipmentCard
} from "../utils/utils";
import {socket} from "../socket";
import emitMap from "../config/emitMap.json";
import {BASIC_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "../utils/cardConfig";

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
            textConfig.OK.CN,
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
            textConfig.END.CN,
            {fill: "#fff", align: "center"}
        )
        this.endBtnText.setPadding(0, 5, 0, 0);
        this.endBtnText.setOrigin(0.5, 0.5);
        this.endBtnText.setAlpha(0)
        this.endBtnGroup.text = this.endBtnText
    }

    bindEvent() {
        this.cancelBtnImg.on('pointerdown', () => {
            if (this.isMyResponseTurn) {
                this.gamingScene.socket.emit(
                    emitMap.RESPONSE,
                    {
                        originId: getMyUserId(),
                    }
                )
                this.gamingScene.gameFEStatusObserved.reset();
            } else if (this.canPlayInMyTurn) {
                this.gamingScene.gameFEStatusObserved.reset();
            }
        });

        this.okBtnImg.on('pointerdown', () => {
            const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
            const gameStatus = this.gamingScene.gameStatusObserved.gameStatus;

            if (this.isMyResponseTurn) {
                if (!this.canClickOkBtnInMyResponseStage(gameStatus, gameFEStatus)) {
                    return
                }

                this.gamingScene.socket.emit(
                    emitMap.RESPONSE,
                    this.generateResponse(),
                )
                this.gamingScene.gameFEStatusObserved.reset();
            } else if (this.canPlayInMyTurn) {
                if (!this.canClickOkBtnInMyPlayStage(gameFEStatus)) {
                    return
                }

                this.gamingScene.socket.emit(
                    emitMap.ACTION,
                    this.generateAction()
                )
                this.gamingScene.gameFEStatusObserved.reset();
            }
        });

        this.endBtnImg.on('pointerdown', () => {
            this.gamingScene.socket.emit(emitMap.GO_NEXT_STAGE)
        });
    }

    generateAction() {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus;

        const actualCard = JSON.parse(JSON.stringify(gameFEStatus.selectedCards[0]));
        actualCard.cardId = uuidv4(); // 作为前端判断要不要重新计算和刷新disable的依据
        if ([BASIC_CARDS_CONFIG.SHA.CN, BASIC_CARDS_CONFIG.LEI_SHA.CN, BASIC_CARDS_CONFIG.HUO_SHA.CN].includes(actualCard.CN)) {
            return {
                cards: gameFEStatus.selectedCards,
                actualCard,
                actions: gameFEStatus.selectedTargetUsers.map((targetUser) => {
                    return {
                        originId: getMyUserId(),
                        targetId: targetUser.userId,
                    }
                })
            }
        } else if (actualCard.CN == BASIC_CARDS_CONFIG.TAO.CN || actualCard.CN == SCROLL_CARDS_CONFIG.SHAN_DIAN.CN || getIsEquipmentCard(actualCard)) {
            return {
                cards: gameFEStatus.selectedCards,
                actualCard,
                originId: getMyUserId(),
                targetId: getMyUserId(),
            }
        } else if (actualCard.CN == SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN) {
            return {
                cards: gameFEStatus.selectedCards,
                actualCard,
                originId: getMyUserId(),
                targetId: gameFEStatus.selectedTargetUsers[0].userId,
            }
        }
    }

    generateResponse() {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus;
        return {
            cards: gameFEStatus.selectedCards,
            actualCard: gameFEStatus.selectedCards[0],
            originId: getMyUserId(),
        }
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
        if (gameFEStatus?.actualCard && gameFEStatus.selectedCards.length > 0) {
            const targetMinMaxNumber = getHowManyTargetsNeed(gameFEStatus.actualCard);
            const ifSelectedTargetsQualified = gameFEStatus.selectedTargetUsers.length >= targetMinMaxNumber.min
                && gameFEStatus.selectedTargetUsers.length <= targetMinMaxNumber.max;
            return ifSelectedTargetsQualified;
        }
        return false
    }

    canClickOkBtnInMyResponseStage(gameStatus, gameFEStatus) {
        if (gameStatus.taoResStages.length > 0) {
            return gameFEStatus?.actualCard?.CN == BASIC_CARDS_CONFIG.TAO.CN
        } else if (gameStatus.shanResStages.length > 0) {
            return gameFEStatus?.actualCard?.CN == BASIC_CARDS_CONFIG.SHAN.CN
        }
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
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus
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
                gameStatus,
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
