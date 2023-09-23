import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {CARD_CONFIG, DELAY_SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {GameFEStatus} from "../../types/gameFEStatus";
import {getIsAllSelectHeroDone} from "../../utils/playerUtils";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {uuidv4} from "../../utils/uuid";
import {Player} from "../../types/player";
import {
    getPlayerStrokeAlphaAndColor,
    reDrawPlayerStroke,
    sharedDrawPlayerStroke
} from "../../utils/draw/drawPlayerStrokeUtils";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {isLanEn, i18} from "../../i18n/i18nUtils";
import {Skill} from "../../types/skill";
import {i18Config} from "../../i18n/i18Config";
import {TOOL_TIP_CARD_TYPE} from "../../config/toolTipConfig";
import {getCardText, getHeroText, splitText} from "../../utils/string/stringUtils";
import {
    TOOL_TIP_CARD_MAX_LENGTH,
    TOOL_TIP_HERO_MAX_LENGTH_CN,
    TOOL_TIP_HERO_MAX_LENGTH_EN
} from "../../config/stringConfig";
import {
    getCanISelectMySelfAsTarget,
    getIsBoardPlayerAble,
    getNeedSelectPlayersMinMax
} from "../../utils/validation/validationUtils";
import {BoardPlayerSkills} from "./BoardPlayerSkills";
import {Card} from "../../types/card";
import {EquipmentCard} from "../Card/EquipmentCard";
import differenceBy from "lodash/differenceBy";

const reduceBloodOut = 50;
const reduceBloodIn = 300;

export class BoardPlayer {
    obId: string;
    gamingScene: GamingScene;
    playerId: string;
    playerName: string;
    teamName: string;
    linePosition: { x: number, y: number };
    playerPosition: { x: number, y: number };
    isDead?: boolean;
    isMe: boolean;

    positionX: number;
    positionY: number;

    maxPandingCardsNumber: number;

    _heroId: string;
    _disable: boolean;
    _pandingCardsLength: number;
    _playerEquipmentCards: Card[];
    _blood: number;
    _cardNumber: number;
    _isTieSuo: boolean;
    // player disable inner state
    _actualCardId?: string;
    _selectedTargetPlayersLength?: number;
    _chooseToReleaseSkill?: boolean;

    phaserGroup: PhaserGameObject[];

    playerStroke?: Phaser.GameObjects.Graphics;
    cardNumObj?: Phaser.GameObjects.Text;
    tieSuoImage?: Phaser.GameObjects.Image;
    playerImage?: Phaser.GameObjects.Image;
    teamImage?: Phaser.GameObjects.Image;
    bloodsBgGraphics?: Phaser.GameObjects.Graphics;
    bloodImages?: Phaser.GameObjects.Image[];
    pandingCardImages?: Phaser.GameObjects.Image[];
    pandingCardTexts?: Phaser.GameObjects.Text[];
    skillImages?: Phaser.GameObjects.Image[];
    skillTexts?: Phaser.GameObjects.Text[];

    constructor(gamingScene: GamingScene, player: Player) {
        this.obId = uuidv4();

        // init
        this.gamingScene = gamingScene;
        this.playerId = player.playerId;
        this.playerName = player.playerName;
        this.teamName = player.teamName
        this.linePosition = player.linePosition;
        this.playerPosition = player.playerPosition;
        this.isMe = this.playerId === getMyPlayerId();

        // position
        this.positionX = this?.playerPosition?.x;
        this.positionY = this?.playerPosition?.y;

        // phaser objects
        this.phaserGroup = [];
        this.bloodImages = []; //从下往上
        this.pandingCardImages = []; //从右往左
        this.pandingCardTexts = []; //从右往左
        this.skillImages = [];
        this.skillTexts = [];

        // varible
        this.maxPandingCardsNumber = Object.keys(DELAY_SCROLL_CARDS_CONFIG).length;

        // init inner state
        this._heroId = '';
        this._disable = false;
        this._pandingCardsLength = 0;
        this._playerEquipmentCards = [];
        this._blood = 0;
        this._cardNumber = 0;
        this._isTieSuo = false;
        // player disable inner state
        this._actualCardId = '';
        this._selectedTargetPlayersLength = 0;
        this._chooseToReleaseSkill = undefined;

        this.drawPlayer(this.gamingScene.gameStatusObserved.gameStatus!);
        this.drawPlayerName();
        this.drawTeamTag();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }

    initHero(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId]

        this.drawStroke();
        this.drawPlayer(gameStatus);
        this.drawBloodsBg(player.maxBlood);
        this.drawBloods(player.maxBlood);
        this.setBloods(player.currentBlood);
        this.drawPlayerName();
        this.drawTeamTag();
        this.drawPandingCards();
        this.drawTieSuo(player.isTieSuo);
        this.drawCardNumber();

        if (player.isDead) {
            this.drawIsDead();
            this.isDead = true;
        }

        if (this.isMe) {
            this.drawHeroSkills(player.skills);
        }

        this.drawWound();
        this.bindEvent();
    }

    drawStroke() {
        const {stroke} = sharedDrawPlayerStroke(this.gamingScene, {
            x: this.positionX - sizeConfig.player.width / 2,
            y: this.positionY - sizeConfig.player.height / 2,
        })
        this.playerStroke = stroke;
        this.playerStroke.setAlpha(0);

        this.phaserGroup.push(stroke)
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

        this.phaserGroup.push(this.cardNumObj)
    }

    drawPlayer(gameStatus: GameStatus) {
        const player = gameStatus?.players[this.playerId]
        const playerImage = player?.heroId || 'xuanjiang';

        this.playerImage = this.gamingScene.add.image(
            this.positionX - sizeConfig.player.width / 2,
            this.positionY - sizeConfig.player.height / 2,
            playerImage).setInteractive()
        this.playerImage.setDisplaySize(sizeConfig.player.width,
            sizeConfig.player.width * (sizeConfig.playerSource.height / sizeConfig.playerSource.width))
        this.playerImage.setOrigin(0, 0)

        var cropRect = new Phaser.Geom.Rectangle(0, 0,
            sizeConfig.playerSource.width,
            sizeConfig.playerSource.width * 1.2);

        this.playerImage.setCrop(cropRect);

        if (player?.heroId) {
            this.playerImage.setData("hoverData", {
                text: splitText(getHeroText(player), isLanEn() ? TOOL_TIP_HERO_MAX_LENGTH_EN : TOOL_TIP_HERO_MAX_LENGTH_CN),
                toolTipType: TOOL_TIP_CARD_TYPE.PLAYER,
            })
            this.phaserGroup.push(this.playerImage);
        }
    }

    drawPlayerName() {
        const nameText = this.gamingScene.add.text(
            this.positionX - sizeConfig.player.width / 2,
            this.positionY - sizeConfig.player.height / 2,
            " " + this.playerName,
            // @ts-ignore
            {fill: COLOR_CONFIG.whiteString, fixedWidth: sizeConfig.player.width}
        );

        const padding = 2;
        nameText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        nameText.setBackgroundColor("rgba(0,0,0,0.7)")

        this.phaserGroup.push(nameText)
    }

    drawTeamTag() {
        this.teamImage = this.gamingScene.add.image(
            this.positionX + sizeConfig.player.width / 2 - sizeConfig.teamTag.width + 2,
            this.positionY - sizeConfig.player.height / 2 + 20,
            this.teamName)
        this.teamImage.setDisplaySize(sizeConfig.teamTag.width, sizeConfig.teamTag.height)
        this.teamImage.setOrigin(0, 0)

        this.phaserGroup.push(this.teamImage)
    }

    drawTieSuo(isTieSuo: boolean) {
        this.tieSuoImage = this.gamingScene.add.image(
            this.positionX,
            this.positionY,
            "tiesuo");
        this.tieSuoImage.displayHeight = sizeConfig.player.height * 0.3;
        this.tieSuoImage.displayWidth = sizeConfig.player.width;
        this.tieSuoImage.setAlpha(isTieSuo ? 1 : 0);

        this.phaserGroup.push(this.tieSuoImage)
    }

    drawPandingCards() {
        const stepX = sizeConfig.player.width / 4.5;
        for (let i = 0; i < this.maxPandingCardsNumber; i++) {
            const x = this.isMe ? sizeConfig.controlEquipment.width * 1.1 - stepX * i : this.positionX + sizeConfig.player.width / 2 + 5 - stepX * i
            const y = this.isMe ? sizeConfig.playersArea.height : this.positionY + sizeConfig.player.height / 2 + 5

            const pandingCardImage = this.gamingScene.add.image(x, y, "white");
            pandingCardImage.displayHeight = sizeConfig.player.width / 8;
            pandingCardImage.displayWidth = sizeConfig.player.width / 8;
            pandingCardImage.setRotation(Math.PI / 4)
            // @ts-ignore
            pandingCardImage.setTint(COLOR_CONFIG.card)
            pandingCardImage.setAlpha(0)
            pandingCardImage.setDepth(DEPTH_CONFIG.PANDING_SIGN)
            this.pandingCardImages!.push(pandingCardImage);
            this.phaserGroup.push(pandingCardImage)


            const pandingCardText = this.gamingScene.add.text(x, y, "",
                // @ts-ignore
                {fill: COLOR_CONFIG.black, align: "center"}
            );
            pandingCardText.setOrigin(0.5, 0.5)
            pandingCardText.setFontSize(sizeConfig.player.width / 11)
            pandingCardText.setAlpha(0)
            pandingCardText.setDepth(DEPTH_CONFIG.PANDING_SIGN)
            this.pandingCardTexts!.push(pandingCardText);
            this.phaserGroup.push(pandingCardText)
        }
    }

    drawBloodsBg(maxBlood: number) {
        const discount = maxBlood >= 4 ? 1 : 0.75;
        const meWidth = sizeConfig.player.width * 0.18
        const meHeight = sizeConfig.player.height * 0.62 * discount

        const graphicsW = this.isMe ? meWidth : meWidth * 0.8
        const graphicsH = this.isMe ? meHeight : meHeight * 0.8
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
        this.phaserGroup.push(this.bloodsBgGraphics)
    }

    drawBloods(maxBlood: number) {
        const bloodHeight = this.isMe ? sizeConfig.player.height * 0.15 : sizeConfig.player.height * 0.15 * 0.8;
        const bloodWidth = bloodHeight * 1.5333;
        const marginBottom = this.isMe ? 4 : 0;

        for (let i = 0; i < maxBlood; i++) {
            const bloodImage = this.gamingScene.add.image(
                this.positionX + sizeConfig.player.width / 2 * 0.85,
                this.positionY - marginBottom + sizeConfig.player.height / 2 * 0.86 - (bloodHeight * 0.9 * i),
                "gouyu");
            bloodImage.displayHeight = bloodHeight;
            bloodImage.displayWidth = bloodWidth;

            this.bloodImages!.push(bloodImage);
            this.phaserGroup.push(bloodImage)
        }
    }

    drawIsDead() {
        // @ts-ignore
        this.playerImage!.setTint(COLOR_CONFIG.disablePlayer);

        const isDeadText = this.gamingScene.add.text(
            this.positionX,
            this.positionY,
            i18(i18Config.IS_DEAD),
            // @ts-ignore
            {fill: "#cb0c0c", align: "center"}
        );
        isDeadText.setOrigin(0.5, 0.5)
        const padding = 2;
        isDeadText.setPadding(padding + 0, padding + 2, padding + 0, padding + 0);
        isDeadText.setFontSize(isLanEn() ? 30 : 40)
        isDeadText.setRotation(-Math.PI / 10)

        this.phaserGroup.push(isDeadText)
    }

    drawWound() {
        const wound = this.gamingScene.add.image(
            this.positionX,
            this.positionY,
            "wound").setAlpha(0);

        wound.setData('name', 'wound');
        this.phaserGroup.push(wound);
    }

    drawHeroSkills(skills: Skill[]) {
        const boardPlayerSkills = new BoardPlayerSkills(this.gamingScene, this.positionX, this.positionY, skills)
        this.phaserGroup = this.phaserGroup.concat(boardPlayerSkills.phaserGroup);
    }

    setBloods(number: number) {
        let color;
        if (number > 2) {
            color = COLOR_CONFIG.bloodGreen
        } else if (number == 2) {
            color = COLOR_CONFIG.bloodYellow
        } else {
            color = COLOR_CONFIG.bloodRed
        }

        for (let i = 0; i < this.bloodImages!.length; i++) {
            const bloodNumber = i + 1;
            color = (bloodNumber > number) ? COLOR_CONFIG.grey555 : color
            this.bloodImages![i].setTint(Number(color))
        }
    }

    bindEvent() {
        this.playerImage!.on('pointerdown', () => {
            const gameFEStatusObserved = this.gamingScene.gameFEStatusObserved
            const curGameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
            const curGameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
            const player = curGameStatus.players[this.playerId]

            if (this.isDead) {
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

            // 检查是否指定我自己为目标
            if (this.isMe) {
                const canISelectMySelfAsTarget = getCanISelectMySelfAsTarget(curGameStatus, curGameFEStatus)
                if (!canISelectMySelfAsTarget) {
                    return;
                }
            }

            // validate是否选择了足够目标
            if (curGameFEStatus.selectedTargetPlayers.length >= getNeedSelectPlayersMinMax(curGameStatus, curGameFEStatus).max) {
                return;
            }

            gameFEStatusObserved.selectPlayer(player)
        });
    }

    onPandingCardsChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId];

        if (this._pandingCardsLength != player.pandingSigns.length) {
            for (let i = 0; i < this.maxPandingCardsNumber; i++) {
                if (player.pandingSigns[i]) {
                    const pandingSign = player.pandingSigns[i]
                    const {card, actualCard} = pandingSign
                    const pandingCardText = i18(CARD_CONFIG[actualCard.key])?.slice(0, 1);
                    this.pandingCardTexts![i].setAlpha(1).setText(pandingCardText)

                    this.pandingCardImages![i].setData('hoverData', {
                        card,
                        text: splitText(getCardText(actualCard), TOOL_TIP_CARD_MAX_LENGTH),
                        toolTipType: TOOL_TIP_CARD_TYPE.PANDING_CARD,
                    }).setInteractive().setAlpha(1);
                } else {
                    this.pandingCardImages![i].setAlpha(0)
                    this.pandingCardTexts![i].setAlpha(0)
                }
            }
            this._pandingCardsLength = player.pandingSigns.length
        }
    }

    onEquipmentCardsChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId];
        const playerEquipmentCards = [player.weaponCard, player.shieldCard, player.minusHorseCard, player.plusHorseCard].filter(Boolean)

        const needNewCards = differenceBy(playerEquipmentCards, this._playerEquipmentCards, 'cardId');
        needNewCards.forEach((card) => {
            const equipmentCard = new EquipmentCard(this.gamingScene, card, this.playerId);
            this.phaserGroup = this.phaserGroup.concat(equipmentCard.phaserGroup)
        })

        this._playerEquipmentCards = playerEquipmentCards
    }

    startReduceBloodMove() {
        this.phaserGroup.forEach((obj) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    // @ts-ignore
                    value: obj.x - 50,
                    duration: reduceBloodOut,
                },
                onComplete: () => {
                    this.gamingScene.tweens.add({
                        targets: obj,
                        x: {
                            // @ts-ignore
                            value: obj.x + 50,
                            duration: reduceBloodIn,
                        },
                    });
                }
            });

            if (obj.getData('name') == 'wound') {
                this.gamingScene.tweens.add({
                    targets: obj,
                    alpha: {
                        // @ts-ignore
                        value: 1,
                        duration: reduceBloodOut,
                    },
                    onComplete: () => {
                        this.gamingScene.tweens.add({
                            targets: obj,
                            alpha: {
                                // @ts-ignore
                                value: 0,
                                duration: reduceBloodIn,
                            },
                        });
                    }
                });
            }
        });
    }

    onPlayerBloodChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId]

        if (this._blood != player.currentBlood) {
            this.setBloods(player.currentBlood)
            if (player.currentBlood < this._blood) {
                this.startReduceBloodMove();
            }
            this._blood = player.currentBlood;
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

    onPlayerDisableChange(gameFEStatus: GameFEStatus) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus as GameStatus

        const setPlayerDisable = () => {
            // @ts-ignore
            this.playerImage!.setTint(COLOR_CONFIG.disablePlayer);
            this._disable = true;
        }
        const setPlayerAble = () => {
            this.playerImage!.clearTint();
            this._disable = false;
        }

        if (this._actualCardId == gameFEStatus?.actualCard?.cardId &&
            this._selectedTargetPlayersLength == gameFEStatus?.selectedTargetPlayers?.length &&
            this._chooseToReleaseSkill == gameStatus.skillResponse?.chooseToReleaseSkill
        ) {
            return
        }

        const targetPlayer = gameStatus.players[this.playerId];
        const playerAble = getIsBoardPlayerAble(gameStatus, gameFEStatus, targetPlayer)
        playerAble ? setPlayerAble() : setPlayerDisable()

        this._actualCardId = gameFEStatus?.actualCard?.cardId
        this._selectedTargetPlayersLength = gameFEStatus?.selectedTargetPlayers?.length //借刀杀人
        this._chooseToReleaseSkill = gameStatus.skillResponse?.chooseToReleaseSkill
    }


    onPlayerStrokeChange(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        const {color, alpha, lineWidth} = getPlayerStrokeAlphaAndColor(gameStatus, gameFEStatus, this.playerId);
        reDrawPlayerStroke(this.playerStroke!, {
            x: this.positionX - sizeConfig.player.width / 2,
            y: this.positionY - sizeConfig.player.height / 2,
            // @ts-ignore
            color,
            alpha,
            lineWidth,
        })
    }

    onPlayerDieChange(gameStatus: GameStatus) {
        const player = gameStatus.players[this.playerId]
        if (player.isDead) {
            this.drawIsDead();
            this.isDead = true;
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        if (this.isDead)
            return

        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!
        const allSelectHeroDone = getIsAllSelectHeroDone(gameStatus)
        const heroId = gameStatus.players[this.playerId].heroId

        if (this.isMe) { // 是我的话 我选完就要显示武将
            if (heroId && !this._heroId) {
                this._heroId = heroId;
                this.initHero(gameStatus);
            }
        } else {
            if (heroId && !this._heroId && allSelectHeroDone) {
                this._heroId = heroId
                this.initHero(gameStatus);
            }
        }


        if (allSelectHeroDone) { // 选将完成了
            this.onPlayerStrokeChange(gameStatus, gameFEStatus);
            this.onCardNumberChange(gameStatus);
            this.onTieSuoChange(gameStatus);
            this.onPlayerBloodChange(gameStatus);
            this.onPandingCardsChange(gameStatus);
            this.onEquipmentCardsChange(gameStatus);
            this.onPlayerDieChange(gameStatus)
        }
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        if (this.isDead)
            return

        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!

        const allSelectHeroDone = getIsAllSelectHeroDone(gameStatus)
        if (allSelectHeroDone) { // 选将完成了
            this.onPlayerStrokeChange(gameStatus, gameFEStatus);
            this.onPlayerDisableChange(gameFEStatus);
        }
    }
}
