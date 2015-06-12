/**
 * Created by wangxufeng on 2015/4/27.
 */

(function(){
    'use strict';

    angular.module('modules')
        .service('ModService', ['$q', '$http', ModService])
        /*.service('gameDataService', ['$q', GameDataService])
        .service('dataCateService', ['$q', DataCateService])*/;

    var requestUrl = 'http://rpttest.ztgame.com/api/api.php';
    var gametype = {
        1: '端游',
        3: '手游',
        2: '页游'
    };
    var overallGamelist = [];
    var overallChannels = [];

    function ModService($q, $http) {
        var self = this;

        function getByJsonp(url, params, type) {
            var deferral = $q.defer();
            url = url  + '?callback=JSON_CALLBACK';
            $http.jsonp (url, {
                params: params
            }).success(function(data, status, headers, config) {console.log(data);
                switch (type) {
                    case 1:                             //获取游戏列表
                        genGamesObj(deferral, data);
                        break;
                    case 2:                             //渠道信息
                        genChannelData(deferral, data);
                        break;
                }
            }).error(function() {
                console.log('连接异常，请重试！');
            });
            return deferral.promise;
        }

        function genGamesObj(deferral, data) {
            var games = [];
            var gameids = [];
            if (verifyRet(data)) {
                var game;
                var gametypeid = -1;
                for (game in data.data) {
                    var gamedata = data.data[game];
                    if (gameids.indexOf(gamedata.gametype) == -1) {
                        gametypeid++;
                        gameids.push(gamedata.gametype);
                        games[gametypeid] = {};
                        games[gametypeid].type = gametype[gamedata.gametype];
                        games[gametypeid].gamelist = [];
                    }
                    var thisgame = {
                        'gid' : gamedata.gameid,
                        'name' : gamedata.gamename_cn
                    };
                    games[gametypeid].gamelist = games[gametypeid].gamelist.concat(thisgame);
                }
                for (var typegame in games) {
                    overallGamelist = myjquery.merge(overallGamelist, games[typegame].gamelist);
                }
            }

            deferral.resolve(games);
        }

        function genChannelData(deferral, data) {
            var channels = {};
            channels.ios = [];
            channels.android = [];
            if (verifyRet(data)) {
                for (var key in data.data) {
                    var item = {
                        name: data.data[key].custname_cn,
                        id: data.data[key].cust
                    };
                    if (2 == data.data[key].cust) {             //IOS
                        channels.ios.push(item);
                    } else {                                    //ANDROID
                        channels.android.push(item);
                    }
                }
            }
            channels.android.sort(byAlpha);

            overallChannels = channels;

            deferral.resolve(channels);
        }


        // 1 获取游戏列表
        function getGameList() {
            var param = {'act':'userpriv', 'type':'gamePriv', 'username':'songhua', 'area':1};
            return getByJsonp(requestUrl, param, 1);
        }

        // 2 获取渠道列表
        function getChannelList() {
            var param = {'act':'getData', 'datetype': 'channel'};
            return getByJsonp(requestUrl, param, 2);
        }

        var games = [{
            type: '手游',
            gamelist: [{
                gid: 1,
                name: '国民足球',
                avatar: 'svg-1',
                content: 'content1',
                selected: true
            }, {
                gid: 2,
                name: '征途口袋版',
                avatar: 'svg-2',
                content: 'content2',
                selected: false
            }, {
                gid: 3,
                name: '大主宰',
                avatar: 'svg-3',
                content: "content3",
                selected: false
            }, {
                gid: 4,
                name: '新征途',
                avatar: 'svg-4',
                content: 'content4',
                selected: false
            }, {
                gid: 5,
                name: '手游版征途',
                avatar: 'svg-5',
                content: 'content5',
                selected: false
            }]
        }, {
            type: '端游',
            gamelist: [{
                gid: 6,
                name: '绿色征途',
                avatar: '',
                content: "content7",
                selected: false
            }, {
                gid: 7,
                name: '征途2',
                avatar: '',
                content: 'content8',
                selected: false
            }, {
                gid: 8,
                name: '征途',
                avatar: '',
                content: 'content9',
                selected: false
            }, {
                gid: 9,
                name: '征途2经典版',
                avatar: '',
                content: 'content10',
                selected: false
            }, {
                gid: 10,
                name: '仙途',
                avatar: '',
                content: 'content11',
                selected: false
            }, {
                gid: 11,
                name: '仙侠世界',
                avatar: '',
                content: 'content12',
                selected: false
            }]
        }];

        var channeldata = {
            ios: [{
                id: "2",
                name: "IOS官服"
            }],
            android: [{
                id: "1",
                name: "Android官服"
            }, {
                id: "3",
                name: "4399"
            }, {
                id: "4",
                name: "37wan"
            }]
        };

        // Promise-based API
        return {
            loadAllGames : function() {
                /////////////////////////////////////////
                //return $q.when(games);

                return $q.when(getGameList());
            },
            loadAllChannels : function() {
                /////////////////////////////////////////
                //return $q.when(channeldata);

                return $q.when(getChannelList());
            }
        };
    }



    //tools ↓
    function byAlpha(a, b) {
        return a.name.localeCompare(b.name);
    }
    function byNum(a, b) {
        /*a.amount = null == a.amount ? 0 : a.amount;
        b.amount = null == b.amount ? 0 : b.amount;*/
        return b.amount - a.amount;
    }
    function getGameNameById(gid) {
        for (var id in overallGamelist) {
            if (gid == overallGamelist[id].gid) {
                return overallGamelist[id].name;
            }
        }
    }
    function getChannelNameById(chid) {
        for (var sys in overallChannels) {
            for (var key in overallChannels[sys]) {
                if (chid == parseInt(overallChannels[sys][key].id)) {
                    return overallChannels[sys][key].name;
                }
            }
        }
    }
    function verifyRet(data) {
        if ("OK" == data.status && "\u4e0d\u5b58\u5728\u8be5\u63a5\u53e3" != data.data && "no this api" != data.data)
            return true;
        else
            return false;
    }
    function num2e(num){
        var p = Math.floor(Math.log(num)/Math.LN10);
        var n = (num * Math.pow(10, -p)).toFixed(1);
        return n + 'e' + p;
    }
    //tools ↑
})();