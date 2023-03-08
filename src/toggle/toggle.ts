import JSONEditor from "../jsoneditor/jsoneditor.min";
import {socket} from "../socket";
import emitMap from "../config/emitMap.json";

const DEFAULT_FEATURE_TOGGLE = {
    SHOW_GO_TO_NEXT_STAGE: false,
    SHOW_JSON_EDITOR: false,
};

export const getFeatureToggle = () => {
    const key = 'three-kingdom-feature-toggle';
    const value = localStorage.getItem(key);
    if (value) {
        try {
            const toggle = JSON.parse(value)
            return toggle;
        } catch (e) {
            console.log("parse toggles error")
            return DEFAULT_FEATURE_TOGGLE
        }
    } else {
        return DEFAULT_FEATURE_TOGGLE;
    }
}

export const setPageByFeatureToggle = () => {
    // create the editor
    const SHOW_JSON_EDITOR = getFeatureToggle().SHOW_JSON_EDITOR;
    if (SHOW_JSON_EDITOR) {
        const container = document.getElementById('jsoneditor')
        // @ts-ignore
        window.editor = new JSONEditor(container, {})
        // @ts-ignore
        window.editor2 = new JSONEditor(container, {})
    }

    const SHOW_GO_TO_NEXT_STAGE = getFeatureToggle().SHOW_GO_TO_NEXT_STAGE;
    if (SHOW_GO_TO_NEXT_STAGE) {
        $("#GoNextStage").show()

        $("#GoNextStage").click(() => {
            socket.emit(emitMap.GO_NEXT_STAGE);
        })
    }
}