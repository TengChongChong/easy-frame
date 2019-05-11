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
                    field: 'id',
                    title: '#',
                    sortable: false, // 禁用此列排序
                    width: 40,
                    selector: {class: 'm-checkbox--solid m-checkbox--brand'},
                },
                {
                    field: 'jobId',
                    title: '任务id'
                },
                {
                    field: 'runDate',
                    title: '执行时间'
                },
                {
                    field: 'timeConsuming',
                    title: '耗时'
                },
                {
                    field: 'Actions',
                    width: 110,
                    title: '操作',
                    sortable: false,
                    overflow: 'visible',
                    locked: {
                        right: 'md'
                    },
                    template: function (row, index, datatable) {
                        var _btn = '';
                        if (mTool.hasPermissions('scheduler:job:log:save')) {
                            _btn += '<a href="#" onclick="mTool.editById(this, \'' + row.id + '\')" class="' + mTool.ACTIONS_DANGER + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                        return _btn;
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