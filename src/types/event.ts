import {Card} from "./card"

export type UseStrikeEvent = {
    originId: string,
    targetId: string,
    cantShan: boolean,
    eventTimingsWithSkills: EventTimingsWithSkill[],

    // UseStrikeEvents的所有事件done UseStrikeEvents才能被删除 所以需要一个标记记录单个UseStrikeEvent的情况
    done: boolean
}

export type PandingEvent = {
    originId: string,
    eventTimingsWithSkills: EventTimingsWithSkill[],
    done: boolean
}

export type EventTimingsWithSkill = {
    eventTimingName: string,
    eventTimingSkills: EventTimingSkill[],
}

export type EventTimingSkill = {
    skillName: string,
    playerId: string,
    chooseToRelease: boolean | undefined,
    releaseTargets: string[],
    releaseCards: Card[],
    done: boolean,
}
