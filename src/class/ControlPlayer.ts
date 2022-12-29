import sizeConfig from "../config/sizeConfig.json";
import {getMyPlayerId, uuidv4} from "../utils/gameStatusUtils";
import {GamingScene} from "../types/phaser";
import {Card, GameStatus, Player} from "../types/gameStatus";

export class ControlPlayer {
    obId: string;
    gamingScene: GamingScene;
    player: Player;
    maxBlood: number;
    _currentBlood: number;
    name: string;
    positionX: number;
    positionY: number;

    playerImage?: Phaser.GameObjects.Image;
    bloodsBgGraphics?: Phaser.GameObjects.Graphics;
    bloodImages: Phaser.GameObjects.Image[];

    constructor(gamingScene: GamingScene, player: Player) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.player = player;
        this.maxBlood = player.maxBlood;
        this._currentBlood = player.maxBlood;
        this.name = player.name;
        this.positionX = (sizeConfig.background.width - sizeConfig.player.width / 2)
        this.positionY = (sizeConfig.background.height - sizeConfig.player.height / 2)

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
        this.playerImage.displayHeight = sizeConfig.player.height;
        this.playerImage.displayWidth = sizeConfig.player.width;
    }

    drawBloodsBg() {
        const graphicsW = sizeConfig.player.width * 0.16
        const graphicsH = sizeConfig.player.height * 0.52
        this.bloodsBgGraphics = this.gamingScene.add.graphics();
        this.bloodsBgGraphics.fillStyle(0x000, 1);
        this.bloodsBgGraphics.fillRoundedRect(
            this.positionX + sizeConfig.player.width / 2 - graphicsW,
            this.positionY + sizeConfig.player.height / 2 - graphicsH,
            graphicsW,
            graphicsH, {
                tl: 4,
                tr: 0,
                bl: 0,
                br: 0
            });
    }

    drawBloods() {
        const bloodHeight = sizeConfig.player.height * 0.15;
        const bloodWidth = bloodHeight * 1.5333;
        for (let i = 0; i < this.player.maxBlood; i++) {
            const bloodImage = this.gamingScene.add.image(
                this.positionX + sizeConfig.player.width / 2 * 0.86,
                this.positionY + sizeConfig.player.height / 2 * 0.86 - (bloodHeight * 0.81 * i),
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
        const player = gameStatus.players[this.player.playerId]

        if (this._currentBlood != player.currentBlood) {
            this.setBloods(player.currentBlood)
            this._currentBlood = player.currentBlood
        }
    }
}
