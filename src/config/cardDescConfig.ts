const BASIC_CARDS_DESC_CONFIG = {
    "SHA": {
        "CN": `使用时机：出牌阶段限一次。\n使用目标：你攻击范围内的一名角色。\n作用效果：你对目标角色造成1点伤害。`,
        "EN": `Usage Timing: Once per turn during the Play Phase.\nTarget: One character within your attack range.\nEffect: Inflict 1 damage to the target character.`,
    },
    "SHAN": {
        "CN": `使用时机：以你为目标的【杀】生效前。\n使用目标：以你为目标的【杀】。\n作用效果：抵消此【杀】。`,
        "EN": `Usage Timing: Before a [Strike] card targeting you takes effect.\nTarget: A [Strike] card targeting you.\nEffect: Nullify the [Strike] card.`,
    },
    "TAO": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：包括你在内的一名已受伤的角色。\n" +
            "作用效果：目标角色回复1点体力。\n" +
            "\r" +
            "使用时机：当一名角色处于濒死状态时。\n" +
            "使用目标：一名处于濒死状态的角色。\n" +
            "作用效果：目标角色回复1点体力。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: One injured character, including yourself.\n" +
            "Effect: The target character restores 1 health point.\n" +
            "\r" +
            "Usage Timing: When a character is in a dying state.\n" +
            "Target: One character in a dying state.\n" +
            "Effect: The target character restores 1 health point.",
    },
}

const IMMEDIATE_SCROLL_CARDS_DESC_CONFIG = {
    // 锦囊
    "WAN_JIAN_QI_FA": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：所有其他角色。\n" +
            "作用效果：目标角色需打出【闪】，否则受到你造成的1点伤害。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: All other characters.\n" +
            "Effect: The target characters must play [Dodge], otherwise they receive 1 damage from you.",
    },
    "NAN_MAN_RU_QIN": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：所有其他角色。\n" +
            "作用效果：目标角色需打出【杀】，否则受到你造成的1点伤害。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: All other characters.\n" +
            "Effect: The target characters must play [Strike], otherwise they receive 1 damage from you.",
    },
    "TAO_YUAN_JIE_YI": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：所有角色。\n" +
            "作用效果：目标角色回复1点体力。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: All characters.\n" +
            "Effect: The target characters restore 1 health point.",
    },
    "WU_ZHONG_SHENG_YOU": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：包括你在内的一名角色。\n" +
            "作用效果：目标角色摸两张牌。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: One character, including yourself.\n" +
            "Effect: The target character draws two cards.",
    },
    "WU_GU_FENG_DENG": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：所有角色。\n" +
            "执行动作：当此牌指定目标后，你亮出牌堆顶的X张牌（X为目标数）。\n" +
            "作用效果：目标角色获得这些牌中（剩余）的一张牌。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: All characters.\n" +
            "Action: After designating the targets for this card, reveal the top X cards of the deck (X equals the number of targets).\n" +
            "Effect: The target characters each gain one card from the revealed cards (the remaining cards).",
    },
    "GUO_HE_CHAI_QIAO": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：一名区域里有牌的其他角色。\n" +
            "作用效果：你弃置目标角色的区域里的一张牌。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: Another character with cards in their area.\n" +
            "Effect: Discard one card from the target character's area.",
    },
    "SHUN_SHOU_QIAN_YANG": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：距离为1的一名区域里有牌的其他角色。\n" +
            "作用效果：你获得目标角色的区域里的一张牌。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: Another character within a distance of 1 and with cards in their area.\n" +
            "Effect: Obtain one card from the target character's area.",
    },
    "JIE_DAO_SHA_REN": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：一名装备区里有武器牌且攻击范围内有其使用【杀】的合法目标的其他角色An。你在选择An为目标的同时选择An攻击范围内的一个An使用【杀】的合法目标Bn。\n" +
            "作用效果：目标角色An需对Bn使用【杀】，否则将其装备区里的武器牌交给你。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: Another character (An) who has a weapon card equipped and has legal targets within their attack range to use [Strike]. While selecting (An) as a target, you also select a legal target (Bn) within An's attack range who can use [Strike].\n" +
            "Effect: Target player (An) must use [Strike] on player (Bn). If not, they must give you the weapon card in their equipment area."
    },
    "JUE_DOU": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：一名其他角色。\n" +
            "作用效果：由目标角色开始，其与你轮流打出【杀】，直到其中的一名角色未打出【杀】。然后未打出【杀】的角色受到另一名角色造成的1点伤害。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: Another character.\n" +
            "Effect: Starting from the target character, take turns with them to play [Strike] cards until one of the characters fails to play a [Strike]. Then, the character who did not play a [Strike] receives 1 damage from the other character.",
    },
    "WU_XIE_KE_JI": {
        "CN": "使用时机：一张锦囊牌对一个目标生效前。\n" +
            "使用目标：一张对一个目标生效前的锦囊牌。\n" +
            "作用效果：抵消此锦囊牌。",
        "EN": "Usage Timing: Before a Scroll card takes effect on a target.\n" +
            "Target: One Scroll card targeting a specific target before it takes effect.\n" +
            "Effect: Nullify this Scroll card.",
    },

    // junzheng
    "HUO_GONG": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：一名有手牌的角色。\n" +
            "作用效果：目标角色展示一张手牌，然后你可以弃置与之花色相同的一张手牌，若如此做，其受到你造成的1点火焰伤害。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: One character with a hand of cards.\n" +
            "Effect: The target character reveals one card from their hand, then you may discard one card of the same suit, if you do, deal 1 point of Fire damage to them.",
    },
    "TIE_SUO_LIAN_HUAN": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：一至两名角色。\n" +
            "作用效果：目标角色选择一项：1.横置；2. 重置。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: One to two characters.\n" +
            "Effect: The target character(s) choose one of the following options: 1. Lay the character card horizontally; 2. Reset the character card",
    },
}

