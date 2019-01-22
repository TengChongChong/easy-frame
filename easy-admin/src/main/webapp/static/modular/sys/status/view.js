//== 系统状态
var mStatusList = function () {
    /**
     * 初始化图表
     *
     * @param selector {string} 选择器
     * @param data {array} 数据
     */
    var initCharts = function (selector, data) {
        var myChart = echarts.init($(selector)[0], 'westeros');
        var option = {

            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data,
                type: 'line'
            }]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    };
    return {
        //== 初始化页面
        init: function () {
            // mTool.setBaseUrl('/auth/sys/roles/');
            // initRolesTree();
            // initCharts('.cpu-charts', [10, 20, 30, 50, 60, 70, 80]);
            // initCharts('.jvm-charts', [10, 20, 30, 50, 60, 70, 80]);
        },
        /**
         * 初始化图表
         *
         * @param selector {string} 选择器
         * @param data {array} 数据
         */
        initCharts: function (selector, data){
            initCharts(selector, data);
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mStatusList.init();
});