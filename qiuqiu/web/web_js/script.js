function GetRequest() { 
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
			theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1]; 
		} 
	}
	return theRequest; 
}

var request = new Object();
request = GetRequest();


if(typeof(request['isshow'])!="undefined"){
	document.getElementById("user_name1").innerHTML = decodeURI(request['Account']);
	SetInfo();
}else{
	SetInfo();
	//document.getElementById("paihangbang").innerHTML = "世界排名:"+request['paihangbang'];
	//document.getElementById("benlunmingci").innerHTML = "第"+request['benlunmingci']+"名";
	//document.getElementById("tunshirenshu").innerHTML = request['tunshirenshu']+"人";
	//document.getElementById("benlunzuidatizhong").innerHTML = request['benlunzuidatizhong']+"亿吨";
    $(".user_name").css({
        "width": "100%",
        "max-width": "150px",
        "height": "44px",
        "background-size": "contain",
        "-webkit-background-size": "contain",
        "-o-background-size": "contain",
        "-ms-background-size": "contain",
        "-moz-background-size": "contain",
        "border": "0",
        "float": "left",
        "letter-spacing": "-1px",
        "margin-left": "3%",
        "margin-top": "10px",
        "display": "inline-block"});

	$(".cls_mainContainer .data_dis").css({
        "max-width":"340px",
    	"border": "0",
    	"float": "left",
    	"margin-left": "4%",
    	"margin-top": "-8%",
    	"font-size": "19px",
    	"display": "block"});

    document.getElementById("user").innerHTML = " ";
}

function SetInfo(){
    SetInfoAtomic();

    var interval = setInterval(function() {
        if (ifLangLoaded) {
            SetInfoAtomic();
            clearInterval(interval);
        }
    }, 200)
}

function SetInfoAtomic() {
    var shijiepaiming = document.getElementById("shijiepaiming").innerHTML;
    var weishangbang = document.getElementById("weishangbang").innerHTML;
    var di = document.getElementById("di").innerHTML;
    var ming = document.getElementById("ming").innerHTML;
    var ren = document.getElementById("ren").innerHTML;

    if (0 == request['paihangbang']) {
        document.getElementById("paihangbang").innerHTML = shijiepaiming+weishangbang;
    } else {
        document.getElementById("paihangbang").innerHTML = shijiepaiming+request['paihangbang'];
    }

    if (10000 == request['benlunmingci']) {
        document.getElementById("benlunmingci").innerHTML = weishangbang;
    } else {
        document.getElementById("benlunmingci").innerHTML = di+request['benlunmingci']+ming;
    }

    document.getElementById("tunshirenshu").innerHTML = request['tunshirenshu']+ren;
    document.getElementById("benlunzuidatizhong").innerHTML = getWeight(request['benlunzuidatizhong']);
}


function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
var isWeixin = is_weixin();
var winHeight = typeof window.innerHeight != 'undefined' ? window.innerHeight : document.documentElement.clientHeight;

function loadHtml(){
    var div = document.createElement('div');
    div.id = 'weixin-tip';
    div.innerHTML = '<p><img src="live_weixin.png" style="width: 100%;" alt="微信打开"/></p>';
    document.body.appendChild(div);
}

function loadStyleText(cssText) {
    var style = document.createElement('style');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    try {
        style.appendChild(document.createTextNode(cssText));
    } catch (e) {
        style.styleSheet.cssText = cssText; //ie9以下
    }
    var head=document.getElementsByTagName("head")[0]; //head标签之间加上style样式
    head.appendChild(style);
}
var cssText = "#weixin-tip{position: fixed; left:0; top:0; background: rgba(0,0,0,0.8); filter:alpha(opacity=80); width: 100%; height:100%; z-index: 100;} #weixin-tip p{text-align: center; margin-top: 10%; padding:0 5%;}";

function loadAndroid() {
    if (isWeixin) {
        loadHtml();
        loadStyleText(cssText);
    } else {
        window.location.href="http://res.battleofballs.com/bob.apk";
    }
}
function loadIOS() {
    if (isWeixin) {
        loadHtml();
        loadStyleText(cssText);
    } else {
        window.location.href="https://itunes.apple.com/us/app/qiu-qiu-da-zuo-zhan-battle/id996509117?l=zh&ls=1&mt=8";
    }
}









function getWeight(data) {
    var wanyidun = document.getElementById("wanyidun").innerHTML;
    var wandun = document.getElementById("wandun").innerHTML;
    var dun = document.getElementById("dun").innerHTML;
    var qianke = document.getElementById("qianke").innerHTML;
    var ke = document.getElementById("ke").innerHTML;
    var haoke = document.getElementById("haoke").innerHTML;

	var wightStr = "";
	var num = data * data * data;
	if (data >= 14677)
    {
        wightStr = parseInt(num / 100000 / 1e+18 * num) +  wanyidun;
    }
    else if (data >= 2154)
    {
        wightStr = parseInt(num / 100000 / 1e+13 * num) +  wandun;
    }
    else if (data >= 464)
    {
        wightStr = parseInt(num / 100000 / 1e+9 * num) +  dun;
    }
    else if (data >= 100)
    {
        wightStr = parseInt(num / 100000 / 1e+6 * num) +  qianke;
    }
    else if (data >= 31)
    {
        wightStr = parseInt(num / 100000 / 1e+3 * num) +  ke;
    }
    else
    {
        wightStr = parseInt(num / 100000 * num) +  haoke;
    }
	return wightStr
}

//window.onload = function () {
//    document.getElementById("copy").onclick=function(){
//        var copyText = request['Account'];
//		window.clipboardData.setData("Text",copyText);
//		alert("复制成功!");
//    }
//}
