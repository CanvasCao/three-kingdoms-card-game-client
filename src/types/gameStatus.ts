export type GameStatus = {
    users: GameStatusUsers,
    stage: Stage,
    action: OneTargetAction | MultiTargetsAction,
    shanResStages: ShanStage[],
    taoResStages: TaoStage[],
    scrollResStages: ScrollResStage[],
    wuxieSimultaneousResStage: WuxieSimultaneousResStage,
    tieSuoTempStorage: TieSuoTempStorageItem[],
    throwedCards?: Card[],
};


export type GameStatusUsers = { [key: string]: User }
export type Users = User[]
export type User = {
    maxBlood: number,
    currentBlood: number,
    cardId: string,
    userId: string,
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

    // tags
    judgedShandian: boolean,

    // delay scroll
    skipDraw: boolean,
    skipPlay: boolean,

    // skills
    skills: any[],

    isDead: boolean,
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
}

export type PandingSign = {
    card: Card,
    actualCard: Card,
    isEffect: boolean, // undefined/null 未开始结算生效 true结算生效 false结算失效
}

export type Stage = {
    userId: string,
    stageName: string,
    stageNameCN: string,
}

export type OneTargetAction = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetId: string,
}

export type MultiTargetsAction = {
    cards: Card[],
    actualCard: Card,
    actions: {
        originId: string,
        targetId: string,
    }[],
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