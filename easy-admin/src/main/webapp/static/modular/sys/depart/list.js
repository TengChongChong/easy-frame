//== 机构管理-列表页
let mDepartList = function () {
    let firstClick = true;
    let initDepartTypeTree = function () {
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
                        let url = basePath + '/auth/sys/depart/type/select/all';
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
    let search = function () {
        let permissionsTitle = $('#depart-type-title').val();
        if (mUtil.isNotBlank(permissionsTitle)) {
            $('#depart-type-tree').addClass('m--hide');
            $('#search-depart-type').removeClass('m--hide');
            mUtil.ajax({
                type: 'get',
                wait: '#search-depart-type',
                data: {
                    title: permissionsTitle
                },
                url: basePath + '/auth/sys/depart/type/search',
                success: function (res) {
                    let $tree = $('#search-depart-type').find('.tree');
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
            mTool.warnTip(mTool.commonTips.fail, '请输入关键字搜索');
        }
    };
    /**
     * 树点击事件
     *
     * @param node
     */
    let activateNode = function (node) {
        if (mUtil.isNotBlank(node.data)) {
            $('#typeCode').val(node.data);
            if (firstClick) {
                initTable();
                $('.m-form').removeClass('m--hide');
                firstClick = false;
            } else {
                $('.btn-search').click();
            }
        }
    };

    /**
     * 初始化列表
     */
    let initTable = function () {
        let options = {
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
                    title: '机构代码',
                },
                {
                    field: 'name',
                    title: '机构名称',
                },
                {
                    field: 'typeCode',
                    title: '机构类型',
                    width: 60
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
                    dictType: mTool.commonDict // 这里设置机构类型名称{string}或机构{object}
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
                        let _btn = '';
                        if (mTool.hasPermissions('sys:depart:save')) {
                            _btn += '<a href="#" onclick="mTool.addData(this, \'新增机构\', null,  ' + row.id + ')" class="' + mTool.ACTIONS_SUCCESS + '" title="新增下级">\
                                <i class="la la-plus"></i>\
                            </a>\
                            <a href="#" onclick="mTool.editById(this, ' + row.id + ', \'' + row.name + '\')" class="' + mTool.ACTIONS_DANGER + '" title="编辑">\
							    <i class="la la-edit"></i>\
						    </a>';
                        }
                        if (mTool.hasPermissions('sys:depart:delete')) {
                            _btn += '<a href="#" onclick="mTool.deleteById(this, ' + row.id + ')" class="' + mTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }
            ]
        };
        mDepartList.dataTable = mTool.initDataTable(options);
    };

    /**
     * 新增
     */
    let addDepart = function () {
        mApp.openPage('新增机构', mTool.getBaseUrl() + 'add?typeCode=' + $('#typeCode').val());
    };
    /**
     * 新增下级
     *
     * @param pId {string} 上级id
     */
    let addSubDepart = function (pId) {
        mApp.openPage('新增机构', mTool.getBaseUrl() + 'add/' + pId);
    };


    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/depart/');
            initDepartTypeTree();
            $('#search-depart-type-btn').click(search);
            $('.back-btn').click(function () {
                $('#search-depart-type').addClass('m--hide');
                $('#depart-type-tree').removeClass('m--hide');
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
mTab.needSubmitForm = function () {
    return true;
}
//== 初始化
$(document).ready(function () {
    mDepartList.init();
});