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

    }

    drawLine() {
        const {
            startPosition: {x: startX, y: startY},
            endPosition: {x: endX, y: endY}
        } = this.locations;

        this.graphics = this.gamingScene.add.graphics();
        let line;
        let startPointPercent: number = 0;
        let endPointPercent: number = 0;
        let loopIndex = 0;
        const timer = setInterval(() => {
            line = new Phaser.Geom.Line(
                startX + (endX - startX) * startPointPercent,
                startY + (endY - startY) * startPointPercent,
                startX + (endX - startX) * endPointPercent,
                startY + (endY - startY) * endPointPercent);

            if (endPointPercent < 1) {
                endPointPercent += 0.1;
            } else if (loopIndex < 20) {
                loopIndex++
            } else {
                startPointPercent += 0.1;
            }

            this.graphics!.clear();
            this.graphics!.lineStyle(2, 0xF8D781);
            this.graphics!.strokeLineShape(line);

            if (endPointPercent >= 1 && startPointPercent >= 1 && loopIndex >= 20) {
                this.destoryAll();
                clearInterval(timer)
            }
        }, 10)
    }

    destoryAll() {
        this.graphics!.destroy()
    }

}
