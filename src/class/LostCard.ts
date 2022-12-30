import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {getMyPlayerId, uuidv4} from "../utils/gameStatusUtils";
import {sharedDrawCard} from "../utils/drawCardUtils";
import {differenceBy} from "lodash";
import {GameFEStatus} from "../types/gameFEStatus";
import {GamingScene} from "../types/phaser";
import {Card} from "../types/gameStatus";
import {
    cardHuaseNumberObjOffsetX,
    cardHuaseNumberObjOffsetY,
    cardNameObjOffsetX,
    cardNameObjOffsetY
} from "../config/offsetConfig";
import {BoardPlayer} from "./BoardPlayer";

export class LostCard {
    obId: string;
    gamingScene: GamingScene;
    card: Card;

    message: string;
    publicCards: Card[];
    originOwnerPlayer: BoardPlayer;
    targetPlayer: BoardPlayer | null;

    fadeInStartX: number;
    fadeInStartY: number;
    fadeInEndX: number;
    fadeInEndY: number;

    disableTint: string;
    ableTint: string;

    isMoving: boolean;

    group: Phaser.GameObjects.Group;
    cardNameObj: Phaser.GameObjects.Text | null;
    cardImgObj: Phaser.GameObjects.Image | null;
    cardHuaseNumberObj: Phaser.GameObjects.Text | null;
    cardMessageObj: Phaser.GameObjects.Text | null;

    constructor(gamingScene: GamingScene,
                card: Card,
                originIndex: number | undefined,
                message: string,
                publicCards: Card[],
                originOwnerPlayer: BoardPlayer,
                targetPlayer: BoardPlayer | null,
    ) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;
        this.message = message;
        this.publicCards = publicCards;
        this.originOwnerPlayer = originOwnerPlayer;
        this.targetPlayer = targetPlayer;

        const initDiffDistance = this.getInitDiffDistance(this.publicCards);

        this.fadeInStartX = 0;
        this.fadeInStartY = 0;

        // fadeInEnd
        if (!targetPlayer) { // to Public
            this.fadeInEndX = initDiffDistance + sizeConfig.playersArea.width / 2;
            this.fadeInEndY = sizeConfig.background.height / 2;
        } else { // player之间移动
            // TODO 牌的移动
            this.fadeInEndX = initDiffDistance + sizeConfig.playersArea.width / 2;
            this.fadeInEndY = sizeConfig.background.height / 2;
        }

        // fadeInStart
        if (!this.originOwnerPlayer) { // 牌堆打出的牌
            this.fadeInStartX = this.fadeInEndX + 50;
            this.fadeInStartY = this.fadeInEndY
        } else if (this.originOwnerPlayer.player.playerId == getMyPlayerId()) { // 我打出的牌
            // LostCard的fadeInStartX 就是controlCard的cardInitEndY
            this.fadeInStartX = originIndex! * sizeConfig.controlCard.width + sizeConfig.controlCard.width / 2;
            this.fadeInStartY = sizeConfig.background.height - sizeConfig.controlCard.height / 2;
        } else { // 别人打出的牌
            this.fadeInStartX = originOwnerPlayer.playerPosition.x
            this.fadeInStartY = originOwnerPlayer.playerPosition.y
        }


        // tint
        this.disableTint = colorConfig.disableCard;
        this.ableTint = colorConfig.card;

        // inner state
        this.isMoving = false;

        // phaser obj
        this.group = this.gamingScene.add.group();
        this.cardNameObj = null;
        this.cardImgObj = null;
        this.cardHuaseNumberObj = null;
        this.cardMessageObj = null;

        this.drawCard();
        this.fadeIn();

        this.gamingScene.gameFEStatusObserved.addPublicCardsObserver(this);

        setTimeout(() => {
            this.destoryAll();
        }, 15000)
    }

    fadeIn() {
        this.isMoving = true;
        [this.cardImgObj, this.cardNameObj, this.cardHuaseNumberObj, this.cardMessageObj].forEach((obj, index) => {
            let offsetX = 0, offsetY = 0;
            if (index == 1) {
                offsetX = cardNameObjOffsetX
                offsetY = cardNameObjOffsetY
            } else if (index == 2) {
                offsetX = cardHuaseNumberObjOffsetX
                offsetY = cardHuaseNumberObjOffsetY
            }

            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: this.fadeInEndX + offsetX,
                    duration: 500,
                },
                y: {
                    value: this.fadeInEndY + offsetY,
                    duration: 500,
                },
                alpha: {
                    value: 1,
                    duration: 50,
                },
                onComplete: () => {
                    this.isMoving = false;
                }
            });
        })
    }

    drawCard() {
        const {
            cardImgObj,
            cardNameObj,
            cardHuaseNumberObj,
            cardMessageObj,
        } = sharedDrawCard(this.gamingScene,
            this.card,
            {x: this.fadeInStartX, y: this.fadeInStartY, message: this.message})
        this.cardImgObj = cardImgObj
        this.cardNameObj = cardNameObj
        this.cardHuaseNumberObj = cardHuaseNumberObj
        this.cardMessageObj = cardMessageObj!
        this.group.add(cardImgObj);
        this.group.add(cardNameObj);
        this.group.add(cardHuaseNumberObj);
        this.group.add(cardMessageObj!);
    }

    adjustLocation(gameFEStatus: GameFEStatus) {
        // TODO isMoving有bug 第二张牌打出以后第一张牌isMoving依然是true 导致无法移动
        // if (this.isMoving) {
        //     return
        // }

        const publicCards = gameFEStatus.publicCards;
        const diffDis = this.getDiffDistance(publicCards);

        // this.isMoving = true;
        [this.cardImgObj, this.cardNameObj, this.cardHuaseNumberObj, this.cardMessageObj].forEach((obj, index) => {
            let offsetX = 0, offsetY = 0;
            if (index == 1) {
                offsetX = cardNameObjOffsetX
                offsetY = cardNameObjOffsetY
            } else if (index == 2) {
                offsetX = cardHuaseNumberObjOffsetX
                offsetY = cardHuaseNumberObjOffsetY
            }
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: sizeConfig.playersArea.width / 2 + diffDis + offsetX,
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
        // TODO 好像是Phaser的bug 只能遍历到两个child
        // this.group.getChildren().forEach((child,i) => {
        //     console.log(child,i)
        //     child.destroy()
        // })

        this.cardNameObj!.destroy();
        this.cardImgObj!.destroy();
        this.cardHuaseNumberObj!.destroy();
        this.cardMessageObj!.destroy();
        this.removeCardsfromGameFEStatus()
        this.gamingScene.gameFEStatusObserved.removePublicCardsObserver(this);
    }

    removeCardsfromGameFEStatus() {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus;

        const leftCards = differenceBy(gameFEStatus.publicCards, [this.card], 'cardId');
        gameFEStatus.publicCards = leftCards;
        this.gamingScene.gameFEStatusObserved.setPublicCardsGameEFStatus(gameFEStatus)
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        this.adjustLocation(gameFEStatus);
    }
}
