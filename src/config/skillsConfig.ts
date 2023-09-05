import {SkillDescConfig, SkillNameConfig} from "../types/skill"

const SKILL_NAMES_CONFIG: SkillNameConfig = {
    WEI001_JIAN_XIONG: {
        key: 'WEI001_JIAN_XIONG',
        CN: '奸雄',
        EN: 'Villainous Hero'
    },
    WEI001_HU_JIA: {
        key: 'WEI001_HU_JIA',
        CN: '护驾',
        EN: 'Villainous Hero'
    },
    WEI002_FAN_KUI: {
        key: 'WEI002_FAN_KUI',
        CN: '反馈',
        EN: 'Retaliation'
    },
    WEI002_GUI_CAI: {
        key: 'WEI002_GUI_CAI',
        CN: '鬼才',
        EN: 'Demonic Talent'
    },
    WEI004_TU_XI: {
        key: 'WEI004_TU_XI',
        CN: '突袭',
        EN: 'Sudden Strike'
    },
    WEI005_LUO_YI: {
        key: 'WEI005_LUO_YI',
        CN: '裸衣',
        EN: 'Bare-Chested'
    },

    SHU003_PAO_XIAO: {
        key: 'SHU003_PAO_XIAO',
        CN: '咆哮',
        EN: 'Berserk'
    },
    SHU006_MA_SHU: {
        key: 'SHU006_MA_SHU',
        CN: '马术',
        EN: 'Horsemanship'
    },
    SHU006_TIE_JI: {
        key: 'SHU006_TIE_JI',
        CN: '铁骑',
        EN: 'Iron Cavalry'
    },
    WU006_GUO_SE: {
        key: 'WU006_GUO_SE',
        CN: '国色',
        EN: 'National Beauty'
    },
    WU006_LIU_LI: {
        key: 'WU006_LIU_LI',
        CN: '流离',
        EN: 'Displacement'
    },

    QUN002_WU_SHUANG: {
        key: 'QUN002_WU_SHUANG',
        CN: '无双',
        EN: 'Without Equal'
    },

    SP001_CHONG_SHENG:{
        key: 'SP001_CHONG_SHENG',
        CN: '重生',
        EN: 'Rebirth'
    }
}

const SKILL_DESC_CONFIG: SkillDescConfig = {
    WEI001_JIAN_XIONG: {
        CN: '当你受到伤害后，你可以获得造成伤害的牌。',
        EN: 'After you take damage, you can obtain the cards that caused the damage.'
    },
    WEI001_HU_JIA: {
        CN: '主公技，你可以令其他魏势力角色选择是否替你使用或打出【闪】。',
        EN: 'Villainous Hero'
    },
    WEI002_FAN_KUI: {
        CN: '当你受到伤害后，你可以获得伤害来源的一张牌。',
        EN: 'When you take damage, you can gain a card from the source of the damage.'
    },
    WEI002_GUI_CAI: {
        CN: '当一名角色的判定牌生效前，你可以打出一张手牌代替之。',
        EN: "Before a character's judgment card takes effect, you can play a hand card to replace it."
    },
    WEI004_TU_XI: {
        CN: '摸牌阶段，你可以放弃摸牌，改为获得最多两名其他角色的各一张手牌。',
        EN: "During the draw phase, you can choose to forgo drawing cards and instead obtain one hand card from up to two other characters."
    },
    WEI005_LUO_YI: {
        CN: '摸牌阶段，你可以少摸一张牌，然后本回合你为伤害来源的【杀】或【决斗】造成的伤害+1。',
        EN: "During the draw phase, you may draw one less card. If you to do so, any [Strike] and [Duel] that you use in the play phase results in 1 additional damage to your opponent. "
    },

    SHU003_PAO_XIAO: {
        CN: '锁定技，你使用【杀】无次数限制。',
        EN: 'Locked skill: You can use [Strike] without any usage limit.'
    },
    SHU006_MA_SHU: {
        CN: '锁定技，你计算与其他角色的距离-1。',
        EN: 'Locked skill: You calculate your distance to other characters as -1.'
    },
    SHU006_TIE_JI: {
        CN: '你的【杀】指定目标后，你可以进行判定，若结果为红色，该角色不能使用【闪】',
        EN: 'After you designate the target for your [Strike] you can judge. If the judgment result is red, the target cannot use [Dodge].'
    },

    WU006_GUO_SE: {
        CN: '你可以将一张♦牌当【乐不思蜀】使用。',
        EN: 'You can use a Diamonds card as a [Contentment].'
    },
    WU006_LIU_LI: {
        CN: '当你成为【杀】的目标时，你可以弃置一张牌并将此【杀】转移给你攻击范围内的一名其他角色（不能是使用此【杀】的角色）。',
        EN: 'When you become the target of a [Strike], you may discard a card and transfer this [Strike] to another character within your attack range (excluding the player who used this [Strike]).'
    },

    QUN002_WU_SHUANG: {
        CN: '锁定技，你的【杀】需要两张【闪】才能抵消；与你【决斗】的角色每次需要打出两张【杀】。',
        EN: 'Locked skill: Your [Strike] require two [Dodge] to negate. The character dueling with you needs to play two [Strike] each time.'
    },

    SP001_CHONG_SHENG: {
        CN: '锁定技，当你第一次死亡后，你弃置你的区域里的所有牌，然后摸三张牌，将体力回复至3点。',
        EN: 'Locked skill: After your first death, discard all cards in your area, draw 3 cards and restore your health to 3 points.'
    },
}

export {
    SKILL_NAMES_CONFIG,
    SKILL_DESC_CONFIG
}