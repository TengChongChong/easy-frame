//== 任务 -列表页
var SysTaskList = function () {
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
                    selector: {class: 'kt-checkbox--solid'},
                },
                {
                    field: 'title',
                    title: '标题'
                },
                {
                    field: 'strDate',
                    title: '开始时间'
                },
                {
                    field: 'endDate',
                    title: '结束时间'
                },
                {
                    field: 'url',
                    title: '任务url'
                },
                {
                    field: 'receiver',
                    title: '接收人'
                },
                {
                    field: 'status',
                    title: '状态'
                },
                {
                    field: 'releaseDate',
                    title: '发布时间'
                },
                {
                    field: 'editUser',
                    title: '更新人'
                },
                {
                    field: 'editDate',
                    title: '更新时间'
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
                        if (KTTool.hasPermissions('sys:task:save')) {
                            _btn += '<a href="#" onclick="KTTool.editById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_INFO + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                        if (KTTool.hasPermissions('sys:task:delete')) {
                            _btn += '<a href="#" onclick="KTTool.deleteById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }

            ]
        };
        SysTaskList.dataTable = KTTool.initDataTable(options);
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/task/');
            initTable();
        }
    };
}();
/**
 * 当前tab激活时是否需要重新加载数据
 *
 * @return {boolean} true/false
 */
KTTab.needSubmitForm = function () {
    return true;
};
//== 初始化
$(document).ready(function () {
    SysTaskList.init();
});