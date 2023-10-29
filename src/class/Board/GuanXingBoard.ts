import {GameStatus} from "../../types/gameStatus";
import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {uuidv4} from "../../utils/uuid";
import {i18, isLanEn} from "../../i18n/i18nUtils";
import {DEPTH_CONFIG} from "../../config/depthConfig";
import {BaseBoard} from "./BaseBoard";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {invert} from "lodash";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {EMIT_TYPE} from "../../config/emitConfig";
import {EmitGuanXingBoardData} from "../../types/emit";
import {sizeConfig} from "../../config/sizeConfig";
import {sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {Card} from "../../types/card";
import {i18Config} from "../../i18n/i18Config";

const boardSize = {
    height: 380,
    width: 580,
}

export class GuanXingBoard {
    obId: string;
    gamingScene: GamingScene;
    boardContent: PhaserGameObject[];

    // innerState
    _originId: string | undefined;

    placeholderObjs: { [key: number]: Phaser.GameObjects.Image };
    cardIdAllObjs: { [cardId: string]: PhaserGameObject[] };
    cardIdIndex: { [cardId: string]: number } // {'a': 0, 'b': 7, 'c': 3,} 卡牌移动的位置
    selectedIndex: number | undefined // 选中的第一张 用来交换位置和显示选中框

    baseBoard: BaseBoard;
    initX: number;
    initY: number;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();
        this.gamingScene = gamingScene
        this.boardContent = []

        this.placeholderObjs = {};
        this.cardIdAllObjs = {};
        this.cardIdIndex = {}
        this.selectedIndex;

        this.baseBoard = new BaseBoard(gamingScene, {
            boardSize,
        });
        this.initX = this.baseBoard.initX;
        this.initY = this.baseBoard.initY;

        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawCards(gameStatus: GameStatus) {
        const guanXingCards = gameStatus.guanXingBoardResponse?.guanXingCards!
        Array(10).fill(1).forEach((_, i) => {
            const isTop = i < 5
            const x = isTop ? this.initX + 100 * i - 200 : this.initX + 100 * (i - 5) - 200
            const y = isTop ? this.initY - 70 : this.initY + 70

            const imageObj = this.gamingScene.add.image(
                x, y, 'white')
                .setDepth(DEPTH_CONFIG.BOARD)
                .setOrigin(0.5, 0.5)
                .setTint(Number(COLOR_CONFIG.blackString))
                .setInteractive()
            imageObj.displayHeight = sizeConfig.controlCard.height;
            imageObj.displayWidth = sizeConfig.controlCard.width;
            this.boardContent = this.boardContent.concat(imageObj)
            this.placeholderObjs[i] = imageObj // 存image位置 给观星调整的时候找到对应的位置
            imageObj.on('pointerdown', () => {
                const currentIndex = i;

                if (this.selectedIndex !== undefined) {
                    // switch index
                    const firstCardId = Object.keys(this.cardIdIndex).find(key => this.cardIdIndex[key] === this.selectedIndex)!;
                    const secondIndex = currentIndex

                    this.cardIdIndex[firstCardId] = secondIndex; // 之前选中的卡是现在的位置

                    // update position
                    this.cardIdAllObjs[firstCardId].forEach((obj) => {
                        obj.setPosition(
                            this.placeholderObjs[secondIndex]!.x + (obj?.getData("offsetX")),
                            this.placeholderObjs[secondIndex]!.y + (obj?.getData("offsetY")))
                        obj.setDepth(DEPTH_CONFIG.BOARD + 1)
                    })

                    // clear selectedIndex
                    this.selectedIndex = undefined
                }
            })


            let text;
            if (isTop) {
                text = isLanEn() ? 'top' : '置于顶部的牌'
            } else {
                text = isLanEn() ? 'buttom' : '置于底部的牌'
            }
            const textObj = this.gamingScene.add.text(x, y, text)
                .setOrigin(0.5, 0.5)
                .setPadding(0, 2, 0, 0)
                .setDepth(DEPTH_CONFIG.BOARD)
                .setFontSize(14)
            this.boardContent = this.boardContent.concat(textObj)


            if (guanXingCards[i]) {
                const cardId = guanXingCards[i].cardId
                const {allCardObjects, cardImgObj} = sharedDrawFrontCard(this.gamingScene, guanXingCards[i],
                    {x, y, depth: DEPTH_CONFIG.BOARD})
                cardImgObj.on('pointerdown', () => {
                    const currentIndex = this.cardIdIndex[cardId];

                    if (this.selectedIndex == undefined) {
                        this.selectedIndex = currentIndex
                    } else if (this.selectedIndex == currentIndex) {
                        this.selectedIndex = undefined
                    } else {
                        // switch index
                        const firstCardId = Object.keys(this.cardIdIndex).find(key => this.cardIdIndex[key] === this.selectedIndex)!;
                        const secondCardId = cardId;
                        const firstIndex = this.selectedIndex
                        const secondIndex = currentIndex

                        this.cardIdIndex[firstCardId] = secondIndex; // 之前选中的卡是现在的位置
                        this.cardIdIndex[cardId] = firstIndex // 现在选中的卡是之前的位置

                        // update position
                        this.cardIdAllObjs[firstCardId].forEach((obj) => {
                            obj.setPosition(
                                this.placeholderObjs[secondIndex]!.x + (obj?.getData("offsetX")),
                                this.placeholderObjs[secondIndex]!.y + (obj?.getData("offsetY")))
                            obj.setDepth(DEPTH_CONFIG.BOARD + 1)
                        })
                        this.cardIdAllObjs[secondCardId].forEach((obj) => {
                            obj.setPosition(
                                this.placeholderObjs[firstIndex]!.x + (obj?.getData("offsetX")),
                                this.placeholderObjs[firstIndex]!.y + (obj?.getData("offsetY")))
                            obj.setDepth(DEPTH_CONFIG.BOARD + 1)
                        })

                        // clear selectedIndex
                        this.selectedIndex = undefined
                    }
                })
                this.cardIdAllObjs[cardId] = allCardObjects;
                this.boardContent = this.boardContent.concat(allCardObjects)
            }
        })
    }

    drawOkButton(gameStatus: GameStatus) {
        const guanXingCards = gameStatus.guanXingBoardResponse?.guanXingCards!
        const x = this.initX
        const y = this.initY + 160
        const imageObj = this.gamingScene.add.image(
            x, y, 'white')
            .setDepth(DEPTH_CONFIG.BOARD)
            .setOrigin(0.5, 0.5)
            // @ts-ignore
            .setTint(COLOR_CONFIG.buttonAble)
            .setInteractive({cursor: 'pointer'})
        imageObj.displayHeight = sizeConfig.boardBtn.height;
        imageObj.displayWidth = sizeConfig.boardBtn.width;
        imageObj.on('pointerdown', () => {
            const index_cardId: { [key: number]: string } = invert(this.cardIdIndex);
            const topCards: Card[] = [];
            const bottomCards: Card[] = [];

            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((index => {
                if (index_cardId[index]) {
                    const cardId = index_cardId[index]
                    const card = guanXingCards.find(card => card.cardId == cardId)!
                    if (index < 5) {
                        topCards.push(card)
                    } else {
                        bottomCards.push(card)
                    }
                }
            }));
            const data: EmitGuanXingBoardData = {
                topCards,
                bottomCards,
            }
            this.gamingScene.socket.emit(
                EMIT_TYPE.GUAN_XING_ACTION,
                data
            )
        })
        this.boardContent = this.boardContent.concat(imageObj)

        const textObj = this.gamingScene.add.text(x, y, i18(i18Config.OK))
            .setOrigin(0.5, 0.5)
            .setPadding(0, 2, 0, 0)
            .setDepth(DEPTH_CONFIG.BOARD)
            .setFontSize(14)
        this.boardContent = this.boardContent.concat(textObj)


        // const data: EmitGuanXingBoardData =;
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const originId = gameStatus.guanXingBoardResponse?.originId;
        if (this._originId == originId) {
            return;
        }

        const showBoard = originId == getMyPlayerId();
        if (showBoard && !this.baseBoard.show) {

            this.baseBoard.showBoard();

            gameStatus.guanXingBoardResponse?.guanXingCards.forEach((card, i) => {
                this.cardIdIndex[card.cardId] = i
            })

            const title = i18(SKILL_NAMES_CONFIG.SHU004_GUAN_XING)
            this.baseBoard.setTitle(title)
            this.drawCards(gameStatus)
            this.drawOkButton(gameStatus)
            this.baseBoard.addContent(this.boardContent);
        } else if (!showBoard && this.baseBoard.show) {
            this.baseBoard.hideBoard();
        }

        this._originId = originId;
    }
}