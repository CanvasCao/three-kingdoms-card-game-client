import {cloneDeep} from "lodash";
import {GameStatus} from "../../types/gameStatus";
import {Observer} from "../../types/observer";
import {GamingScene} from "../../types/phaser";

export class GameStatusObserved {
    gamingScene: GamingScene;
    prev_gameStatus?: GameStatus;
    gameStatus?: GameStatus;
    observers: Observer[];

    constructor(gamingScene: GamingScene) {
        this.gamingScene = gamingScene
        this.prev_gameStatus;
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
        this.prev_gameStatus = this.gameStatus ? cloneDeep(this.gameStatus) : cloneDeep(gameStatus) // 第一次设置prev_gameStatus this.gameStatus为空需要设置成gameStatus
        this.gameStatus = gameStatus;
        // @ts-ignore
        window?.editor && window?.editor?.set(gameStatus);
        this.observers.forEach(observer => {
            observer.gameStatusNotify(gameStatus);
        });

        this.gamingScene.gameFEStatusObserved.resetSelectedStatus();
    }
}