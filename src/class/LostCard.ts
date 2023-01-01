import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {getMyPlayerId, uuidv4} from "../utils/gameStatusUtils";
import {sharedDrawBackCard, sharedDrawFrontCard} from "../utils/drawCardUtils";
import {differenceBy} from "lodash";
import {GameFEStatus} from "../types/gameFEStatus";
import {GamingScene} from "../types/phaser";
import {Card} from "../types/gameStatus";
import {BoardPlayer} from "./BoardPlayer";

export class LostCard {
    obId: string;
    gamingScene: GamingScene;
    card: Card;

    message: string;
    publicCards: Card[];

    toPublic: boolean;

    fadeInStartX: number;
    fadeInStartY: number;
    fadeInEndX: number;
    fadeInEndY: number;

    disableTint: string;
    ableTint: string;

    isMoving: boolean;

    cardObjgroup: Phaser.GameObjects.GameObject[];

    constructor(gamingScene: GamingScene,
                card: Card,
                isFaceFront: boolean,
                message: string,
                originIndex: number | undefined, // 来源 我打出的牌
                publicCards: Card[],
                fromBoardPlayer: BoardPlayer | undefined,
                toBoardPlayer: BoardPlayer | undefined,
    ) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;
        this.message = message;
        this.publicCards = publicCards;
        this.toPublic = !toBoardPlayer;

        this.fadeInStartX = 0;
        this.fadeInStartY = 0;

        // fadeInEnd
        // fadeIn到我手里 逻辑在ControlCard
        if (this.toPublic) { // 到public区域
            const initDiffDistance = this.getInitDiffDistance(this.publicCards);
            this.fadeInEndX = initDiffDistance + sizeConfig.playersArea.width / 2;
            this.fadeInEndY = sizeConfig.background.height / 2;
        } else { // 到其他player
            this.fadeInEndX = toBoardPlayer!.playerPosition.x
            this.fadeInEndY = toBoardPlayer!.playerPosition.y
        }

        // fadeInStart
        if (!fromBoardPlayer && this.toPublic) { // 牌堆出的牌 到弃牌堆（判定牌）
            this.fadeInStartX = this.fadeInEndX + 50;
            this.fadeInStartY = this.fadeInEndY
        } else if (!fromBoardPlayer && !this.toPublic) { // 牌堆出的牌 到player（摸牌 五谷丰登）
            this.fadeInStartX = sizeConfig.playersArea.width / 2;
            this.fadeInStartY = sizeConfig.background.height / 2;
        } else if (fromBoardPlayer!.player.playerId == getMyPlayerId()) { // 我打出的牌
            // LostCard的fadeInStartX 就是controlCard的cardInitEndY
            this.fadeInStartX = originIndex! * sizeConfig.controlCard.width + sizeConfig.controlCard.width / 2;
            this.fadeInStartY = sizeConfig.background.height - sizeConfig.controlCard.height / 2;
        } else { // 别人打出的牌
            this.fadeInStartX = fromBoardPlayer!.playerPosition.x
            this.fadeInStartY = fromBoardPlayer!.playerPosition.y
        }


        // tint
        this.disableTint = colorConfig.disableCard;
        this.ableTint = colorConfig.card;

        // inner state
        this.isMoving = false;

        // phaser obj
        this.cardObjgroup = [];

        this.drawCard(isFaceFront);
        this.fadeIn();

        this.gamingScene.gameFEStatusObserved.addPublicCardsObserver(this);

        if (this.toPublic) {
            setTimeout(() => {
                this.destoryAll();
            }, 15000)
        }
    }

    drawCard(isFaceFront: boolean) {
        if (isFaceFront) {
            const {
                cardImgObj,
                cardNameObj,
                cardHuaseNumberObj,
                cardMessageObj,
            } = sharedDrawFrontCard(this.gamingScene,
                this.card,
                {x: this.fadeInStartX, y: this.fadeInStartY, message: this.message})
            this.cardObjgroup.push(cardImgObj);
            this.cardObjgroup.push(cardNameObj);
            this.cardObjgroup.push(cardHuaseNumberObj);
            this.cardObjgroup.push(cardMessageObj);
        } else {
            const {
                cardImgObj,
            } = sharedDrawBackCard(this.gamingScene,
                this.card,
                {x: this.fadeInStartX, y: this.fadeInStartY})
            this.cardObjgroup.push(cardImgObj);
        }
    }

    fadeIn() {
        this.isMoving = true;
        this.cardObjgroup.forEach((obj, index) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: this.fadeInEndX + (obj?.getData("offsetX") || 0),
                    duration: 500,
                },
                y: {
                    value: this.fadeInEndY + (obj?.getData("offsetY") || 0),
                    duration: 500,
                },
                alpha: {
                    value: 1,
                    duration: 500,
                },
                onComplete: () => {
                    this.isMoving = false;

                    if (!this.toPublic) {
                        this.destoryAll()
                    }
                }
            });
        })
    }

    adjustLocation(gameFEStatus: GameFEStatus) {
        // TODO isMoving有bug 第二张牌打出以后第一张牌isMoving依然是true 导致无法移动
        // if (this.isMoving) {
        //     return
        // }

        const publicCards = gameFEStatus.publicCards;
        const diffDis = this.getDiffDistance(publicCards);

        // this.isMoving = true;
        this.cardObjgroup.forEach((obj, index) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: sizeConfig.playersArea.width / 2 + diffDis + (obj?.getData("offsetX") || 0),
                    duration: 500,
                },
            });
        })
    }


    getInitDiffDistance(publicCards: Card[]) {
        const cardLen = publicCards.length - 1;
        const middle = (cardLen - 1) / 2;
        const diffDis = (cardLen - middle) * sizeConfig.controlCard.width;
        return diffDis;
    }

    getDiffDistance(publicCards: Card[]) {
        const middle = (publicCards.length - 1) / 2;
        const myindex = publicCards.findIndex((c) => c.cardId == this.card.cardId);
        const diffDis = (myindex - middle) * sizeConfig.controlCard.width;
        return diffDis;
    }

    destoryAll() {
        this.cardObjgroup.forEach((obj, index) => {
            obj?.destroy();
        })
        this.removePublicCardsfromGameFEStatus()
        this.gamingScene.gameFEStatusObserved.removePublicCardsObserver(this);
    }

    removePublicCardsfromGameFEStatus() {
        if (!this.toPublic) {
            return
        }

        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        const leftCards = differenceBy(gameFEStatus.publicCards, [this.card], 'cardId');
        gameFEStatus.publicCards = leftCards;
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        if (!this.toPublic) {
            return
        }

        this.adjustLocation(gameFEStatus);
    }
}
