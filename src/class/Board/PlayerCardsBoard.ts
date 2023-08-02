import {GameStatus} from "../../types/gameStatus";
import {GamingScene, PhaserGameObject} from "../../types/phaser";
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
import {
    getCardBoardDisplayArea,
    getCardBoardTargetPlayer,
    getCardBoardTitle,
    getCardBoardType,
} from "../../utils/board/boardUtils";
import {PLAYER_BOARD_ACTION} from "../../config/boardConfig";
import {getResponseType} from "../../utils/response/responseUtils";
import {RESPONSE_TYPE_CONFIG} from "../../config/responseTypeConfig";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {BaseBoard} from "./BaseBoard";

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
    _responseType: string | undefined;

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

        this._responseType = '';
        this.gamingScene.gameStatusObserved.addObserver(this);
    }


    drawCardCategories(cardBoardDisplayArea: string[]) {
        const categoryFontSize = 16
        const textObjs = []

        if (cardBoardDisplayArea.includes(CARD_LOCATION.HAND)) {
            const handCardsCategoryText = this.gamingScene.add.text(
                this.initX + gridOffset.column1.x + categoryDiffX,
                this.initY + gridOffset.line1.y,
                i18(i18Config.PLAYER_BOARD_HAND_CARD_CATEGORY), {
                    align: 'center'
                }
            );
            textObjs.push(handCardsCategoryText)
        }

        if (cardBoardDisplayArea.includes(CARD_LOCATION.EQUIPMENT) ||
            cardBoardDisplayArea.includes(CARD_LOCATION.HORSE)) {
            const equipmentCardsCategoryText = this.gamingScene.add.text(
                this.initX + gridOffset.column1.x + categoryDiffX,
                this.initY + gridOffset.line2.y,
                i18(i18Config.PLAYER_BOARD_EQUIPMENT_CARD_CATEGORY), {
                    align: 'center'
                }
            );
            textObjs.push(equipmentCardsCategoryText)
        }

        if (cardBoardDisplayArea.includes(CARD_LOCATION.PANDING)) {
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
        if (!cardBoardDisplayArea.includes(CARD_LOCATION.HAND)) {
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
                this.getCardClickHandler(targetPlayer, card, CARD_LOCATION.HAND as CardAreaType)
            )
            this.boardContent.push(cardImgObj);
        })
    }

    drawTargetEquipmentCards(cardBoardDisplayArea: string[], targetPlayer: Player) {
        if (!cardBoardDisplayArea.includes(CARD_LOCATION.EQUIPMENT) && !cardBoardDisplayArea.includes(CARD_LOCATION.HORSE)) {
            return
        }

        let loopArray: string[] = [];
        if (cardBoardDisplayArea.includes(CARD_LOCATION.EQUIPMENT)) {
            loopArray = ['weaponCard', 'shieldCard', 'plusHorseCard', 'minusHorseCard']
        } else if (cardBoardDisplayArea.includes(CARD_LOCATION.HORSE)) {
            loopArray = ['plusHorseCard', 'minusHorseCard']
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
            cardImgObj.on('pointerdown', this.getCardClickHandler(targetPlayer, card, CARD_LOCATION.EQUIPMENT as CardAreaType))

            this.boardContent = this.boardContent.concat(allCardObjects)
            index++
        })
    }

    drawTargetPandingCards(cardBoardDisplayArea: string[], targetPlayer: Player) {
        if (!cardBoardDisplayArea.includes(CARD_LOCATION.PANDING)) {
            return
        }

        targetPlayer.pandingSigns.forEach((sign, index) => {
            const card = sign.card
            const {allCardObjects, cardImgObj} = sharedDrawFrontCard(this.gamingScene, card, {
                x: this.initX + gridOffset.column2.x + index * (sizeConfig.controlCard.width + sizeConfig.controlCardMargin),
                y: this.initY + gridOffset.line2.y,
                depth: DEPTH_CONFIG.BOARD,
            })
            cardImgObj.on('pointerdown', this.getCardClickHandler(targetPlayer, card, CARD_LOCATION.PANDING as CardAreaType))

            this.boardContent = this.boardContent.concat(allCardObjects)
        })
    }

    getCardClickHandler(targetPlayer: Player, card: Card, cardAreaType: CardAreaType) {
        return () => {
            this.gamingScene.socket.emit(
                EMIT_TYPE.CARD_BOARD_ACTION,
                this.getEmitCardBoardActionData(targetPlayer, card, cardAreaType)
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
        cardAreaType: CardAreaType, // NofityAnimationManager判断正反
    ): EmitCardBoardData {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;

        return {
            originId: getMyPlayerId(),
            targetId: targetPlayer.playerId,
            card: card,
            type: this._getEmitType(gameStatus) as CardBoardActionType,
            cardAreaType,
        }
    }

    _getEmitType(gameStatus: GameStatus) {
        if (this._responseType == RESPONSE_TYPE_CONFIG.SKILL) {
            return PLAYER_BOARD_ACTION.MOVE
        } else if (this._responseType == RESPONSE_TYPE_CONFIG.SCROLL) {
            const scrollResponse = gameStatus.scrollResponses[0]
            if (scrollResponse?.actualCard?.key == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.key) {
                return PLAYER_BOARD_ACTION.REMOVE
            } else if (scrollResponse?.actualCard?.key == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.key) {
                return PLAYER_BOARD_ACTION.MOVE
            }
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const responseType = getResponseType(gameStatus)
        this._responseType = responseType;

        const cardBoardType = getCardBoardType(gameStatus, responseType)
        const needShowBoard = !!cardBoardType;
        if (needShowBoard && !this.baseBoard.show) {
            const cardBoardDisplayArea = getCardBoardDisplayArea(cardBoardType);
            const targetPlayer = getCardBoardTargetPlayer(gameStatus, responseType)
            const title = getCardBoardTitle(gameStatus, responseType, targetPlayer!)

            this.baseBoard.showBoard();
            this.baseBoard.setTitle(title)

            this.drawTargetCards(gameStatus, cardBoardDisplayArea, targetPlayer!)
            this.baseBoard.addContent(this.boardContent);
        } else if (!needShowBoard && this.baseBoard.show) {
            this.baseBoard.hideBoard();
        }
    }

}