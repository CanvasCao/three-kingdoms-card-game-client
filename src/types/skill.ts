export type Skill = {
    key: string
}

export type SkillNameConfigValue = {
    key: string,
    CN: string,
    EN: string,
}
export type SkillNameConfig = { [key: string]: { [key: string]: SkillNameConfigValue } }

export type SkillDescConfigValue = {
    CN: string,
    EN: string,
}
export type SkillDescConfig = { [key: string]: { [key: string]: SkillDescConfigValue } }