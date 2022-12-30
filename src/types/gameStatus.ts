export type GameStatus = {
    players: GameStatusPlayers,
    stage: Stage,
    action: OneTargetAction | MultiTargetsAction,
    shanResStages: ShanStage[],
    taoResStages: TaoStage[],
    scrollResStages: ScrollResStage[],
    wuxieSimultaneousResStage: WuxieSimultaneousResStage,
    tieSuoTempStorage: TieSuoTempStorageItem[],
    throwedCards?: Card[],
};


export type GameStatusPlayers = { [key: string]: Player }
export type Players = Player[]
export type Player = {
    maxBlood: number,
    currentBlood: number,
    cardId: string,
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
    equipmentType?: string,
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

export type Stage = {
    playerId: string,
    stageName: string,
    stageNameCN: string,
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

export type WuxieChain = {
    cards: Card[],
    actualCard: Card,
    originId: string, // 延迟锦囊的WuxieChain[0]来源是自己
    targetId: string,
}[];

export type TieSuoTempStorageItem = {
    damage: number,
    targetId: string,
    originId?: string,
    cards?: Card[],
    actualCard?: Card,
}