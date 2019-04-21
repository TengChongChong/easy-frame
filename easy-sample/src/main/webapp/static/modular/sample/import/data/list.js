//== 数据导出示例
var mExportDataList = function () {
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
                }
            ]
        };
        mExportDataList.dataTable = mTool.initDataTable(options);
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sample/import/data/');
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
    mExportDataList.init();
});