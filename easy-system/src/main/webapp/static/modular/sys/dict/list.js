//== 字典管理-列表页
var mDictList = function () {
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
                    field: 'code',
                    title: '字典编码',
                },
                {
                    field: 'name',
                    title: '字典名称',
                },
                {
                    field: 'dictType',
                    title: '字典类型',
                },
                {
                    field: 'css',
                    title: 'Classes',
                    width: 60,
                    template: function (row, index, datatable) {
                        if (mUtil.isNotBlank(row.css)) {
                            return '<span class="m-badge ' + row.css + ' m-badge--wide"></span>';
                        } else {
                            return '--';
                        }
                    }
                },
                {
                    field: 'orderNo',
                    title: '排序值',
                    sortable: 'asc',
                    width: 65
                },
                {
                    field: 'status',
                    title: '状态',
                    width: 60,
                    dictType: mTool.commonDict // 这里设置字典类型名称{string}或字典{object}
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
                        if (mTool.hasPermissions('sys:dict:add')) {
                            _btn += '<a href="#" onclick="mTool.addData(this, \'新增字典\', null,  ' + row.id + ')" class="' + mTool.ACTIONS_SUCCESS + '" title="新增下级">\
                                <i class="la la-plus"></i>\
                            </a>';
                        }
                        if (mTool.hasPermissions('sys:dict:delete')) {
                            _btn += '<a href="#" onclick="mTool.editById(this, ' + row.id + ', \'' + row.name + '\')" class="' + mTool.ACTIONS_ACCENT + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                        if (mTool.hasPermissions('sys:dict:save')) {
                            _btn += '<a href="#" onclick="mTool.deleteById(this, ' + row.id + ')" class="' + mTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }
            ]
        };
        mDictList.dataTable = mTool.initDataTable(options);
    };
    /**
     * 生成静态文件
     */
    var generateDictData = function () {
        mUtil.alertConfirm('确定要生成静态文件吗？', '此操作会将数据库中字典数据生成js文件', function () {
            mUtil.ajax({
                url: mTool.getBaseUrl() + 'generate/dict/data',
                success: function (res) {
                    mTool.successTip(mTool.commonTips.success, '静态文件生成成功');
                }
            });
        });
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/dict/');
            initTable();
        },
        /**
         * 生成静态文件
         */
        generateDictData: function () {
            generateDictData();
        }
    };
}();
mTab.needSubmitForm = function () { return true; };
//== 初始化
$(document).ready(function () {
    mDictList.init();
});