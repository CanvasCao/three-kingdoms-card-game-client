import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId, uuidv4} from "../utils/gameStatusUtils";
import {GamingScene} from "../types/phaser";
import {Card, GameStatus, User} from "../types/gameStatus";

export class ControlPlayer {
    obId: string;
    gamingScene: GamingScene;
    player: User;
    maxBlood: number;
    _currentBlood: number;
    name: string;
    positionX: number;
    positionY: number;

    playerImage?: Phaser.GameObjects.Image;
    bloodsBgGraphics?: Phaser.GameObjects.Graphics;
    bloodImages: Phaser.GameObjects.Image[];

    constructor(gamingScene: GamingScene, player: User) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.player = player;
        this.maxBlood = player.maxBlood;
        this._currentBlood = player.maxBlood;
        this.name = player.name;
        this.positionX = (sizeConfig.background.width - sizeConfig.controlPlayer.width / 2)
        this.positionY = (sizeConfig.background.height - sizeConfig.controlPlayer.height / 2)

        this.bloodImages = [];

        this.drawPlayer();
        this.drawBloodsBg();
        this.drawBloods();
        this.gamingScene.gameStatusObserved.addObserver(this);
    }

    drawPlayer() {
        this.playerImage = this.gamingScene.add.image(
            this.positionX,
            this.positionY,
            this.player.cardId);
        this.playerImage.displayHeight = sizeConfig.controlPlayer.height;
        this.playerImage.displayWidth = sizeConfig.controlPlayer.width;
    }

    drawBloodsBg() {
        const graphicsW = sizeConfig.controlPlayer.width * 0.16
        const graphicsH = sizeConfig.controlPlayer.height * 0.52
        this.bloodsBgGraphics = this.gamingScene.add.graphics();
        this.bloodsBgGraphics.fillStyle(0x000, 1);
        this.bloodsBgGraphics.fillRoundedRect(
            this.positionX + sizeConfig.controlPlayer.width / 2 - graphicsW,
            this.positionY + sizeConfig.controlPlayer.height / 2 - graphicsH,
            graphicsW,
            graphicsH, {
                tl: 4,
                tr: 0,
                bl: 0,
                br: 0
            });
    }

    drawBloods() {
        const bloodHeight = sizeConfig.controlPlayer.height * 0.15;
        const bloodWidth = bloodHeight * 1.5333;
        for (let i = 0; i < this.player.maxBlood; i++) {
            const bloodImage = this.gamingScene.add.image(
                this.positionX + sizeConfig.controlPlayer.width / 2 * 0.86,
                this.positionY + sizeConfig.controlPlayer.height / 2 * 0.86 - (bloodHeight * 0.81 * i),
                "greenGouyu");
            bloodImage.displayHeight = bloodHeight;
            bloodImage.displayWidth = bloodWidth;
            this.bloodImages.push(bloodImage);
        }
    }

    setBloods(number: number) {
        for (let i = 0; i < this.bloodImages!.length; i++) {
            const bloodNumber = i + 1;
            const alpha = (bloodNumber > number) ? 0 : 1

            this.gamingScene.tweens.add({
                targets: this.bloodImages![i],
                alpha: {
                    value: alpha,
                    duration: 500,
                    ease: "Bounce.easeInOut"
                }
            });
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const user = gameStatus.users[this.player.userId]

        if (this._currentBlood != user.currentBlood) {
            this.setBloods(user.currentBlood)
            this._currentBlood = user.currentBlood
        }
    }
}
