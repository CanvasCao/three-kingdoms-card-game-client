import {Card, WugufengdengCard} from "./card";
import {DamageEvent, EventTimingSkill, GameStageEvent, PandingEvent, ResponseCardEvent, UseStrikeEvent} from "./event";
import {Log} from "./log";
import {GameStatusPlayers} from "./player";

export type GameStatus = {
    roomId: string,
    players: GameStatusPlayers,
    stage: Stage,

    // Action
    action: Action,

    // Response
    cardResponse: CardResponse | undefined,
    skillResponse: SkillResponse | undefined,
    taoResponses: TaoResponse[],
    wuxieSimultaneousResponse: WuxieSimultaneousResponse,

    cardBoardResponses: CardBoardResponse[],
    fanJianBoardResponse: FanJianBoardResponse | undefined,
    guanXingBoardResponse: GuanXingBoardResponse | undefined,

    // wugufengdengCards
    wugufengdengCards: WugufengdengCard[]

    // events
    gameStageEvent: GameStageEvent,
    useStrikeEvents: UseStrikeEvent[],
    responseCardEvents: ResponseCardEvent[],
    damageEvents: DamageEvent[],
    pandingEvent: PandingEvent,

    // storage
    scrollStorages: ScrollStorage[],
    tieSuoTempStorage: TieSuoTempStorageItem[],

    // gameEnd
    gameEnd: {
        winnerTeamName: string,
    },

    // only for debug
    log: Log,
    throwedCards?: Card[],
};

export type Stage = {
    currentLocation: number,
    stageName: string,
}

// action
export type Action = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    skillKey: string,
    targetIds?: string[],
}

// response
export type CardResponse = {
    originId: string,
    targetId: string,
    cardNumber: number,
    actionCards: Card[],
    actionActualCard: Card,
}

export type TaoResponse = {
    originId: string,
    targetId: string,
    cardNumber: number,
}

export type SkillResponse = EventTimingSkill

export type ScrollStorage = {
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

export type CardBoardResponse = {
    originId: string,
    targetId: string,
    cardBoardContentKey: string,
}

export type FanJianBoardResponse = {
    originId: string,
}

export type GuanXingBoardResponse = {
    originId: string,
    guanXingCards: Card[]
}

export type TieSuoTempStorageItem = {
    damage: number,
    targetId: string,
    originId?: string, // 闪电没有来源
    cards?: Card[],
    actualCard?: Card,
}