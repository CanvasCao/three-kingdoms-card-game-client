import {Card, GameStatus, ScrollResStage, Player} from "../types/gameStatus";
import {GamingScene} from "../types/phaser";
import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {getMyPlayerId, uuidv4, verticalRotationSting} from "../utils/gameStatusUtils";
import {SCROLL_CARDS_CONFIG} from "../config/cardConfig";
import {sharedDrawCard} from "../utils/drawCardUtils";
import {sample, shuffle} from "lodash";
import emitMap from "../config/emitMap.json";
import {EmitCardBoardData} from "../types/emit";

const gridOffset = {
    line1: {y: -55},
    line2: {y: 80},
    column1: {x: -280},
    column2: {x: 130}
}
const categoryDiffX = -70;
const cardMargin = 5
const boardAlpha = 0.4;

const boardSize = {
    height: 320,
    width: 760,
}

const boardDepth = 100;

export class PlayerCardsBoard {
    obId: string;
    gamingScene: GamingScene;

    initX: number;
    initY: number;

    maskImg?: Phaser.GameObjects.Image;
    boardImg?: Phaser.GameObjects.Image;
    titleText?: Phaser.GameObjects.Text;

    handCardsCategoryText?: Phaser.GameObjects.Text;
    equipmentCardsCategoryText?: Phaser.GameObjects.Text;
    pandingCardsCategoryText?: Phaser.GameObjects.Text;

    handCardsPlaceholder?: Phaser.GameObjects.Image;
    equipmentCardsPlaceholders: Phaser.GameObjects.Image[];
    equipmentCardsPlaceholderTexts: Phaser.GameObjects.Text[];
    pandingCardsPlaceholders: Phaser.GameObjects.Image[];
    pandingCardsPlaceholderTexts: Phaser.GameObjects.Text[];

    destoryObjects: (Phaser.GameObjects.Image | Phaser.GameObjects.Text)[];
    // innerState
    _stageId: string;
    _selectedCardId: string;


    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.maskImg;

        this.initX = sizeConfig.background.width / 2;
        this.initY = sizeConfig.background.height / 2;

        this.maskImg;
        this.boardImg;
        this.handCardsCategoryText;
        this.equipmentCardsCategoryText;
        this.pandingCardsCategoryText;

        this.handCardsPlaceholder;
        this.equipmentCardsPlaceholders = [];
        this.equipmentCardsPlaceholderTexts = [];
        this.pandingCardsPlaceholders = [];
        this.pandingCardsPlaceholderTexts = [];

        this.destoryObjects = [];

        this._stageId = '';
        this._selectedCardId = '';

        this.drawBackground();
        this.drawTitle();
        this.drawCardCategories();
        this.drawCardPlaceHolders();

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawBackground() {
        this.maskImg = this.gamingScene.add.image(0, 0, 'white').setInteractive()
        this.maskImg.displayHeight = sizeConfig.background.height;
        this.maskImg.displayWidth = sizeConfig.background.width;
        this.maskImg.setAlpha(0)
        this.maskImg.setOrigin(0, 0)
        this.maskImg.setDepth(boardDepth)

        this.boardImg = this.gamingScene.add.image(this.initX, this.initY, 'white')
        // @ts-ignore
        this.boardImg.setTint("0x000000")
        this.boardImg.displayHeight = boardSize.height;
        this.boardImg.displayWidth = boardSize.width;
        this.boardImg.setAlpha(0)
        this.boardImg.setDepth(boardDepth)
    }

    drawTitle() {
        this.titleText = this.gamingScene.add.text(this.initX, this.initY - 138, '')
        this.titleText.setOrigin(0.5, 0.5)
        this.titleText.setAlpha(0)
        this.titleText.setPadding(0, 2, 0, 0)
        this.titleText.setDepth(boardDepth)
    }

    drawCardCategories() {
        const fontSize = 14
        this.handCardsCategoryText = this.gamingScene.add.text(
            this.initX + gridOffset.column1.x + categoryDiffX,
            this.initY + gridOffset.line1.y,
            verticalRotationSting("手牌"),
        );

        this.equipmentCardsCategoryText = this.gamingScene.add.text(
            this.initX + gridOffset.column1.x + categoryDiffX,
            this.initY + gridOffset.line2.y,
            verticalRotationSting("装备牌"),
        );

        this.pandingCardsCategoryText = this.gamingScene.add.text(
            this.initX + gridOffset.column2.x + categoryDiffX,
            this.initY + gridOffset.line2.y,
            verticalRotationSting("延时锦囊牌"),
        );

        [this.handCardsCategoryText, this.equipmentCardsCategoryText, this.pandingCardsCategoryText].forEach(text => {
            text.setFontSize(fontSize)
            text.setOrigin(0, 0.5)
            text.setAlpha(0)
            text.setDepth(boardDepth)
        })
    }

