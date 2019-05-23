//== 字典管理-列表页
var mDictTypeList = function () {
    var initTable = function () {
        var options = {
            // 列配置
            columns: [
                {
                    field: 'id',
                    title: '#',
                    sortable: false, // 禁用此列排序
                    width: 40,
                    class: 'text-center',
                    selector: {class: 'kt-checkbox--solid kt-checkbox--brand'},
                    edit: {
                        tag: 'input',
                        type: 'hidden'
                    }
                },
                {
                    field: 'type',
                    title: '字典类型',
                    edit: {
                        tag: 'input',
                        type: 'text'
                    }
                },
                {
                    field: 'name',
                    title: '字典类型名称',
                    edit: {
                        tag: 'input',
                        type: 'text'
                    }
                },
                {
                    field: 'status',
                    title: '状态',
                    dictType: KTTool.commonDict, // 这里设置字典类型名称{string}或字典{object}
                    edit: {
                        tag: 'select',
                        option: KTTool.commonDict,
                        default: '1'
                    }

                },
                {
                    field: 'actions',
                    width: 110,
                    title: '操作',
                    sortable: false,
                    overflow: 'visible',
                    edit: {
                        tag: 'button',
                        title: '保存',
                        text: '<i class="la la-save"></i>',
                        click: function (row, data) {
                            saveDictType(row, data);
                        }
                    },
                    template: function (row, index, datatable) {
                        var _btn = '';
                        if (KTTool.hasPermissions('sys:dict:type:save')) {
                            _btn += '<a href="#" onclick="mDictTypeList.editDictType(this)" class="' + KTTool.ACTIONS_SUCCESS + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                        if (KTTool.hasPermissions('sys:dict:type:delete')) {
                            _btn += '<a href="#" onclick="mDictTypeList.deleteDictType(this, ' + row.id + ')" class="' + KTTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
						return _btn;
                    },
                }],
        };
        mDictTypeList.dataTable = KTTool.initDataTable(options)
    };
    /**
     * 保存字典类别
     *
     * @param row {element} 数据所在行
     * @param data {object} 数据
     */
    var saveDictType = function (row, data) {
        var ajaxParams = {
            wait: row,
            data: data,
            needAlert: false,
            url: KTTool.getBaseUrl() + KTTool.urlSuffix.saveData,
            fail: function(res){
                toastr.warning(res.message, '操作失败');
            },
            success: function (res) {
                toastr.success('字典类型保存成功', '操作成功');
                row.find('td:eq(0)').find('input').val(res.data.id);
                row.attr('data-id', res.data.id);
            }
        };
        KTUtil.ajax(ajaxParams);
    };
    /**
     * 添加字典类别
     */
    var addDictType = function () {
        mDictTypeList.dataTable.addRow();
    };

    /**
     * 添加字典类别
     *
     * @param element {object} 编辑按钮
     */
    var editDictType = function (element) {
        $(element).tooltip('hide');
        mDictTypeList.dataTable.editRow(element);
    };

    /**
     * 删除字典类别
     *
     * @param element {object} 删除按钮
     * @param id {string} 要删除的数据id
     */
    var deleteDictType = function (element, id) {
        KTUtil.alertConfirm(KTTool.commonTips.delete.title, KTTool.commonTips.delete.subtitle, function () {
            var row = $(element).parents('tr.m-datatable__row');
            var ajaxParams = {
                wait: row,
                needAlert: false,
                url: KTTool.getBaseUrl() + KTTool.urlSuffix.deleteById + id,
                fail: function(res){
                    toastr.errorTip(res.message, KTTool.commonTips.fail);
                },
                success: function (res) {
                    KTTool.successTip('字典类型删除成功', KTTool.commonTips.success);
                    mDictTypeList.dataTable.row(row);
                    mDictTypeList.dataTable.remove();
                }
            };
            KTUtil.ajax(ajaxParams);
        });
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/dict/type/');
            initTable();
        },
        /**
         * 添加字典类别
         */
        addDictType: function () {
            addDictType();
        },
        /**
         * 添加字典类别
         */
        editDictType: function (element) {
            editDictType(element);
        },
        /**
         * 删除字典类别
         *
         * @param element {objct} 删除按钮
         * @param id {string} 要删除的数据id
         */
        deleteDictType: function (element, id) {
            deleteDictType(element, id);
        }

    };
}();

//== 初始化
$(document).ready(function () {
    mDictTypeList.init();
});