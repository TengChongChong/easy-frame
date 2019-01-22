//== 机构类型管理-列表页
var mDepartTypeView = function () {
    var initTree = function () {
        $('#depart-type-tree').jstree({
            types: {
                '#': {
                    'max_children': 1 // //根节点只能有一个
                },
                default: {
                    icon: 'la la-bars'
                },
                disabled: {
                    icon: 'la la-ban'
                }
            },
            plugins: ['dnd', 'types', 'contextmenu'],
            core: {
                check_callback: true,
                data: {
                    url: function (node) {
                        var url = mTool.getBaseUrl() + 'select/data';
                        if ('#' != node.id) {
                            url += '?pId=' + node.id;
                        }
                        return url;
                    }
                }
            },
            dnd: {
                drag_selection: false // 只能拖动单个节点
            },
            contextmenu: {
                select_node: false,
                show_at_node: true,
                items: function () {
                    var _items = {};
                    if (mTool.hasPermissions('sys:depart:type:add')) {
                        _items.add = {
                            label: '新增下级',
                            icon: 'la la-plus',
                            action: function (data) {
                                add(mTool.getClickNode(data).id);
                            }
                        };
                    }

                    if (mTool.hasPermissions('sys:depart:type:delete')) {
                        _items.delete = {
                            label: '删除',
                            icon: 'la la-trash',
                            _disabled: function (data) {
                                var node = mTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                batchDelete(mTool.getOperationNodes(data).join(','));
                            }
                        };
                    }
                    if (mTool.hasPermissions('sys:depart:type:save')) {
                        _items.edit = {
                            label: '修改',
                            icon: 'la la-edit',
                            _disabled: function (data) {
                                var node = mTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                activateNode(mTool.getClickNode(data));
                            }
                        };
                    }
                    if (mTool.hasPermissions('sys:depart:type:status')) {
                        _items.enable = {
                            label: '启用',
                            icon: 'la la-check',
                            action: function (data) {
                                setStatus(mTool.getOperationNodes(data).join(','), 1);
                            }
                        };
                        _items.disabled = {
                            label: '禁用',
                            icon: 'la la-ban',
                            _disabled: function (data) {
                                var node = mTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                setStatus(mTool.getOperationNodes(data).join(','), 2);
                            }
                        };
                    }

                    return _items;
                },
            }
        }).on('activate_node.jstree', function (e, data) {
            activateNode(data.node)
        }).on('move_node.jstree', function (e, data) {
            //拖拽节点事件
            var moveData = {
                id: data.node.id,
                parent: data.parent,
                position: data.position,
                oldParent: data.old_parent,
                oldPosition: data.old_position
            };
            if (moveData.parent != moveData.oldParent || moveData.position != moveData.oldPosition) {
                mUtil.ajax({
                    type: 'get',
                    wait: '#depart-type-tree',
                    data: moveData,
                    url: mTool.getBaseUrl() + 'move',
                    success: function (res) {
                        mTool.successTip(mTool.commonTips.success, '位置已保存');
                    }
                });
            }
        });
    };
    /**
     * 搜索
     */
    var search = function () {
        var permissionsTitle = $('#depart-type-title').val();
        if (mUtil.isNotBlank(permissionsTitle)) {
            $('#depart-type-tree').addClass('m--hide');
            $('#search-depart-type').removeClass('m--hide');
            mUtil.ajax({
                type: 'get',
                wait: '#search-depart-type',
                data: {
                    title: permissionsTitle
                },
                url: mTool.getBaseUrl() + 'search',
                success: function (res) {
                    var $tree = $('#search-depart-type').find('.tree');
                    if ($tree.jstree(true)) {
                        $tree.jstree(true).destroy();
                    }
                    $tree.jstree({
                        types: {
                            default: {
                                icon: 'la la-bars'
                            },
                            disabled: {
                                icon: 'la la-ban'
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
        }
    };
    /**
     * 树点击事件
     *
     * @param node
     */
    var activateNode = function (node) {
        mUtil.ajax({
            type: 'get',
            dataType: 'html',
            wait: '#depart-type-info',
            url: mTool.getBaseUrl() + 'input/' + node.id,
            success: function (res) {
                $('#depart-type-info').html(res);
                mApp.initComponents();
                initRolesTree();
            }
        })
    };

    /**
     * 保存数据
     *
     * @param el {object} html 元素
     */
    var save = function (el) {
        var checked = mTool.getCheckedNodes('#roles-tree', 'id');
        $('#roles').val(checked.join(','));
        mTool.saveData(el, null, null, null, function (res) {
            mTool.saveNode('#depart-type-tree', {
                id: res.data.id,
                pId: res.data.pId,
                text: res.data.name
            });
        });
    };
    /**
     * 删除权限/菜单
     *
     * @param el 删除按钮
     */
    var deleteById = function (el) {
        var id = $('#id').val();
        mTool.deleteById(el, id, null, false, function (res) {
            console.log(res);
            $('#depart-type-info').html('');
            mTool.deleteNode('#depart-type-tree', id);
        })
    };
    /**
     * 设置状态
     *
     * @param ids {string} 要设置状态的id
     * @param status {number} 状态
     */
    var setStatus = function (ids, status) {
        if (mUtil.isNotBlank(ids)) {
            mUtil.ajax({
                wait: '#depart-type-tree',
                url: mTool.getBaseUrl() + 'set/' + ids + '/status/' + status,
                success: function (res) {
                    var type = status == 1 ? 'default' : 'disabled';
                    var _id = $('#id').val();
                    $(ids.split(',')).each(function (i, id) {
                        // 如果节点已经在右侧打开,要更新状态
                        if (id == _id) {
                            $('[name="status"][value="' + status + '"]').prop('checked', true);
                        }
                        mTool.saveNode('#depart-type-tree', {
                            id: id,
                            type: type
                        });
                    });
                }
            });
        } else {
            mTool.warnTip(mTool.commonTips.fail, '请选择角色后重试');
        }
    };
    /**
     * 批量删除节点
     *
     * @param ids {string} 要删除的节点id
     */
    var batchDelete = function (ids) {
        if (mUtil.isNotBlank(ids)) {
            mUtil.alertConfirm(mTool.commonTips.delete.title, mTool.commonTips.delete.subtitle, function () {
                mUtil.ajax({
                    wait: '#depart-type-tree',
                    url: mTool.getBaseUrl() + 'batch/delete/' + ids,
                    success: function (res) {
                        mTool.deleteNode('#depart-type-tree', ids);
                        // 如果删除的ids,已在右边打开,则清空
                        var _id = $('#id').val();
                        $(ids.split(',')).each(function (i, id) {
                            if (id == _id) {
                                $('#depart-type-info').html('');
                            }
                        });
                    }
                });
            })
        } else {
            mTool.warnTip(mTool.commonTips.fail, '请选择角色后重试');
        }
    };

    /**
     * 添加下级权限
     *
     * @param pId {string} 上级id
     */
    var add = function (pId) {
        if (mUtil.isBlank(pId)) {
            pId = $('#id').val();
        }
        mUtil.ajax({
            type: 'get',
            dataType: 'html',
            wait: '#depart-type-info',
            url: mTool.getBaseUrl() + 'add/' + pId,
            success: function (res) {
                $('#depart-type-info').html(res);
                mApp.initComponents();
                initRolesTree();
            }
        });
    };
    /**
     * 初始化权限tree
     */
    var initRolesTree = function () {
        mUtil.ajax({
            url: basePath + '/auth/sys/role/select/all',
            success: function (res) {
                $('#roles-tree').jstree({
                    types: {
                        default: {
                            icon: 'la la-group'
                        }
                    },
                    plugins: ['checkbox', 'types'],
                    core: {
                        data: res.data
                    },
                    checkbox: {
                        three_state: false, // 阻止上下级关联
                        tie_selection: false,
                        keep_selected_style: false
                    }
                }).on('loaded.jstree', function (e, data) {
                    mTool.checkNodes('#roles-tree', $('#roles').val());
                });
            }
        });
    };
    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/depart/type/');
            initTree();
            $('#search-depart-type-btn').click(search);
            $('.back-btn').click(function () {
                $('#search-depart-type').addClass('m--hide');
                $('#depart-type-tree').removeClass('m--hide');
                $('#depart-type-title').val('');
            });
        },
        /**
         * 添加下级权限
         */
        add: function () {
            add();
        },
        /**
         * 保存数据
         *
         * @param el {object} html 元素
         */
        save: function (el) {
            save(el);
        },
        /**
         * 删除权限/菜单
         *
         * @param el 删除按钮
         */
        delete: function (el) {
            deleteById(el);
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mDepartTypeView.init();
});