    drawCardPlaceHolders() {
        this.handCardsPlaceholder = this.gamingScene.add.image(
            this.initX + gridOffset.column1.x - sizeConfig.controlCard.width / 2,
            this.initY + gridOffset.line1.y, 'white')
        // @ts-ignore
        this.handCardsPlaceholder.setTint(colorConfig.playerCardPlaceholder)
        this.handCardsPlaceholder.displayHeight = sizeConfig.controlCard.height;
        this.handCardsPlaceholder.displayWidth = 675;
        this.handCardsPlaceholder.setOrigin(0, 0.5)
        this.handCardsPlaceholder.setAlpha(0)
        this.handCardsPlaceholder.setDepth(boardDepth)

        const equipmentTexts = ["武器牌", "防具牌", "+1🐎", "-1🐎"] as string[];
        equipmentTexts.forEach((equipmentText: string, index) => {
            const img = this.gamingScene.add.image(
                this.initX + gridOffset.column1.x + index * (sizeConfig.controlCard.width + cardMargin),
                this.initY + gridOffset.line2.y,
                'white')
            // @ts-ignore
            img.setTint(colorConfig.playerCardPlaceholder)
            img.displayHeight = sizeConfig.controlCard.height;
            img.displayWidth = sizeConfig.controlCard.width;
            img.setAlpha(0)
            img.setDepth(boardDepth)

            const text = this.gamingScene.add.text(
                this.initX + gridOffset.column1.x + (index * (sizeConfig.controlCard.width + cardMargin)),
                this.initY + gridOffset.line2.y, equipmentText)
            text.setOrigin(0.5, 0.5)
            text.setAlpha(0)
            text.setDepth(boardDepth)
            text.setPadding(0, 2, 0, 0);

            this.equipmentCardsPlaceholders.push(img)
            this.equipmentCardsPlaceholderTexts.push(text)
        })

        const delayTexts = ["", "", ""].fill("延时锦囊") as string[];
        delayTexts.forEach((delayText: string, index) => {
            const img = this.gamingScene.add.image(
                this.initX + gridOffset.column2.x + index * (sizeConfig.controlCard.width + cardMargin),
                this.initY + gridOffset.line2.y,
                'white')
            // @ts-ignore
            img.setTint(colorConfig.playerCardPlaceholder)
            img.displayHeight = sizeConfig.controlCard.height;
            img.displayWidth = sizeConfig.controlCard.width;
            img.setAlpha(0)
            img.setDepth(boardDepth)

            const text = this.gamingScene.add.text(
                this.initX + gridOffset.column2.x + (index * (sizeConfig.controlCard.width + cardMargin)),
                this.initY + gridOffset.line2.y, delayText)
            text.setOrigin(0.5, 0.5)
            text.setAlpha(0)
            text.setDepth(boardDepth)
            text.setPadding(0, 2, 0, 0)

            this.pandingCardsPlaceholders.push(img)
            this.pandingCardsPlaceholderTexts.push(text)
        })
    }

    drawTargetPlayerCards(targetPlayer: Player, scrollResStage: ScrollResStage) {
        const cards = shuffle(targetPlayer.cards).slice(0, 8);
        cards.forEach((card, index) => {
            const cardImg = this.gamingScene.add.image(
                this.initX + gridOffset.column1.x + index * (sizeConfig.controlCard.width + cardMargin),
                this.initY + gridOffset.line1.y,
                'cardBg')
            cardImg.setInteractive({cursor: 'pointer'})
            cardImg.displayHeight = sizeConfig.controlCard.height;
            cardImg.displayWidth = sizeConfig.controlCard.width;
            cardImg.setDepth(boardDepth)
            cardImg.setInteractive();
            cardImg.on('pointerdown', this.getCardClickHandler(targetPlayer, card, scrollResStage))
            this.destoryObjects.push(cardImg);
        })
    }

    drawTargetEquipmentCards(targetPlayer: Player, scrollResStage: ScrollResStage) {
        ['weaponCard', 'shieldCard', 'plusHorseCard', 'minusHorseCard'].forEach((key, index) => {
            const card = targetPlayer[key as keyof Player] as Card;
            if (!card) {
                return
            }

            const {cardNameObj, cardHuaseNumberObj, cardImgObj} = sharedDrawCard(this.gamingScene, card, {
                x: this.initX + gridOffset.column1.x + index * (sizeConfig.controlCard.width + cardMargin),
                y: this.initY + gridOffset.line2.y,
                depth: boardDepth,
            })
            cardImgObj.on('pointerdown', this.getCardClickHandler(targetPlayer, card, scrollResStage))

            this.destoryObjects.push(cardNameObj);
            this.destoryObjects.push(cardHuaseNumberObj);
            this.destoryObjects.push(cardImgObj);
        })

    }

