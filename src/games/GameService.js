/**
 * Created by wangxufeng on 2015/4/27.
 */

(function(){
    'use strict';

    angular.module('games')
        .service('gameService', ['$q', GameService])
        .service('gameDataService', ['$q', GameDataService])
        .service('dataCateService', ['$q', DataCateService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
    function GameService($q) {
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


        // Promise-based API
        return {
            loadAllGames : function() {
                // Simulate async nature of real remote calls
                return $q.when(games);
            }
        };
    }


    function GameDataService($q) {
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
                        num: 985647855,
                        topgid: 1
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
                    },
                    topRech: {
                        chain: -8.9,
                        num: 938271,
                        topgid: 2
                    },
                    topLost: {
                        chain: -1.9,
                        num: 938271,
                        topgid: 2
                    },
                    topLostTotal: {
                        chain: -0.8,
                        num: 2938271,
                        topgid: 3
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

        // Promise-based API
        return {
            loadAllGameData : function() {
                // Simulate async nature of real remote calls
                return $q.when(gamedata);
            }
        };
    }


    function DataCateService($q) {
        var datacatedata = {
            overall : {
                1: '收入',
                2: '最高在线',
                3: '当前在线',
                4: '净新增付费用户数',
                5: '付费用户数',
                6: '新增付费用户数',
                7: '流失付费用户数',
                8: '净新增用户数',
                9: '活跃用户数',
                10: '新增用户数',
                11: '流失用户数'
            },
            specgame: {
                1: '收入',
                2: 'ARPU',
                3: '付费比',
                4: '最高在线',
                5: '当前在线',
                6: '净新增付费用户数',
                7: '付费用户数',
                8: '新增付费用户数',
                9: '流失付费用户数',
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
                17: '所有用户留存',
                18: '活跃玩家留存',
                19: '付费玩家留存'
            }
        };

        return {
            loadAllDataCategory: function() {
                return $q.when(datacatedata);
            }
        };
    }
})();