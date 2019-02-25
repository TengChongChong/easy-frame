//== 用户管理-列表页
var mUserList = function () {
    var firstClick = true;
    var initDepartTree = function () {
        $('#depart-tree').jstree({
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
                        var url = basePath + '/auth/sys/depart/select/data';
                        if ('#' !== node.id) {
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
        var permissionsTitle = $('#depart-title').val();
        if (mUtil.isNotBlank(permissionsTitle)) {
            $('#depart-tree').addClass('m--hide');
            $('#search-depart').removeClass('m--hide');
            mUtil.ajax({
                type: 'get',
                wait: '#search-depart',
                data: {
                    title: permissionsTitle
                },
                url: basePath + '/auth/sys/depart/search',
                success: function (res) {
                    var $tree = $('#search-depart').find('.tree');
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
    var activateNode = function (node) {
        if (mUtil.isNotBlank(node.id) && node.id != 0) {
            $('#deptId').val(node.id);
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
     * 检查参数ids,如果为空获取表格中勾选的行
     *
     * @param el {object} 按钮元素
     * @param ids {string} 数据id
     * @returns {*}
     */
    var checkParams = function (el, ids) {
        if (mUtil.isBlank(ids)) {
            var $dataTable = $(el).parents('.m-form').find('.m_datatable');
            if (typeof $dataTable !== 'undefined' && $dataTable.length > 0) {
                var _ids = mTool.getSelectData($dataTable);
                if (mTool.checkSelectDataIsNotEmpty(_ids, true)) {
                    ids = _ids.join(',');
                }
            }
        }
        return ids;
    };

    /**
     * 禁用用户
     *
     * @param ids 用户ids
     */
    var disableUser = function (el, ids) {
        ids = checkParams(el, ids);
        if (ids) {
            mUtil.alertConfirm('确定要禁用用户吗？', '禁用后用户无法登录', function () {
                mUtil.ajax({
                    url: mTool.getBaseUrl() + 'disable/user/' + ids,
                    success: function (res) {
                        mTool.selectData(el);
                    }
                });
            });
        }
    };
    /**
     * 启用用户
     *
     * @param ids 用户ids
     */
    var enableUser = function (el, ids) {
        ids = checkParams(el, ids);
        if (ids) {
            mUtil.ajax({
                url: mTool.getBaseUrl() + 'enable/user/' + ids,
                success: function (res) {
                    mTool.selectData(el);
                }
            });
        }
    };
    /**
     * 重置密码
     *
     * @param ids 用户ids
     */
    var resetPassword = function (el, ids) {
        ids = checkParams(el, ids);
        if (ids) {
            mUtil.alertConfirm('确定要重置密码吗？', '重置后用户无法使用旧密码登录', function () {
                mUtil.ajax({
                    url: mTool.getBaseUrl() + 'reset/password/' + ids,
                    success: function (res) {
                        mTool.successTip(mTool.commonTips.success, '密码重置成功！');
                    }
                });
            });
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
                    selector: {class: 'm-checkbox--solid m-checkbox--brand'},
                    locked: {
                        left: 'md'
                    }
                },
                {
                    field: 'username',
                    title: '用户名',
                    locked: {
                        left: 'md'
                    }
                },
                {
                    field: 'nickname',
                    title: '昵称'
                },
                {
                    field: 'phone',
                    title: '手机号'
                },
                {
                    field: 'status',
                    title: '状态',
                    width: 70,
                    dictType: mTool.commonDict // 这里设置机构类型名称{string}或机构{object}
                },
                {
                    field: 'lastLogin',
                    title: '最后登录时间'
                },
                {
                    field: 'createDate',
                    title: '创建时间',
                    sortable: 'desc'
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
                        if (mTool.hasPermissions('sys:user:save')) {
                            _btn += '<a href="#" onclick="mTool.editById(this, ' + row.id + ', \'' + row.username + '\')" class="' + mTool.ACTIONS_ACCENT + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                        }
                        if (mTool.hasPermissions('sys:user:delete')) {
                            _btn += '<a href="#" onclick="mTool.deleteById(this, ' + row.id + ')" class="' + mTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                        }
                        if (mTool.hasPermissions('sys:user:reset:password')) {
                            _btn += '<a href="#" onclick="mUserList.resetPassword(this, ' + row.id + ')" class="' + mTool.ACTIONS_WARN + '" title="重置密码">\
                                <i class="la la-refresh"></i>\
                            </a>';
                        }
                        if (mTool.hasPermissions('sys:user:disable')) {
                            _btn += '<a href="#" onclick="mUserList.disableUser(this, ' + row.id + ')" class="' + mTool.ACTIONS_WARN + '" title="禁用用户">\
                                <i class="la la-ban"></i>\
                            </a>';
                        }
                        if (mTool.hasPermissions('sys:user:enable')) {
                            _btn += '<a href="#" onclick="mUserList.enableUser(this, ' + row.id + ')" class="' + mTool.ACTIONS_SUCCESS + '" title="启用用户">\
                                <i class="la la-check"></i>\
                            </a>';
                        }
                        return _btn;
                    }
                }
            ]
        };
        mUserList.dataTable = mTool.initDataTable(options);
    };

    /**
     * 新增
     */
    var addUser = function () {
        mApp.openPage('新增用户', mTool.getBaseUrl() + 'add/' + $('#deptId').val());
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/user/');
            initDepartTree();
            $('#search-depart-btn').click(search);
            $('.back-btn').click(function () {
                $('#search-depart').addClass('m--hide');
                $('#depart-tree').removeClass('m--hide');
                $('#depart-title').val('');
            });
        },
        /**
         * 新增
         */
        addUser: function () {
            addUser();
        },
        /**
         * 禁用用户
         *
         * @param ids 用户ids
         */
        disableUser: function (el, ids) {
            disableUser(el, ids);
        },
        /**
         * 启用用户
         *
         * @param ids 用户ids
         */
        enableUser: function (el, ids) {
            enableUser(el, ids);
        },
        /**
         * 重置密码
         *
         * @param ids 用户ids
         */
        resetPassword: function (el, ids) {
            resetPassword(el, ids);
        }
    };
}();
mTab.needSubmitForm = function () {
    return true;
};
//== 初始化
$(document).ready(function () {
    mUserList.init();
});