    drawTargetScrollCards(targetPlayer: Player, scrollResStage: ScrollResStage) {
        targetPlayer.pandingSigns.forEach((sign, index) => {
            const card = sign.card
            const {cardNameObj, cardHuaseNumberObj, cardImgObj} = sharedDrawCard(this.gamingScene, card, {
                x: this.initX + gridOffset.column2.x + index * (sizeConfig.controlCard.width + cardMargin),
                y: this.initY + gridOffset.line2.y,
                depth: boardDepth,
            })
            cardImgObj.on('pointerdown', this.getCardClickHandler(targetPlayer, card, scrollResStage))

            this.destoryObjects.push(cardNameObj);
            this.destoryObjects.push(cardHuaseNumberObj);
            this.destoryObjects.push(cardImgObj);
        })
    }

    getCardClickHandler(targetPlayer: Player, card: Card, scrollResStage: ScrollResStage) {
        return () => {
            this.gamingScene.socket.emit(
                emitMap.CARD_BOARD_ACTION,
                this.getEmitCardBoardActionData(targetPlayer, card, scrollResStage)
            )
        }
    }

    showBoard(show: boolean) {
        this.maskImg!.setAlpha(show ? 0.0001 : 0) // 配合setInteractive 阻止冒泡
        this.boardImg!.setAlpha(show ? boardAlpha : 0)

        this.titleText!.setAlpha(show ? 1 : 0)

        this.handCardsCategoryText!.setAlpha(show ? 1 : 0)
        this.equipmentCardsCategoryText!.setAlpha(show ? 1 : 0)
        this.pandingCardsCategoryText!.setAlpha(show ? 1 : 0)

        this.handCardsPlaceholder!.setAlpha(show ? 1 : 0)
        this.equipmentCardsPlaceholders.forEach((o) => o.setAlpha(show ? 1 : 0))
        this.equipmentCardsPlaceholderTexts.forEach((o) => o.setAlpha(show ? 1 : 0))
        this.pandingCardsPlaceholders.forEach((o) => o.setAlpha(show ? 1 : 0))
        this.pandingCardsPlaceholderTexts.forEach((o) => o.setAlpha(show ? 1 : 0))
    }

    updateTargetCards(gameStatus: GameStatus) {
        const scrollResStage = gameStatus.scrollResStages?.[0];
        const targetPlayer = gameStatus.players[scrollResStage.targetId]
        this.titleText!.setAlpha(1)
        this.titleText!.setText(`${scrollResStage?.actualCard.CN} 选择一张 ${gameStatus.players[targetPlayer.playerId].name} 的卡牌`)

        this.drawTargetPlayerCards(targetPlayer, scrollResStage);
        this.drawTargetEquipmentCards(targetPlayer, scrollResStage);
        this.drawTargetScrollCards(targetPlayer, scrollResStage);
    }

    destoryTargetCards() {
        this.destoryObjects.forEach((o) => o.destroy());
    }

    getEmitCardBoardActionData(targetPlayer: Player, card: Card, scrollResStage: ScrollResStage): EmitCardBoardData {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;

        return {
            originId: getMyPlayerId(),
            targetId: targetPlayer.playerId,
            card: card,
            selectedIndex: gameFEStatus.selectedIndexes[0],
            type: this.getEmitType(scrollResStage)!,
        }
    }

    getEmitType(scrollResStage: ScrollResStage) {
        if (scrollResStage.actualCard.CN == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN) {
            return "REMOVE"
        } else if (scrollResStage.actualCard.CN == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN) {
            return "MOVE"
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const curScrollResStage = gameStatus.scrollResStages?.[0];
        if (!curScrollResStage) {
            this.showBoard(false);
            this.destoryTargetCards();
            return
        }

        if (this._stageId == curScrollResStage.stageId) {
            return;
        }

        const showBoard = curScrollResStage.originId == getMyPlayerId() &&
            curScrollResStage.isEffect &&
            (curScrollResStage.actualCard.CN == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN ||
                curScrollResStage.actualCard.CN == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN)

        if (!showBoard) {
            this.showBoard(false);
            this.destoryTargetCards();
            return;
        }
        this.showBoard(true);
        this.updateTargetCards(gameStatus)

        this._stageId = curScrollResStage.stageId!
    }

}