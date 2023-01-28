const DEFAULT_FEATURE_TOGGLE = {
    SHOW_GO_TO_NEXT_STAGE: false,
    SHOW_JSON_EDITOR: false,
};

const getFeatureToggle = () => {
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
        localStorage.setItem(key, JSON.stringify(DEFAULT_FEATURE_TOGGLE));
        return DEFAULT_FEATURE_TOGGLE;
    }
}

export {
    getFeatureToggle,
}