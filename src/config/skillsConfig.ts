const SKILL_NAMES_CONFIG: any = {
    WEI001_JIAN_XIONG: {
        key: 'WEI001_JIAN_XIONG',
        CN: '奸雄',
        EN: 'Treachery'
    },
    WEI001_HU_JIA: {
        key: 'WEI001_HU_JIA',
        CN: '护驾',
        EN: 'Escort'
    },
    WEI002_FAN_KUI: {
        key: 'WEI002_FAN_KUI',
        CN: '反馈',
        EN: 'Feedback'
    },
    WEI002_GUI_CAI: {
        key: 'WEI002_GUI_CAI',
        CN: '鬼才',
        EN: 'Sorcery'
    },
    WEI003_GANG_LIE: {
        key: 'WEI003_GANG_LIE',
        CN: '刚烈',
        EN: 'Unyielding'
    },
    WEI004_TU_XI: {
        key: 'WEI004_TU_XI',
        CN: '突袭',
        EN: 'Assault'
    },
    WEI005_LUO_YI: {
        key: 'WEI005_LUO_YI',
        CN: '裸衣',
        EN: 'Armorless'
    },

    SHU003_PAO_XIAO: {
        key: 'SHU003_PAO_XIAO',
        CN: '咆哮',
        EN: 'Battlecry'
    },
    SHU006_MA_SHU: {
        key: 'SHU006_MA_SHU',
        CN: '马术',
        EN: 'Horsemanship'
    },
    SHU006_TIE_JI: {
        key: 'SHU006_TIE_JI',
        CN: '铁骑',
        EN: 'Cavalry'
    },
    SHU007_JI_ZHI: {
        key: 'SHU007_JI_ZHI',
        CN: '急智',
        EN: 'Intuition'
    },
    SHU007_QI_CAI: {
        key: 'SHU007_QI_CAI',
        CN: '奇才',
        EN: 'Wizardry'
    },

    WU006_GUO_SE: {
        key: 'WU006_GUO_SE',
        CN: '国色',
        EN: 'Beauty'
    },
    WU006_LIU_LI: {
        key: 'WU006_LIU_LI',
        CN: '流离',
        EN: 'Outcast'
    },

    QUN002_WU_SHUANG: {
        key: 'QUN002_WU_SHUANG',
        CN: '无双',
        EN: 'Unrivaled'
    },

    SP001_CHONG_SHENG: {
        key: 'SP001_CHONG_SHENG',
        CN: '重生',
        EN: 'Rebirth'
    }
}

const SKILL_DESC_CONFIG: any = {
    WEI001_JIAN_XIONG: {
        CN: '当你受到伤害后，你可以获得造成伤害的牌。',
        EN: '"After damage taken", you may acquire the card(s) that inflicted damage on you.'
    },
    WEI001_HU_JIA: {
        CN: '主公技，你可以令其他魏势力角色选择是否替你使用或打出【闪】。',
        EN: 'Monarch Ability: Heores from "WEI" can play a "Dodge" for you when you needed.\n'
    },
    WEI002_FAN_KUI: {
        CN: '当你受到伤害后，你可以获得伤害来源的一张牌。',
        EN: '"After damage taken", you may acquire a card belonging to your damage source.'
    },
    WEI002_GUI_CAI: {
        CN: '当一名角色的判定牌生效前，你可以打出一张手牌代替之。',
        EN: "You may replace any Hero's judgment draw with a card from your hand before calculating the judgment result."
    },
    WEI003_GANG_LIE: {
        CN: '当你受到伤害后，你可以进行判定，若结果不为♥，则伤害来源选择一项：\n' +
            '1. 弃置两张手牌；\n' +
            '2. 受到你造成的1点伤害。',
        EN: "\"After damage taken\", you may reveal a judgment draw. If the result is not a ♥, then the damage source must discard two hand cards or take 1 point of damage from you."
    },
    WEI004_TU_XI: {
        CN: '摸牌阶段，你可以放弃摸牌，改为获得最多两名其他角色的各一张手牌。',
        EN: "During the draw phase, instead of drawing from the deck, you may draw up to two hand cards, each must be from a different Hero with card(s)."
    },
    WEI005_LUO_YI: {
        CN: '摸牌阶段，你可以少摸一张牌，然后本回合你为伤害来源的【杀】或【决斗】造成的伤害+1。',
        EN: "During draw phase, you may draw one card instead of two. If you do so, all of your [Strike] and [Duel] inflict +1 damage for that phase (only when you are the damage source of a Duel)."
    },

    SHU003_PAO_XIAO: {
        CN: '锁定技，你使用【杀】无次数限制。',
        EN: 'During your play phase, you may use any amount of [Strike] cards.'
    },
    SHU006_MA_SHU: {
        CN: '锁定技，你计算与其他角色的距离-1。',
        EN: 'Passive Ability: When calculating your distance to other Heroes, subtract 1.'
    },
    SHU006_TIE_JI: {
        CN: '你的【杀】指定目标后，你可以进行判定，若结果为红色，该角色不能使用【闪】',
        EN: 'When you target a Hero with [Strike], you may reveal a judgment. If the result is a red color suit, then your [Strike] cannot be Dodged.'
    },
    SHU007_JI_ZHI: {
        CN: '当你使用一张非转化的普通锦囊牌时，你可以摸一张牌。',
        EN: 'Anytime you use a "Scroll" card you immediately draw a card from the deck before calculating the effect of the "Scroll" card.'
    },
    SHU007_QI_CAI: {
        CN: '锁定技，你使用锦囊牌无距离限制。',
        EN: 'Your "Scroll" cards have infinite range.'
    },

    WU006_GUO_SE: {
        CN: '你可以将一张♦牌当【乐不思蜀】使用。',
        EN: 'During your play phase, you may use any of your ♦ cards as "Contentment".'
    },
    WU006_LIU_LI: {
        CN: '当你成为【杀】的目标时，你可以弃置一张牌并将此【杀】转移给你攻击范围内的一名其他角色（不能是使用此【杀】的角色）。',
        EN: 'You may discard one of your cards to transfer a [Strike] targeting you to another Hero within your weapon range, except for the attacker.'
    },

    QUN002_WU_SHUANG: {
        CN: '锁定技，你的【杀】需要两张【闪】才能抵消；与你【决斗】的角色每次需要打出两张【杀】。',
        EN: 'Passive Ability: When you use [Strike], your target must use two [Dodge] to dodge your [Strike], when you use [Duel] your target must play two [Strike] to counter one of your [Strike].'
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