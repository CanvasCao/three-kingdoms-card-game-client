import {GameStatus} from "../../types/gameStatus";
import {Observer} from "../../types/observer";
import {GamingScene} from "../../types/phaser";

export class GameStatusObserved {
    gamingScene: GamingScene;
    gameStatus?: GameStatus;
    observers: Observer[];

    constructor(gamingScene: GamingScene) {
        this.gamingScene = gamingScene
        this.gameStatus;
        this.observers = [];
    }

    addObserver(observer: Observer) {
        this.observers.push(observer);
    }

    removeObserver(observer: Observer) {
        this.observers = this.observers.filter(o => {
            return o.obId != observer.obId;
        });
    }

    setGameStatus(gameStatus: GameStatus) {
        this.gameStatus = gameStatus;
        // @ts-ignore
        window?.editor && window?.editor?.set(gameStatus);
        this.observers.forEach(observer => {
            observer.gameStatusNotify(this.gameStatus as GameStatus);
        });

        this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
    }
}