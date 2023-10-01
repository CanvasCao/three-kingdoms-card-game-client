import {GamingScene, PhaserGameObject} from "../../types/phaser";
import {sizeConfig} from "../../config/sizeConfig";
import {uuidv4} from "../../utils/uuid";
import {COLOR_CONFIG} from "../../config/colorConfig";
import {Skill} from "../../types/skill";
import {limitStringLengthWithEllipsis} from "../../utils/string/stringUtils";
import {i18, isLanEn} from "../../i18n/i18nUtils";
import {SKILL_NAMES_CONFIG} from "../../config/skillsConfig";
import {GameStatus} from "../../types/gameStatus";
import {getIsSkillAble} from "../../utils/validation/validationUtils";
import {GameFEStatus} from "../../types/gameFEStatus";

export class BoardPlayerSkills {
    obId: string;
    gamingScene: GamingScene;
    skills: Skill[];
    positionX: number;
    positionY: number;
    phaserGroup: PhaserGameObject[];
    _skillImages: Phaser.GameObjects.Image[];
    _skillStrokes: Phaser.GameObjects.Graphics[];

    constructor(gamingScene: GamingScene, positionX: number, positionY: number, skills: Skill[]) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.skills = skills;
        this.positionX = positionX;
        this.positionY = positionY;
        this.phaserGroup = [];

        this._skillImages = [];
        this._skillStrokes = [];

        this.draw()
        this.bindEvent()
        this.initAble();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }

    draw() {
        const skillMargin = 5;
        const doubleSkillWidth = (sizeConfig.player.width - 40) / 2
        const singleSkillWidth = (sizeConfig.player.width - 40)

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
            this._skillImages.push(skillImage)
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
            skillText.setStroke(COLOR_CONFIG.blackString, 2)
            skillText.setPadding(2)
            skillText.setOrigin(0.5, 1)
            skillText.setFontSize(fontSize)
            this.phaserGroup.push(skillText)

            const stroke = this.gamingScene.add.graphics();
            stroke.lineStyle(3, Number(COLOR_CONFIG.yellow));
            stroke.strokeRoundedRect(
                x - skillWidth / 2,
                y - skillHeight,
                skillWidth,
                skillHeight,
                2);
            stroke.setAlpha(0)
            this._skillStrokes.push(stroke)
            this.phaserGroup.push(stroke)
        })
    }

    bindEvent() {
        this.skills.forEach((skill, index) => {
            this._skillImages[index].on('pointerdown', () => {
                const gameFEStatusObserved = this.gamingScene.gameFEStatusObserved!;
                if (gameFEStatusObserved.gameFEStatus.selectedSkillKey) {
                    gameFEStatusObserved.unselectSkill()
                } else {
                    gameFEStatusObserved.selectSkill(skill.key)
                }
            })
        })
    }

    initAble() {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        this.gameStatusNotify(gameStatus)
    }

    gameStatusNotify(gameStatus: GameStatus) {
        this.skills.forEach((skill, index) => {
            const gameFEStatus = this.gamingScene.gameFEStatusObserved!.gameFEStatus;
            const isAble = getIsSkillAble(gameStatus, gameFEStatus, skill);
            if (isAble) {
                this._skillImages[index].setTint(Number(COLOR_CONFIG.skill)).setInteractive({cursor: "pointer"})
            } else {
                this._skillImages[index].setTint(Number(COLOR_CONFIG.grey555)).removeInteractive();
            }
        })
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        const index = this.skills.findIndex((skill) => skill.key == gameFEStatus.selectedSkillKey)
        this.skills.forEach((skill, i) => {
            if (index == i) {
                this._skillStrokes[i].setAlpha(1)
            } else {
                this._skillStrokes[i].setAlpha(0)
            }
        })
    }
}