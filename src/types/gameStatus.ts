import {EQUIPMENT_TYPE} from "../config/cardConfig";

export type GameStatus = {
    roomId: string,
    players: GameStatusPlayers,
    stage: Stage,
    action: OneTargetAction | MultiTargetsAction,
    shanResStages: ShanStage[],
    taoResStages: TaoStage[],
    scrollResStages: ScrollResStage[],
    wuxieSimultaneousResStage: WuxieSimultaneousResStage,
    weaponResStages: weaponResStage[],
    wugufengdengCards: WugufengdengCard[]
    tieSuoTempStorage: TieSuoTempStorageItem[],
    throwedCards?: Card[],
};

export type GameStatusPlayers = { [key: string]: Player }
export type Players = Player[]
export type Player = {
    maxBlood: number,
    currentBlood: number,
    imageName: string,
    shaLimitTimes: number,
    playerId: string,
    name: string,
    location: number,

    // cards
    cards: Card[],
    pandingSigns: PandingSign[],
    weaponCard: Card,
    shieldCard: Card,
    plusHorseCard: Card,
    minusHorseCard: Card,


    // ui tags
    isTieSuo: boolean,

    // resetWhenMyTurnEnds
    judgedShandian: boolean,
    skipDraw: boolean,
    skipPlay: boolean,
    shaTimes: number,

    // skills
    skills: any[],

    // Dead
    isDead: boolean,

    // FE
    linePosition: { x: number, y: number },
    playerPosition: { x: number, y: number },
}

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

export type WugufengdengCard = Card & { wugefengdengSelectedPlayerId: string }

export type PandingSign = {
    card: Card,
    actualCard: Card,
    isEffect: boolean, // undefined/null 未开始结算生效 true结算生效 false结算失效
}

export type Stage = {
    playerId: string,
    stageIndex: number,
}

export type OneTargetAction = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetId?: string,

    selectedIndexes: number[],

}

export type MultiTargetsAction = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetId?: string,
    targetIds: string[],

    selectedIndexes: number[],
}

export type ShanStage = {
    originId: string,
    targetId: string,
    cardNumber: number,
}

export type TaoStage = ShanStage

export type ScrollResStage = {
    originId: string,
    targetId: string,
    cardTakeEffectOnPlayerId: string,
    cards: Card[],
    actualCard: Card,
    isEffect: boolean,

    // 顺拆 前端刷新Board的依据
    stageId?: string,
}

export type WuxieSimultaneousResStage = {
    hasWuxiePlayerIds: string[],
    wuxieChain: WuxieChain,
}

export type weaponResStage = {
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