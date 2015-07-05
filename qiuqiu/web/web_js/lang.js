var language = navigator.language || navigator.userLanguage;
var langArr = language.split("-");
if (("zh" == langArr[0] && "zh-cn" != language.toLowerCase()) || "zh" != langArr[0]) {
    language = langArr[0];
} else {
    if (2 == langArr.length && "zh" == langArr[0]) {
        language = langArr[0] + langArr[1].toLowerCase();
    }
}

$(function () {
    window.lang.change(language);
    ifLangLoaded = true;
});



var lang = new Lang('en');
for (var lk in isoLangs){
    lang.dynamic(lk, 'langpack/' + lk + '.json');
}
