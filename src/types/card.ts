import {EQUIPMENT_TYPE} from "../config/cardConfig";

export type Card = {
    huase: string,
    number: number,
    key: string,
    KEY: string,
    cardId: string,
    cardNumDesc: string,
    CN: string,
    EN: string,
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
    isEffect: boolean, // undefined/null 未开始结算生效 true结算生效 false结算失效
}
export type WugufengdengCard = Card & { wugefengdengSelectedPlayerId: string }
export type CardAreaType = "hand" | 'equipment' | 'panding'
export type CardBoardActionType = "REMOVE" | "MOVE"