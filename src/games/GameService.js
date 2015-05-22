/**
 * Created by wangxufeng on 2015/4/27.
 */

(function(){
    'use strict';

    angular.module('games')
        .service('gameService', ['$q', '$http', GameService])
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

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
    function GameService($q, $http) {
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
                    case 2:                             //获取面板数据
                        genGamesData(deferral, data, params);
                        break;
                    case 3:                             //获取收入数据
                        genProfitData(deferral, data, params);
                        break;
                    case 4:                             //获取TOP数据
                        genTopData(deferral, data, params);
                        break;
                    case 5:                             //获取留存数据
                        genRemainData(deferral, data, params);
                        break;
                    case 6:                             //环比数据
                        genChainChartData(deferral, data, params);
                        break;
                    case 7:                             //分布图/结构图数据
                        genDistChartData(deferral, data, params);
                        break;
                    case 8:                             //趋势
                        genTrendChartData(deferral, data, params);
                        break;
                    case 9:                             //渠道信息
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
        function genGamesData(deferral, data, params) {
            var gamedata = {
                //overall: {
                //    profit: {
                //        chain: 0,
                //        num: 0,
                //        topgid: 0
                //    },
                //    ol: {
                //        pcu: {
                //            chain: 0,
                //            num: 0,
                //            topgid: 0
                //        },
                //        cu: {
                //            num: 0,
                //            topgid: 0
                //        }
                //    },
                //    people: {
                //        netNewRech: {
                //            chain: 0,
                //            num: 0,
                //            topgid: 0
                //        },
                //        rech: {
                //            chain: 0,
                //            num: 0,
                //            topgid: 0
                //        },
                //        newRech: {
                //            chain: 0,
                //            num: 0,
                //            topgid: 0
                //        },
                //        lostRech: {
                //            chain: 0,
                //            num: 0,
                //            topgid: 0
                //        },
                //        netNew: {
                //            chain: 0,
                //            num: 0,
                //            topgid: 0
                //        },
                //        active: {
                //            chain: 0,
                //            num: 0,
                //            topgid: 0
                //        },
                //        new: {
                //            chain: 0,
                //            num: 0,
                //            topgid: 0
                //        },
                //        lost: {
                //            chain: 0,
                //            num: 0,
                //            topgid: 0
                //        }
                //    }
                //},
                //specgame: {
                //    profit: {
                //        income: {
                //            chain: 0,
                //            num: 0
                //        },
                //        arpu: {
                //            num: 0
                //        },
                //        ratio: {
                //            num: 0
                //        }
                //    },
                //    ol: {
                //        pcu: {
                //            chain: 0,
                //            num: 0
                //        },
                //        cu: {
                //            num: 0
                //        }
                //    },
                //    people: {
                //        netNewRech: {
                //            chain: 0,
                //            num: 0
                //        },
                //        rech: {
                //            chain: 0,
                //            num: 0
                //        },
                //        newRech: {
                //            chain: 0,
                //            num: 0
                //        },
                //        lostRech: {
                //            chain: 0,
                //            num: 0
                //        },
                //        netNew: {
                //            chain: 0,
                //            num: 0
                //        },
                //        active: {
                //            chain: 0,
                //            num: 0
                //        },
                //        new: {
                //            chain: 0,
                //            num: 0
                //        },
                //        lost: {
                //            chain: 0,
                //            num: 0
                //        },
                //        topRech: {
                //            chain: 0,
                //            num: 0
                //        },
                //        topLost: {
                //            chain: 0,
                //            num: 0
                //        },
                //        topLostTotal: {
                //            chain: 0,
                //            num: 0
                //        }
                //    },
                //    remain: {
                //        overall: {
                //            d: 0,
                //            w: 0,
                //            dw: 0,
                //            m: 0
                //        },
                //        active: {
                //            d: 0,
                //            w: 0,
                //            dw: 0,
                //            m: 0
                //        },
                //        rech: {
                //            d: 0,
                //            w: 0,
                //            dw: 0,
                //            m: 0
                //        }
                //    }
                //}
            };
            if (verifyRet(data)) {
                if (0 == params.gid) {              //总览面板数据
                    gamedata.overall  = data.data;
                    gamedata.overall.profit = data.data.profile;
                } else {                            //某个游戏的面板数据
                    gamedata.specgame = data.data;
                }
            }
            deferral.resolve(gamedata);
        }
        function genProfitData(deferral, data, params) {
            var gamedata = {};
            deferral.resolve(gamedata);
        }
        function genTopData(deferral, data, params) {
            var gamedata = {};
            deferral.resolve(gamedata);
        }
        function genRemainData(deferral, data, params) {
            var gamedata = {};
            deferral.resolve(gamedata);
        }
        function genChainChartData(deferral, data, params) {
            if (verifyRet(data)) {
                var options = {
                    animation: false,
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['当前', '对比']
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            /*dataView : {show: true, readOnly: false},
                             magicType: {show: true, type: ['line', 'bar']},
                             restore : {show: true},*/
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [{
                        type : 'value',
                        boundaryGap : [0, 0.01]
                    }],
                    yAxis : [{
                        type : 'category',
                        data : []
                    }],
                    series: [{
                        name: '对比',
                        type: 'bar',
                        data: []
                    }, {
                        name: '当前',
                        type: 'bar',
                        data: []
                    }]
                };

                switch (self.mode) {
                    case 1:             //环比
                        var segDef = {
                            'day' : '日\n\n\n',
                            'week' : '周\n\n\n',
                            'month' : '月\n\n\n',
                            'quarter' : '季度\n\n\n',
                            'year' : '年\n\n\n',
                            'diy' : '自定义\n\n\n'
                        };
                        for (var key in data.data) {
                            options.yAxis[0].data.push(segDef[key]);
                            options.series[0].data.push(data.data[key].cmp);
                            options.series[1].data.push(data.data[key].cur);
                        }
                        options.yAxis[0].data = options.yAxis[0].data.reverse();
                        options.series[0].data = options.series[0].data.reverse();
                        options.series[1].data = options.series[1].data.reverse();
                        break;
                    case 2:             //在线曲线
                        options.legend.data = ['在线曲线'];
                        options.dataZoom = {
                            show: true,
                            realtime: true,
                            start: 0,
                            end: 100
                        };
                        options.xAxis[0].type = 'category';
                        options.xAxis[0].boundaryGap = false;
                        options.xAxis[0].data = [];
                        options.yAxis[0].type = 'value';
                        /*options.yAxis[0].axisLabel = {
                            formatter: '{value}人'
                        };*/
                        options.series = [{
                            name: '在线曲线',
                            type: 'line',
                            data: [],
                            markPoint: {
                                symbol: 'pin',
                                data : [{
                                    type: 'max', name: '最大值', symbolSize: 20
                                }, {
                                    type: 'min', name: '最小值', symbolSize: 20
                                }]
                            },
                            markLine: {
                                data : [{
                                    type: 'average', name: '平均值'
                                }]
                            }
                        }];
                        for (var key in data.data) {
                            options.xAxis[0].data.push(moment(new Date(data.data[key].time * 1000)).format('YYYY-MM-DD'));
                            options.series[0].data.push(parseInt(data.data[key].amount));

                            options.xAxis[0].data = options.xAxis[0].data.reverse();
                            options.series[0].data = options.series[0].data.reverse();
                        }
                        break;
                    case 3:             //TOP付费用户、流失用户、总流失用户环比
                        var segDef = {
                            'day' : '日\n\n\n',
                            'week' : '周\n\n\n',
                            'month' : '月\n\n\n',
                            'quarter' : '季度\n\n\n',
                            'year' : '年\n\n\n',
                            'diy' : '自定义\n\n\n'
                        };
                        for (var key in data.data) {
                            options.yAxis[0].data.push(segDef[key]);
                            options.series[0].data.push(data.data[key].cmp);
                            options.series[1].data.push(data.data[key].cur);
                        }
                        options.yAxis[0].data = options.yAxis[0].data.reverse();
                        options.series[0].data = options.series[0].data.reverse();
                        options.series[1].data = options.series[1].data.reverse();
                        break;
                    case 4:             //留存曲线
                        options.legend.data = ['留存曲线'];
                        options.dataZoom = {};
                        options.xAxis[0].type = 'category';
                        options.xAxis[0].boundaryGap = false;
                        options.xAxis[0].data = [];
                        options.yAxis[0].type = 'value';
                        options.yAxis[0].axisLabel = {formatter: '{value}%'};
                        options.tooltip = {
                            trigger: 'axis',
                            formatter: function (params) {console.log(params[0].seriesName);
                                return params[0].seriesName +
                                    '<br/>' +
                                    (1==params[0].name?"次":params[0].name) + '日留存：' +
                                    params[0].data + "%";
                            }
                        };
                        options.series = [{
                            name: '留存曲线',
                            type: 'line',
                            data: []
                        }];
                        for (var key in data.data) {
                            if (0 == key)
                                continue;
                            options.xAxis[0].data.push(data.data[key].time);
                            options.series[0].data.push((data.data[key].amount/data.data[0].amount*100).toFixed(2));

                            //options.xAxis[0].data = options.xAxis[0].data.reverse();
                            //options.series[0].data = options.series[0].data.reverse();
                        }
                        break;
                }
            }

            deferral.resolve(options);
        }
        function genDistChartData(deferral, data, params) {
            if (!verifyRet(data)) {
            } else {
                var options = {
                    animation: false,
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: []
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        x: '25%',
                                        width: '50%',
                                        funnelAlign: 'left',
                                        max: 1548
                                    }
                                }
                            },
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    series: [{
                        name: '',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '40%'],
                        data: []
                    }]
                };

                switch (self.mode) {
                    case 1:             //产品贡献结构
                        break;
                    case 2:             //渠道贡献结构
                        //按照从大到小排序
                        data.data.sort(byNum);
                        var index = 0;
                        var otherTotal = 0;
                        for (var key in data.data) {
                            if (index < 15) {
                                //options.legend.data.push(getChannelNameById(data.data[key].gid));
                                var seriesData = {
                                    value: data.data[key].amount,
                                    name: getChannelNameById(data.data[key].gid)
                                };
                                options.series[0].data.push(seriesData);
                            } else {
                                var amount = null==data.data[key].amount?0:parseInt(data.data[key].amount);
                                otherTotal += amount;
                            }
                            index++;
                        }
                        if (index >=15) {
                            //options.legend.data.push('其他');
                            options.series[0].data.push({value:otherTotal, name: '其他'});
                        }
                        options.series[0].name = "渠道贡献结构";
                        break;
                    case 3:             //分布结构(净新增付费用户、净新增用户（横向双柱状图）)
                        var tooltipTitle = 12 == params.dtype ? '净新增付费用户数' : (24 == params.dtype ? '净新增用户数' : '');
                        options.tooltip = {
                            trigger: 'axis',
                            formatter: function (params) {
                                return tooltipTitle +
                                    '<br/>新增：' + params[0].data +
                                    '<br/>流失：' + params[1].data +
                                    '<br/>净新增：' + (params[0].data - params[1].data);
                            }
                        };
                        options.legend = {data: ['新增', '流失']};
                        options.xAxis = [{
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        }];
                        options.yAxis = [{
                            type: 'category',
                            data: ['0~10元', '11~100元', '101~500元', '501~3000元', '3001~10000元', '10000元以上']
                        }];
                        options.series = [{
                            name: '新增',
                            type: 'bar',
                            data: [1, 2, 3, 4, 5, 6]
                        }, {
                            name: '流失',
                            type: 'bar',
                            data: [6, 5, 4, 3, 2, 1]
                        }];

                        break;
                    case 4:             //分布结构(付费用户、活跃用户（双饼图）)
                        console.log(params);
                        if (15 == params.dtype) {           //付费用户分布结构

                        } else if (27 == params.dtype) {    //活跃用户分布结构

                        }

                        var leftoption = options;
                        for (var key in data.data.left) {
                            options.legend.data.push(data.data.left[key].seg);
                            options.series[0].data.push({value:data.data.left[key].amount, name:data.data.left[key].seg});
                        }
                        var rightoption = options;
                        for (var key in data.data.right) {
                            options.legend.data.push(data.data.right[key].seg);
                            options.series[0].data.push({value:data.data.right[key].amount, name:data.data.right[key].seg});
                        }
                        options = [leftoption, rightoption];
                    case 5:             //分布结构(新增付费用户、流失付费用户、流失用户)
                        //按照从大到小排序
                        data.data.sort(byNum);
                        var index = 0;
                        var otherTotal = 0;
                        for (var key in data.data) {
                            if (index < 15) {
                                //options.legend.data.push(getChannelNameById(data.data[key].gid));
                                var seriesData = {
                                    value: data.data[key].amount,
                                    name: getChannelNameById(data.data[key].gid)
                                };
                                options.series[0].data.push(seriesData);
                            } else {
                                var amount = null==data.data[key].amount?0:parseInt(data.data[key].amount);
                                otherTotal += amount;
                            }
                            index++;
                        }
                        if (index >=15) {
                            //options.legend.data.push('其他');
                            options.series[0].data.push({value:otherTotal, name: '其他'});
                        }
                        //for (var key in data.data) {
                        //    options.legend.data.push(getChannelNameById(data.data[key].gid));
                        //    var seriesData = {
                        //        value: data.data[key].amount,
                        //        name: getChannelNameById(data.data[key].gid)
                        //    };
                        //    options.series[0].data.push(seriesData);
                        //}
                        options.series[0].name = "分布结构";
                        break;
                    case 6:             //分布结构(top付费用户、top流失用户、top总流失用户（单饼图）)
                        //按照从大到小排序
                        data.data.sort(byNum);
                        var index = 0;
                        var otherTotal = 0;
                        for (var key in data.data) {
                            if (index < 15) {
                                //options.legend.data.push(getChannelNameById(data.data[key].gid));
                                var seriesData = {
                                    value: data.data[key].amount,
                                    name: getChannelNameById(data.data[key].gid)
                                };
                                options.series[0].data.push(seriesData);
                            } else {
                                var amount = null==data.data[key].amount?0:parseInt(data.data[key].amount);
                                otherTotal += amount;
                            }
                            index++;
                        }
                        if (index >=15) {
                            //options.legend.data.push('其他');
                            options.series[0].data.push({value:otherTotal, name: '其他'});
                        }
                        options.series[0].name = "分布结构";
                        break;
                }
            }

            deferral.resolve(options);
        }
        function genTrendChartData(deferral, data, params) {
            if (verifyRet(data)) {
                var options = {
                    animation: false,
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend : {
                        data: ['趋势']
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            /*dataView : {show: true, readOnly: false},
                             magicType: {show: true, type: ['line', 'bar']},
                             restore : {show: true},*/
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [{
                        type : 'category',
                        boundaryGap : false,
                        data: []
                    }],
                    yAxis : [{
                        type : 'value',
                        //scale: true,
                        data : [],
                        axisLabel: {
                            formatter: function (value) {
                                if (value >= 100000) {
                                    return num2e(value);
                                } else {
                                    return value;
                                }
                            }
                        }
                    }],
                    series: [{
                        name: '趋势',
                        type: 'line',
                        data: [],
                        markPoint: {
                            symbol: 'pin',
                            data : [{
                                type: 'max', name: '最大值', symbolSize: 20
                            }, {
                                type: 'min', name: '最小值', symbolSize: 20
                            }]
                        }/*,
                        markLine: {
                            data : [{
                                type: 'average', name: '平均值'
                            }]
                        }*/
                    }],
                    dataZoom : {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                };

                switch (self.mode) {
                    case 1:             //趋势
                        for (var key in data.data) {
                            options.xAxis[0].data.push(moment(new Date(data.data[key].time * 1000)).format('YYYY-MM-DD'));
                            options.series[0].data.push(parseInt(data.data[key].amount));

                            options.xAxis[0].data = options.xAxis[0].data.reverse();
                            options.series[0].data = options.series[0].data.reverse();
                        }
                        break;
                    case 2:             //趋势(净新增付费用户、净新增用户（双面积曲线）)
                        options.legend.data = ["新增", "流失"];
                        options.series[0] = {
                            name: '新增',
                            type: 'line',
                            data: [],
                            itemStyle: {normal: {areaStyle: {type: 'default'}}}
                        };
                        options.series[1] = {
                            name: '流失',
                            type: 'line',
                            data: [],
                            itemStyle: {normal: {areaStyle: {type: 'default'}}}
                        };
                        for (var key in data.data.newRech) {
                            options.xAxis[0].data.push(moment(new Date(data.data.newRech[key].time * 1000)).format('YYYY-MM-DD'));
                            options.series[0].data.push(parseInt(data.data.newRech[key].amount));
                            undefined!=data.data.lostRech[key] && undefined!=data.data.lostRech[key].amount && options.series[1].data.push(parseInt(data.data.lostRech[key].amount));

                            options.xAxis[0].data = options.xAxis[0].data.reverse();
                            options.series[0].data = options.series[0].data.reverse();
                            options.series[1].data = options.series[1].data.reverse();
                        }
                        break;
                }
            }

            deferral.resolve(options);
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

        // 2 获取面板数据
        function getGameBoardData(param) {
            return getByJsonp(requestUrl, param, 2);
        }

        // 3 获取收入面板数据
        function getProfitByUnit(param) {
            return getByJsonp(requestUrl, param, 3);
        }

        // 4 获取最高xxx面板数据
        function getTopByToptype(param) {
            return getByJsonp(requestUrl, param, 4);
        }

        // 5 活跃留存面板数据
        function getRemainByDate(param) {
            return getByJsonp(requestUrl, param, 5);
        }

        // 6 环比数据
        function getChainChartData(param, mode) {
            self.mode = mode || 1;
            return getByJsonp(requestUrl, param, 6);
        }

        // 7 分布图/结构图数据
        function getDistChartData(param, mode) {
            self.mode = mode || 1;
            return getByJsonp(requestUrl, param, 7);
        }

        // 8 趋势
        function getTrendChartData(param, mode) {
            self.mode = mode || 1;
            return getByJsonp(requestUrl, param, 8);
        }

        // 9 获取渠道列表
        function getChannelList() {
            var param = {'act':'getData', 'datetype': 'channel'};
            return getByJsonp(requestUrl, param, 9);
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


        var gamedata = {
            overall: {
                profit: {
                    chain: 10.9,
                    num: 985647855,
                    topgid: 1
                },
                ol: {
                    pcu: {
                        chain: -3.41,
                        num: 72517859,
                        topgid: 2
                    },
                    cu: {
                        num: 36857859,
                        topgid: 3
                    }
                },
                people: {
                    netNewRech: {
                        chain: 6.7777,
                        num: 856217,
                        topgid: 4
                    },
                    rech: {
                        chain: -1.3,
                        num: 9925716,
                        topgid: 5
                    },
                    newRech: {
                        chain: 3.3,
                        num: 368579,
                        topgid: 6
                    },
                    lostRech: {
                        chain: 1.1,
                        num: 111222,
                        topgid: 7
                    },
                    netNew: {
                        chain: 9.9,
                        num: 632587856,
                        topgid: 1
                    },
                    active: {
                        chain: 6.6,
                        num: 258963,
                        topgid: 9
                    },
                    new: {
                        chain: 18.9,
                        num: 6859652,
                        topgid: 2
                    },
                    lost: {
                        chain: -1.1,
                        num: 332211,
                        topgid: 3
                    }
                }
            },
            specgame: {
                profit: {
                    income: {
                        chain: 10.9,
                        num: 985647855
                    },
                    arpu: {
                        num: 69875
                    },
                    ratio: {
                        num: 56.223
                    }
                },
                ol: {
                    pcu: {
                        chain: -3.41,
                        num: 72517859
                    },
                    cu: {
                        num: 36857859
                    }
                },
                people: {
                    netNewRech: {
                        chain: 6.7777,
                        num: 856217
                    },
                    rech: {
                        chain: -1.3,
                        num: 9925716
                    },
                    newRech: {
                        chain: 3.3,
                        num: 368579
                    },
                    lostRech: {
                        chain: 1.1,
                        num: 111222
                    },
                    netNew: {
                        chain: 9.9,
                        num: 632587856
                    },
                    active: {
                        chain: 6.6,
                        num: 258963
                    },
                    new: {
                        chain: 18.9,
                        num: 6859652
                    },
                    lost: {
                        chain: -1.1,
                        num: 332211
                    },
                    topRech: {
                        chain: -8.9,
                        num: 938271
                    },
                    topLost: {
                        chain: -1.9,
                        num: 938271
                    },
                    topLostTotal: {
                        chain: -0.8,
                        num: 2938271
                    }
                },
                remain: {
                    overall: {
                        d: 90.1,
                        w: 50.8,
                        dw: 30.8,
                        m: 15.6
                    },
                    active: {
                        d: 95.5,
                        w: 60.8,
                        dw: 35.6,
                        m: 16.0
                    },
                    rech: {
                        d: 98.6,
                        w: 70.9,
                        dw: 40.8,
                        m: 19.9
                    }
                }
            }
        };
        var datacatedata = {
            overall : {
                1: '收入',
                2: '最高在线',
                3: '当前在线',
                4: '净新增付费用户数',
                5: '付费用户数',
                6: '新增付费用户',
                7: '流失付费用户',
                8: '净新增用户数',
                9: '活跃用户数',
                10: '新增用户数',
                11: '流失用户数',
                12: '平均在线'
            },
            specgame: {
                1: '收入',
                2: 'ARPU',
                3: '付费比',
                4: '最高在线',
                5: '当前在线',
                6: '净新增付费用户数',
                7: '付费用户数',
                8: '新增付费用户',
                9: '流失付费用户',
                10: '净新增用户数',
                11: '活跃用户数',
                12: '新增用户数',
                13: '流失用户数',
                14: '付费用户数',
                15: '流失用户数',
                16: '总流失用户数',
                remain: {
                    1: '次日留存',
                    2: '周留存',
                    3: '双周留存',
                    4: '月留存'
                },
                17: '所有用户',
                18: '活跃玩家',
                19: '付费玩家'
            }
        };
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
                // Simulate async nature of real remote calls
                /////////////////////////////////////////
                //return $q.when(games);

                return $q.when(getGameList());
            },
            loadAllChannels : function() {
                /////////////////////////////////////////
                //return $q.when(channeldata);

                return $q.when(getChannelList());
            },
            loadAllGameData : function(param) {
                // Simulate async nature of real remote calls
                /////////////////////////////////////////
                //return $q.when(gamedata);

                return $q.when(getGameBoardData(param));
            },
            loadAllDataCategory: function() {
                return $q.when(datacatedata);
            },
            loadProfitByUnit: function(param) {
                return $q.when(getProfitByUnit(param));
            },
            loadTopByToptype: function(param) {
                return $q.when(getTopByToptype(param));
            },
            loadRemainByDate: function(param) {
                return $q.when(getRemainByDate(param));
            },
            loadChainChartData: function(param, mode) {
                return $q.when(getChainChartData(param, mode))
            },
            loadDistChartData: function(param, mode) {
                return $q.when(getDistChartData(param, mode));
            },
            loadTrendChartData: function(param, mode) {
                return $q.when(getTrendChartData(param, mode));
            }
        };

    }


    //function GameDataService($q) {
    //    var gamedata = {
    //        overall: {
    //            profit: {
    //                chain: 10.9,
    //                num: 985647855,
    //                topgid: 1
    //            },
    //            ol: {
    //                pcu: {
    //                    chain: -3.41,
    //                    num: 72517859,
    //                    topgid: 2
    //                },
    //                cu: {
    //                    num: 36857859,
    //                    topgid: 3
    //                }
    //            },
    //            people: {
    //                netNewRech: {
    //                    chain: 6.7777,
    //                    num: 856217,
    //                    topgid: 4
    //                },
    //                rech: {
    //                    chain: -1.3,
    //                    num: 9925716,
    //                    topgid: 5
    //                },
    //                newRech: {
    //                    chain: 3.3,
    //                    num: 368579,
    //                    topgid: 6
    //                },
    //                lostRech: {
    //                    chain: 1.1,
    //                    num: 111222,
    //                    topgid: 7
    //                },
    //                netNew: {
    //                    chain: 9.9,
    //                    num: 632587856,
    //                    topgid: 1
    //                },
    //                active: {
    //                    chain: 6.6,
    //                    num: 258963,
    //                    topgid: 9
    //                },
    //                new: {
    //                    chain: 18.9,
    //                    num: 6859652,
    //                    topgid: 2
    //                },
    //                lost: {
    //                    chain: -1.1,
    //                    num: 332211,
    //                    topgid: 3
    //                }
    //            }
    //        },
    //        specgame: {
    //            profit: {
    //                income: {
    //                    chain: 10.9,
    //                    num: 985647855
    //                },
    //                arpu: {
    //                    num: 69875
    //                },
    //                ratio: {
    //                    num: 56.223
    //                }
    //            },
    //            ol: {
    //                pcu: {
    //                    chain: -3.41,
    //                    num: 72517859
    //                },
    //                cu: {
    //                    num: 36857859
    //                }
    //            },
    //            people: {
    //                netNewRech: {
    //                    chain: 6.7777,
    //                    num: 856217
    //                },
    //                rech: {
    //                    chain: -1.3,
    //                    num: 9925716
    //                },
    //                newRech: {
    //                    chain: 3.3,
    //                    num: 368579
    //                },
    //                lostRech: {
    //                    chain: 1.1,
    //                    num: 111222
    //                },
    //                netNew: {
    //                    chain: 9.9,
    //                    num: 632587856
    //                },
    //                active: {
    //                    chain: 6.6,
    //                    num: 258963
    //                },
    //                new: {
    //                    chain: 18.9,
    //                    num: 6859652
    //                },
    //                lost: {
    //                    chain: -1.1,
    //                    num: 332211
    //                },
    //                topRech: {
    //                    chain: -8.9,
    //                    num: 938271
    //                },
    //                topLost: {
    //                    chain: -1.9,
    //                    num: 938271
    //                },
    //                topLostTotal: {
    //                    chain: -0.8,
    //                    num: 2938271
    //                }
    //            },
    //            remain: {
    //                overall: {
    //                    d: 90.1,
    //                    w: 50.8,
    //                    dw: 30.8,
    //                    m: 15.6
    //                },
    //                active: {
    //                    d: 95.5,
    //                    w: 60.8,
    //                    dw: 35.6,
    //                    m: 16.0
    //                },
    //                rech: {
    //                    d: 98.6,
    //                    w: 70.9,
    //                    dw: 40.8,
    //                    m: 19.9
    //                }
    //            }
    //        }
    //    };
    //
    //    // Promise-based API
    //    return {
    //        loadAllGameData : function() {
    //            // Simulate async nature of real remote calls
    //            return $q.when(gamedata);
    //        }
    //    };
    //}


    //function DataCateService($q) {
    //    var datacatedata = {
    //        overall : {
    //            1: '收入',
    //            2: '最高在线',
    //            3: '当前在线',
    //            4: '净新增付费用户数',
    //            5: '付费用户数',
    //            6: '新增付费用户数',
    //            7: '流失付费用户数',
    //            8: '净新增用户数',
    //            9: '活跃用户数',
    //            10: '新增用户数',
    //            11: '流失用户数'
    //        },
    //        specgame: {
    //            1: '收入',
    //            2: 'ARPU',
    //            3: '付费比',
    //            4: '最高在线',
    //            5: '当前在线',
    //            6: '净新增付费用户数',
    //            7: '付费用户数',
    //            8: '新增付费用户数',
    //            9: '流失付费用户数',
    //            10: '净新增用户数',
    //            11: '活跃用户数',
    //            12: '新增用户数',
    //            13: '流失用户数',
    //            14: '付费用户数',
    //            15: '流失用户数',
    //            16: '总流失用户数',
    //            remain: {
    //                1: '次日留存',
    //                2: '周留存',
    //                3: '双周留存',
    //                4: '月留存'
    //            },
    //            17: '所有用户',
    //            18: '活跃玩家',
    //            19: '付费玩家'
    //        }
    //    };
    //
    //    return {
    //        loadAllDataCategory: function() {
    //            return $q.when(datacatedata);
    //        }
    //    };
    //}



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