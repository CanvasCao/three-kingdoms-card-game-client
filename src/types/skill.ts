export type Skill = {
    key: string
}

export type SkillNameConfigValue = {
    key: string,
    CN: string,
    EN: string,
}
export type SkillNameConfig = { [key: string]: { [key: string]: SkillNameConfigValue } }