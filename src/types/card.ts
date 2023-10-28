import {PLAYER_BOARD_ACTION} from "../config/boardConfig";
import {EQUIPMENT_TYPE} from "../config/cardConfig";

export type Card = {
    key: string,
    huase: string,
    number: number,
    cardId: string,
    cardNumDesc: string,
    type: string,
    attribute: string,

    equipmentType?: keyof typeof EQUIPMENT_TYPE,
    horseDistance?: number,
    distance?: number,
    distanceDesc?: string,

    isYiJi?: boolean; // 遗计

    // FE
    canPlayInMyTurn: boolean,
    targetMinMax: { min: number, max: number },
    noNeedSetTargetDueToImDefaultTarget?: boolean,
    noNeedSetTargetDueToTargetAll?: boolean,
}

export type PandingSign = {
    card: Card,
    actualCard: Card,
    isEffect: boolean, // undefined/null 未开始结算生效 true结算生效开始判定 false结算失效
}
export type WugufengdengCard = Card & { wugefengdengSelectedPlayerId: string }
export type PlayerBoardAction = keyof typeof PLAYER_BOARD_ACTION
