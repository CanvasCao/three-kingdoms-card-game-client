import {CardConfig, CardDescConfig} from "../types/card"
import {BASIC_CARDS_CONFIG, CARD_TYPE, EQUIPMENT_TYPE} from "./cardConfig"

const BASIC_CARDS_DESC_CONFIG = {
    "SHA": {
        "CN": `使用时机：出牌阶段限一次。\r\n使用目标：你攻击范围内的一名角色。\r\n作用效果：你对目标角色造成1点伤害。`,
        "EN": `Usage Timing: Once per turn during the Play Phase.\r\nTarget: One character within your attack range.\r\nEffect: Inflict 1 damage to the target character.`,
    },
    "SHAN": {
        "CN": `使用时机：以你为目标的【杀】生效前。\r\n使用目标：以你为目标的【杀】。\r\n作用效果：抵消此【杀】。`,
        "EN": `Usage Timing: Before a [Strike] card targeting you takes effect.\r\nTarget: A [Strike] card targeting you.\r\nEffect: Nullify the [Strike] card.`,
    },
    "TAO": {
        "CN": "使用时机：出牌阶段。\r\n" +
            "使用目标：包括你在内的一名已受伤的角色。\r\n" +
            "作用效果：目标角色回复1点体力。\r\n" +
            "\r\n" +
            "使用时机：当一名角色处于濒死状态时。\r\n" +
            "使用目标：一名处于濒死状态的角色。\r\n" +
            "作用效果：目标角色回复1点体力。",
        "EN": "Usage Timing: Play Phase.\r\n" +
            "Target: One injured character, including yourself.\r\n" +
            "Effect: The target character restores 1 health point.\r\n" +
            "\r\n" +
            "Usage Timing: When a character is in a dying state.\r\n" +
            "Target: One character in a dying state.\r\n" +
            "Effect: The target character restores 1 health point.",
    },
}

const IMMEDIATE_SCROLL_CARDS_DESC_CONFIG = {
    // 锦囊
    "WAN_JIAN_QI_FA": {
        key: "WAN_JIAN_QI_FA",
        "CN": "万箭齐发",
        "EN": "Arrow Barrage",
        type: CARD_TYPE.SCROLL
    },
    "NAN_MAN_RU_QIN": {
        key: "NAN_MAN_RU_QIN",
        "CN": "南蛮入侵",
        "EN": "Barbarian Invasion",
        type: CARD_TYPE.SCROLL
    },
    "TAO_YUAN_JIE_YI": {
        key: "TAO_YUAN_JIE_YI",
        "CN": "桃园结义",
        "EN": "Peach Garden",
        type: CARD_TYPE.SCROLL
    },
    "WU_ZHONG_SHENG_YOU": {
        key: "WU_ZHONG_SHENG_YOU",
        "CN": "无中生有",
        "EN": "Something for Nothing",
        type: CARD_TYPE.SCROLL
    },
    "WU_GU_FENG_DENG": {
        key: "WU_GU_FENG_DENG",
        "CN": "五谷丰登",
        "EN": "Bountiful Harvest",
        type: CARD_TYPE.SCROLL
    },
    "GUO_HE_CHAI_QIAO": {
        key: "GUO_HE_CHAI_QIAO",
        "CN": "过河拆桥",
        "EN": "Dismantle",
        type: CARD_TYPE.SCROLL
    },
    "SHUN_SHOU_QIAN_YANG": {
        key: "SHUN_SHOU_QIAN_YANG",
        "CN": "顺手牵羊",
        "EN": "Snatch",
        type: CARD_TYPE.SCROLL
    },
    "JIE_DAO_SHA_REN": {
        key: "JIE_DAO_SHA_REN",
        "CN": "借刀杀人",
        "EN": "Borrowed Sword",
        type: CARD_TYPE.SCROLL
    },
    "JUE_DOU": {
        key: "JUE_DOU",
        "CN": "决斗",
        "EN": "Duel",
        type: CARD_TYPE.SCROLL
    },
    "WU_XIE_KE_JI": {
        key: "WU_XIE_KE_JI",
        "CN": "无懈可击",
        "EN": "Cancel",
        type: CARD_TYPE.SCROLL
    },

    // junzheng
    "HUO_GONG": {
        key: "HUO_GONG",
        "CN": "火攻",
        "EN": "Fire Attack",
        type: CARD_TYPE.SCROLL,
    },
    "TIE_SUO_LIAN_HUAN": {
        key: "TIE_SUO_LIAN_HUAN",
        "CN": "铁索连环",
        "EN": "Chain",
        type: CARD_TYPE.SCROLL,
    },
}

