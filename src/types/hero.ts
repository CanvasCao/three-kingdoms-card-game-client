import {Skill} from "./skill"

export type Hero = {
    heroId: string,

    shaLimitTimes: number, // 张飞
    shunRange: number, // 黄月英
    bingLiangRange: number, // 黄月英
    minusHorseDistance: number, // 马超
    cantBeTargetKeys: string[], // 陆逊
    useSkillTimes: {
        [key: string]: number    // 孙权
    }

    maxBlood: number,
    kingdom: string,
    gender: number,
    skills: Skill[],
}