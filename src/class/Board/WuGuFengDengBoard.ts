import {GameStatus} from "../../types/gameStatus";
import {GamingScene} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {CARD_CONFIG, SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitWugufengdengBoardData} from "../../types/emit";
import {uuidv4} from "../../utils/uuid";
import {i18} from "../../i18n/i18nUtils";
import {i18Config} from "../../i18n/i18Config";
import {getPlayerDisplayName} from "../../utils/playerUtils";
import {Card, WugufengdengCard} from "../../types/card";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {BaseBoard} from "./BaseBoard";
import {cloneDeep, isEqual} from "lodash";

const boardSize = {
    height: 380,
    width: 440,
}

const gridOffset = {
    line1: {y: -55},
    line2: {y: -55 + sizeConfig.controlCard.height + sizeConfig.boardCardMargin},
}

export class WuGuFengDengBoard {
    obId: string;
    gamingScene: GamingScene;
    boardContent: (Phaser.GameObjects.Image | Phaser.GameObjects.Text | Phaser.GameObjects.Graphics)[];
    cardIdMap: {
        [key: string]: {
            cardImgObj: Phaser.GameObjects.Image,
            cardMessageObj: Phaser.GameObjects.Text
        }
    };

    // innerState
    _scrollResponse: object | undefined;

    baseBoard: BaseBoard;
    initX: number;
    initY: number;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.boardContent = []
        this.cardIdMap = {};

        this.baseBoard = new BaseBoard(gamingScene, {
            boardSize,
        });
        this.initX = this.baseBoard.initX;
        this.initY = this.baseBoard.initY;

        this._scrollResponse = undefined;

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawWugufengdengCards(gameStatus: GameStatus) {
        this.boardContent.forEach((obj) => {
            obj.destroy();
        });

        gameStatus.wugufengdengCards.forEach((card, index) => {
            const offsetY = (index) > 3 ? gridOffset.line2.y : gridOffset.line1.y;
            const modIndex = index % 4;
            const {allCardObjects, cardImgObj, cardMessageObj} =
                sharedDrawFrontCard(this.gamingScene, card, {
                    x: this.initX - 142 + modIndex * (sizeConfig.controlCard.width + sizeConfig.boardCardMargin),
                    y: this.initY + offsetY,
                    depth: DEPTH_CONFIG.BOARD,
                })

            this.boardContent = this.boardContent.concat(allCardObjects)
            this.cardIdMap[card.cardId] = {
                cardImgObj,
                cardMessageObj
            }
        })
    }

    bindEvent(gameStatus: GameStatus) {
        gameStatus.wugufengdengCards.forEach((card) => {
            this.cardIdMap[card.cardId].cardImgObj.removeAllListeners();
            this.cardIdMap[card.cardId].cardImgObj.on("pointerdown", () => {
                if (gameStatus.scrollResponses?.[0].originId !== getMyPlayerId()) {
                    return;
                }
                if (gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.length > 0) {
                    return
                }
                if (card.wugefengdengSelectedPlayerId) {
                    return;
                }
                if (!gameStatus.scrollResponses?.[0].isEffect) {
                    return;
                }
                this.gamingScene.socket.emit(
                    EMIT_TYPE.WUGU_BOARD_ACTION,
                    this.getEmitWugufengdengBoardData(card)
                )
            })
        })
    }

    setBoardInteractive(gameStatus: GameStatus) {
        if (gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.includes(getMyPlayerId())) {
            this.baseBoard.maskImg!.disableInteractive()
        } else {
            this.baseBoard.maskImg!.setInteractive()
        }
    }

    setCardSelectedStatus(gameStatus: GameStatus) {
        gameStatus.wugufengdengCards.forEach((card: WugufengdengCard) => {
            if (card.wugefengdengSelectedPlayerId) {
                this.cardIdMap[card.cardId].cardImgObj.setTint(Number(COLOR_CONFIG.disableCard))
                this.cardIdMap[card.cardId].cardMessageObj.setText(gameStatus.players[card.wugefengdengSelectedPlayerId].playerName)
            }
        })
    }

    getBottomText(gameStatus: GameStatus) {
        const hasWuxiePlayer = gameStatus.wuxieSimultaneousResponse.hasWuxiePlayerIds.length > 0;
        const originId = gameStatus.scrollResponses?.[0]?.originId;
        return hasWuxiePlayer ?
            i18(i18Config.WU_GU_FENG_DENG_WAIT_WU_XIE, {name: getPlayerDisplayName(gameStatus, originId)}) :
            i18(i18Config.WU_GU_FENG_DENG_CHOOSING, {name: getPlayerDisplayName(gameStatus, originId)})
    }

    getEmitWugufengdengBoardData(card: Card): EmitWugufengdengBoardData {
        return {
            playerId: getMyPlayerId(),
            card: card,
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const curScrollResponse = gameStatus.scrollResponses?.[0];
        if (isEqual(this._scrollResponse, curScrollResponse)) {
            return;
        }

        const showBoard = curScrollResponse?.actualCard?.key === SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.key
        if (showBoard && !this.baseBoard.show) {
            this.baseBoard.showBoard();
            this.baseBoard.setTitle(i18(CARD_CONFIG.WU_GU_FENG_DENG))
            this.drawWugufengdengCards(gameStatus)
            this.baseBoard.addContent(this.boardContent);
        } else if (!showBoard && this.baseBoard.show) {
            this.baseBoard.hideBoard();
            this.cardIdMap = {};
        }

        // curScrollResponse不同了 所以需要更新Mask和BoardCard状态 并且重新绑定事件
        if (showBoard) {
            this.baseBoard.setBottom(this.getBottomText(gameStatus))
            this.setBoardInteractive(gameStatus);
            this.setCardSelectedStatus(gameStatus);
            this.bindEvent(gameStatus);
        }

        this._scrollResponse = cloneDeep(curScrollResponse);
    }
}