//== 机构管理-列表页
var mDepartList = function () {
    var firstClick = true;
    var initDepartTypeTree = function () {
        $('#depart-type-tree').jstree({
            types: {
                default: {
                    icon: 'la la-bars'
                }
            },
            plugins: ['types'],
            core: {
                check_callback: true,
                data: {
                    url: function (node) {
                        var url = basePath + '/auth/sys/depart/type/select/all';
                        if ('#' != node.id) {
                            url += '?pId=' + node.id;
                        }
                        return url;
                    }
                }
            },
        }).on('activate_node.jstree', function (e, data) {
            activateNode(data.node)
        });
    };
    /**
     * 搜索
     */
    var search = function () {
        var permissionsTitle = $('#depart-type-title').val();
        if (KTUtil.isNotBlank(permissionsTitle)) {
            $('#depart-type-tree').addClass('kt-hide');
            $('#search-depart-type').removeClass('kt-hide');
            KTUtil.ajax({
                type: 'get',
                wait: '#search-depart-type',
                data: {
                    title: permissionsTitle
                },
                url: basePath + '/auth/sys/depart/type/search',
                success: function (res) {
                    var $tree = $('#search-depart-type').find('.tree');
                    if ($tree.jstree(true)) {
                        $tree.jstree(true).destroy();
                    }
                    $tree.jstree({
                        types: {
                            default: {
                                icon: 'la la-bars'
                            }
                        },
                        plugins: ['types'],
                        core: {
                            data: res.data
                        }
                    }).on('activate_node.jstree', function (e, data) {
                        activateNode(data.node);
                    });
                }
            });
        } else {
            KTTool.warnTip(KTTool.commonTips.fail, '请输入关键字搜索');
        }
    };
    /**
     * 树点击事件
     *
     * @param node
     */
    var activateNode = function (node) {
        if (KTUtil.isNotBlank(node.data)) {
            $('#typeCode').val(node.data);
            if (firstClick) {
                initTable();
                $('.kt-form').removeClass('kt-hide');
                firstClick = false;
            } else {
                $('.btn-search').click();
            }
        }
    };

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
                    selector: {class: 'kt-checkbox--solid'},
                },
                {
                    field: 'code',
                    title: '机构代码'
                },
                {
                    field: 'name',
                    title: '机构名称'
                },
                {
                    field: 'typeCode',
                    title: '机构类型'
                    // width: 60
                },
                {
                    field: 'orderNo',
                    title: '排序值',
                    sortable: 'asc',
                    width: 60
                },
                {
                    field: 'status',
                    title: '状态',
                    width: 60,
                    dictType: KTTool.commonDict // 这里设置机构类型名称{string}或机构{object}
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
                        if (KTTool.hasPermissions('sys:depart:save')) {
                            _btn += '<a href="#" onclick="KTTool.addData(this, \'新增机构\', null, \'' + row.id + '\')" class="' + KTTool.ACTIONS_SUCCESS + '" title="新增下级">\
                                <i class="la la-plus"></i>\
                            </a>\
                            <a href="#" onclick="KTTool.editById(this,\'' + row.id + '\', \'' + row.name + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="编辑">\
							    <i class="la la-edit"></i>\
						    </a>';
                        }
                        if (KTTool.hasPermissions('sys:depart:delete')) {
                            _btn += '<a href="#" onclick="KTTool.deleteById(this,\'' + row.id + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }
            ]
        };
        mDepartList.dataTable = KTTool.initDataTable(options);
    };

    /**
     * 新增
     */
    var addDepart = function () {
        KTApp.openPage('新增机构', KTTool.getBaseUrl() + 'add?typeCode=' + $('#typeCode').val());
    };
    /**
     * 新增下级
     *
     * @param pId {string} 上级id
     */
    var addSubDepart = function (pId) {
        KTApp.openPage('新增机构', KTTool.getBaseUrl() + 'add/' + pId);
    };


    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/depart/');
            initDepartTypeTree();
            $('#search-depart-type-btn').click(search);
            $('.back-btn').click(function () {
                $('#search-depart-type').addClass('kt-hide');
                $('#depart-type-tree').removeClass('kt-hide');
                $('#depart-type-title').val('');
            });
        },
        /**
         * 新增
         */
        addDepart: function () {
            addDepart();
        },
        /**
         * 新增下级
         *
         * @param pId {string} 上级id
         */
        addSubDepart: function (pId) {
            addSubDepart(pId);
        }
    };
}();
KTTab.needSubmitForm = function () {
    return true;
}
//== 初始化
$(document).ready(function () {
    mDepartList.init();
});