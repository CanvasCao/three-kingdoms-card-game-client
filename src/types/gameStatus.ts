export type GameStatus = {
    users: GameStatusUsers,
    stage: Stage,
    action: oneTargetAction | multiTargetsAction,
    shanResStages: ShanStage[],
    taoResStages: TaoStage[],
    tieSuoTempStorage: tieSuoTempStorageItem[],
    throwedCards: Card[],
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
    pandingCards: Card[],
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

export type Stage = {
    userId: string,
    stageName: string,
    stageNameCN: string,
}

export type oneTargetAction = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetId: string,
}

export type multiTargetsAction = {
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

export type tieSuoTempStorageItem = {
    damage: number,
    targetId: string,
    originId?: string,
    cards?: Card[],
    actualCard?: Card,
}