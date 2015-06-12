/**
 * Created by wangxufeng on 2015/4/27.
 */
(function () {

    angular
        .module('modules')
        .controller('ModController', [
            'ModService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$scope', '$mdDialog', '$mdUtil', '$mdToast',
            ModController
        ]);



    function ModController(gameService, $mdSidenav, $mdBottomSheet, $log, $q, $scope, $mdDialog, $mdUtil, $mdToast) {
        var self = this;

        // controller params ↓
        // 初始化请求参数
        self.gid = 0;                       //默认全部


        function reloadParam(act) {
            var act = act || 'getData';
            return {
                'act': act,
                'gid': self.gid,
                'datetype' : self.datetype,
                'daterangeStart' : self.daterangeStart,
                'daterangeEnd' : self.daterangeEnd,
                'channel' : self.channel,
                'platform' : self.platform,
                'server' : self.server,
                'dtype' : self.dtype,
                'tD' : self.tD,
                'tW' : self.tW,
                'tM' : self.tM,
                'tQ' : self.tQ,
                'tY' : self.tY,
                'tDS' : self.tDS,
                'tDE' : self.tDE,
                'cunit' : $scope.misc.cunit,
                'topType' : $scope.misc.topType,
                'AllRemainDate' : self.allremaindate,
                'ActiveRemainDate' : self.activeremaindate,
                'RechargersDate' : self.rechremaindate
            };
        }
        // data manipulation ↑



  	};
})();
