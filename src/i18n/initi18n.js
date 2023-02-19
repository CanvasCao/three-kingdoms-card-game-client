export const i18WindowKey = 'three-kingdom-i18n';
export const i18Lans={
    'CN':'CN',
    'EN':'EN',
}
export const initI18n = () => {
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