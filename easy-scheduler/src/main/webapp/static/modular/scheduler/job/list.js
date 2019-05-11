//== 定时任务 -列表页
var mSchedulerJobList = function () {
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
                    field: 'name',
                    title: '名称'
                },
                {
                    field: 'cron',
                    title: 'cron表达式'
                },
                {
                    field: 'bean',
                    title: 'bean'
                },
                {
                    field: 'method',
                    title: 'method'
                },
                {
                    field: 'status',
                    title: '状态',
                    dictType: 'commonStatus'
                },
                {
                    field: 'editUser',
                    title: '修改人'
                },
                {
                    field: 'editDate',
                    title: '修改时间'
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
                        if (mTool.hasPermissions('scheduler:job:save')) {
                            _btn += '<a href="#" onclick="mTool.editById(this, \'' + row.id + '\')" class="' + mTool.ACTIONS_DANGER + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                        if (mTool.hasPermissions('scheduler:job:delete')) {
                            _btn += '<a href="#" onclick="mTool.deleteById(this, \'' + row.id + '\')" class="' + mTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }

            ]
        };
        mSchedulerJobList.dataTable = mTool.initDataTable(options);
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/scheduler/job/');
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
    mSchedulerJobList.init();
});