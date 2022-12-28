import sizeConfig from "../config/sizeConfig.json";
import colorConfig from "../config/colorConfig.json";
import {uuidv4} from "../utils/gameStatusUtils";
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

export class PublicCard {
    obId: string;
    gamingScene: GamingScene;
    card: Card;

    message: string;
    publicCards: Card[];

    cardInitStartX: number;
    cardInitStartY: number;

    disableTint: string;
    ableTint: string;

    isMoving: boolean;

    group: Phaser.GameObjects.Group;
    cardNameObj: Phaser.GameObjects.Text | null;
    cardImgObj: Phaser.GameObjects.Image | null;
    cardHuaseNumberObj: Phaser.GameObjects.Text | null;
    cardMessageObj: Phaser.GameObjects.Text | null;

    constructor(gamingScene: GamingScene, card: Card, message: string, publicCards: Card[]) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;
        this.message = message;
        this.publicCards = publicCards;

        const initDiffDistance = this.getInitDiffDistance(this.publicCards);
        this.cardInitStartX = initDiffDistance + sizeConfig.playersArea.width / 2;
        this.cardInitStartY = sizeConfig.background.height / 2;

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
        } = sharedDrawCard(this.gamingScene,
            this.card,
            {x: this.cardInitStartX, y: this.cardInitStartY, message: this.message})
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
        this.removeCardsfromGameFEStatus()// from gameFEStatusObserved
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
