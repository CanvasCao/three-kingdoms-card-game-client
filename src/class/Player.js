import sizeConfig from "../config/sizeConfig.json";
import {getDistanceBetweenMeAndTarget, getHowManyTargetsNeed, getMyUserId, uuidv4} from "../utils/utils";
import {CARD_CONFIG} from "../utils/cardConfig";

export class Player {
    constructor(gamingScene, user) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.user = user;
        this.playerX = (sizeConfig.background.width / 2);
        this.playerY = this.user.userId == getMyUserId() ? sizeConfig.player.height + 280 : sizeConfig.player.height - 60;
        this.bloodImages = []; //从下往上

        this._currentBlood = this.user.currentBlood;
        this._cardNumber = 0;
        this._actualCardId = '';

        this.drawMyTurnStroke();
        this.drawSelectedStroke();
        this.drawPlayer();
        this.drawBloodsBg();
        this.drawBloods();
        this.setBloods(this.user.currentBlood);
        this.drawCardNumber();
        this.drawStageText();
        this.drawEquipments();
        if (this.user.isDead) {
            this.drawIsDead();
            this._isDead = true;
        }
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addObserver(this);
    }

    drawMyTurnStroke() {
        this.myTurnStroke = this.gamingScene.add.graphics();
        this.myTurnStroke.lineStyle(10, 0x00ff00, 1);
        this.myTurnStroke.strokeRect(this.playerX - sizeConfig.player.width / 2,
            this.playerY - sizeConfig.player.height / 2,
            sizeConfig.player.width,
            sizeConfig.player.height);
        this.myTurnStroke.setAlpha(0);
    }

    drawSelectedStroke() {
        this.selectedStroke = this.gamingScene.add.graphics();
        this.selectedStroke.lineStyle(10, 0xffff00, 1);
        this.selectedStroke.strokeRect(this.playerX - sizeConfig.player.width / 2,
            this.playerY - sizeConfig.player.height / 2,
            sizeConfig.player.width,
            sizeConfig.player.height);
        this.selectedStroke.setAlpha(0);
    }

    drawCardNumber() {
        this.cardNumObj = this.gamingScene.add.text((
            this.playerX - sizeConfig.player.width / 2),
            this.playerY - 22,
            this._cardNumber,
            {fill: "#000", align: "center"}
        );

        const padding = 2;
        this.cardNumObj.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.cardNumObj.setBackgroundColor("#fff");
        this.cardNumObj.setFontSize(10)
    }

    drawBloods() {
        for (let i = 0; i < this.user.maxBlood; i++) {
            const bloodImage = this.gamingScene.add.image(
                this.playerX + sizeConfig.player.width / 2 - 7,
                this.playerY + sizeConfig.player.height / 2 - 10 - (sizeConfig.blood.height * 0.8 * 0.8 * i),
                "greenGouyu");
            bloodImage.displayHeight = sizeConfig.blood.height * 0.8;
            bloodImage.displayWidth = sizeConfig.blood.width * 0.8;
            this.bloodImages.push(bloodImage);
        }
    }

    drawStageText() {
        this.stageText = this.gamingScene.add.text(
            this.playerX,
            this.playerY + sizeConfig.player.height / 2 + 10,
            "",
            {fill: "#000", align: "center"}
        );

        this.stageText.setOrigin(0.5, 0.5)
        const padding = 2;
        this.stageText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.stageText.setBackgroundColor("#fff")
        this.stageText.setFontSize(10)
        this.stageText.setAlpha(0)
    }

    drawEquipments() {
        for (let i = 0; i < 4; i++) {
            this.drawEquipment(i);
        }
    }

    drawEquipment(index) {
        const padding = 2;
        const offsetY = 16;
        const groupMap = {0: 'weaponGroup', 1: 'shieldGroup', 2: 'plusHorseGroup', 3: 'minusHorseGroup'};
        const groupName = groupMap[index];
        this[groupName] = {};
        this[groupName].distanceText = this.gamingScene.add.text(
            this.playerX - sizeConfig.player.width / 2,
            this.playerY + offsetY * index,
            "1",
            {fill: "#000", align: "left", fixedWidth: 84}
        );
        this[groupName].distanceText.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
        this[groupName].distanceText.setBackgroundColor("#ccc")
        this[groupName].distanceText.setFontSize(10)
        this[groupName].distanceText.setAlpha(0)

        this[groupName].nameText = this.gamingScene.add.text(
            this.playerX - sizeConfig.player.width / 2 + 14,
            this.playerY + offsetY * index,
            "2",
            {fill: "#000", align: "justify", fixedWidth: 80}
        );
        this[groupName].nameText.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
        this[groupName].nameText.setFontSize(10)
        this[groupName].nameText.setAlpha(0)


        this[groupName].huaseNumText = this.gamingScene.add.text(
            this.playerX - sizeConfig.player.width / 2 + 56,
            this.playerY + offsetY * index,
            "3",
            {fill: "#000", align: "center", fixedWidth: 28}
        );
        this[groupName].huaseNumText.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
        this[groupName].huaseNumText.setFontSize(10)
        this[groupName].huaseNumText.setAlpha(0)
    }

    drawIsDead() {
        this.playerImage.setTint(0x666666);
        this.isDeadText = this.gamingScene.add.text(
            this.playerX,
            this.playerY,
            "阵亡",
            {fill: "#000", align: "center"}
        );
        this.isDeadText.setOrigin(0.5, 0.5)
        const padding = 2;
        this.isDeadText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.isDeadText.setBackgroundColor("#fff")
        this.isDeadText.setFontSize(16)
    }

    setBloods(number) {
        for (let i = 0; i < this.bloodImages.length; i++) {
            const bloodNumber = i + 1;
            const alpha = (bloodNumber > number) ? 0 : 1

            this.gamingScene.tweens.add({
                targets: this.bloodImages[i],
                alpha: {
                    value: alpha,
                    duration: 500,
                    // ease: "Bounce.easeIn"
                    ease: "Bounce.easeInOut"
                }
            });
        }
    }

    bindEvent() {
        this.playerImage.on('pointerdown', () => {
            const curGameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
            const curGameStatus = this.gamingScene.gameStatusObserved.gameStatus;
            if (curGameFEStatus.selectedCards <= 0) {
                return;
            }

            if (this.distanceDisable) {
                return;
            }

            const targetMinMaxNumber = getHowManyTargetsNeed(curGameFEStatus.actualCard);
            if (curGameFEStatus.selectedTargetUsers.length >= targetMinMaxNumber.max) {
                return;
            }

            curGameFEStatus.selectedTargetUsers = [this.user];
            this.gamingScene.gameFEStatusObserved.setGameEFStatus(curGameFEStatus);
        });
    }

    drawBloodsBg() {
        const graphicsW = 18 * 0.8
        const graphicsH = 100 * 0.8
        this.graphics = this.gamingScene.add.graphics();
        this.graphics.fillStyle(0x000, 1);
        this.graphics.fillRoundedRect(
            this.playerX + sizeConfig.player.width / 2 - graphicsW,
            this.playerY + sizeConfig.player.height / 2 - graphicsH,
            graphicsW,
            graphicsH, {
                tl: 4,
                tr: 0,
                bl: 0,
                br: 0
            });
    }

    drawPlayer() {
        this.playerImage = this.gamingScene.add.image(
            this.playerX,
            this.playerY,
            this.user.cardId).setInteractive({cursor: 'pointer'});
        this.playerImage.displayHeight = sizeConfig.player.height;
        this.playerImage.displayWidth = sizeConfig.player.width;
    }

    onEquipmentsChange(gameStatus) {
        const user = gameStatus.users[this.user.userId];
        [
            {card: "weaponCard", group: "weaponGroup"},
            {card: "shieldCard", group: "shieldGroup"},
            {card: "plusHorseCard", group: "plusHorseGroup"},
            {card: "minusHorseCard", group: "minusHorseGroup"},
        ].forEach((ele, index) => {
            const card = user[ele.card]
            const group = this[ele.group]
            if (user[ele.card]) {
                group.distanceText.setText(card.distanceDesc)
                group.nameText.setText(card.CN)
                group.huaseNumText.setText(card.cardNumDesc + card.huase)
                this.gamingScene.tweens.add({
                    targets: [group.distanceText, group.nameText, group.huaseNumText],
                    alpha: {
                        value: 0.95,
                        duration: 100,
                    },
                });
            } else {
                this.gamingScene.tweens.add({
                    targets: [group.distanceText, group.nameText, group.huaseNumText],
                    alpha: {
                        value: 0,
                        duration: 0,
                    },
                });
            }
        })
    }

    onPlayerBloodChange(gameStatus) {
        const user = gameStatus.users[this.user.userId]

        if (this._currentBlood != user.currentBlood) {
            this.setBloods(user.currentBlood)
            this._currentBlood = user.currentBlood
        }
    }

    onCardNumberChange(gameStatus) {
        const user = gameStatus.users[this.user.userId]

        if (this._cardNumber != user.cards.length) {
            this.cardNumObj.setText(user.cards.length)
            this._cardNumber = user.cards.length
        }
    }

    onPlayerTurnAndStageChange(gameStatus) {
        if (gameStatus.stage.userId === this.user.userId) {
            this.myTurnStroke.setAlpha(1);
            this.stageText.setAlpha(1);
            this.stageText.setText(gameStatus.stage.stageNameCN + '阶段...')
        } else {
            this.myTurnStroke.setAlpha(0);
            this.stageText.setAlpha(0)
        }
    }

    onPlayerDisableChange(gameFEStatus) {
        if (this.user.userId == getMyUserId()) {
            return;
        }
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus

        // 计算杀的距离
        if (this._actualCardId != gameFEStatus?.actualCard?.cardId) {
            if (gameFEStatus?.actualCard?.CN == CARD_CONFIG.SHA.CN) {
                const myDistance = gameStatus.users[getMyUserId()]?.weaponCard?.distance || 1;
                const distanceBetweenMeAndTarget = getDistanceBetweenMeAndTarget(gameStatus.users, this.user.userId)

                if (myDistance >= distanceBetweenMeAndTarget) {
                    this.playerImage.clearTint();
                    this.distanceDisable = false;
                } else {
                    this.playerImage.setTint(0x666666);
                    this.distanceDisable = true;
                }
            } else {
                this.playerImage.clearTint();
                this.distanceDisable = false;
            }
            this._actualCardId = gameFEStatus?.actualCard?.cardId
        }
    }

    onPlayerSelectedChange(gameFEStatus) {
        const isSelected = !!gameFEStatus.selectedTargetUsers.find((u) => u.userId == this.user.userId)
        this.selectedStroke.setAlpha(isSelected ? 1 : 0);
    }

    onPlayerDieChange(gameStatus) {
        const user = gameStatus.users[this.user.userId]
        if (user.isDead) {
            this.drawIsDead();
            this._isDead = true;
        }
    }

    gameStatusNotify(gameStatus) {
        if (this._isDead)
            return

        this.onPlayerTurnAndStageChange(gameStatus);
        this.onCardNumberChange(gameStatus);
        this.onPlayerBloodChange(gameStatus);
        this.onEquipmentsChange(gameStatus);
        this.onPlayerDieChange(gameStatus)
    }

    gameFEStatusNotify(gameFEStatus) {
        if (this._isDead)
            return

        this.onPlayerSelectedChange(gameFEStatus);
        this.onPlayerDisableChange(gameFEStatus);
    }
}
