//== 导入临时表-列表页
var mSysImportExcelTemporaryList = function () {
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
                    field: 'templateId',
                    title: '模板id'
                },
                {
                    field: 'userId',
                    title: '导入用户id'
                },
                {
                    field: 'verificationResults',
                    title: '验证结果'
                },
                {
                    field: 'field1',
                    title: '导入字段'
                },
                {
                    field: 'field2',
                    title: '导入字段'
                },
                {
                    field: 'field3',
                    title: '导入字段'
                },
                {
                    field: 'field4',
                    title: '导入字段'
                },
                {
                    field: 'field5',
                    title: '导入字段'
                },
                {
                    field: 'field6',
                    title: '导入字段'
                },
                {
                    field: 'field7',
                    title: '导入字段'
                },
                {
                    field: 'field8',
                    title: '导入字段'
                },
                {
                    field: 'field9',
                    title: '导入字段'
                },
                {
                    field: 'field10',
                    title: '导入字段'
                },
                {
                    field: 'field11',
                    title: '导入字段'
                },
                {
                    field: 'field12',
                    title: '导入字段'
                },
                {
                    field: 'field13',
                    title: '导入字段'
                },
                {
                    field: 'field14',
                    title: '导入字段'
                },
                {
                    field: 'field15',
                    title: '导入字段'
                },
                {
                    field: 'field16',
                    title: '导入字段'
                },
                {
                    field: 'field17',
                    title: '导入字段'
                },
                {
                    field: 'field18',
                    title: '导入字段'
                },
                {
                    field: 'field19',
                    title: '导入字段'
                },
                {
                    field: 'field20',
                    title: '导入字段'
                },
                {
                    field: 'field21',
                    title: '导入字段'
                },
                {
                    field: 'field22',
                    title: '导入字段'
                },
                {
                    field: 'field23',
                    title: '导入字段'
                },
                {
                    field: 'field24',
                    title: '导入字段'
                },
                {
                    field: 'field25',
                    title: '导入字段'
                },
                {
                    field: 'field26',
                    title: '导入字段'
                },
                {
                    field: 'field27',
                    title: '导入字段'
                },
                {
                    field: 'field28',
                    title: '导入字段'
                },
                {
                    field: 'field29',
                    title: '导入字段'
                },
                {
                    field: 'field30',
                    title: '导入字段'
                },
                {
                    field: 'field31',
                    title: '导入字段'
                },
                {
                    field: 'field32',
                    title: '导入字段'
                },
                {
                    field: 'field33',
                    title: '导入字段'
                },
                {
                    field: 'field34',
                    title: '导入字段'
                },
                {
                    field: 'field35',
                    title: '导入字段'
                },
                {
                    field: 'field36',
                    title: '导入字段'
                },
                {
                    field: 'field37',
                    title: '导入字段'
                },
                {
                    field: 'field38',
                    title: '导入字段'
                },
                {
                    field: 'field39',
                    title: '导入字段'
                },
                {
                    field: 'field40',
                    title: '导入字段'
                },
                {
                    field: 'field41',
                    title: '导入字段'
                },
                {
                    field: 'field42',
                    title: '导入字段'
                },
                {
                    field: 'field43',
                    title: '导入字段'
                },
                {
                    field: 'field44',
                    title: '导入字段'
                },
                {
                    field: 'field45',
                    title: '导入字段'
                },
                {
                    field: 'field46',
                    title: '导入字段'
                },
                {
                    field: 'field47',
                    title: '导入字段'
                },
                {
                    field: 'field48',
                    title: '导入字段'
                },
                {
                    field: 'field49',
                    title: '导入字段'
                },
                {
                    field: 'field50',
                    title: '导入字段'
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
                        if (mTool.hasPermissions('sys:import:excel:temporary:delete')) {
                            _btn += '<a href="#" onclick="mTool.deleteById(this, \'' + row.id + '\')" class="' + mTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }

            ]
        };
        mSysImportExcelTemporaryList.dataTable = mTool.initDataTable(options);
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/import/excel/temporary/');
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
    mSysImportExcelTemporaryList.init();
});