import {GameStatus} from "../../types/gameStatus";
import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {CARD_LOCATION, SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {sharedDrawBackCard, sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {shuffle} from "lodash";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitCardBoardData} from "../../types/emit";
import {uuidv4} from "../../utils/uuid";
import {i18} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {Card, CardAreaType, CardBoardActionType} from "../../types/card";
import {Player} from "../../types/player";
import {getIfShowFanKuiPlayerCardsBoard, getIfShowShunChaiPlayerCardsBoard} from "../../utils/board/boardUtils";
import {PLAYER_BOARD_ACTION} from "../../config/boardConfig";
import {getResponseType} from "../../utils/response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";
import { DEPTH_CONFIG } from "../../config/depthConfig";

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
    _boardObserveId: string;
    _responseType: string | undefined;


    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.maskImg;

        this.initX = sizeConfig.playersArea.width / 2;
        this.initY = sizeConfig.playersArea.height / 2;

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

        this._boardObserveId = '';
        this._responseType = '';

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
        this.maskImg.setDepth(DEPTH_CONFIG.BOARD)

        this.boardImg = this.gamingScene.add.image(this.initX, this.initY, 'white')
        // @ts-ignore
        this.boardImg.setTint("0x000000")
        this.boardImg.displayHeight = boardSize.height;
        this.boardImg.displayWidth = boardSize.width;
        this.boardImg.setAlpha(0)
        this.boardImg.setDepth(DEPTH_CONFIG.BOARD)
    }

    drawTitle() {
        this.titleText = this.gamingScene.add.text(this.initX, this.initY - 138, '')
        this.titleText.setOrigin(0.5, 0.5)
        this.titleText.setAlpha(0)
        this.titleText.setPadding(0, 2, 0, 0)
        this.titleText.setDepth(DEPTH_CONFIG.BOARD)
    }

    drawCardCategories() {
        const fontSize = 14
        this.handCardsCategoryText = this.gamingScene.add.text(
            this.initX + gridOffset.column1.x + categoryDiffX,
            this.initY + gridOffset.line1.y,
            i18(i18Config.PLAYER_BOARD_HAND_CARD_CATEGORY),
        );

        this.equipmentCardsCategoryText = this.gamingScene.add.text(
            this.initX + gridOffset.column1.x + categoryDiffX,
            this.initY + gridOffset.line2.y,
            i18(i18Config.PLAYER_BOARD_EQUIPMENT_CARD_CATEGORY),
        );

        this.pandingCardsCategoryText = this.gamingScene.add.text(
            this.initX + gridOffset.column2.x + categoryDiffX,
            this.initY + gridOffset.line2.y,
            i18(i18Config.PLAYER_BOARD_PANDING_CARD_CATEGORY),
        );

        [this.handCardsCategoryText, this.equipmentCardsCategoryText, this.pandingCardsCategoryText].forEach(text => {
            text.setFontSize(fontSize)
            text.setOrigin(0.5, 0.5)
            text.setAlpha(0)
            text.setDepth(DEPTH_CONFIG.BOARD)
        })
    }

    drawCardPlaceHolders() {
        this.handCardsPlaceholder = this.gamingScene.add.image(
            this.initX + gridOffset.column1.x - sizeConfig.controlCard.width / 2,
            this.initY + gridOffset.line1.y, 'white')
        // @ts-ignore
        this.handCardsPlaceholder.setTint(COLOR_CONFIG.boardCardPlaceholder)
        this.handCardsPlaceholder.displayHeight = sizeConfig.controlCard.height;
        this.handCardsPlaceholder.displayWidth = 675;
        this.handCardsPlaceholder.setOrigin(0, 0.5)
        this.handCardsPlaceholder.setAlpha(0)
        this.handCardsPlaceholder.setDepth(DEPTH_CONFIG.BOARD)

        const equipmentTexts = [
            i18(i18Config.PLAYER_BOARD_WEAPON_CARD_PLACEHOLDER),
            i18(i18Config.PLAYER_BOARD_SHEILD_CARD_PLACEHOLDER),
            "+1🐎",
            "-1🐎"] as string[];
        equipmentTexts.forEach((equipmentText: string, index) => {
            const img = this.gamingScene.add.image(
                this.initX + gridOffset.column1.x + index * (sizeConfig.controlCard.width + cardMargin),
                this.initY + gridOffset.line2.y,
                'white')
            // @ts-ignore
            img.setTint(COLOR_CONFIG.boardCardPlaceholder)
            img.displayHeight = sizeConfig.controlCard.height;
            img.displayWidth = sizeConfig.controlCard.width;
            img.setAlpha(0)
            img.setDepth(DEPTH_CONFIG.BOARD)

            const text = this.gamingScene.add.text(
                this.initX + gridOffset.column1.x + (index * (sizeConfig.controlCard.width + cardMargin)),
                this.initY + gridOffset.line2.y, equipmentText)
            text.setOrigin(0.5, 0.5)
            text.setAlpha(0)
            text.setDepth(DEPTH_CONFIG.BOARD)
            text.setPadding(0, 2, 0, 0);

            this.equipmentCardsPlaceholders.push(img)
            this.equipmentCardsPlaceholderTexts.push(text)
        })

        const delayTexts = ["", "", ""].fill(i18(i18Config.PLAYER_BOARD_DELAY_SCROLL_CARD_PLACEHOLDER)) as string[];
        delayTexts.forEach((delayText: string, index) => {
            const img = this.gamingScene.add.image(
                this.initX + gridOffset.column2.x + index * (sizeConfig.controlCard.width + cardMargin),
                this.initY + gridOffset.line2.y,
                'white')
            // @ts-ignore
            img.setTint(COLOR_CONFIG.boardCardPlaceholder)
            img.displayHeight = sizeConfig.controlCard.height;
            img.displayWidth = sizeConfig.controlCard.width;
            img.setAlpha(0)
            img.setDepth(DEPTH_CONFIG.BOARD)

            const text = this.gamingScene.add.text(
                this.initX + gridOffset.column2.x + (index * (sizeConfig.controlCard.width + cardMargin)),
                this.initY + gridOffset.line2.y, delayText)
            text.setOrigin(0.5, 0.5)
            text.setAlpha(0)
            text.setDepth(DEPTH_CONFIG.BOARD)
            text.setPadding(0, 2, 0, 0)

            this.pandingCardsPlaceholders.push(img)
            this.pandingCardsPlaceholderTexts.push(text)
        })
    }

    drawTargetPlayerCards(targetPlayer: Player) {
        const cards = shuffle(targetPlayer.cards).slice(0, 8);
        cards.forEach((card, index) => {
            const {cardImgObj} = sharedDrawBackCard(this.gamingScene, card, {
                x: this.initX + gridOffset.column1.x + index * (sizeConfig.controlCard.width + cardMargin),
                y: this.initY + gridOffset.line1.y,
                depth: DEPTH_CONFIG.BOARD,
            })
            cardImgObj.on('pointerdown',
                this.getCardClickHandler(targetPlayer, card, CARD_LOCATION.HAND as CardAreaType, index)
            )
            this.destoryObjects.push(cardImgObj);
        })
    }

    drawTargetEquipmentCards(targetPlayer: Player) {
        ['weaponCard', 'shieldCard', 'plusHorseCard', 'minusHorseCard'].forEach((key, index) => {
            const card = targetPlayer[key as keyof Player] as Card;
            if (!card) {
                return
            }

            const {cardNameObj, cardHuaseNumberObj, cardImgObj} = sharedDrawFrontCard(this.gamingScene, card, {
                x: this.initX + gridOffset.column1.x + index * (sizeConfig.controlCard.width + cardMargin),
                y: this.initY + gridOffset.line2.y,
                depth: DEPTH_CONFIG.BOARD,
            })
            cardImgObj.on('pointerdown',
                this.getCardClickHandler(targetPlayer, card, CARD_LOCATION.EQUIPMENT as CardAreaType))

            this.destoryObjects.push(cardNameObj);
            this.destoryObjects.push(cardHuaseNumberObj);
            this.destoryObjects.push(cardImgObj);
        })

    }

    drawTargetPandingCards(targetPlayer: Player) {
        targetPlayer.pandingSigns.forEach((sign, index) => {
            const card = sign.card
            const {cardNameObj, cardHuaseNumberObj, cardImgObj} = sharedDrawFrontCard(this.gamingScene, card, {
                x: this.initX + gridOffset.column2.x + index * (sizeConfig.controlCard.width + cardMargin),
                y: this.initY + gridOffset.line2.y,
                depth: DEPTH_CONFIG.BOARD,
            })
            cardImgObj.on('pointerdown', this.getCardClickHandler(targetPlayer, card, CARD_LOCATION.PANDING as CardAreaType))

            this.destoryObjects.push(cardNameObj);
            this.destoryObjects.push(cardHuaseNumberObj);
            this.destoryObjects.push(cardImgObj);
        })
    }

    getCardClickHandler(targetPlayer: Player, card: Card, cardAreaType: CardAreaType, index?: number) {
        return () => {
            this.gamingScene.socket.emit(
                EMIT_TYPE.CARD_BOARD_ACTION,
                this.getEmitCardBoardActionData(targetPlayer, card, cardAreaType, index)
            )
        }
    }

    showBoard(gameStatus: GameStatus, show: boolean) {
        this.maskImg!.setAlpha(show ? 0.0001 : 0) // 配合setInteractive 阻止冒泡
        this.boardImg!.setAlpha(show ? boardAlpha : 0)

        const alpha = show ? 1 : 0
        this.titleText!.setAlpha(alpha)

        this.handCardsCategoryText!.setAlpha(alpha)
        this.equipmentCardsCategoryText!.setAlpha(alpha)

        this.handCardsPlaceholder!.setAlpha(alpha)
        this.equipmentCardsPlaceholders.forEach((o) => o.setAlpha(alpha))
        this.equipmentCardsPlaceholderTexts.forEach((o) => o.setAlpha(alpha))

        // 锦囊才可以显示判定牌
        if (this._responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
            this.pandingCardsCategoryText!.setAlpha(alpha)
            this.pandingCardsPlaceholders.forEach((o) => o.setAlpha(alpha))
            this.pandingCardsPlaceholderTexts.forEach((o) => o.setAlpha(alpha))
        }

        // hideBoard 不能以scrollResponses判断依据
        if (!show) {
            this.pandingCardsCategoryText!.setAlpha(alpha)
            this.pandingCardsPlaceholders.forEach((o) => o.setAlpha(alpha))
            this.pandingCardsPlaceholderTexts.forEach((o) => o.setAlpha(alpha))
        }
    }

    drawTargetCards(gameStatus: GameStatus) {
        let name;
        let targetPlayer: Player;

        // 反馈
        if (this._responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            targetPlayer = gameStatus.players[gameStatus.damageEvent.originId]
            name = gameStatus.skillResponse!.skillName
        } else if (this._responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
            const scrollResponse = gameStatus.scrollResponses[0]!
            targetPlayer = gameStatus.players[scrollResponse.targetId]
            name = i18(scrollResponse.actualCard)
        }

        this.titleText!.setAlpha(1)
        this.titleText!.setText(
            i18(i18Config.PLAYER_BOARD_TITLE, {
                name,
                playerName: gameStatus.players[targetPlayer!.playerId].name
            }),
        )

        this.drawTargetPlayerCards(targetPlayer!);
        this.drawTargetEquipmentCards(targetPlayer!);

        if (this._responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
            this.drawTargetPandingCards(targetPlayer!);
        }
    }

    destoryTargetCards() {
        this.destoryObjects.forEach((o) => o.destroy());
    }

    getEmitCardBoardActionData(
        targetPlayer: Player,
        card: Card,
        cardAreaType: CardAreaType, // NofityAnimationManager判断正反
        index?: number | string
    ): EmitCardBoardData {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        let selectedIndex: number | string = 0
        if (index) {
            selectedIndex = index
        } else if (cardAreaType == CARD_LOCATION.PANDING) {
            selectedIndex = card.CN
        } else if (cardAreaType == CARD_LOCATION.EQUIPMENT) {
            selectedIndex = card.equipmentType!
        }

        return {
            originId: getMyPlayerId(),
            targetId: targetPlayer.playerId,
            card: card,
            selectedIndexes: [selectedIndex],
            type: this.getEmitType(gameStatus) as CardBoardActionType,
            cardAreaType,
        }
    }

    getEmitType(gameStatus: GameStatus) {
        if (this._responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            return PLAYER_BOARD_ACTION.MOVE
        } else if (this._responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
            const scrollResponse = gameStatus.scrollResponses[0]
            if (scrollResponse?.actualCard?.CN == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN) {
                return PLAYER_BOARD_ACTION.REMOVE
            } else if (scrollResponse?.actualCard?.CN == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN) {
                return PLAYER_BOARD_ACTION.MOVE
            }
        }
    }

    getCanShowBoard(gameStatus: GameStatus) {
        if (this._responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            return getIfShowFanKuiPlayerCardsBoard(gameStatus)
        } else if (this._responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
            return getIfShowShunChaiPlayerCardsBoard(gameStatus)
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const responseType = getResponseType(gameStatus)
        this._responseType = responseType;

        let boardObserveId = ''
        if (responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            boardObserveId = gameStatus.skillResponse!.boardObserveId
        } else if (responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
            boardObserveId = gameStatus.scrollResponses[0].boardObserveId!
        }

        if (this._boardObserveId == boardObserveId) {
            return;
        }

        const showBoard = this.getCanShowBoard(gameStatus)

        if (!showBoard) {
            this.showBoard(gameStatus, false);
            this.destoryTargetCards();
            return;
        }
        this.showBoard(gameStatus, true);
        this.drawTargetCards(gameStatus)

        this._boardObserveId = boardObserveId;
    }

}