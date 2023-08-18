import { Skill } from "./skill"

export type HeroNameConfigValue = {
    CN: string,
    EN: string,
}
export type HeroNameConfig = { [key: string]: HeroNameConfigValue }

export type Hero = {
    heroId: string,

    shaLimitTimes: number,
    maxBlood: number,
    kingdom: string,
    gender: number,
    skills: Skill[],
}