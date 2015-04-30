/**
 * Created by wangxufeng on 2015/4/27.
 */

(function(){
    'use strict';

    angular.module('games')
        .service('userService', ['$q', UserService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
    function UserService($q) {
        var users = [{
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
            loadAllUsers : function() {
                // Simulate async nature of real remote calls
                return $q.when(users);
            }
        };
    }

})();