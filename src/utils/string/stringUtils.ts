import {CARD_CONFIG, CARD_NUM_DESC} from "../../config/cardConfig";
import {CARD_DESC_CONFIG} from "../../config/cardDescConfig";
import {HERO_NAMES_CONFIG} from "../../config/heroConfig";
import {SKILL_DESC_CONFIG, SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {TOOL_TIP_HERO_MAX_LENGTH} from "../../config/stringConfig";
import {getI18Lan, i18, I18LANS} from "../../i18n/i18nUtils";
import {Card} from "../../types/card";
import {Player} from "../../types/player";

function truncateStringIntoArray(inputString: string, maxLength: number) {
    return getI18Lan() == I18LANS.EN ? truncateEnIntoArray(inputString, maxLength) : truncateCnIntoArray(inputString, maxLength)
}

function truncateEnIntoArray(inputString: string, maxLength: number) {
    const words = inputString.split(' ');
    const truncatedArray = [];
    let currentChunk = '';

    for (const word of words) {
        if (currentChunk.length + word.length <= maxLength) {
            currentChunk += (currentChunk === '' ? '' : ' ') + word;
        } else {
            truncatedArray.push(currentChunk);
            currentChunk = word;
        }
    }

    if (currentChunk !== '') {
        truncatedArray.push(currentChunk);
    }

    return truncatedArray;
}

function truncateCnIntoArray(inputString: string, maxLength: number) {
    const result = [];
    for (let i = 0; i < inputString.length; i += maxLength) {
        result.push(inputString.slice(i, i + maxLength));
    }
    return result;
}

function generateEmptyString(length: number) {
    return " ".repeat(length);
}

const verticalRotationString = (s: string) => {
    return s.split('').join('\r\n')
}

const verticalRotationEnString = (s: string) => {
    return s.split(' ').join('\r\n')
}

const splitText = (text: string, maxLineLength: number): string => {
    const splittedText = text.split('\n');
    let resArr: string[] = [];

    splittedText.forEach((t) => {
        resArr = resArr.concat(truncateStringIntoArray(t, maxLineLength))
    })

    return resArr.join('\n');
};

const getCardText = (card: Card) => {
    const resArr: string[] = []

    resArr.push(i18(CARD_CONFIG[card.key]) + ' ' + card.huase + CARD_NUM_DESC[card.number])
    resArr.push('\r')
    resArr.push(i18(CARD_DESC_CONFIG[card.key]))
    return resArr.join('\n');
}

const getHeroSkillsText = (player: Player) => {
    const {skills, heroId} = player
    const resArr: string[] = []
    const heroName = i18(HERO_NAMES_CONFIG[heroId])
    resArr.push(heroName + generateEmptyString(TOOL_TIP_HERO_MAX_LENGTH - heroName.length))
    resArr.push('\r')

    skills.forEach((skill, index) => {
        resArr.push(i18(SKILL_NAMES_CONFIG[skill.key]))
        resArr.push(i18(SKILL_DESC_CONFIG[skill.key]))
        if (index !== skills.length - 1) {
            resArr.push('\r')
        }
    })
    console.log(resArr)
    return resArr.join('\n');
}

export {
    verticalRotationString,
    verticalRotationEnString,
    splitText,
    getHeroSkillsText,
    getCardText
}