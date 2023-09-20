const BASIC_CARDS_DESC_CONFIG = {
    "SHA": {
        "CN": `出牌阶段限一次，对你攻击范围内的一名角色使用。你对目标角色造成1点伤害。`,
        "EN": `Play Phase\nTarget: Another Hero within your Attack Range\nEffect: Target takes damage of 1.`,
    },
    "SHAN": {
        "CN": `每当以你为目标的【杀】生效前，对此【杀】使用。抵消此【杀】。`,
        "EN": `Respond to a "Strike" that is targeting you\nTarget: Hero targeting you with a "Strike"\nEffect: Negate the effect of "Strike" targeting you.`,
    },
    "TAO": {
        "CN": "①出牌阶段，对已受伤的你使用。目标角色回复1点体力。\n" +
            "②每当一名角色处于濒死状态时，对处于濒死状态的该角色使用。目标角色回复1点体力。\n",
        "EN": "Play Phase or when a hero is Near Death\n" +
            "Target: On yourself during play phase, or on a hero that is Near Death\n" +
            "Effect: Hero Regains one Life.",
    },
}

const IMMEDIATE_SCROLL_CARDS_DESC_CONFIG = {
    // 锦囊
    "WAN_JIAN_QI_FA": {
        "CN": "出牌阶段，对所有其他角色使用。目标角色需打出【闪】，否则受到你造成的1点伤害。",
        "EN": "Play Phase\n" +
            "Target: All other Heroes\n" +
            "Effect: All other Heroes in turn order must play [Dodge] or take 1 damage.",
    },
    "NAN_MAN_RU_QIN": {
        "CN": "出牌阶段，对所有其他角色使用。目标角色需打出【杀】，否则受到你造成的1点伤害。",
        "EN": "Usage Timing: Play Phase.\n" +
            "Target: All other characters.\n" +
            "Effect: The target characters must play [Strike], otherwise they receive 1 damage from you.",
    },
    "TAO_YUAN_JIE_YI": {
        "CN": "出牌阶段，对所有角色使用。目标角色回复1点体力。",
        "EN": "Play Phase\n" +
            "Target: All Heroes\n" +
            "Effect: All Heroes regain 1 unit of life in turn order, starting with the Hero who used this card.",
    },
    "WU_ZHONG_SHENG_YOU": {
        "CN": "出牌阶段，对你使用。目标角色摸两张牌。",
        "EN": "Play Phase\n" +
            "Target: Yourself\n" +
            "Effect: Draw two cards",
    },
    "WU_GU_FENG_DENG": {
        "CN": "出牌阶段，对所有角色使用。（指定目标后）你亮出牌堆顶的X张牌（X为目标数）。目标角色获得这些牌中的一张牌。",
        "EN": "Play Phase\n" +
            "Target: All Heroes\n" +
            "Effect: Reveal top X cards from the deck where X is the number of Heroes alive. Starting with the Hero who used this card, each Hero chooses and keeps a card in turn order from the revealed cards.",
    },
    "GUO_HE_CHAI_QIAO": {
        "CN": "出牌阶段，对区域里有牌的一名其他角色使用。你弃置目标角色区域里的一张牌。",
        "EN": "Play Phase\n" +
            "Target: Another Hero with card in his/her fields (Hand, Equipment, Judgment)\n" +
            "Effect: Discard any one card from target's fields (Hand, Equipment, Judgment).",
    },
    "SHUN_SHOU_QIAN_YANG": {
        "CN": "出牌阶段，对距离为1且区域里有牌的一名角色使用。你获得目标角色区域里的一张牌。",
        "EN": "Play Phase\n" +
            "Target: Another Hero within one range with card in his/her fields (Hand, Equipment, Judgment)\n" +
            "Effect: Take any one card from target's fields (Hand, Equipment, Judgment).",
    },
    "JIE_DAO_SHA_REN": {
        "CN": "出牌阶段，对装备区里有武器牌且其攻击范围内有是其使用【杀】的合法目标的一名其他角色使用。（声明使用牌时）你选择目标角色攻击范围内的是其使用【杀】的合法目标的一名角色。目标角色需对该角色使用【杀】，否则将装备区里的武器牌交给你。",
        "EN": "Play Phase\n" +
            "Target: Another Hero with an equipped weapon\n" +
            "Effect: Order a Hero to use [Strike] on another Hero within his/her weapon range, if not, you receive his/her weapon card."
    },
    "JUE_DOU": {
        "CN": "出牌阶段，对一名其他角色使用。由目标角色开始，其与你轮流打出【杀】，直到其中的一名角色未打出【杀】，未打出【杀】的角色受到另一名角色造成的1点伤害。",
        "EN": "Play Phase\n" +
            "Target: Another Hero\n" +
            "Effect: Target Hero must play [Strike]. If he/she does, then you must use [Strike]. Continue until a Hero does not use [Strike]. That Hero then takes 1 damage.",
    },
    "WU_XIE_KE_JI": {
        "CN": "每当锦囊牌对其一个目标生效前，对此锦囊牌使用。抵消此牌。",
        "EN": "When target scroll is about to activate\n" +
            "Target: Scroll\n" +
            "Effect: Negate the effect of a Scroll card before the effect activates on a target.",
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
        "CN": "出牌阶段，对一名其他角色使用。目标角色判定，若结果不为红桃，该角色跳过出牌阶段。",
        "EN": "During play phase\n" +
            "Target: Another Hero\n" +
            "Effect: During target's judgment phase, reveal the top card of the deck as a judgment if the suit is not ♥, target Hero skips his/her play phase!",
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
        "CN": "出牌阶段，对你使用。目标角色进行判定，若结果为黑桃2~9，该角色受到3点没有来源的雷电伤害，然后将【闪电】置入弃牌堆。【闪电】在使用结算结束后移动的目标区域由弃牌堆改为下一个合法目标的判定区。",
        "EN": "Play Phase\n" +
            "Target: Yourself\n" +
            "Effect: During affected Hero's judgment phase, reveal the top card of the deck; if it is a ♠ from 2 to 9, that Hero receives 3 points of lightning damage. Otherwise the [Lightning] card's target keeps changing until it is discarded into the discard pile. If [Lightning] activation is negated, it moves to the judgment field of the next target.",
    }
}
const SCROLL_CARDS_DESC_CONFIG = {
    ...IMMEDIATE_SCROLL_CARDS_DESC_CONFIG,
    ...DELAY_SCROLL_CARDS_DESC_CONFIG,
}
const WEAPON_CARDS_DESC_CONFIG = {
    // 武器
    "ZHU_GE_LIAN_NU": {
        "CN": "锁定技，你使用【杀】无次数限制。\n" +
            "（攻击范围：1）",
        "EN": "When equipped you can use any number of [Strike] during your play phase.\n" +
            "(Attack Range: 1)",
    },
    "CI_XIONG_SHUANG_GU_JIAN": {
        "CN": "每当你使用【杀】指定一名异性角色为目标后，你可以令该角色选择一项：1.弃置一张手牌；2.令你摸一张牌。\n" +
            "（攻击范围：2）",
        "EN": "When Striking a Hero of the opposite gender, target Hero must choose to discard a hand card or let you draw a card before that [Strike] resolves.\n" +
            "(Attack Range: 2)",
    },
    "GU_DIN_DAO": {
        "CN": "攻击范围：2\n" +
            "技能：锁定技，每当你使用【杀】对目标角色造成伤害时，若其没有手牌，你令伤害值+1。",
        "EN": "Attack Range: 2\n" +
            "Skill: Locked Skill - Whenever you deal damage to the target character using [Strike], if they have no hand cards, you increase the damage value by 1.",
    },
    "QIN_GANG_JIAN": {
        "CN": "锁定技。每当你使用【杀】指定一个目标后，你于此【杀】结算完毕之前无视其防具。\n" +
            "（攻击范围：2）",
        "EN": "Your [Strike] ignores the Effect of target's Armor\n" +
            "(Attack Range: 2)",
    },
    "HAN_BIN_JIAN": {
        "CN": "每当你使用【杀】对对手造成伤害时，若其有牌，你可以防止此伤害，依次弃置其两张牌。\n" +
            "（攻击范围：2）",
        "EN": "When your [Strike] damages a Hero, you may prevent that damage by discarding any two cards from target's hand or equipment field (discarding one card at a time).\n" +
            "(Attack Range: 2)",
    },
    "GUAN_SHI_FU": {
        "CN": "每当你使用的【杀】被抵消时，你可以弃置两张牌，令此【杀】依然对当前目标生效。\n" +
            "（攻击范围：3）",
        "EN": "When your [Strike] is Dodged, you may discard two of your cards to force the target to take damage from the [Strike].\n" +
            "(Attack Range: 3)",
    },
    "ZHANG_BA_SHE_MAO": {
        "CN": "你可以将两张手牌当【杀】使用或打出。\n" +
            "（攻击范围：3）",
        "EN": "You may treat two hand cards as a [Strike] to use or play.\n" +
            "(Attack Range: 3)",
    },
    "QING_LONG_YAN_YUE_DAO": {
        "CN": "每当你使用的【杀】被抵消时，你可以对目标角色使用【杀】（无距离限制）。\n" +
            "（攻击范围：3）",
        "EN": "You may use another [Strike] on the target who Dodged your last [Strike].\n" +
            "(Attack Range: 3)",
    },
    "FANG_TIAN_HUA_JI": {
        "CN": "锁定技。若你使用的【杀】的实体牌是你的所有手牌，你使用此【杀】选择目标的个数上限+2。\n" +
            "（攻击范围：4）",
        "EN": "If you use a [Strike] as your last hand card, you may attack one or two more additional targets of your choice. Hero(es) respond to the [Strike] in turn order.\n" +
            "(Attack Range: 4)",
    },
    "ZHU_QUE_YU_SHAN": {
        "CN": "攻击范围：4\n" +
            "技能：你可以将一张普通【杀】当火【杀】使用；你可以将视为使用【杀】改为视为使用火【杀】。",
        "EN": "Attack Range: 4\n" +
            "Skill: You may use or play one regular [Strike] as a [Fire Strike]",
    },
    "QI_LIN_GONG": {
        "CN": "每当你使用【杀】对目标角色造成伤害时，你可以弃置其装备区里的一张坐骑牌。\n" +
            "（攻击范围：5）",
        "EN": "When your [Strike] deals damage to the target, you can eliminate one equipped mount card of your choice from the target.\n" +
            "(Attack Range: 5)",
    },
}

