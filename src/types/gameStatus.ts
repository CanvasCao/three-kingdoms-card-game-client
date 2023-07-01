import {Card, SelectedCards, WugufengdengCard} from "./card";
import {EventTimingSkill, PandingEvent, UseStrikeEvent} from "./event";
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
    weaponResponses: weaponResponse[],

    wugufengdengCards: WugufengdengCard[]

    // events
    useStrikeEvents: UseStrikeEvent[],
    pandingEvent: PandingEvent,

    tieSuoTempStorage: TieSuoTempStorageItem[],

    // only for debug
    throwedCards?: Card[],
};

export type Stage = {
    playerId: string,
    stageIndex: number,
}

export type OneTargetAction = {
    cards: SelectedCards,
    actualCard: Card,
    originId: string,
    targetId?: string,

    selectedIndexes: number[],

}

export type MultiTargetsAction = {
    cards: SelectedCards,
    actualCard: Card,
    originId: string,
    targetIds: string[],

    selectedIndexes: number[],
}

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
    stageId?: string,
}

export type WuxieSimultaneousResponse = {
    hasWuxiePlayerIds: string[],
    wuxieChain: WuxieChain,
}

export type weaponResponse = {
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
    originId?: string,
    cards?: Card[],
    actualCard?: Card,
}