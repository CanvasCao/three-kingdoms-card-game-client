import {sizeConfig} from "../../config/sizeConfig";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {getMyPlayerId} from "../../utils/localstorage/localStorageUtils";
import {sharedDrawBackCard, sharedDrawFrontCard} from "../../utils/draw/drawCardUtils";
import {differenceBy} from "lodash";
import {GamingScene} from "../../types/phaser";
import {BoardPlayer} from "../Player/BoardPlayer";
import {uuidv4} from "../../utils/uuid";
import {Card} from "../../types/card";
import {getMyCardPosition} from "../../utils/position/cardPositionUtils";

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

    cardObjGroup: Phaser.GameObjects.GameObject[];

    constructor(gamingScene: GamingScene,
                card: Card,
                isFaceFront: boolean,
                originIndex: number, // 来源 我打出的牌
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
        } else if (fromBoardPlayer!.playerId == getMyPlayerId()) { // 我打出的牌
            const position = getMyCardPosition(originIndex!);
            this.fadeInStartX = position.x;
            this.fadeInStartY = position.y;
        } else { // 别人打出的牌
            this.fadeInStartX = fromBoardPlayer!.playerPosition.x
            this.fadeInStartY = fromBoardPlayer!.playerPosition.y
        }

        // tint
        this.disableTint = COLOR_CONFIG.disableCard;
        this.ableTint = COLOR_CONFIG.card;

        // inner state
        this.isMoving = false;

        // phaser obj
        this.cardObjGroup = [];

        this.drawCard();
        this.fadeIn();
    }

    drawCard() {
        if (this.isFaceFront) {
            const {
                allCardObjects
            } = sharedDrawFrontCard(
                this.gamingScene,
                this.card,
                {x: this.fadeInStartX, y: this.fadeInStartY}
            )
            this.cardObjGroup = this.cardObjGroup.concat(allCardObjects)
        } else {
            // 摸牌||仁德
            for (let i = 0; i < this.repeatTimes!; i++) {
                const offsetX = i * 20
                const {
                    cardImgObj,
                } = sharedDrawBackCard(this.gamingScene,
                    this.card,
                    {x: this.fadeInStartX + offsetX, y: this.fadeInStartY, offsetX})
                this.cardObjGroup.push(cardImgObj);
            }
        }
    }

    fadeIn() {
        this.isMoving = true;
        this.cardObjGroup.forEach((obj, index) => {
            this.gamingScene.tweens.add({
                targets: obj,
                x: {
                    value: this.fadeInEndX + (obj?.getData("offsetX")),
                    duration: 400,
                },
                y: {
                    value: this.fadeInEndY + (obj?.getData("offsetY")),
                    duration: 400,
                },
                onComplete: () => {
                    this.isMoving = false;
                    this.destoryAll()
                }
            });
        })
    }

    destoryAll() {
        this.cardObjGroup.forEach((obj, index) => {
            obj?.destroy();
        })
    }
}
