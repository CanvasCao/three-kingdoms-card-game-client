import {EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "./cardConfig"
import {SKILL_NAMES_CONFIG} from "./skillsConfig"

const PANDING_EFFECT_CONFIG = {
    [SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key]: {
        CN: '♠ ♣ ♦：跳过出牌阶段\n' +
            '♥：乐不思蜀无效',
        EN: '♠ ♣ ♦: Skip play\n' +
            'stage\n' +
            '\n' +
            '♥：Contentment has\n' +
            'no efffect',
    },
    [SCROLL_CARDS_CONFIG.SHAN_DIAN.key]: {
        CN: '♠ 2-9：受到三点闪电伤害\n' +
            '其他：闪电无效',
        EN: '♠ 2-9：Take three\n' +
            'lightning damage\n' +
            '\n' +
            'Other：Lightning\n' +
            'has no effect',
    },
    [EQUIPMENT_CARDS_CONFIG.BA_GUA_ZHEN.key]: {
        CN: '♥ ♦：视为出【闪】\n' +
            '♠ ♣：八卦未生效',
        EN: '♥ ♦：Treat it as\n' +
            'you played [Dodge]\n' +
            '\n' +
            '♠ ♣：Eight Diagrams\n' +
            'has no effect',
    },
    [SKILL_NAMES_CONFIG.SHU006_TIE_JI.key]: {
        CN: '♥ ♦：目标无法闪避\n' +
            '♠ ♣：铁骑未生效',
        EN: '♥ ♦：Target can not\n' +
            'play [Dodge]\n' +
            '\n' +
            '♠ ♣：Iron Cavalry\n' +
            'has no effect',
    },
    [SKILL_NAMES_CONFIG.WEI003_GANG_LIE.key]: {
        CN: '♦ ♠ ♣：伤害来源弃置\n' +
            '两张手牌或受到1点伤害\n' +
            '♥：刚烈未生效',
        EN: '♦ ♠ ♣：Damage source\n' +
            'must discard two hand\n' +
            'cards or take 1\n' +
            'point of damage\n' +
            '\n' +
            '♦ ♠ ♣：Unyielding\n' +
            'has no effect',
    },
}

export {
    PANDING_EFFECT_CONFIG,
}
