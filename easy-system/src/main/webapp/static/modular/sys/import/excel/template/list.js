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
                    selector: {class: 'm-checkbox--solid m-checkbox--brand'},
                },
                {
                    field: 'name',
                    title: '名称'
                },
                {
                    field: 'importCode',
                    title: '模板代码'
                },
                {
                    field: 'importTable',
                    title: '导入表'
                },
                {
                    field: 'startRow',
                    title: '起始行'
                },
                {
                    field: 'callback',
                    title: '回调'
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
                        if (mTool.hasPermissions('sys:import:excel:template:save')) {
                            _btn += '<a href="#" onclick="mTool.editById(this, \'' + row.id + '\', \'' + row.name + '\')" class="' + mTool.ACTIONS_INFO + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                            _btn += '<a href="#" onclick="mApp.openPage(\'' + row.name + '\', \'' + basePath + '/auth/sys/import/excel/template/details/list/' + row.id + '\')" class="' + mTool.ACTIONS_INFO + '" title="编辑导入规则">\
                                <i class="la la-gear"></i>\
                            </a>';
                        }
                        if (mTool.hasPermissions('sys:import:excel:template:delete')) {
                            _btn += '<a href="#" onclick="mTool.deleteById(this, \'' + row.id + '\')" class="' + mTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        _btn += '<a href="#" onclick="mSysImportExcelTemplateList.downloadTemplate(\'' + row.id + '\')" class="' + mTool.ACTIONS_SUCCESS + '" title="下载模板">\
                                <i class="la la-cloud-download"></i>\
                            </a>';
                        return _btn;
                    }
                }

            ]
        };
        mSysImportExcelTemplateList.dataTable = mTool.initDataTable(options);
    };
    /**
     * 下载模板
     *
     * @param templateId {number|string} 模板id
     */
    var downloadTemplate = function (templateId) {
        mTool.downloadFile(mTool.getBaseUrl() + '/download/template/' + templateId);
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/import/excel/template/');
            initTable();
        },
        /**
         * 下载模板
         *
         * @param templateId {number|string} 模板id
         */
        downloadTemplate: function (templateId) {
            downloadTemplate(templateId);
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
    mSysImportExcelTemplateList.init();
});