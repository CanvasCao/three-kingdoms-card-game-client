import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {getDistanceBetweenMeAndTarget, getHowManyTargetsNeed, getMyUserId, uuidv4} from "../utils/utils";
import {CARD_CONFIG} from "../utils/cardConfig";

export class Player {
    constructor(gamingScene, user) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.user = user;
        // this.playerX = (sizeConfig.background.width / 2);
        // this.playerY = this.user.userId == getMyUserId() ? sizeConfig.player.height + 280 : sizeConfig.player.height - 60;
        const xmap = {0: -200, 1: 0, 2: 200};
        this.playerX = (sizeConfig.background.width / 2) + xmap[this.user.location];
        this.playerY = sizeConfig.player.height + 100;
        this.bloodImages = []; //从下往上
        this.pandingCardImages = []; //从右往左
        this.pandingCardTexts = []; //从右往左

        this.maxPandingCardsNumber = 3;
        this._currentBlood = this.user.currentBlood;
        this._cardNumber = this.user.cards.length;
        this._isTieSuo = this.user.isTieSuo;
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
        this.drawPandingCards();
        this.drawTieSuo();
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

    drawTieSuo() {
        this.tieSuoImage = this.gamingScene.add.image(
            this.playerX,
            this.playerY,
            "tiesuo");
        this.tieSuoImage.displayHeight = sizeConfig.tiesuo.height;
        this.tieSuoImage.displayWidth = sizeConfig.tiesuo.width;
        this.tieSuoImage.setAlpha(this._isTieSuo ? 1 : 0);
    }

    drawPandingCards() {
        const stepX = 20
        for (let i = 0; i < this.maxPandingCardsNumber; i++) {
            const pandingCardImage = this.gamingScene.add.image(
                this.playerX + sizeConfig.player.width / 2 - 10 - stepX * i,
                this.playerY + sizeConfig.player.height / 2 + 2,
                "white");
            pandingCardImage.displayHeight = 12;
            pandingCardImage.displayWidth = 12;
            pandingCardImage.setRotation(Math.PI / 4)
            pandingCardImage.setTint(colorConfig.card)
            pandingCardImage.setAlpha(1)

            this.pandingCardImages.push(pandingCardImage);

            const pandingCardText = this.gamingScene.add.text(
                this.playerX + sizeConfig.player.width / 2 - 10 - stepX * i,
                this.playerY + sizeConfig.player.height / 2 + 2,
                "乐",
                {fill: "#000", align: "center"}
            );
            pandingCardText.setOrigin(0.5, 0.5)
            pandingCardText.setFontSize(10)
            pandingCardText.setAlpha(1)
            this.pandingCardTexts.push(pandingCardText);
        }
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
            {fill: "#fff", align: "center", stroke: '#ff0000', strokeThickness: 6}
        );

        this.stageText.setOrigin(0.5, 0.5)
        const padding = 2;
        this.stageText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        // this.stageText.setBackgroundColor("#fff")
        this.stageText.setFontSize(10)
        this.stageText.setAlpha(0)
    }

    drawEquipments() {
        for (let i = 0; i < 4; i++) {
            this.drawEquipment(i);
        }
    }

    drawEquipment(index) {
        const padding = 1;
        const offsetY = 12;
        const offsetYStep = 14;
        const groupMap = {0: 'weaponGroup', 1: 'shieldGroup', 2: 'plusHorseGroup', 3: 'minusHorseGroup'};
        const groupName = groupMap[index];
        this[groupName] = {};
        this[groupName].distanceText = this.gamingScene.add.text(
            this.playerX - sizeConfig.player.width / 2,
            this.playerY + offsetY + offsetYStep * index,
            "",
            {fill: "#000", align: "left", fixedWidth: 84}
        );
        this[groupName].distanceText.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
        this[groupName].distanceText.setBackgroundColor("#ccc")
        this[groupName].distanceText.setFontSize(9)
        this[groupName].distanceText.setAlpha(0)

        this[groupName].nameText = this.gamingScene.add.text(
            this.playerX - sizeConfig.player.width / 2 + 14,
            this.playerY + offsetY + offsetYStep * index,
            "",
            {fill: "#000", align: "justify", fixedWidth: 80}
        );
        this[groupName].nameText.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
        this[groupName].nameText.setFontSize(9)
        this[groupName].nameText.setAlpha(0)


        this[groupName].huaseNumText = this.gamingScene.add.text(
            this.playerX - sizeConfig.player.width / 2 + 56,
            this.playerY + offsetY + offsetYStep * index,
            "",
            {fill: "#000", align: "center", fixedWidth: 28}
        );
        this[groupName].huaseNumText.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
        this[groupName].huaseNumText.setFontSize(9)
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

            if (curGameFEStatus.selectedTargetUsers.find((u) => u.userId == this.user.userId)) {
                return;
            }
            curGameFEStatus.selectedTargetUsers.push(this.user);
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

    onPandingCardsChange(gameStatus) {
        const user = gameStatus.users[this.user.userId];

        if (this._pandingCardsLength != user.pandingCards.length) {
            for (let i = 0; i < this.maxPandingCardsNumber; i++) {
                if (user.pandingCards[i]) {
                    this.pandingCardImages[i].setAlpha(1)
                    this.pandingCardTexts[i].setAlpha(1)
                    this.pandingCardTexts[i].setText(user.pandingCards[i].CN.slice(0, 1))
                } else {
                    this.pandingCardImages[i].setAlpha(0)
                    this.pandingCardTexts[i].setAlpha(0)
                }
            }
            this._pandingCardsLength = user.pandingCards.length
        }
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

    onTieSuoChange(gameStatus) {
        const user = gameStatus.users[this.user.userId]

        if (this._isTieSuo != user.isTieSuo) {
            this.tieSuoImage.setAlpha(user.isTieSuo ? 1 : 0)
            // this.tieSuoImage.setAlpha(1)
            this._isTieSuo = user._isTieSuo
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


        if (this._actualCardId != gameFEStatus?.actualCard?.cardId) {

            // 计算杀的距离
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
        this.onTieSuoChange(gameStatus);
        this.onPlayerBloodChange(gameStatus);
        this.onEquipmentsChange(gameStatus);
        this.onPandingCardsChange(gameStatus);
        this.onPlayerDieChange(gameStatus)
    }

    gameFEStatusNotify(gameFEStatus) {
        if (this._isDead)
            return

        this.onPlayerSelectedChange(gameFEStatus);
        this.onPlayerDisableChange(gameFEStatus);
    }
}