const DELAY_SCROLL_CARDS_DESC_CONFIG = { // 延时锦囊
    "LE_BU_SI_SHU": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：一名其他角色。\n" +
            "作用效果：目标角色判定，若结果不为红桃，其跳过出牌阶段。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: Another character.\n" +
            "Effect: The target character judges. If the result is not Hearts, they skip the Play Phase.",
    },
    "BING_LIANG_CUN_DUAN": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：距离为1的一名其他角色。\n" +
            "作用效果：目标角色判定，若结果不为梅花，其跳过摸牌阶段。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: Another character within a distance of 1.\n" +
            "Effect: The target character judges. If the result is not Clubs, they skip the Draw Phase.",
    },
    "SHAN_DIAN": {
        "CN": "使用时机：出牌阶段。\n" +
            "使用目标：你。\n" +
            "作用效果：目标角色判定，若结果为黑桃2~9：\n" +
            "其受到3点无来源的雷电伤害，将此【闪电】置入弃牌堆。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: Yourself.\n" +
            "Effect: The target character judges. If the result is Spades 2 to 9, they receive 3 Thunder damage with no specific source, and place this [Lightning] into the discard pile.",
    }
}
const SCROLL_CARDS_DESC_CONFIG = {
    ...IMMEDIATE_SCROLL_CARDS_DESC_CONFIG,
    ...DELAY_SCROLL_CARDS_DESC_CONFIG,
}
const WEAPON_CARDS_DESC_CONFIG = {
    // 武器
    "ZHU_GE_LIAN_NU": {
        "CN": "攻击范围：1\n" +
            "技能：你使用【杀】无次数限制。",
        "EN": "Attack Range: 1\n" +
            "Skill: You can use [Strike] without restriction on the number of times.",
    },
    "CI_XIONG_SHUANG_GU_JIAN": {
        "CN": "攻击范围：2\n" +
            "技能：每当你使用【杀】指定与你性别不同的一个目标后，你可以令其选择一项：1.弃置一张手牌；2.令你摸一张牌。",
        "EN": "Attack Range: 2\n" +
            "Skill: Whenever you use [Strike] to designate a target of the opposite gender, you may have them choose one: 1. Discard one card from their hand; 2. Make you draw one card.",
    },
    "GU_DIN_DAO": {
        "CN": "攻击范围：2\n" +
            "技能：锁定技，每当你使用【杀】对目标角色造成伤害时，若其没有手牌，你令伤害值+1。",
        "EN": "Attack Range: 2\n" +
            "Skill: Locked Skill - Whenever you deal damage to the target character using [Strike], if they have no hand cards, you increase the damage value by 1.",
    },
    "QIN_GANG_JIAN": {
        "CN": "攻击范围：2\n" +
            "技能：锁定技，每当你使用【杀】指定一个目标后，你无视其防具。\n",
        "EN": "Attack Range: 2\n" +
            "Skill: Locked Skill - Whenever you use [Strike] to designate a target, you ignore their shield.",
    },
    "HAN_BIN_JIAN": {
        "CN": "攻击范围：2\n" +
            "技能：每当你使用【杀】对目标角色造成伤害时，若其有牌，你可以防止此伤害，依次弃置其两张牌。",
        "EN": "Attack Range: 2\n" +
            "Skill: Whenever you deal damage to the target character using [Strike], if they have cards, you may prevent this damage and discard two cards from them.",
    },
    "GUAN_SHI_FU": {
        "CN": "攻击范围：3\n" +
            "技能：每当你使用的【杀】被目标角色使用的【闪】抵消时，你可以弃置两张牌，令此【杀】依然对其生效。",
        "EN": "Attack Range: 3\n" +
            "Skill: Whenever the [Strike] you use is negated by the target character using [Dodge], you may discard two cards to make this [Strike] still take effect on them.",
    },
    "ZHANG_BA_SHE_MAO": {
        "CN": "攻击范围：3\n" +
            "技能：你可以将两张手牌当【杀】使用或打出。",
        "EN": "Attack Range: 3\n" +
            "Skill: You may use or play two hand cards as [Strike].",
    },
    "QING_LONG_YAN_YUE_DAO": {
        "CN": "攻击范围：3\n" +
            "技能：每当你使用的【杀】被目标角色使用的【闪】抵消时，你可以对其使用【杀】",
        "EN": "Attack Range: 3\n" +
            "Skill: Whenever the [Strike] you use is negated by the target character using [Dodge], you can use another [Strike] card against them.",
    },
    "FANG_TIAN_HUA_JI": {
        "CN": "攻击范围：4\n" +
            "技能：若你使用的【杀】是最后的手牌，你使用此【杀】的额外目标数上限+2。",
        "EN": "Attack Range: 4\n" +
            "Skill: If the [Strike] you use is the last hand card, the maximum number of additional targets for this [Strike] is increased by 2.",
    },
    "ZHU_QUE_YU_SHAN": {
        "CN": "攻击范围：4\n" +
            "技能：你可以将一张普通【杀】当火【杀】使用；你可以将视为使用【杀】改为视为使用火【杀】。",
        "EN": "Attack Range: 4\n" +
            "Skill: You may use or play one regular [Strike] as a [Fire Strike]",
    },
    "QI_LIN_GONG": {
        "CN": "攻击范围：5\n" +
            "技能：每当你使用【杀】对目标角色造成伤害时，你可以弃置其装备区里的一张坐骑牌。",
        "EN": "Attack Range: 5\n" +
            "Skill: Whenever you deal damage to the target character using [Strike], you may discard one Horse card from their equipment area.",
    },
}

