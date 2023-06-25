import {GameStatus} from "../types/gameStatus";
import {GameFEStatus} from "../types/gameFEStatus";
import {getCanPlayInMyTurn, getIsMyResponseTurn, getIsMyThrowTurn} from "./stageUtils";
import {getIsZhangBaSheMaoSelected} from "./weaponUtils";
import {getMyPlayerId} from "./localstorage/localStorageUtils";

const getNeedSelectCardsNumber = (gameStatus: GameStatus, gameFEStatus: GameFEStatus) => {
    const canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
    const isMyResponseTurn = getIsMyResponseTurn(gameStatus);
    const isMyThrowTurn = getIsMyThrowTurn(gameStatus);

    if (canPlayInMyTurn || isMyResponseTurn) {
        if (getIsZhangBaSheMaoSelected(gameFEStatus)) {
            return 2;
        }

        // 响应是否选择使用技能
        if (gameStatus.skillResponse && gameStatus.skillResponse.chooseToReleaseSkill === undefined) {
            return 0
        }

        return 1;
    } else if (isMyThrowTurn) {
        const myPlayer = gameStatus.players[getMyPlayerId()];
        return myPlayer.cards.length - myPlayer.currentBlood;
    }

    return 0
}

// 选手牌 武器牌 或 点击OK 的时候校验数字
export {getNeedSelectCardsNumber};