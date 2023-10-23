import {GameStatus} from "../../types/gameStatus";
import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {PLAYER_CARD_AREA, EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {sharedDrawBackCard, sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {cloneDeep, isEqual, shuffle} from "lodash";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitCardBoardData} from "../../types/emit";
import {uuidv4} from "../../utils/uuid";
import {i18} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {Card, PlayerBoardAction} from "../../types/card";
import {Player} from "../../types/player";
import {
    getCardBoardDisplayArea,
    getCardBoardTitle
} from "../../utils/board/cardBoardUtils";
import {PLAYER_BOARD_ACTION} from "../../config/boardConfig";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {BaseBoard} from "./BaseBoard";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";

const gridOffset = {
    line1: {y: -55},
    line2: {y: 90},
    column1: {x: -280},
    column2: {x: 130}
}

const categoryDiffX = -80;

const boardSize = {
    height: 380,
    width: 800,
}

export class PlayerCardsBoard {
    obId: string;
    gamingScene: GamingScene;
    boardContent: PhaserGameObject[];

    // innerState
    _cardBoardResponses: object[] | undefined;

    baseBoard: BaseBoard;
    initX: number;
    initY: number;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene

        this.boardContent = []

        this.baseBoard = new BaseBoard(gamingScene, {
            boardSize,
        });
        this.initX = this.baseBoard.initX;
        this.initY = this.baseBoard.initY;

        this.gamingScene.gameStatusObserved.addObserver(this);
    }


    drawCardCategories(cardBoardDisplayArea: string[]) {
        const categoryFontSize = 16
        const textObjs = []

        if (cardBoardDisplayArea.includes(PLAYER_CARD_AREA.HAND)) {
            const handCardsCategoryText = this.gamingScene.add.text(
                this.initX + gridOffset.column1.x + categoryDiffX,
                this.initY + gridOffset.line1.y,
                i18(i18Config.PLAYER_BOARD_HAND_CARD_CATEGORY), {
                    align: 'center'
                }
            );
            textObjs.push(handCardsCategoryText)
        }

        if (cardBoardDisplayArea.includes(PLAYER_CARD_AREA.WEAPON) ||
            cardBoardDisplayArea.includes(PLAYER_CARD_AREA.SHEILD) ||
            cardBoardDisplayArea.includes(PLAYER_CARD_AREA.HORSE)) {
            const equipmentCardsCategoryText = this.gamingScene.add.text(
                this.initX + gridOffset.column1.x + categoryDiffX,
                this.initY + gridOffset.line2.y,
                i18(i18Config.PLAYER_BOARD_EQUIPMENT_CARD_CATEGORY), {
                    align: 'center'
                }
            );
            textObjs.push(equipmentCardsCategoryText)
        }

        if (cardBoardDisplayArea.includes(PLAYER_CARD_AREA.PANDING)) {
            const pandingCardsCategoryText = this.gamingScene.add.text(
                this.initX + gridOffset.column2.x + categoryDiffX,
                this.initY + gridOffset.line2.y,
                i18(i18Config.PLAYER_BOARD_PANDING_CARD_CATEGORY), {
                    align: 'center'
                }
            );
            textObjs.push(pandingCardsCategoryText)
        }

        textObjs.forEach(textObj => {
            textObj.setFontSize(categoryFontSize)
            textObj.setOrigin(0.5, 0.5)
            textObj.setDepth(DEPTH_CONFIG.BOARD)
            this.boardContent.push(textObj)
        })
    }

    drawTargetPlayerCards(cardBoardDisplayArea: string[], targetPlayer: Player) {
        if (!cardBoardDisplayArea.includes(PLAYER_CARD_AREA.HAND)) {
            return
        }

        const cards = shuffle(targetPlayer.cards)
        cards.forEach((card, index) => {
            const {cardImgObj} = sharedDrawBackCard(this.gamingScene, card, {
                x: this.initX + gridOffset.column1.x + index * (sizeConfig.controlCard.width + sizeConfig.controlCardMargin),
                y: this.initY + gridOffset.line1.y,
                depth: DEPTH_CONFIG.BOARD,
            })
            cardImgObj.on('pointerdown',
                this.getCardClickHandler(targetPlayer, card)
            )
            this.boardContent.push(cardImgObj);
        })
    }

    drawTargetEquipmentCards(cardBoardDisplayArea: string[], targetPlayer: Player) {
        if (!cardBoardDisplayArea.includes(PLAYER_CARD_AREA.WEAPON) &&
            !cardBoardDisplayArea.includes(PLAYER_CARD_AREA.SHEILD) &&
            !cardBoardDisplayArea.includes(PLAYER_CARD_AREA.HORSE)) {
            return
        }

        let loopArray: string[] = [];
        if (cardBoardDisplayArea.includes(PLAYER_CARD_AREA.WEAPON)) {
            loopArray = loopArray.concat('weaponCard')
        }
        if (cardBoardDisplayArea.includes(PLAYER_CARD_AREA.SHEILD)) {
            loopArray = loopArray.concat('shieldCard')
        }
        if (cardBoardDisplayArea.includes(PLAYER_CARD_AREA.HORSE)) {
            loopArray = loopArray.concat(['plusHorseCard', 'minusHorseCard'])
        }

        let index = 0;
        loopArray.forEach((key) => {
            const card = targetPlayer[key as keyof Player] as Card;
            if (!card) {
                return
            }

            const {allCardObjects, cardImgObj} = sharedDrawFrontCard(this.gamingScene, card, {
                x: this.initX + gridOffset.column1.x + index * (sizeConfig.controlCard.width + sizeConfig.controlCardMargin),
                y: this.initY + gridOffset.line2.y,
                depth: DEPTH_CONFIG.BOARD,
            })
            cardImgObj.on('pointerdown', this.getCardClickHandler(targetPlayer, card))

            this.boardContent = this.boardContent.concat(allCardObjects)
            index++
        })
    }

    drawTargetPandingCards(cardBoardDisplayArea: string[], targetPlayer: Player) {
        if (!cardBoardDisplayArea.includes(PLAYER_CARD_AREA.PANDING)) {
            return
        }

        targetPlayer.pandingSigns.forEach((sign, index) => {
            const card = sign.card
            const {allCardObjects, cardImgObj} = sharedDrawFrontCard(this.gamingScene, card, {
                x: this.initX + gridOffset.column2.x + index * (sizeConfig.controlCard.width + sizeConfig.controlCardMargin),
                y: this.initY + gridOffset.line2.y,
                depth: DEPTH_CONFIG.BOARD,
            })
            cardImgObj.on('pointerdown', this.getCardClickHandler(targetPlayer, card))

            this.boardContent = this.boardContent.concat(allCardObjects)
        })
    }

    getCardClickHandler(targetPlayer: Player, card: Card) {
        return () => {
            this.gamingScene.socket.emit(
                EMIT_TYPE.CARD_BOARD_ACTION,
                this.getEmitCardBoardActionData(targetPlayer, card)
            )
        }
    }

    drawTargetCards(gameStatus: GameStatus, cardBoardDisplayArea: string[], targetPlayer: Player) {
        this.drawCardCategories(cardBoardDisplayArea);
        this.drawTargetPlayerCards(cardBoardDisplayArea, targetPlayer!);
        this.drawTargetEquipmentCards(cardBoardDisplayArea, targetPlayer!);
        this.drawTargetPandingCards(cardBoardDisplayArea, targetPlayer!);
    }

    getEmitCardBoardActionData(
        targetPlayer: Player,
        card: Card,
    ): EmitCardBoardData {
        return {
            originId: getMyPlayerId(),
            targetId: targetPlayer.playerId,
            card: card,
            action: this._getEmitType() as PlayerBoardAction,
        }
    }

    _getEmitType() {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!
        const curCardBoardResponse = gameStatus.cardBoardResponses[0];
        const cardBoardContentKey = curCardBoardResponse.cardBoardContentKey;

        if ([SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key,
            SKILL_NAMES_CONFIG.WEI002_FAN_KUI.key,
            SKILL_NAMES_CONFIG.WEI004_TU_XI.key].includes(cardBoardContentKey)) {
            return PLAYER_BOARD_ACTION.MOVE
        } else if ([SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key,
            EQUIPMENT_CARDS_CONFIG.QI_LIN_GONG.key,
            EQUIPMENT_CARDS_CONFIG.HAN_BIN_JIAN.key].includes(cardBoardContentKey)
        ) {
            return PLAYER_BOARD_ACTION.REMOVE
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const cardBoardResponses = gameStatus.cardBoardResponses;

        if (isEqual(this._cardBoardResponses, gameStatus.cardBoardResponses)) {
            return;
        }

        const showBoard = !!gameStatus.cardBoardResponses.length && gameStatus.cardBoardResponses[0].originId == getMyPlayerId();

        if (showBoard) {
            this.boardContent = []
            this.baseBoard.hideBoard();

            const cardBoardDisplayArea = getCardBoardDisplayArea(gameStatus);
            const targetPlayer = gameStatus.players[gameStatus.cardBoardResponses[0].targetId]
            const title = getCardBoardTitle(gameStatus, targetPlayer!)

            this.baseBoard.showBoard();

            this.baseBoard.setTitle(title)
            this.drawTargetCards(gameStatus, cardBoardDisplayArea, targetPlayer!)
            this.baseBoard.addContent(this.boardContent);
        } else if (!showBoard && this.baseBoard.show) {
            this.boardContent = []
            this.baseBoard.hideBoard();
        }

        this._cardBoardResponses = cloneDeep(cardBoardResponses);
    }
}