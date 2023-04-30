export type ResponseInfo = BasicCardResponseInfo | WuXieResponseInfo | SkillResponseInfo|undefined

export type BasicCardResponseInfo = {
    targetId: string,
    cardNames: string[]
}

export type WuXieResponseInfo = {
    wuxieTargetCardId: string,
    cardNames: string[]
}

export type SkillResponseInfo = {
    cardNames: string[]
}