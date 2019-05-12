//== 定时任务执行日志-列表页
var mSchedulerJobLogList = function () {
    /**
     * 初始化列表
     */
    var initTable = function () {
        var options = {
            // 列配置
            columns: [
                {
                    field: 'runDate',
                    title: '执行时间'
                },
                {
                    field: 'timeConsuming',
                    title: '耗时（单位：秒）',
                    template: function (row, index, datatable) {
                        return row.timeConsuming / 1000.0
                    }
                }
            ]
        };
        mSchedulerJobLogList.dataTable = mTool.initDataTable(options);
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/scheduler/job/log/');
            initTable();
        }
    };
}();
/**
 * 当前tab激活时是否需要重新加载数据
 *
 * @return {boolean} true/false
 */
mTab.needSubmitForm = function () {
    return true;
};
//== 初始化
$(document).ready(function () {
    mSchedulerJobLogList.init();
});