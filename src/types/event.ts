export type UseStrikeEvents = UseStrikeEvent[]

export type UseStrikeEvent = {
    originId: string,
    targetId: string,
    timings: EventTiming[],
    done: boolean
}

export type PandingEvent = {
    originId: string,
    timings: EventTiming[],
    done: boolean
}

export type EventTiming = {
    name: string,
    skills: EventSkills,
}

export type EventSkill = {
    skillName: string,
    playerId: string,
    chooseToRelease: boolean,
}

export type EventSkills = EventSkill[]



