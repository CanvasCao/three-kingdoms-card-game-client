export type UseStrikeEvents = UseStrikeEvent[]

export type UseStrikeEvent = {
    "originId": string,
    "targetId": string,
    "timings": UseStrikeEventTiming[],
    "done": false
}

export type UseStrikeEventTiming = {
    "name": string,
    "skills": EventSkills,
    "done": true
}

export type EventSkill = {
    playerId: string,
    chooseToRelease: boolean,
}

export type EventSkills = EventSkill[]