const SHIELD_CARDS_DESC_CONFIG = {
    // 防具
    "BA_GUA_ZHEN": {
        "CN": "技能：每当你需要使用/打出【闪】时，你可以判定，若结果为红色，你视为使用/打出一张【闪】。",
        "EN": "Skill: Whenever you need to use/play [Dodge], you can judge. If the judgment result is red, you treat it as you used/played a [Dodge].",
    },
    "REN_WANG_DUN": {
        "CN": "技能：锁定技，黑色【杀】对你无效。",
        "EN": "Skill: Locked Skill - Black [Strike] has no effect on you.",
    },
    "TENG_JIA": {
        "CN": "技能：锁定技，【南蛮入侵】、【万箭齐发】和普通【杀】对你无效；\n" +
            "锁定技，每当你受到火焰伤害时，你令伤害值+1。",
        "EN": "Skill: Locked Skill - [Barbarian Invasion], [Arrow Barrage], and regular [Strike] have no effect on you.\n" +
            "Locked Skill - Whenever you take Fire damage, increase the damage value by 1.",
    },
    "BAI_YIN_SHI_ZI": {
        "CN": "技能：锁定技，每当你受到大于1点的伤害时，你将伤害值改为1点；\n" +
            "锁定技，每当你失去装备区里的【白银狮子】后，你回复1点体力。",
        "EN": "Skill: Locked Skill - Whenever you would take more than 1 damage, reduce the damage to 1.\n" +
            "Locked Skill - Whenever you lose the [Silver Lion] from your equipment area, you regain 1 health point.",
    },
}

const PLUS_HORSE_CARDS_DESC_CONFIG = {
    // 马
    "DI_LU": {
        "CN": "技能：其他角色与你的距离+1。",
        "EN": "Skill: The distance between other characters and you is increased by 1.",
    },
    "JUE_YING": {
        "CN": "技能：其他角色与你的距离+1。",
        "EN": "Skill: The distance between other characters and you is increased by 1.",
    },
    "ZHAO_HUANG_FEI_DIAN": {
        "CN": "技能：其他角色与你的距离+1。",
        "EN": "Skill: The distance between other characters and you is increased by 1.",
    },
}
const MINUS_HORSE_CARDS_DESC_CONFIG = {
    "CHI_TU": {
        "CN": "技能：你与其他角色的距离-1。",
        "EN": "Skill: Your distance to other characters is reduced by 1.",
    },
    "DA_WAN": {
        "CN": "技能：你与其他角色的距离-1。",
        "EN": "Skill: Your distance to other characters is reduced by 1.",
    },
    "ZI_XING": {
        "CN": "技能：你与其他角色的距离-1。",
        "EN": "Skill: Your distance to other characters is reduced by 1.",
    },
}

const EQUIPMENT_CARDS_DESC_CONFIG = {
    ...WEAPON_CARDS_DESC_CONFIG,
    ...SHIELD_CARDS_DESC_CONFIG,
    ...PLUS_HORSE_CARDS_DESC_CONFIG,
    ...MINUS_HORSE_CARDS_DESC_CONFIG,
}

const CARD_DESC_CONFIG: any = {
    ...BASIC_CARDS_DESC_CONFIG,
    ...SCROLL_CARDS_DESC_CONFIG,
    ...EQUIPMENT_CARDS_DESC_CONFIG,
}

export {
    CARD_DESC_CONFIG,
    BASIC_CARDS_DESC_CONFIG,
}