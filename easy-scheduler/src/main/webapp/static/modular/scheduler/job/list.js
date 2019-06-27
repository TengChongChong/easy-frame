//== 定时任务 -列表页
var mSchedulerJobList = function () {
    /**
     * 初始化列表
     */
    var initTable = function () {
        // 是否有修改任务权限
        var hasSavePermissions = KTTool.hasPermissions('scheduler:job:save');
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
                    field: 'name',
                    title: '名称'
                },
                {
                    field: 'code',
                    title: '代码'
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
                    template: function (row) {
                        if (hasSavePermissions) {
                            return '<span class="kt-switch kt-switch--sm kt-switch--icon">\
                                    <label>\
                                        <input data-id="' + row.id + '" type="checkbox" ' + (1 === row.status ? 'checked="checked"' : '') + ' name="status">\
                                        <span></span>\
                                    </label>\
                                </span>';
                        } else {
                            return KTTool.getDictElement(row.status, KTTool.getSysDictsObject('schedulerJobStatus'));
                        }
                    }
                },
                {
                    field: 'lastRunDate',
                    title: '上次执行时间',
                    width: 140
                },
                {
                    field: 'Actions',
                    width: 100,
                    title: '操作',
                    sortable: false,
                    overflow: 'visible',
                    locked: {
                        right: 'md'
                    },
                    template: function (row, index, datatable) {
                        var _btn = '';
                        if (KTTool.hasPermissions('scheduler:job:save')) {
                            _btn += '<a href="#" onclick="KTTool.editById(this, \'' + row.id + '\', \'' + row.name + '\')" class="' + KTTool.ACTIONS_INFO + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                        if (KTTool.hasPermissions('scheduler:job:delete')) {
                            _btn += '<a href="#" onclick="KTTool.deleteById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        if (KTTool.hasPermissions('scheduler:job:log:select')) {
                            _btn += '<a href="#" onclick="KTApp.openPage(\'' + row.name + '执行日志\', \'' + basePath + '/auth/scheduler/job/log/list/' + row.id + '\')" class="' + KTTool.ACTIONS_INFO + '" title="查看日志">\
                                <i class="la la-file-text"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }

            ]
        };
        mSchedulerJobList.dataTable = KTTool.initDataTable(options);
    };
    /**
     * 绑定启用&暂停任务事件
     */
    var bindClickStatus = function () {
        mSchedulerJobList.dataTable.on('click', '[name="status"]', function () {
            if ($(this).is(':checked')) {
                mSchedulerJobList.startJob(this, $(this).data('id'));
            } else {
                mSchedulerJobList.pauseJob(this, $(this).data('id'));
            }
        });
    };
    /**
     * 开启任务
     *
     * @param el {element} 按钮对象
     * @param id {number|null} 任务id,如果为空则开启全部任务
     */
    var startJob = function (el, id) {
        var url = KTTool.getBaseUrl() + 'start/';
        if (KTUtil.isBlank(id)) {
            url += 'all';
        } else {
            url += id;
        }
        KTUtil.ajax({
            url: url,
            success: function (res) {
                KTTool.selectData(el);
                KTTool.successTip(KTTool.commonTips.success, '任务已开启');
            }
        });
    };
    /**
     * 暂停任务
     *
     * @param el {element} 按钮对象
     * @param id {number|null} 任务id,如果为空则暂停全部任务
     */
    var pauseJob = function (el, id) {
        var url = KTTool.getBaseUrl() + 'pause/';
        if (KTUtil.isBlank(id)) {
            url += 'all';
        } else {
            url += id;
        }
        KTUtil.ajax({
            url: url,
            success: function (res) {
                KTTool.selectData(el);
                KTTool.successTip(KTTool.commonTips.success, '任务已暂停');
            }
        });
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/scheduler/job/');
            initTable();
            bindClickStatus();
        },
        /**
         * 开启任务
         *
         * @param el {element} 按钮对象
         * @param id {number|null} 任务id,如果为空则开启全部任务
         */
        startJob: function (el, id) {
            startJob(el, id);
        },
        /**
         * 暂停任务
         *
         * @param el {element} 按钮对象
         * @param id {number|null} 任务id,如果为空则暂停全部任务
         */
        pauseJob: function (el, id) {
            pauseJob(el, id);
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
    mSchedulerJobList.init();
});