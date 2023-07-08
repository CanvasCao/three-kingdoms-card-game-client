import {Card, WugufengdengCard} from "./card";
import {DamageEvent, EventTimingSkill, PandingEvent, UseStrikeEvent} from "./event";
import {GameStatusPlayers} from "./player";

export type GameStatus = {
    roomId: string,
    players: GameStatusPlayers,
    stage: Stage,

    // Action
    action: OneTargetAction | MultiTargetsAction,

    // Response
    shanResponse: ShanResponse | undefined, // shanResponse不为undefined就需要出闪
    skillResponse: SkillResponse | undefined,
    taoResponses: TaoResponse[],
    scrollResponses: ScrollResponse[],
    wuxieSimultaneousResponse: WuxieSimultaneousResponse,
    weaponResponses: WeaponResponse[],

    wugufengdengCards: WugufengdengCard[]

    // events
    useStrikeEvents: UseStrikeEvent[],
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

    selectedIndexes: (number|string)[],
}

export type MultiTargetsAction = {
    cards:Card[],
    actualCard: Card,
    originId: string,
    targetIds: string[],

    selectedIndexes: (number|string)[],
}

// response
export type ShanResponse = {
    originId: string,
    targetId: string,
    cardNumber: number,
}

export type SkillResponse = EventTimingSkill

export type TaoResponse = ShanResponse

export type ScrollResponse = {
    originId: string,
    targetId: string,
    cardTakeEffectOnPlayerId: string,
    cards: Card[],
    actualCard: Card,
    isEffect: boolean,

    // 顺拆 前端刷新Board的依据
    boardObserveId?: string,
}

export type WuxieSimultaneousResponse = {
    hasWuxiePlayerIds: string[],
    wuxieChain: WuxieChain,
}

export type WeaponResponse = {
    originId: string,
    targetId: string,
    weaponCardName: string,
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