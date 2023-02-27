import {i18Config} from "./i18Config";
export const i18WindowKey = 'three-kingdom-i18n';
export const i18Lans={
    'CN':'CN',
    'EN':'EN',
}
export const i18nUtils = () => {
    var params = {};
    if (location.search) {
        var parts = location.search.substring(1).split('&');

        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            params[nv[0]] = nv[1] || true;
        }
    }

    if (['CN', 'EN'].includes(params.LAN)) {
        window[i18WindowKey] = params.LAN
    } else {
        const languages = navigator.languages || [];
        if (languages.includes("zh-CN")) {
            window[i18WindowKey] = 'CN'
        } else {
            window[i18WindowKey] = 'EN'
        }
    }
}

export const getI18Lan = () => {
    return window[i18WindowKey] || i18Lans.EN
}

export const i18 = (obj, replaceObj={}) => {
    const lan = window[i18WindowKey] || i18Lans.EN;
    const key = obj.KEY
    try {
        const returnString = i18Config[key][lan];
        const pattern = /\{(\w+)\}/g;
        return returnString.replace(pattern, (match, capture) => replaceObj[capture]);
    } catch (e) {
        console.log("i18 error", obj, replaceObj);
        return ""
    }
}