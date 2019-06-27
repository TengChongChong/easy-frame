//== 日志 -列表页
var SysLogList = function () {
    /**
     * 初始化列表
     */
    var initTable = function () {
        var options = {
            // 列配置
            columns: [
                {
                    field: 'modular',
                    title: '模块'
                },
                {
                    field: 'method',
                    title: '方法'
                },
                {
                    field: 'ip',
                    title: 'ip'
                },
                {
                    field: 'uri',
                    title: 'uri'
                },
                {
                    field: 'clazz',
                    title: 'class',
                    width: 200,
                    template: function (row, index, datatable) {
                        return row.clazz.substr(row.clazz.lastIndexOf('.') + 1) + '.' + row.methodName + '()';
                    }
                },
                {
                    field: 'operationUser',
                    title: '操作人'
                },
                {
                    field: 'operationDate',
                    title: '操作时间'
                },
                {
                    field: 'Actions',
                    width: 30,
                    title: '操作',
                    sortable: false,
                    overflow: 'visible',
                    locked: {
                        right: 'md'
                    },
                    template: function (row, index, datatable) {
                        return '<a href="#" onclick="KTTool.editById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_INFO + '" title="查看">\
                                <i class="la la-search"></i>\
                            </a>';
                    }
                }

            ]
        };
        SysLogList.dataTable = KTTool.initDataTable(options);
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/log/');
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
    SysLogList.init();
});