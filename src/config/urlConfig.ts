import {KINGDOM_CONFIG} from "./kingdomConfig";

const HERO_URL_PREFIX = "wujiang/biao/"

function generateHeroIndexes(kindom: string, end: number) {
    const HERO_INDEXES = [];

    for (let i = 1; i <= end; i++) {
        const index = i.toString().padStart(3, '0');
        HERO_INDEXES.push(`${kindom}${index}`);
    }

    return HERO_INDEXES;
}

const HERO_INDEXES = [
    ...generateHeroIndexes(KINGDOM_CONFIG.WEI.EN, 7),
    ...generateHeroIndexes(KINGDOM_CONFIG.SHU.EN, 7),
    ...generateHeroIndexes(KINGDOM_CONFIG.WU.EN, 7),
    ...generateHeroIndexes(KINGDOM_CONFIG.QUN.EN, 3),
    ...generateHeroIndexes(KINGDOM_CONFIG.SP.EN, 1)
]

const URL_CONFIG = {
    "baseUrl": "http://www.caoyuhao.top",
    "card": {
        "card": "card/card.png",
        "cardBg": "card/cardBg.png"
    },
    "other": {
        "gouyu": "other/gouyu.png",
        "white": "other/white.png",
        "bg": "other/bg.png",
        "tiesuo": "other/tiesuo.png",
        "bigSkin": "other/bigSkin.webp",
        "xuanjiang": "other/xuanjiang.png",
        "wound": "other/wound.png"
    }
}

export {
    URL_CONFIG,
    HERO_INDEXES,
    HERO_URL_PREFIX
}