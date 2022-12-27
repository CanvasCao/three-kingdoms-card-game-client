import {uuidv4} from "../utils/gameStatusUtils";
import {GamingScene} from "../types/phaser";

export class PublicLine {
    obId: string;
    gamingScene: GamingScene;
    locations: {
        startX: number,
        startY: number,
        endX: number,
        endY: number,
    };
    graphics: any;

    constructor(gamingScene: GamingScene, locations: {
        startX: number,
        startY: number,
        endX: number,
        endY: number,
    }) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.locations = locations


        this.drawLine();


        setTimeout(() => {
            this.destoryAll();
        }, 900)
    }

    drawLine() {
        const {startX, startY, endX, endY} = this.locations;
        this.graphics = this.gamingScene.add.graphics();
        let line;
        let percent: number = 0;
        const timer = setInterval(() => {
            line = new Phaser.Geom.Line(startX, startY, startX + (endX - startX) * percent, startY + (endY - startY) * percent);
            percent += 0.1;
            this.graphics.lineStyle(2, 0xffff00);
            this.graphics.strokeLineShape(line);

            if (percent >= 1) {
                clearInterval(timer)
            }
        }, 10)
    }

    destoryAll() {
        this.graphics.destroy()
    }

}