const DELAY_SCROLL_CARDS_DESC_CONFIG = { // 延时锦囊
    "LE_BU_SI_SHU": {
        key: "LE_BU_SI_SHU",
        "CN": "乐不思蜀",
        "EN": "Contentment",
        type: CARD_TYPE.SCROLL,
        isDelay: true,
    },
    "BING_LIANG_CUN_DUAN": {
        key: "BING_LIANG_CUN_DUAN",
        "CN": "兵粮寸断",
        "EN": "Supply Outage",
        type: CARD_TYPE.SCROLL,
        isDelay: true,
    },
    "SHAN_DIAN": {
        key: "SHAN_DIAN",
        "CN": "闪电",
        "EN": "Lightning",
        type: CARD_TYPE.SCROLL,
        isDelay: true,
    }
}
const SCROLL_CARDS_DESC_CONFIG = {
    ...IMMEDIATE_SCROLL_CARDS_DESC_CONFIG,
    ...DELAY_SCROLL_CARDS_DESC_CONFIG,
}
const WEAPON_CARDS_DESC_CONFIG = {
    // 武器
    "ZHU_GE_LIAN_NU": {
        key: "ZHU_GE_LIAN_NU",
        "CN": "诸葛连弩",
        "EN": "Crossbow",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 1
    },
    "CI_XIONG_SHUANG_GU_JIAN": {
        key: "CI_XIONG_SHUANG_GU_JIAN",
        "CN": "雌雄双股剑",
        "EN": "Binary Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 2
    },
    "GU_DIN_DAO": {
        key: "GU_DIN_DAO",
        "CN": "古锭刀",
        "EN": "Ancient Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 2
    },
    "QING_LONG_YAN_YUE_DAO": {
        key: "QING_LONG_YAN_YUE_DAO",
        "CN": "青龙偃月刀",
        "EN": "Green Dragon Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 3
    },
    "FANG_TIAN_HUA_JI": {
        key: "FANG_TIAN_HUA_JI",
        "CN": "方天画戟",
        "EN": "Halberd",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 4
    },
    "HAN_BIN_JIAN": {
        key: "HAN_BIN_JIAN",
        "CN": "寒冰剑",
        "EN": "Ice Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 2
    },
    "GUAN_SHI_FU": {
        key: "GUAN_SHI_FU",
        "CN": "贯石斧",
        "EN": "Stone Axe",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 3
    },
    "QI_LIN_GONG": {
        key: "QI_LIN_GONG",
        "CN": "麒麟弓",
        "EN": "Qilin Bow",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 5
    },
    "ZHU_QUE_YU_SHAN": {
        key: "ZHU_QUE_YU_SHAN",
        "CN": "朱雀羽扇",
        "EN": "Fire Fan",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 4
    },
    "QIN_GANG_JIAN": {
        key: "QIN_GANG_JIAN",
        "CN": "青釭剑",
        "EN": "Green Steel Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 2
    },
    "ZHANG_BA_SHE_MAO": {
        key: "ZHANG_BA_SHE_MAO",
        "CN": "丈八蛇矛",
        "EN": "Snake Spear",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 3
    },
}

const SHIELD_CARDS_DESC_CONFIG = {
    // 防具
    "BA_GUA_ZHEN": {
        key: "BA_GUA_ZHEN",
        "CN": "八卦阵",
        "EN": "Eight Diagrams",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.SHIELD,
    },
    "REN_WANG_DUN": {
        key: "REN_WANG_DUN",
        "CN": "仁王盾",
        "EN": "King's Shield",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.SHIELD,
    },
    "TENG_JIA": {
        key: "TENG_JIA",
        "CN": "藤甲",
        "EN": "Vine Armour",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.SHIELD,
    },
    "BAI_YIN_SHI_ZI": {
        key: "BAI_YIN_SHI_ZI",
        "CN": "白银狮子",
        "EN": "Silver Lion",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.SHIELD,
    },
}

const PLUS_HORSE_CARDS_DESC_CONFIG = {
    // 马
    "DI_LU": {
        key: "DI_LU",
        "CN": "的卢",
        "EN": "Plus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.PLUS_HORSE,
    },
    "JUE_YING": {
        key: "JUE_YING",
        "CN": "绝影",
        "EN": "Plus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.PLUS_HORSE,
    },
    "ZHAO_HUANG_FEI_DIAN": {
        key: "ZHAO_HUANG_FEI_DIAN",
        "CN": "爪黄飞电",
        "EN": "Plus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.PLUS_HORSE,
    },
}
const MINUS_HORSE_CARDS_DESC_CONFIG = {
    "CHI_TU": {
        key: "CHI_TU",
        "CN": "赤兔",
        "EN": "Minus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.MINUS_HORSE,
    },
    "DA_WAN": {
        key: "DA_WAN",
        "CN": "大宛",
        "EN": "Minus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.MINUS_HORSE,
    },
    "ZI_XING": {
        key: "ZI_XING",
        "CN": "紫骍",
        "EN": "Minus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.MINUS_HORSE,
    },
}

const EQUIPMENT_CARDS_DESC_CONFIG = {
    ...WEAPON_CARDS_DESC_CONFIG,
    ...SHIELD_CARDS_DESC_CONFIG,
    ...PLUS_HORSE_CARDS_DESC_CONFIG,
    ...MINUS_HORSE_CARDS_DESC_CONFIG,
}

const CARD_DESC_CONFIG :CardDescConfig= {
    ...BASIC_CARDS_DESC_CONFIG,
    ...SCROLL_CARDS_DESC_CONFIG,
    ...EQUIPMENT_CARDS_DESC_CONFIG,
}

export {
    CARD_DESC_CONFIG,
    BASIC_CARDS_DESC_CONFIG,
}