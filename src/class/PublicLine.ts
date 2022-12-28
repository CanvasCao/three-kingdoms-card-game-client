import {uuidv4} from "../utils/gameStatusUtils";
import {GamingScene} from "../types/phaser";

export class PublicLine {
    obId: string;
    gamingScene: GamingScene;
    locations: {
        startPosition: { x: number, y: number },
        endPosition: { x: number, y: number },
    };
    graphics: Phaser.GameObjects.Graphics | null;

    constructor(gamingScene: GamingScene, locations: {
        startPosition: { x: number, y: number },
        endPosition: { x: number, y: number },
    }) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.locations = locations
        this.graphics = null;

        this.drawLine();


        setTimeout(() => {
            this.destoryAll();
        }, 900)
    }

    drawLine() {
        const {
            startPosition: {x: startX, y: startY},
            endPosition: {x: endX, y: endY}
        } = this.locations;

        this.graphics = this.gamingScene.add.graphics();
        let line;
        let percent: number = 0;
        const timer = setInterval(() => {
            line = new Phaser.Geom.Line(startX, startY, startX + (endX - startX) * percent, startY + (endY - startY) * percent);
            percent += 0.1;
            this.graphics!.lineStyle(2, 0xffff00);
            this.graphics!.strokeLineShape(line);

            if (percent >= 1) {
                clearInterval(timer)
            }
        }, 10)
    }

    destoryAll() {
        this.graphics!.destroy()
    }

}
