import {SCROLL_CARDS_CONFIG} from '../../config/cardConfig';
import {SKILL_NAMES} from '../../config/skillsConfig'
import {GameStatus} from '../../types/gameStatus';
import {getMyPlayerId} from '../localstorage/localStorageUtils';

const getIfShowShunChaiPlayerCardsBoard = (gameStatus: GameStatus) => {
    const curScrollResponse = gameStatus.scrollResponses?.[0];
    return curScrollResponse && curScrollResponse.originId == getMyPlayerId() &&
        curScrollResponse.isEffect &&
        [SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN, SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN].includes(curScrollResponse.actualCard.CN)
}

const getIfShowFanKuiPlayerCardsBoard = (gameStatus: GameStatus) => {
    const skillResponse = gameStatus.skillResponse;
    return skillResponse && skillResponse.skillName == SKILL_NAMES.WEI["002"].FAN_KUI && skillResponse.chooseToReleaseSkill
}


export {
    getIfShowShunChaiPlayerCardsBoard,
    getIfShowFanKuiPlayerCardsBoard
}