//== 代码生成示例-列表页
var mSampleGeneralList = function () {
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
                    title: '姓名'
                },
                {
                    field: 'sex',
                    title: '性别',
                    dictType: 'sex'
                },
                {
                    field: 'age',
                    title: '年龄'
                },
                {
                    field: 'phone',
                    title: '手机号码'
                },
                {
                    field: 'address',
                    title: '地址'
                },
                {
                    field: 'status',
                    title: '状态',
                    dictType: 'commonStatus'
                },
                {
                    field: 'editUser',
                    title: '编辑人'
                },
                {
                    field: 'editDate',
                    title: '编辑时间'
                },
                {
                    field: 'Actions',
                    width: 110,
                    title: '操作',
                    sortable: false,
                    locked: {
                        right: 'md'
                    },
                    template: function (row, index, datatable) {
                        var _btn = '';
                        if (KTTool.hasPermissions('sample:general:save')) {
                            _btn += '<a href="#" onclick="KTTool.editById(this, \'' + row.id + '\', \'' + row.name + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                        if (KTTool.hasPermissions('sample:general:delete')) {
                            _btn += '<a href="#" onclick="KTTool.deleteById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }

            ]
        };
        mSampleGeneralList.dataTable = KTTool.initDataTable(options);
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sample/general/');
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
    mSampleGeneralList.init();
});