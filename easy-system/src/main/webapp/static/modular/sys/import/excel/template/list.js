//== 导入模板-列表页
var mSysImportExcelTemplateList = function () {
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
                    field: 'name',
                    title: '名称'
                },
                {
                    field: 'importCode',
                    title: '模板代码',
                    width: 200
                },
                {
                    field: 'permissionCode',
                    title: '权限代码'
                },
                {
                    field: 'dataSource',
                    title: '数据源'
                },
                {
                    field: 'importTable',
                    title: '导入表'
                },
                {
                    field: 'callback',
                    title: '回调',
                    width: 200
                },
                {
                    field: 'Actions',
                    width: 130,
                    title: '操作',
                    sortable: false,
                    overflow: 'visible',
                    locked: {
                        right: 'md'
                    },
                    template: function (row, index, datatable) {
                        var _btn = '';
                        if (KTTool.hasPermissions('sys:import:excel:template:save')) {
                            _btn += '<a href="#" onclick="KTTool.editById(this, \'' + row.id + '\', \'' + row.name + '\')" class="' + KTTool.ACTIONS_INFO + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                            _btn += '<a href="#" onclick="KTApp.openPage(\'' + row.name + '\', \'' + basePath + '/auth/sys/import/excel/template/details/list/' + row.id + '\')" class="' + KTTool.ACTIONS_INFO + '" title="编辑导入规则">\
                                <i class="la la-gear"></i>\
                            </a>';
                        }
                        if (KTTool.hasPermissions('sys:import:excel:template:delete')) {
                            _btn += '<a href="#" onclick="KTTool.deleteById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        _btn += '<a href="#" onclick="mSysImportExcelTemplateList.downloadTemplate(\'' + row.importCode + '\')" class="' + KTTool.ACTIONS_SUCCESS + '" title="下载模板">\
                                <i class="la la-cloud-download"></i>\
                            </a>';
                        return _btn;
                    }
                }

            ]
        };
        mSysImportExcelTemplateList.dataTable = KTTool.initDataTable(options);
    };
    /**
     * 下载模板
     *
     * @param importCode {string} 模板代码
     */
    var downloadTemplate = function (importCode) {
        KTTool.downloadFile(KTTool.getBaseUrl() + '/download/template/' + importCode);
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/import/excel/template/');
            initTable();
        },
        /**
         * 下载模板
         *
         * @param importCode {string} 模板代码
         */
        downloadTemplate: function (importCode) {
            downloadTemplate(importCode);
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
    mSysImportExcelTemplateList.init();
});