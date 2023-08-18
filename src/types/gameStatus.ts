import {Card, WugufengdengCard} from "./card";
import {DamageEvent, EventTimingSkill, PandingEvent, ResponseCardEvent, UseStrikeEvent} from "./event";
import {GameStatusPlayers} from "./player";

export type GameStatus = {
    roomId: string,
    players: GameStatusPlayers,
    stage: Stage,

    // Action
    action: OneTargetAction | MultiTargetsAction,

    // Response
    cardResponse: CardResponse | undefined,
    skillResponse: SkillResponse | undefined,
    taoResponses: TaoResponse[],
    cardBoardResponses: CardBoardResponse[],
    scrollResponses: ScrollResponse[],
    wuxieSimultaneousResponse: WuxieSimultaneousResponse,

    wugufengdengCards: WugufengdengCard[]

    // events
    useStrikeEvents: UseStrikeEvent[],
    responseCardEvents: ResponseCardEvent[],
    pandingEvent: PandingEvent,
    damageEvent: DamageEvent,

    tieSuoTempStorage: TieSuoTempStorageItem[],

    // only for debug
    throwedCards?: Card[],
};

export type Stage = {
    playerId: string,
    stageIndex: number,
}

// action
export type OneTargetAction = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetId?: string,
}

export type MultiTargetsAction = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetIds: string[],
}

// response
export type CardResponse = {
    originId: string,
    targetId: string,
    cardNumber: number,
    actionCards: Card[],
    actionActualCard: Card,
    responseCardKeys: string[],
}
export type TaoResponse = CardResponse

export type CardBoardResponse = {
    originId: string,
    targetId: string,
    cardBoardContentKey: string,
}

export type SkillResponse = EventTimingSkill

export type ScrollResponse = {
    originId: string,
    targetId: string,
    cardTakeEffectOnPlayerId: string,
    cards: Card[],
    actualCard: Card,
    isEffect: boolean,
}

export type WuxieSimultaneousResponse = {
    hasWuxiePlayerIds: string[],
    wuxieChain: WuxieChain,
}

export type WuxieChain = {
    cards: Card[],
    actualCard: Card,
    cardFromPlayerId: string, // 操作提示里 当有人出无懈可击后 显示是否无懈某人
}[];

export type TieSuoTempStorageItem = {
    damage: number,
    targetId: string,
    originId?: string, // 闪电没有来源
    cards?: Card[],
    actualCard?: Card,
}