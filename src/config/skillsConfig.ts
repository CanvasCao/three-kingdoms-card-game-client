import {SkillDescConfig, SkillNameConfig} from "../types/skill"

const SKILL_NAMES_CONFIG: SkillNameConfig = {
    "WEI001": {
        JIAN_XIONG: {
            key: 'JIAN_XIONG',
            CN: '奸雄',
            EN: 'Villainous Hero'
        },
        HU_JIA: {
            key: 'HU_JIA',
            CN: '护驾',
            EN: 'Villainous Hero'
        }
    },
    "WEI002": {
        FAN_KUI: {
            key: 'FAN_KUI',
            CN: '反馈',
            EN: 'Retaliation'
        },
        GUI_CAI: {
            key: 'GUI_CAI',
            CN: '鬼才',
            EN: 'Demonic Talent'
        }
    },
    "SHU003": {
        PAO_XIAO: {
            key: 'PAO_XIAO',
            CN: '咆哮',
            EN: 'Berserk'
        },
    },
    "SHU006": {
        MA_SHU: {
            key: 'MA_SHU',
            CN: '马术',
            EN: 'Horsemanship'
        },
        TIE_JI: {
            key: 'TIE_JI',
            CN: '铁骑',
            EN: 'Iron Cavalry'
        },
    },

    "WU006": {
        GUO_SE: {
            key: 'GUO_SE',
            CN: '国色',
            EN: 'National Beauty'
        },
        LIU_LI: {
            key: 'LIU_LI',
            CN: '流离',
            EN: 'Displacement'
        },
    },
}

const SKILL_DESC_CONFIG :SkillDescConfig= {
    "WEI001": {
        JIAN_XIONG: {
            CN: '当你受到伤害后，你可以获得造成伤害的牌。',
            EN: 'After you take damage, you can obtain the card that caused the damage.'
        },
        HU_JIA: {
            CN: '主公技，你可以令其他魏势力角色选择是否替你使用或打出【闪】。',
            EN: 'Villainous Hero'
        }
    },
    "WEI002": {
        FAN_KUI: {
            CN: '当你受到伤害后，你可以获得伤害来源的一张牌。',
            EN: 'When you take damage, you can gain a card from the source of the damage.'
        },
        GUI_CAI: {
            CN: '当一名角色的判定牌生效前，你可以打出一张手牌代替之。',
            EN: "Before a character's judgment card takes effect, you can play a hand card to replace it."
        }
    },

    "SHU003": {
        PAO_XIAO: {
            CN: '锁定技，你使用【杀】无次数限制。',
            EN: 'Locked skill: You can use [Strike] without any usage limit.'
        },
    },
    "SHU006": {
        MA_SHU: {
            CN: '锁定技，你计算与其他角色的距离-1。',
            EN: 'Locked skill: You calculate your distance to other characters as -1.'
        },
        TIE_JI: {
            CN: '你的【杀】指定目标后，你可以进行判定，若结果为红色，该角色不能使用【闪】',
            EN: 'After you designate the target for your [Strike] you can judge. If the judgment result is red, the target cannot use [Dodge].'
        },
    },

    "WU006": {
        GUO_SE: {
            CN: '你可以将一张♦牌当【乐不思蜀】使用。',
            EN: 'You can use a Diamonds card as a [Contentment].'
        },
        LIU_LI: {
            CN: '当你成为【杀】的目标时，你可以弃置一张牌并将此【杀】转移给你攻击范围内的一名其他角色（不能是使用此【杀】的角色）。',
            EN: 'When you become the target of a [Strike], you may discard a card and transfer this [Strike] to another character within your attack range (excluding the player who used this [Strike]).'
        },
    },
}

export {
    SKILL_NAMES_CONFIG,
    SKILL_DESC_CONFIG
}