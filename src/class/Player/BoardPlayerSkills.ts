import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {uuidv4} from "../../utils/uuid";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {Skill} from "../../types/skill";
import {limitStringLengthWithEllipsis} from "../../utils/string/stringUtils";
import {i18, isLanEn} from "../../i18n/i18nUtils";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";

export class BoardPlayerSkills {
    obId: string;
    gamingScene: GamingScene;
    skills: Skill[];
    positionX: number;
    positionY: number;
    phaserGroup: PhaserGameObject[];

    constructor(gamingScene: GamingScene, positionX: number, positionY: number, skills: Skill[]) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.skills = skills;
        this.positionX = positionX;
        this.positionY = positionY;
        this.phaserGroup = [];
        this.draw()
    }

    draw() {
        const skillMargin = 5;
        const doubleSkillWidth = (sizeConfig.player.width - 40) / 2
        const singleSkillWidth = (sizeConfig.player.width - 30)

        const isSingleSkill = (this.skills.length === 1)
        const skillWidth = isSingleSkill ? singleSkillWidth : doubleSkillWidth;
        const skillHeight = 24

        this.skills.forEach((skill, index) => {
            if (index > 1) {
                return // 超过三个技能先不写
            }

            const x = this.positionX - sizeConfig.player.width / 2 + skillWidth / 2 + index * (skillWidth + skillMargin) + skillMargin
            const y = this.positionY + sizeConfig.player.height / 2 - skillMargin
            const skillImage = this.gamingScene.add.image(x, y, "white").setTint(Number(COLOR_CONFIG.grey555));
            skillImage.setDisplaySize(skillWidth, skillHeight)
            skillImage.setOrigin(0.5, 1)
            this.phaserGroup.push(skillImage)


            let skillName = limitStringLengthWithEllipsis(i18(SKILL_NAMES_CONFIG[skill.key]), isSingleSkill ? 10 : 5)
            const fontSize = (isLanEn() && !isSingleSkill) ? 14 : 16
            const skillText = this.gamingScene.add.text(x, y, skillName, {
                    align: 'left',
                    wordWrap: {
                        width: isSingleSkill ? Number.MAX_VALUE : skillWidth,
                        useAdvancedWrap: true
                    }
                }
            )
            skillText.setPadding(2)
            skillText.setOrigin(0.5, 1)
            skillText.setFontSize(fontSize)
            this.phaserGroup.push(skillText)
        })
    }
}