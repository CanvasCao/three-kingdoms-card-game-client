import {Card} from "./card"

export type UseStrikeEvent = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetId: string,
    cantShan: boolean,
    dodgeStatus: boolean,
    eventTimingsWithSkills: EventTimingsWithSkill[],

    // UseStrikeEvents的所有事件done UseStrikeEvents才能被删除 所以需要一个标记记录单个UseStrikeEvent的情况
    done: boolean
}

export type PandingEvent = {
    pandingNameKey: string,
    pandingResultCard: Card,
    takeEffect: boolean | undefined,
    originId: string,
    eventTimingsWithSkills: EventTimingsWithSkill[],
    done: boolean
}

export type DamageEvent = {
    damageCards: Card[], // 渠道
    damageActualCard: Card, // 渠道
    damageSkill: string, // 渠道
    damageAttribute: string,// 属性
    originId: string,
    targetId: string,
    damageNumber: number,
    eventTimingsWithSkills: EventTimingsWithSkill[],
    done: boolean
}

export type ResponseCardEvent = {
    originId: string,
    targetId: string,
    cardNumber: number,
    useOrPlay: string,
    playStatus: boolean | undefined,
    eventTimingsWithSkills: EventTimingsWithSkill[],
    done: boolean,
}

export type EventTimingsWithSkill = {
    eventTimingName: string,
    eventTimingSkills: EventTimingSkill[],
}

export type EventTimingSkill = {
    skillNameKey: string,
    playerId: string,
    chooseToReleaseSkill: boolean | undefined,
    releaseTargetIds: string[],
    releaseCards: Card[],
    done: boolean,
}
