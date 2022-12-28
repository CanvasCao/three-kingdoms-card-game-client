import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId, uuidv4} from "../utils/gameStatusUtils";
import {GamingScene} from "../types/phaser";
import {Card, GameStatus, User} from "../types/gameStatus";

export class ControlPlayer {
    obId: string;
    gamingScene: GamingScene;
    player: User;
    maxBlood: number;
    name: string;
    positionX: number;
    positionY: number;

    imageStroke?: Phaser.GameObjects.Graphics;
    playerImage?: Phaser.GameObjects.Image;
    graphics?: Phaser.GameObjects.Graphics;
    bloodImages?: Phaser.GameObjects.Image[];

    constructor(gamingScene: GamingScene, player: User) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.player = player;
        this.maxBlood = player.maxBlood || 4;
        this.name = player.name;
        this.positionX = (sizeConfig.background.width - sizeConfig.controlPlayer.width / 2)
        this.positionY = (sizeConfig.background.height - sizeConfig.controlPlayer.height / 2)

        this.drawPlayer();
        this.drawBloodBg();
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

    drawBloodBg() {
        this.graphics = this.gamingScene.add.graphics();
        this.graphics.fillStyle(0x000, 1);
        this.graphics.fillRoundedRect(sizeConfig.background.width - 18,
            sizeConfig.background.height - 100,
            18,
            100, {
                tl: 4,
                tr: 0,
                bl: 0,
                br: 0
            });
    }

    drawBloods() {
        this.bloodImages = [];
        for (let i = 0; i < this.maxBlood; i++) {
            const bloodImage = this.gamingScene.add.image(
                sizeConfig.background.width - sizeConfig.blood.width / 2 + 10,
                sizeConfig.background.height - 10 - (sizeConfig.blood.height * 0.8 * i),
                "greenGouyu");
            bloodImage.displayHeight = sizeConfig.blood.height;
            bloodImage.displayWidth = sizeConfig.blood.width;
            this.bloodImages.push(bloodImage);
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
    }
}
