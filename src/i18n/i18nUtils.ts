type I18Obj = {
    CN: string,
    EN: string,
}

const i18WindowKey = 'three-kingdom-i18n';
const I18LANS = {
    'CN': 'CN',
    'EN': 'EN',
}
const getI18Lan = () => {
    return (window as { [key: string]: any })[i18WindowKey] || I18LANS.EN
}

export const isLanEn = () => {
    return getI18Lan() == I18LANS.EN
}

export const setI18nLan = () => {
    var params: { [key: string]: any } = {};
    if (location.search) {
        var parts = location.search.substring(1).split('&');

        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            params[nv[0]] = nv[1] || true;
        }
    }

    if ([I18LANS.CN, I18LANS.EN].includes(params.LAN)) {
        (window as { [key: string]: any })[i18WindowKey] = params.LAN
    } else {
        const languages = navigator.languages || [];
        if (languages.includes("zh-CN")) {
            (window as { [key: string]: any })[i18WindowKey] = I18LANS.CN
        } else {
            (window as { [key: string]: any })[i18WindowKey] = I18LANS.EN
        }
    }
}

export const i18 = (obj: I18Obj, replaceObj = {}) => {
    const lan = (window as { [key: string]: any })[i18WindowKey] || I18LANS.EN;
    try {
        // @ts-ignore
        const returnString = obj[lan] || obj[CN];// 没有英文就返回中文
        const pattern = /\{(\w+)\}/g;
        // @ts-ignore
        return returnString.replace(pattern, (match, capture) => replaceObj[capture]);
    } catch (e) {
        console.log("i18 error", obj, replaceObj);
        return ""
    }
}