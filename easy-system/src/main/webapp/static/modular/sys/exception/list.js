//== 异常日志-列表页
var mSysExceptionList = function () {
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
                    selector: {class: 'kt-checkbox--solid kt-checkbox--brand'},
                },
                {
                    field: 'code',
                    title: '错误代码',
                    width: 60
                },
                {
                    field: 'type',
                    title: '异常类型',
                    width: 300
                },
                {
                    field: 'message',
                    title: '错误信息',
                    width: 300
                },
                {
                    field: 'url',
                    title: '请求地址',
                    width: 200
                },
                {
                    field: 'nickname',
                    title: '触发用户'
                },
                {
                    field: 'triggerTime',
                    title: '触发时间',
                    width: 150,
                    locked: {
                        right: 'md'
                    }
                },
                {
                    field: 'Actions',
                    width: 50,
                    title: '操作',
                    sortable: false,
                    overflow: 'visible',
                    locked: {
                        right: 'md'
                    },
                    template: function (row, index, datatable) {
                        var _btn = '';
                        _btn += '<a href="#" onclick="KTTool.editById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_INFO + '" title="查看">\
                            <i class="la la-search"></i>\
                        </a>';
                        if (KTTool.hasPermissions('sys:exception:delete')) {
                            _btn += '<a href="#" onclick="KTTool.deleteById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }

            ]
        };
        mSysExceptionList.dataTable = KTTool.initDataTable(options);
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/exception/');
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
    mSysExceptionList.init();
});