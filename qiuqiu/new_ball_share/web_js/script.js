function GetRequest() { 
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]); 
		} 
	}
	return theRequest; 
}

var request = new Object();
request = GetRequest();

function numController($scope) {
	/*var request = new Object();
	request = GetRequest();*/
	$scope.user_name = request['Account'];
	$scope.rank = request['paihangbang'];
	$scope.rank_num = request['benlunmingci'];
	$scope.devour_num = request['tunshirenshu'];
	$scope.weight_num = request['benlunzuidatizhong'];
	$scope.versionNum = request['versionNum'];
	$scope.clientSize = request['clientSize'];
	$scope.updateTime = request['updateTime'];
}

window.onload = function () {
    document.getElementById("copy").onclick=function(){
        //alert("复制成功!");
 	
        var copyText = request['Account'];
        alert(copyText);
		window.clipboardData.setData("Text",copyText);
		alert("复制成功!");
    }
}
