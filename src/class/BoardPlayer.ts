import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {
    getCanSelectMeAsFirstTargetCardNamesClosure, getCanSelectMeAsSecondTargetCardNamesClosure,
    getDistanceFromAToB,
    getIfPlayerHasAnyCards, getIfPlayerHasWeapon,
    getMyPlayerId,
    uuidv4
} from "../utils/gameStatusUtils";
import {BASIC_CARDS_CONFIG, DELAY_SCROLL_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {GamingScene, PlayerEquipmentGroup} from "../types/phaser";
import {Card, GameStatus, PandingSign, Player} from "../types/gameStatus";
import {ColorConfigJson} from "../types/config";
import {GameFEStatus} from "../types/gameFEStatus";
import {attachFEInfoToCard} from "../utils/cardUtils";

const colorConfigJson = colorConfig as unknown as ColorConfigJson;

export class BoardPlayer {
    obId: string;
    gamingScene: GamingScene;
    player: Player;
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
    _isDead?: boolean;

    myTurnStroke?: Phaser.GameObjects.Graphics;
    selectedStroke?: Phaser.GameObjects.Graphics;
    cardNumObj?: Phaser.GameObjects.Text;
    tieSuoImage?: Phaser.GameObjects.Image;
    stageText?: Phaser.GameObjects.Text;
    weaponGroup?: PlayerEquipmentGroup;
    shieldGroup?: PlayerEquipmentGroup;
    plusHorseGroup?: PlayerEquipmentGroup;
    minusHorseGroup?: PlayerEquipmentGroup;
    playerImage?: Phaser.GameObjects.Image;
    isDeadText?: Phaser.GameObjects.Text;
    bloodsBgGraphics?: Phaser.GameObjects.Graphics;

    constructor(gamingScene: GamingScene, player: Player) {
        this.obId = uuidv4();

        // init
        this.gamingScene = gamingScene;
        this.player = player;
        this.linePosition = player.linePosition;
        this.playerPosition = player.playerPosition;
        this.isMe = this.player.playerId === getMyPlayerId();


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
        this._currentBlood = this.player.currentBlood;
        this._cardNumber = this.player.cards.length;
        this._isTieSuo = this.player.isTieSuo;
        this._actualCardId = '';

        if (!this.isMe) {
            this.drawMyTurnStroke();
            this.drawStageText();
        }

        this.drawMyTurnStroke();
        this.drawSelectedStroke();
        this.drawPlayer();
        this.drawBloodsBg();
        this.drawBloods();
        this.setBloods(this.player.currentBlood);
        this.drawStageText();
        if (!this.isMe) {
            this.drawEquipments();
        }
        this.drawPandingCards();
        this.drawTieSuo();
        this.drawCardNumber();
        if (this.player.isDead) {
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

        for (let i = 0; i < this.player.maxBlood; i++) {
            const bloodImage = this.gamingScene.add.image(
                this.positionX + sizeConfig.player.width / 2 * 0.86,
                this.positionY + sizeConfig.player.height / 2 * 0.86 - (bloodHeight * 0.81 * i),
                "greenGouyu");
            bloodImage.displayHeight = bloodHeight;
            bloodImage.displayWidth = bloodWidth;
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
        // this.stageText.setBackgroundColor("#fff")
        this.stageText.setFontSize(10)
        this.stageText.setAlpha(0)
    }

    drawEquipments() {
        for (let i = 0; i < 4; i++) {
            this.drawEquipment(i);
        }
    }

    drawEquipment(index: number) {
        const padding = 1;
        const offsetY = sizeConfig.player.height / 11;
        const offsetYStep = sizeConfig.player.height / 10;
        const fontSize = sizeConfig.player.height / 15;
        const groupMap: { [key: number]: 'weaponGroup' | 'shieldGroup' | 'plusHorseGroup' | 'minusHorseGroup' } = {
            0: 'weaponGroup',
            1: 'shieldGroup',
            2: 'plusHorseGroup',
            3: 'minusHorseGroup'
        };

        // distanceText 包含背景设置
        const groupName = groupMap[index];
        this[groupName] = {};
        this[groupName]!.distanceText = this.gamingScene.add.text(
            this.positionX - sizeConfig.player.width / 2,
            this.positionY + offsetY + offsetYStep * index,
            "",
            // @ts-ignore
            {fill: "#000", align: "left", fixedWidth: sizeConfig.player.width * 0.8}
        );

        this[groupName]!.distanceText!.setPadding(padding + 5, padding + 1, padding + 0, padding + 0);
        this[groupName]!.distanceText!.setBackgroundColor("#ccc")
        this[groupName]!.distanceText!.setFontSize(fontSize)
        this[groupName]!.distanceText!.setAlpha(0)

        this[groupName]!.nameText = this.gamingScene.add.text(
            this.positionX - sizeConfig.player.width / 2 + sizeConfig.player.width * 0.19,
            this.positionY + offsetY + offsetYStep * index,
            "",
            // @ts-ignore
            {fill: "#000", align: "justify"}
        );
        this[groupName]!.nameText!.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
        this[groupName]!.nameText!.setFontSize(fontSize)
        this[groupName]!.nameText!.setAlpha(0)


        this[groupName]!.huaseNumText = this.gamingScene.add.text(
            this.positionX - sizeConfig.player.width / 2 + sizeConfig.player.width * 0.6,
            this.positionY + offsetY + offsetYStep * index,
            "",
            // @ts-ignore
            {fill: "#000", align: "center"}
        );
        this[groupName]!.huaseNumText!.setPadding(padding + 0, padding + 1, padding + 0, padding + 0);
        this[groupName]!.huaseNumText!.setFontSize(fontSize)
        this[groupName]!.huaseNumText!.setAlpha(0)
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
        }
    }

    bindEvent() {
        this.playerImage!.on('pointerdown', () => {
            const curGameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;
            const curGameStatus = this.gamingScene.gameStatusObserved.gameStatus;
            if (!curGameFEStatus.actualCard) {
                return;
            }

            if (this._disable) {
                return;
            }

            // 自己已经选中过
            if (curGameFEStatus.selectedTargetPlayers.find((u: Player) => u.playerId == this.player.playerId)) {
                return;
            }

            // 因为mePlayer_disable永远是false 所以在这里validate 这张卡能否以自己为目标的卡
            if (curGameFEStatus.selectedTargetPlayers.length == 0) {
                if (!getCanSelectMeAsFirstTargetCardNamesClosure()().includes(curGameFEStatus.actualCard!.CN) && this.player.playerId == getMyPlayerId()) {
                    return;
                }
            }
            if (curGameFEStatus.selectedTargetPlayers.length == 1) {
                if (!getCanSelectMeAsSecondTargetCardNamesClosure()().includes(curGameFEStatus.actualCard!.CN) && this.player.playerId == getMyPlayerId()) {
                    return;
                }
            }

            // validate是否选择了足够目标
            const targetMinMax = attachFEInfoToCard(curGameFEStatus.actualCard)!.targetMinMax;
            if (curGameFEStatus.selectedTargetPlayers.length >= targetMinMax.max) {
                return;
            }

            curGameFEStatus.selectedTargetPlayers.push(this.player);
            this.gamingScene.gameFEStatusObserved.setSelectedGameEFStatus(curGameFEStatus);
        });
    }

    drawBloodsBg() {
        const graphicsW = this.isMe ? sizeConfig.player.width * 0.16 : sizeConfig.player.width * 0.16 * 0.8
        const graphicsH = this.isMe ? sizeConfig.player.height * 0.52 : sizeConfig.player.height * 0.52 * 0.8
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
            this.player.cardId).setInteractive({cursor: 'pointer'}).setScale(140 / 536);
        this.playerImage.setOrigin(0.5, 0.45) // 竖长图片被crop了下面 所以setOriginY 稍微让图片往下挪一点

        var cropRect = new Phaser.Geom.Rectangle(0, 0, 536, 536 * (sizeConfig.player.height / sizeConfig.player.width));

        this.playerImage.setCrop(cropRect);
    }

    onEquipmentsChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.player.playerId];
        [
            {card: "weaponCard", group: "weaponGroup"},
            {card: "shieldCard", group: "shieldGroup"},
            {card: "plusHorseCard", group: "plusHorseGroup"},
            {card: "minusHorseCard", group: "minusHorseGroup"},
        ].forEach((ele, index) => {
            const card = player[ele.card as keyof Player] as Card
            // @ts-ignore
            const group = this[ele.group]
            if (card) {
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

    onPandingCardsChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.player.playerId];

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
        const player = gameStatus.players[this.player.playerId]

        if (this._currentBlood != player.currentBlood) {
            this.setBloods(player.currentBlood)
            this._currentBlood = player.currentBlood
        }
    }

    onCardNumberChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.player.playerId]

        if (this._cardNumber != player.cards.length) {
            this.cardNumObj!.setText(player.cards.length.toString())
            this._cardNumber = player.cards.length
        }
    }

    onTieSuoChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.player.playerId]

        if (this._isTieSuo != player.isTieSuo) {
            this.tieSuoImage!.setAlpha(player.isTieSuo ? 1 : 0)
            // this.tieSuoImage.setAlpha(1)
            this._isTieSuo = player.isTieSuo
        }
    }

    onPlayerTurnAndStageChange(gameStatus: GameStatus) {
        if (gameStatus.stage.playerId === this.player.playerId) {
            this.myTurnStroke!.setAlpha(1);
            this.stageText!.setAlpha(1);
            this.stageText!.setText(gameStatus.stage.stageNameCN + '阶段...')
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

        if (this._actualCardId != gameFEStatus?.actualCard?.cardId) {
            const actualCardName = gameFEStatus?.actualCard?.CN
            const mePlayer = gameStatus.players[getMyPlayerId()];
            const targetPlayer = gameStatus.players[this.player.playerId];
            // 计算杀的距离
            if (actualCardName == BASIC_CARDS_CONFIG.SHA.CN) {
                let attackDistance, distanceBetweenAAndB;

                const curScrollResStage = gameStatus.scrollResStages[0];
                if (curScrollResStage) { // 响应锦囊的杀 setPlayerAble
                    setPlayerAble()
                } else {
                    attackDistance = mePlayer?.weaponCard?.distance || 1;
                    distanceBetweenAAndB = getDistanceFromAToB(mePlayer, targetPlayer, Object.keys(gameStatus.players).length)
                    if (attackDistance >= distanceBetweenAAndB) {
                        setPlayerAble()
                    } else {
                        setPlayerDisable();
                    }
                }

            } else if (actualCardName == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN) {
                if (gameFEStatus.selectedTargetPlayers.length == 0) {
                    if (getIfPlayerHasWeapon(targetPlayer)) {
                        setPlayerAble()
                    } else {
                        setPlayerDisable();
                    }
                } else if (gameFEStatus.selectedTargetPlayers.length == 1) {
                    let attackDistance, distanceBetweenAAndB;
                    const daoOwnerPlayer = gameFEStatus.selectedTargetPlayers[0];
                    attackDistance = daoOwnerPlayer?.weaponCard?.distance || 1;
                    distanceBetweenAAndB = getDistanceFromAToB(daoOwnerPlayer, targetPlayer, Object.keys(gameStatus.players).length)
                    if (attackDistance >= distanceBetweenAAndB) {
                        setPlayerAble()
                    } else {
                        setPlayerDisable();
                    }
                }
            } else if (actualCardName == DELAY_SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN) {
                if (targetPlayer.pandingSigns.find((sign: PandingSign) => sign.actualCard.CN == DELAY_SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.CN)) {
                    setPlayerDisable()
                } else {
                    setPlayerAble()
                }
            } else if (actualCardName == DELAY_SCROLL_CARDS_CONFIG.BING_LIANG_CUN_DUAN.CN ||
                actualCardName == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN
            ) {
                const distanceBetweenMeAndTarget = getDistanceFromAToB(mePlayer, targetPlayer, Object.keys(gameStatus.players).length)
                if (1 >= distanceBetweenMeAndTarget) {
                    setPlayerAble()
                } else {
                    setPlayerDisable();
                }
            } else if (actualCardName == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN ||
                actualCardName == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN) {
                if (getIfPlayerHasAnyCards(targetPlayer)) {
                    setPlayerAble()
                } else {
                    setPlayerDisable()
                }
            } else {
                setPlayerAble()
            }
            this._actualCardId = gameFEStatus?.actualCard?.cardId
        }
    }

    onPlayerSelectedChange(gameFEStatus: GameFEStatus) {
        const isSelected = !!gameFEStatus.selectedTargetPlayers.find((u) => u.playerId == this.player.playerId)
        this.selectedStroke!.setAlpha(isSelected ? 1 : 0);
    }

    onPlayerDieChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.player.playerId]
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
            this.onEquipmentsChange(gameStatus);
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
