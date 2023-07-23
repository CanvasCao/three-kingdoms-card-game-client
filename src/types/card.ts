import {PLAYER_BOARD_ACTION} from "../config/boardConfig";
import {CARD_LOCATION, EQUIPMENT_TYPE} from "../config/cardConfig";

export type Card = {
    huase: string,
    number: number,
    key: string,
    cardId: string,
    cardNumDesc: string,
    type: string,
    attribute: string,

    equipmentType?: keyof typeof EQUIPMENT_TYPE,
    horseDistance?: number,
    distance?: number,
    distanceDesc?: string,

    canClickMySelfAsFirstTarget?: boolean,
    canClickMySelfAsSecondTarget?: boolean,
    canPlayInMyTurn: boolean,
    targetMinMax: { min: number, max: number },
    noNeedSetTargetDueToImDefaultTarget?: boolean,
    noNeedSetTargetDueToTargetAll?: boolean,
    couldHaveMultiTarget?: boolean,
    canOnlyHaveOneTarget?: boolean,

    // 只有借刀杀人
    needAActionToB?: boolean,
}
export type PandingSign = {
    card: Card,
    actualCard: Card,
    isEffect: boolean, // undefined/null 未开始结算生效 true结算生效开始判定 false结算失效
}
export type WugufengdengCard = Card & { wugefengdengSelectedPlayerId: string }
export type CardAreaType = keyof typeof CARD_LOCATION
export type CardBoardActionType = keyof typeof PLAYER_BOARD_ACTION

export type CardConfigValue = {
    key?: string,
    CN: string,
    EN: string,
    type?: string,
    equipmentType?: string,
    distance?:number
}
export type CardConfig = { [key: string]: CardConfigValue }

export type CardDescValue = {
    CN: string,
    EN: string,
}
export type CardDescConfig = { [key: string]: CardDescValue }