import {sizeConfig} from "../../config/sizeConfig";
import colorConfig from "../../config/colorConfig.json";
import {getMyPlayerId} from "../../utils/localStorageUtils";
import {sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {differenceBy} from "lodash";
import {GameFEStatus} from "../../types/gameFEStatus";
import {GamingScene} from "../../types/phaser";
import {Card} from "../../types/gameStatus";
import {BoardPlayer} from "../Player/BoardPlayer";
import {getControlCardPosition} from "../../utils/cardUtils";
import {uuidv4} from "../../utils/uuid";

export class ToPublicCard {
    obId: string;
    gamingScene: GamingScene;
    card: Card;

    message: string;
    publicCards: Card[];

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
                message: string,
                publicCards: Card[],
                fromBoardPlayer: BoardPlayer | undefined,
                originIndex: number | undefined, // 来源 只出现在我打出的牌
    ) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;
        this.message = message;
        this.publicCards = publicCards;

        this.fadeInStartX = 0;
        this.fadeInStartY = 0;

        // fadeInEnd
        // fadeIn到我手里 逻辑在ControlCard
        const initDiffDistance = this.getInitDiffDistance(this.publicCards);
        this.fadeInEndX = initDiffDistance + sizeConfig.playersArea.width / 2;
        this.fadeInEndY = sizeConfig.background.height / 2;

        // fadeInStart
        if (!fromBoardPlayer) { //（判定牌）
            this.fadeInStartX = this.fadeInEndX + 50;
            this.fadeInStartY = this.fadeInEndY
        } else if (fromBoardPlayer!.player.playerId == getMyPlayerId()) { // 我打出的牌
            // LostCard的fadeInStartX 就是controlCard的cardInitEndY
            const position = getControlCardPosition(originIndex!);
            this.fadeInStartX = position.x;
            this.fadeInStartY = position.y;
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

        this.drawCard();
        this.fadeIn();

        this.gamingScene.gameFEStatusObserved.addPublicCardsObserver(this);

        setTimeout(() => {
            this.destoryAll();
        }, 15000)
    }

    drawCard() {
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
    }

    fadeIn() {
        this.isMoving = true;
        this.cardObjgroup.forEach((obj, index) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: this.fadeInEndX + (obj?.getData("offsetX") || 0),
                    duration: 300,
                },
                y: {
                    value: this.fadeInEndY + (obj?.getData("offsetY") || 0),
                    duration: 300,
                },
                alpha: {
                    value: 1,
                    duration: 300,
                },
                onComplete: () => {
                    this.isMoving = false;
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
                    value: sizeConfig.playersArea.width / 2 + diffDis + (obj?.getData("offsetX")),
                    duration: 300,
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
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        const leftCards = differenceBy(gameFEStatus.publicCards, [this.card], 'cardId');
        gameFEStatus.publicCards = leftCards;
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        this.adjustLocation(gameFEStatus);
    }
}
