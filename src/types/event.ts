export type UseStrikeEvent = {
    originId: string,
    targetId: string,
    cantShan: boolean,
    eventTimingWithSkills: EventTimingWithSkill[],

    // UseStrikeEvents的所有事件done UseStrikeEvents才能被删除 所以需要一个标记记录单个UseStrikeEvent的情况
    done: boolean
}

export type PandingEvent = {
    originId: string,
    eventTimingWithSkills: EventTimingWithSkill[],
    done: boolean
}

export type EventTimingWithSkill = {
    eventTimingName: string,
    eventTimingSkills: EventTimingSkill[],
}

export type EventTimingSkill = {
    skillName: string,
    playerId: string,
    chooseToRelease: boolean | undefined,
}
