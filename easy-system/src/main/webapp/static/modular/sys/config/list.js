//== 系统参数-列表页
var mSysConfigList = function () {
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
                    selector: {class: 'kt-checkbox--solid'}
                },
                {
                    field: 'sysKey',
                    title: 'key',
                    sortable: 'asc'
                },
                {
                    field: 'value',
                    title: 'value',
                    width: 100
                },
                {
                    field: 'type',
                    title: '类型',
                    width: 50,
                    dictType: 'dataType'
                },
                {
                    field: 'tips',
                    title: '备注',
                    width: 340
                },
                {
                    field: 'Actions',
                    width: 60,
                    title: '操作',
                    sortable: false,
                    locked: {
                        right: 'md'
                    },
                    template: function (row, index, datatable) {
                        var _btn = '';
                        if (KTTool.hasPermissions('sys:config:save')) {
                            _btn += '<a href="#" onclick="KTTool.editById(this, \'' + row.id + '\', \'' + row.sysKey + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                        if (KTTool.hasPermissions('sys:config:delete')) {
                            _btn += '<a href="#" onclick="KTTool.deleteById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }

            ]
        };
        mSysConfigList.dataTable = KTTool.initDataTable(options);
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/config/');
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
    mSysConfigList.init();
});