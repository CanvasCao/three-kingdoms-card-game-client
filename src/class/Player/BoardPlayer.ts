import {sizeConfig} from "../../config/sizeConfig";
import colorConfig from "../../config/colorConfig.json";
import {DELAY_SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {ColorConfigJson} from "../../types/config";
import {GameFEStatus} from "../../types/gameFEStatus";
import differenceBy from "lodash/differenceBy";
import  {getIfPlayerAble, getTargetPlayersNumberMinMax} from "../../utils/playerUtils";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {uuidv4} from "../../utils/uuid";
import {
    getCanSelectMeAsFirstTargetCardNamesClosure,
    getCanSelectMeAsSecondTargetCardNamesClosure
} from "../../utils/cardNamesClourseUtils";
import {getI18Lan, i18, I18LANS} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {STAGE_NAMES, STAGE_NAMES_CN} from "../../config/gameConfig";
import {Player} from "../../types/player";

const colorConfigJson = colorConfig as unknown as ColorConfigJson;

export class BoardPlayer {
    obId: string;
    gamingScene: GamingScene;
    playerId: string;
    playerName: string;
    playerImageName: string;
    playerMaxBlood: number;
    linePosition: { x: number, y: number };
    playerPosition: { x: number, y: number };
    isMe: boolean;

    _disable: boolean;
    _pandingCardsLength: number;
    positionX: number;
    positionY: number;

    bloodImages?: Phaser.GameObjects.Image[];
    pandingCardImages?: Phaser.GameObjects.Image[];
    pandingCardTexts?: Phaser.GameObjects.Text[];
    maxPandingCardsNumber: number;

    _currentBlood: number;
    _cardNumber: number;
    _isTieSuo: boolean;
    _actualCardId?: string;
    _selectedTargetPlayersLength?: number;
    _isDead?: boolean;

    myTurnStroke?: Phaser.GameObjects.Graphics;
    selectedStroke?: Phaser.GameObjects.Graphics;
    cardNumObj?: Phaser.GameObjects.Text;
    tieSuoImage?: Phaser.GameObjects.Image;
    stageText?: Phaser.GameObjects.Text;
    playerImage?: Phaser.GameObjects.Image;
    isDeadText?: Phaser.GameObjects.Text;
    bloodsBgGraphics?: Phaser.GameObjects.Graphics;

    constructor(gamingScene: GamingScene, player: Player) {
        this.obId = uuidv4();

        // init
        this.gamingScene = gamingScene;
        this.playerId = player.playerId;
        this.playerName = player.name;
        this.playerImageName = player.imageName;
        this.playerMaxBlood = player.maxBlood;
        this.linePosition = player.linePosition;
        this.playerPosition = player.playerPosition;
        this.isMe = this.playerId === getMyPlayerId();

        // init inner state
        this._disable = false;
        this._pandingCardsLength = 0

        // position
        this.positionX = this?.playerPosition?.x;
        this.positionY = this?.playerPosition?.y;

        // phaser objects
        this.bloodImages = []; //从下往上
        this.pandingCardImages = []; //从右往左
        this.pandingCardTexts = []; //从右往左

        // varible
        this.maxPandingCardsNumber = Object.keys(DELAY_SCROLL_CARDS_CONFIG).length;

        // last state cache
        this._currentBlood = player.currentBlood;
        this._cardNumber = player.cards.length;
        this._isTieSuo = player.isTieSuo;
        this._actualCardId = '';
        this._selectedTargetPlayersLength = 0;

        if (!this.isMe) {
            this.drawMyTurnStroke();
            this.drawStageText();
        }

        this.drawSelectedStroke();
        this.drawPlayer();
        this.drawBloodsBg();
        this.drawBloods();
        this.setBloods(player.currentBlood);
        this.drawPandingCards();
        this.drawTieSuo();
        this.drawCardNumber();
        this.drawPlayerName();
        if (player.isDead) {
            this.drawIsDead();
            this._isDead = true;
        }
        this.bindEvent();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }

    drawMyTurnStroke() {
        this.myTurnStroke = this.gamingScene.add.graphics();
        this.myTurnStroke.lineStyle(10, colorConfigJson.myTurnStroke, 1);
        this.myTurnStroke.strokeRect(this.positionX - sizeConfig.player.width / 2,
            this.positionY - sizeConfig.player.height / 2,
            sizeConfig.player.width,
            sizeConfig.player.height);
        this.myTurnStroke.setAlpha(0);
    }

    drawSelectedStroke() {
        this.selectedStroke = this.gamingScene.add.graphics();
        this.selectedStroke.lineStyle(10, colorConfigJson.selectedPlayerStroke, 1);
        this.selectedStroke.strokeRect(this.positionX - sizeConfig.player.width / 2,
            this.positionY - sizeConfig.player.height / 2,
            sizeConfig.player.width,
            sizeConfig.player.height);
        this.selectedStroke.setAlpha(0);
    }

    drawCardNumber() {
        this.cardNumObj = this.gamingScene.add.text(
            this.positionX - sizeConfig.player.width / 2,
            this.positionY - sizeConfig.player.height * 0.08,
            this._cardNumber.toString(),
            // @ts-ignore
            {fill: "#000", align: "center"}
        );

        const padding = 2;
        this.cardNumObj.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.cardNumObj.setBackgroundColor("#fff");
        this.cardNumObj.setFontSize(sizeConfig.player.width / 8)
    }

    drawPlayerName() {
        const nameText = this.gamingScene.add.text(
            this.positionX - sizeConfig.player.width / 2,
            this.positionY - sizeConfig.player.height / 2,
            this.playerName,
            // @ts-ignore
            {fill: "#fff", align: "left", fixedWidth: sizeConfig.player.width}
        );

        const padding = 2;
        nameText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        nameText.setBackgroundColor("#0000003D")
    }

    drawTieSuo() {
        this.tieSuoImage = this.gamingScene.add.image(
            this.positionX,
            this.positionY,
            "tiesuo");
        this.tieSuoImage.displayHeight = sizeConfig.player.height * 0.3;
        this.tieSuoImage.displayWidth = sizeConfig.player.width;
        this.tieSuoImage.setAlpha(this._isTieSuo ? 1 : 0);
    }

    drawPandingCards() {
        const stepX = sizeConfig.player.width / 4.5;
        for (let i = 0; i < this.maxPandingCardsNumber; i++) {
            const pandingCardImage = this.gamingScene.add.image(
                this.positionX + sizeConfig.player.width / 2 - 15 - stepX * i,
                this.positionY + sizeConfig.player.height / 2 + 5,
                "white");
            pandingCardImage.displayHeight = sizeConfig.player.width / 8;
            pandingCardImage.displayWidth = sizeConfig.player.width / 8;
            pandingCardImage.setRotation(Math.PI / 4)
            pandingCardImage.setTint(colorConfigJson.card)
            pandingCardImage.setAlpha(0)

            this.pandingCardImages!.push(pandingCardImage);

            const pandingCardText = this.gamingScene.add.text(
                this.positionX + sizeConfig.player.width / 2 - 15 - stepX * i,
                this.positionY + sizeConfig.player.height / 2 + 5,
                "",
                // @ts-ignore
                {fill: "#000", align: "center"}
            );
            pandingCardText.setOrigin(0.5, 0.5)
            pandingCardText.setFontSize(sizeConfig.player.width / 11)
            pandingCardText.setAlpha(0)
            this.pandingCardTexts!.push(pandingCardText);
        }
    }

    drawBloods() {
        const bloodHeight = this.isMe ? sizeConfig.player.height * 0.15 : sizeConfig.player.height * 0.15 * 0.8;
        const bloodWidth = bloodHeight * 1.5333;
        const marginBottom = this.isMe ? 4 : 0;

        for (let i = 0; i < this.playerMaxBlood; i++) {
            const bloodImage = this.gamingScene.add.image(
                this.positionX + sizeConfig.player.width / 2 * 0.86,
                this.positionY - marginBottom + sizeConfig.player.height / 2 * 0.86 - (bloodHeight * 0.9 * i),
                "gouyu");
            bloodImage.displayHeight = bloodHeight;
            bloodImage.displayWidth = bloodWidth;
            // @ts-ignore
            bloodImage.setTint(colorConfig.bloodGreen);
            this.bloodImages!.push(bloodImage);
        }
    }

    drawStageText() {
        this.stageText = this.gamingScene.add.text(
            this.positionX,
            this.positionY + sizeConfig.player.height / 2 + 10,
            "",
            // @ts-ignore
            {fill: "#fff", align: "center", stroke: '#ff0000', strokeThickness: 6}
        );

        this.stageText.setOrigin(0.5, 0.5)
        const padding = 2;
        this.stageText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.stageText.setFontSize(14)
        this.stageText.setAlpha(0)
    }

    drawIsDead() {
        this.playerImage!.setTint(colorConfigJson.disablePlayer);
        this.isDeadText = this.gamingScene.add.text(
            this.positionX,
            this.positionY,
            "阵亡",
            // @ts-ignore
            {fill: "#000", align: "center"}
        );
        this.isDeadText.setOrigin(0.5, 0.5)
        const padding = 2;
        this.isDeadText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        this.isDeadText.setBackgroundColor("#fff")
        this.isDeadText.setFontSize(16)
    }

    setBloods(number: number) {
        let color;
        if (number > 2) {
            color = colorConfig.bloodGreen
        } else if (number == 2) {
            color = colorConfig.bloodYellow
        } else {
            color = colorConfig.bloodRed
        }

        for (let i = 0; i < this.bloodImages!.length; i++) {
            const bloodNumber = i + 1;
            const alpha = (bloodNumber > number) ? 0 : 1

            this.gamingScene.tweens.add({
                targets: this.bloodImages![i],
                alpha: {
                    value: alpha,
                    duration: 500,
                    ease: "Bounce.easeInOut"
                }
            });

            if (alpha) {
                // @ts-ignore
                this.bloodImages![i].setTint(color)
            }
        }
    }

    bindEvent() {
        this.playerImage!.on('pointerdown', () => {
            const gameFEStatusObserved = this.gamingScene.gameFEStatusObserved
            const curGameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
            const curGameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
            const player = curGameStatus.players[this.playerId]

            if (this._isDead) {
                return;
            }

            if (!curGameFEStatus.actualCard) {
                return;
            }

            if (this._disable) {
                return;
            }

            // Player已经选中过 反选
            if (curGameFEStatus.selectedTargetPlayers.find((u: Player) => u.playerId == this.playerId)) {
                gameFEStatusObserved.unselectPlayer(player)
                return;
            }

            // 因为mePlayer的_disable 大部分情况是false（除了借刀） 所以在这里validate这张卡能否以自己为目标
            if (curGameFEStatus.selectedTargetPlayers.length == 0) {
                if (!getCanSelectMeAsFirstTargetCardNamesClosure()().includes(curGameFEStatus.actualCard!.CN) && this.isMe) {
                    return;
                }
            }
            if (curGameFEStatus.selectedTargetPlayers.length == 1) {
                if (!getCanSelectMeAsSecondTargetCardNamesClosure()().includes(curGameFEStatus.actualCard!.CN) && this.isMe) {
                    return;
                }
            }

            // validate是否选择了足够目标
            const targetMinMax = getTargetPlayersNumberMinMax(curGameStatus, curGameFEStatus)
            if (curGameFEStatus.selectedTargetPlayers.length >= targetMinMax.max) {
                return;
            }

            gameFEStatusObserved.selectPlayer(player)
        });
    }

    drawBloodsBg() {
        const graphicsW = this.isMe ? sizeConfig.player.width * 0.16 : sizeConfig.player.width * 0.16 * 0.8
        const graphicsH = this.isMe ? sizeConfig.player.height * 0.6 : sizeConfig.player.height * 0.6 * 0.8
        this.bloodsBgGraphics = this.gamingScene.add.graphics();
        this.bloodsBgGraphics.fillStyle(0x000, 1);
        this.bloodsBgGraphics.fillRoundedRect(
            this.positionX + sizeConfig.player.width / 2 - graphicsW,
            this.positionY + sizeConfig.player.height / 2 - graphicsH,
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
            this.positionX,
            this.positionY,
            this.playerImageName).setInteractive().setScale(140 / 536);
        this.playerImage.setOrigin(0.5, 0.45) // 竖长图片被crop了下面 所以setOriginY 稍微让图片往下挪一点

        var cropRect = new Phaser.Geom.Rectangle(0, 0, 536, 536 * (sizeConfig.player.height / sizeConfig.player.width));

        this.playerImage.setCrop(cropRect);
    }

    onPandingCardsChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId];

        if (this._pandingCardsLength != player.pandingSigns.length) {
            for (let i = 0; i < this.maxPandingCardsNumber; i++) {
                if (player.pandingSigns[i]) {
                    this.pandingCardImages![i].setAlpha(1)
                    this.pandingCardTexts![i].setAlpha(1)
                    this.pandingCardTexts![i].setText(player.pandingSigns[i].actualCard.CN.slice(0, 1))
                } else {
                    this.pandingCardImages![i].setAlpha(0)
                    this.pandingCardTexts![i].setAlpha(0)
                }
            }
            this._pandingCardsLength = player.pandingSigns.length
        }
    }

    onPlayerBloodChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId]

        if (this._currentBlood != player.currentBlood) {
            this.setBloods(player.currentBlood)
            this._currentBlood = player.currentBlood
        }
    }

    onCardNumberChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId]

        if (this._cardNumber != player.cards.length) {
            this.cardNumObj!.setText(player.cards.length.toString())
            this._cardNumber = player.cards.length
        }
    }

    onTieSuoChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId]

        if (this._isTieSuo != player.isTieSuo) {
            this.tieSuoImage!.setAlpha(player.isTieSuo ? 1 : 0)
            // this.tieSuoImage.setAlpha(1)
            this._isTieSuo = player.isTieSuo
        }
    }

    onPlayerTurnAndStageChange(gameStatus: GameStatus) {
        if (gameStatus.stage.playerId === this.playerId) {
            this.myTurnStroke!.setAlpha(1);
            this.stageText!.setAlpha(1);
            this.stageText!.setText(i18(i18Config.STAGE_DESC,
                {
                    stage: (getI18Lan() == I18LANS.EN ?
                        STAGE_NAMES[gameStatus.stage.stageIndex] :
                        STAGE_NAMES_CN[gameStatus.stage.stageIndex])
                })
            )
        } else {
            this.myTurnStroke!.setAlpha(0);
            this.stageText!.setAlpha(0)
        }
    }

    onPlayerDisableChange(gameFEStatus: GameFEStatus) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus as GameStatus

        const setPlayerDisable = () => {
            this.playerImage!.setTint(colorConfigJson.disablePlayer);
            this._disable = true;
        }
        const setPlayerAble = () => {
            this.playerImage!.clearTint();
            this._disable = false;
        }

        if (this._actualCardId == gameFEStatus?.actualCard?.cardId &&
            this._selectedTargetPlayersLength == gameFEStatus?.selectedTargetPlayers?.length) {
            return
        }

        const targetPlayer = gameStatus.players[this.playerId];
        const playerAble = getIfPlayerAble(gameStatus, gameFEStatus, targetPlayer)
        playerAble ? setPlayerAble() : setPlayerDisable()

        this._actualCardId = gameFEStatus?.actualCard?.cardId
        this._selectedTargetPlayersLength = gameFEStatus?.selectedTargetPlayers?.length
    }

    onPlayerSelectedChange(gameFEStatus: GameFEStatus) {
        const isSelected = !!gameFEStatus.selectedTargetPlayers.find((u) => u.playerId == this.playerId)
        this.selectedStroke!.setAlpha(isSelected ? 1 : 0);
    }

    onPlayerDieChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId]
        if (player.isDead) {
            this.drawIsDead();
            this._isDead = true;
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        if (this._isDead)
            return

        if (!this.isMe) {
            this.onPlayerTurnAndStageChange(gameStatus);
        }
        this.onCardNumberChange(gameStatus);
        this.onTieSuoChange(gameStatus);
        this.onPlayerBloodChange(gameStatus);
        this.onPandingCardsChange(gameStatus);
        this.onPlayerDieChange(gameStatus)
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        if (this._isDead)
            return

        this.onPlayerSelectedChange(gameFEStatus);
        this.onPlayerDisableChange(gameFEStatus);
    }
}