const SHIELD_CARDS_DESC_CONFIG = {
    // 防具
    "BA_GUA_ZHEN": {
        "CN": "每当你需要使用或打出【闪】时，你可以进行判定，若结果为红色，你视为使用或打出【闪】。",
        "EN": "Effect: Anytime you need to play a [Dodge], you may reveal a judgment; if the judgment is a red color suit then, it is treated as a [Dodge].",
    },
    "REN_WANG_DUN": {
        "CN": "锁定技，黑色【杀】对你无效。",
        "EN": "Passive Effect: Black colored suited [Strike] have no effect against you.",
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
        "CN": "锁定技。其他角色与你的距离+1。",
        "EN": "Your range when being targeted by other Heroes is always plus 1(+1)",
    },
    "JUE_YING": {
        "CN": "锁定技。其他角色与你的距离+1。",
        "EN": "Your range when being targeted by other Heroes is always plus 1(+1)",
    },
    "ZHAO_HUANG_FEI_DIAN": {
        "CN": "锁定技。其他角色与你的距离+1。",
        "EN": "Your range when being targeted by other Heroes is always plus 1(+1)",
    },
}
const MINUS_HORSE_CARDS_DESC_CONFIG = {
    "CHI_TU": {
        "CN": "锁定技。你与其他角色的距离-1。",
        "EN": "Your range when targeting other Heroes is always minus 1(-1).",
    },
    "DA_WAN": {
        "CN": "锁定技。你与其他角色的距离-1。",
        "EN": "Your range when targeting other Heroes is always minus 1(-1).",
    },
    "ZI_XING": {
        "CN": "锁定技。你与其他角色的距离-1。",
        "EN": "Your range when targeting other Heroes is always minus 1(-1).",
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