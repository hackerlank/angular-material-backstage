/**
 * Created by wangxufeng on 2015/4/27.
 */
(function () {

    angular
        .module('modules')
        .controller('ModController', [
            'ModService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$scope', '$mdDialog', '$mdUtil', '$mdToast',
            ModController
        ]).directive('callDrawOverallLostChart', function () {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    element.bind('click', function() {
                        if (!$scope.IfCallDrawOverallLostChart) {
                            $scope.drawOverallLost();
                        }
                    });
                }
            }
        }).directive('callDrawLvLostChart', function () {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    element.bind('click', function() {
                        if (!$scope.IfCallDrawLvLostChart) {
                            setTimeout(function() {
                                $scope.drawLvLost();
                                $scope.drawCoreLvLost();
                            }, 500);
                        }
                    });
                }
            }
        }).directive('callDrawTaskLostChart', function () {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    element.bind('click', function() {

                    });
                }
            }
        }).directive('callDrawMapLostChart', function () {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    element.bind('click', function() {

                    });
                }
            }
        }).directive('callDrawOlDistChart', function () {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    element.bind('click', function() {
                        if (!$scope.IfCallDrawOlDistChart) {
                            $scope.drawOlDist1();
                            $scope.drawOlDist2();
                        }
                    });
                }
            }
        }).directive('callDrawJobDistChart', function () {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    element.bind('click', function() {
                        if (!$scope.IfCallDrawJobDistChart) {
                            $scope.drawJobDist1();
                            $scope.drawJobDist2();
                        }
                    });
                }
            }
        });


    function ModController(gameService, $mdSidenav, $mdBottomSheet, $log, $q, $scope, $mdDialog, $mdUtil, $mdToast) {
        var self = this;

        // controller params ↓
        // 初始化请求参数
        self.gid = 0;                       //默认全部

        $scope.IfCallDrawOverallLostChart = false;
        $scope.IfCallDrawLvLostChart = false;
        $scope.IfCallDrawTaskLostChart = false;
        $scope.IfCallDrawMapLostChart = false;
        $scope.IfCallDrawOlDistChart = false;
        $scope.IfCallDrawJobDistChart = false;

        $scope.curDate = '';
        $scope.newDate = function() {
            return new Date();
        };



        function reloadParam(act) {
            var act = act || 'getData';
            return {
                'act': act,
                'gid': self.gid,
                'datetype': self.datetype,
                'daterangeStart': self.daterangeStart,
                'daterangeEnd': self.daterangeEnd,
                'channel': self.channel,
                'platform': self.platform,
                'server': self.server,
                'dtype': self.dtype,
                'tD': self.tD,
                'tW': self.tW,
                'tM': self.tM,
                'tQ': self.tQ,
                'tY': self.tY,
                'tDS': self.tDS,
                'tDE': self.tDE,
                'cunit': $scope.misc.cunit,
                'topType': $scope.misc.topType,
                'AllRemainDate': self.allremaindate,
                'ActiveRemainDate': self.activeremaindate,
                'RechargersDate': self.rechremaindate
            };
        }

        // data manipulation ↑

        drawNpointLost();
        function drawNpointLost() {
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                legend: {
                    data: ['留存人数', '流失率']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['总人数', '点击下载', '下载成功', '下载注册', '注册登录']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} 人'
                        }
                    },
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: [

                    {
                        name: '留存人数',
                        type: 'bar',
                        data: [15000, 12000, 10000, 9000, 8000]
                    },
                    {
                        name: '流失率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [0, 15, 18, 22, 30, 35]
                    }
                ]
            };

            require(
                [
                    'echarts',
                    'echarts/theme/blue',
                    'echarts/chart/line',
                    'echarts/chart/bar'
                ],
                function (ec, theme) {
                    var myChart = ec.init(document.getElementById('npointLost'), theme);
                    myChart.setOption(option);
                }
            );
        }

        $scope.drawOverallLost = function() {
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[
                        '总账号数','流失账号数','流失率',
                    ]
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : ['实时','2日','3日','7日','14日']
                    },
                    {
                        type : 'category',
                        axisLine: {show:false},
                        axisTick: {show:false},
                        axisLabel: {show:false},
                        splitArea: {show:false},
                        splitLine: {show:false},
                        data : ['实时','2日','3日','7日','14日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel:{formatter:'{value} 人'}
                    },
                    {
                        type : 'value',
                        axisLabel:{formatter:'{value} %'}
                    }
                ],
                series : [
                    {
                        name:'总账号数',
                        type:'bar',
                        xAxisIndex:1,
                        //itemStyle: {normal: {color:'rgba(193,35,43,1)', label:{show:true}}},
                        data:[15000,12000,10000,9000,7000]
                    },
                    {
                        name:'流失账号数',
                        type:'bar',
                        //itemStyle: {normal: {color:'rgba(181,195,52,1)', label:{show:true}}},
                        data:[1000,1200,1400,1500,1700]
                    },
                    {
                        name: '流失率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [0, 15, 18, 22, 30, 35]
                    }
                ]
            };

            require(
                [
                    'echarts',
                    'echarts/theme/blue',
                    'echarts/chart/line',
                    'echarts/chart/bar'
                ],
                function (ec, theme) {
                    var myChart = ec.init(document.getElementById('overallLost'), theme);
                    myChart.setOption(option);
                    $scope.IfCallDrawOverallLostChart = true;
                }
            );
        }


        $scope.drawLvLost = function() {
            var xdata = [];
            var series1 = [];
            var series2 = [];
            var series3 = [];
            var series0 = [];
            var seriesLost = [];
            for (var i =1; i<=60; i++) {
                xdata.push(i);
                series1.push((70-i)*100);
                series2.push((70-i)*80);
                series3.push(i*100);
                series0.push(0);
                seriesLost.push(i*100/((70-i)*100));
            }

            var option = {
                timeline:{
                    data:[
                        '6-1','6-2','6-3','6-4','6-5'
                    ],
                    label : {
                        formatter : function(s) {
                            return s.slice(0, 4);
                        }
                    },
                    autoPlay : false,
                    playInterval : 1000
                },
                options: [{
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    legend: {
                        data: ['总账号数', '账号数', '流失账号数', '流失率']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: xdata
                        },
                        {
                            type: 'category',
                            axisLine: {show: false},
                            axisTick: {show: false},
                            axisLabel: {show: false},
                            splitArea: {show: false},
                            splitLine: {show: false},
                            data: xdata
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 人'
                            }
                        },
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '总账号数',
                            type: 'bar',
                            data: series1,
                            xAxisIndex: 1
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            type: 'bar',
                            data: series0
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }, {
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '总账号数',
                            type: 'bar',
                            data: series1,
                            xAxisIndex: 1
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            type: 'bar',
                            data: series0
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }, {
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '总账号数',
                            type: 'bar',
                            data: series1,
                            xAxisIndex: 1
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            type: 'bar',
                            data: series0
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }, {
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '总账号数',
                            type: 'bar',
                            data: series1,
                            xAxisIndex: 1
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            type: 'bar',
                            data: series0
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }, {
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '总账号数',
                            type: 'bar',
                            data: series1,
                            xAxisIndex: 1
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            type: 'bar',
                            data: series0
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }]
            };

            require(
                [
                    'echarts',
                    'echarts/theme/blue',
                    'echarts/chart/line',
                    'echarts/chart/bar'
                ],
                function (ec, theme) {
                    var myChart = ec.init(document.getElementById('lvLost'), theme);
                    myChart.setOption(option);
                    $scope.IfCallDrawLvLostChart = true;
                }
            );
        }

        $scope.drawCoreLvLost = function() {
            var xdata = [];
            var series1 = [];
            var series2 = [];
            var series3 = [];
            var series0 = [];
            var seriesLost = [];
            for (var i =1; i<=60; i++) {
                xdata.push(i);
                series1.push((70-i)*100);
                series2.push((70-i)*80);
                series3.push(i*100);
                series0.push(0);
                seriesLost.push(i*100/((70-i)*100));
            }

            var option = {
                timeline:{
                    data:[
                        '6-1','6-2','6-3','6-4','6-5'
                    ],
                    label : {
                        formatter : function(s) {
                            return s.slice(0, 4);
                        }
                    },
                    autoPlay : false,
                    playInterval : 1000
                },
                options: [{
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    legend: {
                        data: ['账号数', '流失账号数', '流失率']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: xdata
                        },
                        {
                            type: 'category',
                            axisLine: {show: false},
                            axisTick: {show: false},
                            axisLabel: {show: false},
                            splitArea: {show: false},
                            splitLine: {show: false},
                            data: xdata
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 人'
                            }
                        },
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }, {
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }, {
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }, {
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }, {
                    series: [
                        {
                            name: '流失账号数',
                            type: 'bar',
                            data: series3
                        },
                        {
                            name: '账号数',
                            type: 'bar',
                            data: series2,
                            xAxisIndex: 1
                        },
                        {
                            name: '流失率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesLost
                        }
                    ]
                }]
            };

            require(
                [
                    'echarts',
                    'echarts/theme/blue',
                    'echarts/chart/line',
                    'echarts/chart/bar'
                ],
                function (ec, theme) {
                    var myChart = ec.init(document.getElementById('coreLvLost'), theme);
                    myChart.setOption(option);
                    $scope.IfCallDrawLvLostChart = true;
                }
            );
        }


        $scope.drawOlDist1 = function() {
            var option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : 流失 {c} 人，占比： ({d}%)"
                },
                legend: {
                    x : 'center',
                    y : 'bottom',
                    data:['0-0.5','0.5-1','1-2','2-3','3-5','5-10','10-20','20以上']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel']
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                series : [
                    {
                        name:'面积模式',
                        type:'pie',
                        radius : [30, 110],
                        //center : ['75%', 200],
                        roseType : 'area',
                        data:[
                            {value:5000, name:'0-0.5'},
                            {value:4800, name:'0.5-1'},
                            {value:4100, name:'1-2'},
                            {value:4000, name:'2-3'},
                            {value:3500, name:'3-5'},
                            {value:3200, name:'5-10'},
                            {value:3000, name:'10-20'},
                            {value:2500, name:'20以上'}
                        ]
                    }
                ]
            };

            require(
                [
                    'echarts',
                    'echarts/theme/blue',
                    'echarts/chart/pie'
                ],
                function (ec, theme) {
                    var myChart = ec.init(document.getElementById('olDist1'), theme);
                    myChart.setOption(option);
                    $scope.IfCallDrawOlDistChart = true;
                }
            );
        }

        $scope.drawOlDist2 = function() {
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[
                        '账号数','流失账号数','流失率',
                    ]
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : ['0-0.5','0.5-1','1-2','2-3','3-5','5-10','10-20','20以上']
                    },
                    {
                        type : 'category',
                        axisLine: {show:false},
                        axisTick: {show:false},
                        axisLabel: {show:false},
                        splitArea: {show:false},
                        splitLine: {show:false},
                        data : ['0-0.5','0.5-1','1-2','2-3','3-5','5-10','10-20','20以上']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel:{formatter:'{value} 人'}
                    },
                    {
                        type : 'value',
                        axisLabel:{formatter:'{value} %'}
                    }
                ],
                series : [
                    {
                        name:'账号数',
                        type:'bar',
                        xAxisIndex:1,
                        //itemStyle: {normal: {color:'rgba(193,35,43,1)', label:{show:true}}},
                        data:[10000,9000,8000,7500,7000,6700,6000,5900]
                    },
                    {
                        name:'流失账号数',
                        type:'bar',
                        //itemStyle: {normal: {color:'rgba(181,195,52,1)', label:{show:true}}},
                        data:[5000,4800,4100,4000,3500,3200,3000,2500]
                    },
                    {
                        name: '流失率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [5000/10000, 4800/9000, 4100/8000, 4000/7500, 3500/7000, 3200/6700, 3000/6000, 2500/5900]
                    }
                ]
            };

            require(
                [
                    'echarts',
                    'echarts/theme/blue',
                    'echarts/chart/line',
                    'echarts/chart/bar'
                ],
                function (ec, theme) {
                    var myChart = ec.init(document.getElementById('olDist2'), theme);
                    myChart.setOption(option);
                    $scope.IfCallDrawOlDistChart = true;
                }
            );
        }


        $scope.drawJobDist1 = function() {
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['账号数','流失账号数']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                polar : [
                    {
                        indicator : [
                            { text: '职业A', max: 12000},
                            { text: '职业B', max: 12000},
                            { text: '职业C', max: 12000}
                        ]
                    }
                ],
                calculable : true,
                series : [
                    {
                        name: '职业流失',
                        type: 'radar',
                        data : [
                            {
                                value : [9000, 8300, 6500],
                                name : '账号数'
                            },
                            {
                                value : [973, 1562, 360],
                                name : '流失账号数'
                            }
                        ]
                    }
                ]
            };
            require(
                [
                    'echarts',
                    'echarts/theme/blue',
                    'echarts/chart/radar',
                ],
                function (ec, theme) {
                    var myChart = ec.init(document.getElementById('jobDist1'), theme);
                    myChart.setOption(option);
                    $scope.IfCallDrawJobDistChart = true;
                }
            );
        }


        $scope.drawJobDist2 = function() {
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[
                        '账号数','流失账号数','流失率',
                    ]
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : ['职业A','职业B','职业C']
                    },
                    {
                        type : 'category',
                        axisLine: {show:false},
                        axisTick: {show:false},
                        axisLabel: {show:false},
                        splitArea: {show:false},
                        splitLine: {show:false},
                        data : ['职业A','职业B','职业C']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel:{formatter:'{value} 人'}
                    },
                    {
                        type : 'value',
                        axisLabel:{formatter:'{value} %'}
                    }
                ],
                series : [
                    {
                        name:'账号数',
                        type:'bar',
                        xAxisIndex:1,
                        //itemStyle: {normal: {color:'rgba(193,35,43,1)', label:{show:true}}},
                        data:[10000,9000,8000]
                    },
                    {
                        name:'流失账号数',
                        type:'bar',
                        //itemStyle: {normal: {color:'rgba(181,195,52,1)', label:{show:true}}},
                        data:[5000,4800,4100]
                    },
                    {
                        name: '流失率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [5000/10000, 4800/9000, 4100/8000]
                    }
                ]
            };

            require(
                [
                    'echarts',
                    'echarts/theme/blue',
                    'echarts/chart/line',
                    'echarts/chart/bar'
                ],
                function (ec, theme) {
                    var myChart = ec.init(document.getElementById('jobDist2'), theme);
                    myChart.setOption(option);
                    $scope.IfCallDrawJobDistChart = true;
                }
            );
        }

        //hide loading overlay
        myjquery("#loading-overlay").fadeOut("slow");
    };
})();
