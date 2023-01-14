import sizeConfig from "../../config/sizeConfig.json";
import colorConfig from "../../config/colorConfig.json";
import {getMyPlayerId, uuidv4} from "../../utils/gameStatusUtils";
import {sharedDrawBackCard, sharedDrawFrontCard} from "../../utils/drawCardUtils";
import {differenceBy} from "lodash";
import {GameFEStatus} from "../../types/gameFEStatus";
import {GamingScene} from "../../types/phaser";
import {Card} from "../../types/gameStatus";
import {BoardPlayer} from "../Player/BoardPlayer";
import {getControlCardPosition} from "../../utils/cardUtils";

export class ToPlayerCard {
    obId: string;
    gamingScene: GamingScene;
    card: Card;
    isFaceFront: boolean;
    repeatTimes: number;

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
                originIndex: number | undefined, // 来源 我打出的牌
                fromBoardPlayer: BoardPlayer | undefined,
                toBoardPlayer: BoardPlayer | undefined,
                repeatTimes?: number,
    ) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.card = card;
        this.isFaceFront = isFaceFront;
        this.repeatTimes = repeatTimes || 1;

        this.fadeInStartX = 0;
        this.fadeInStartY = 0;

        // fadeInEnd
        // fadeIn到我手里 逻辑在ControlCard
        this.fadeInEndX = toBoardPlayer!.playerPosition.x
        this.fadeInEndY = toBoardPlayer!.playerPosition.y

        // fadeInStart
        if (!fromBoardPlayer) { // 牌堆出的牌 到player（摸牌 五谷丰登）
            this.fadeInStartX = sizeConfig.playersArea.width / 2;
            this.fadeInStartY = sizeConfig.background.height / 2;
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
    }

    drawCard() {
        if (this.isFaceFront) {
            const {
                cardImgObj,
                cardNameObj,
                cardHuaseNumberObj,
                cardMessageObj,
            } = sharedDrawFrontCard(this.gamingScene,
                this.card,
                {x: this.fadeInStartX, y: this.fadeInStartY})
            this.cardObjgroup.push(cardImgObj);
            this.cardObjgroup.push(cardNameObj);
            this.cardObjgroup.push(cardHuaseNumberObj);
            this.cardObjgroup.push(cardMessageObj);
        } else {
            // 摸牌||仁德
            for (let i = 0; i < this.repeatTimes!; i++) {
                const offsetX = i * 20
                const {
                    cardImgObj,
                } = sharedDrawBackCard(this.gamingScene,
                    this.card,
                    {x: this.fadeInStartX + offsetX, y: this.fadeInStartY, offsetX})
                this.cardObjgroup.push(cardImgObj);
            }
        }
    }

    fadeIn() {
        this.isMoving = true;
        this.cardObjgroup.forEach((obj, index) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: this.fadeInEndX + (obj?.getData("offsetX")),
                    duration: 300,
                },
                y: {
                    value: this.fadeInEndY + (obj?.getData("offsetY")),
                    duration: 300,
                },
                alpha: {
                    value: 1,
                    duration: 500,
                },
                onComplete: () => {
                    this.isMoving = false;
                    this.destoryAll()
                }
            });
        })
    }

    destoryAll() {
        this.cardObjgroup.forEach((obj, index) => {
            obj?.destroy();
        })
    }
}
