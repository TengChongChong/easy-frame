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
                        var url = KTTool.getBaseUrl() + 'select/data';
                        if ('#' !== node.id) {
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
                    if (KTTool.hasPermissions('sys:depart:type:add')) {
                        _items.add = {
                            label: '新增下级',
                            icon: 'la la-plus',
                            action: function (data) {
                                add(KTTool.getClickNode(data).id);
                            }
                        };
                    }

                    if (KTTool.hasPermissions('sys:depart:type:delete')) {
                        _items.delete = {
                            label: '删除',
                            icon: 'la la-trash',
                            _disabled: function (data) {
                                var node = KTTool.getClickNode(data);
                                return node.id === '0';
                            },
                            action: function (data) {
                                batchDelete(KTTool.getOperationNodes(data).join(','));
                            }
                        };
                    }
                    if (KTTool.hasPermissions('sys:depart:type:save')) {
                        _items.edit = {
                            label: '修改',
                            icon: 'la la-edit',
                            _disabled: function (data) {
                                var node = KTTool.getClickNode(data);
                                return node.id === '0';
                            },
                            action: function (data) {
                                activateNode(KTTool.getClickNode(data));
                            }
                        };
                    }
                    if (KTTool.hasPermissions('sys:depart:type:status')) {
                        _items.enable = {
                            label: '启用',
                            icon: 'la la-check',
                            action: function (data) {
                                setStatus(KTTool.getOperationNodes(data).join(','), 1);
                            }
                        };
                        _items.disabled = {
                            label: '禁用',
                            icon: 'la la-ban',
                            _disabled: function (data) {
                                var node = KTTool.getClickNode(data);
                                return node.id === '0';
                            },
                            action: function (data) {
                                setStatus(KTTool.getOperationNodes(data).join(','), 2);
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
                KTUtil.ajax({
                    type: 'get',
                    wait: '#depart-type-tree',
                    data: moveData,
                    url: KTTool.getBaseUrl() + 'move',
                    success: function (res) {
                        KTTool.successTip(KTTool.commonTips.success, '位置已保存');
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
        if (KTUtil.isNotBlank(permissionsTitle)) {
            $('#depart-type-tree').addClass('m--hide');
            $('#search-depart-type').removeClass('m--hide');
            KTUtil.ajax({
                type: 'get',
                wait: '#search-depart-type',
                data: {
                    title: permissionsTitle
                },
                url: KTTool.getBaseUrl() + 'search',
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
        KTUtil.ajax({
            type: 'get',
            dataType: 'html',
            wait: '#depart-type-info',
            url: KTTool.getBaseUrl() + 'input/' + node.id,
            success: function (res) {
                $('#depart-type-info').html(res);
                KTApp.initComponents();
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
        var checked = KTTool.getCheckedNodes('#roles-tree', 'id');
        $('#roles').val(checked.join(','));
        KTTool.saveData(el, null, null, null, function (res) {
            KTTool.saveNode('#depart-type-tree', {
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
        KTTool.deleteById(el, id, null, false, function (res) {
            console.log(res);
            $('#depart-type-info').html('');
            KTTool.deleteNode('#depart-type-tree', id);
        })
    };
    /**
     * 设置状态
     *
     * @param ids {string} 要设置状态的id
     * @param status {number} 状态
     */
    var setStatus = function (ids, status) {
        if (KTUtil.isNotBlank(ids)) {
            KTUtil.ajax({
                wait: '#depart-type-tree',
                url: KTTool.getBaseUrl() + 'set/' + ids + '/status/' + status,
                success: function (res) {
                    var type = status == 1 ? 'default' : 'disabled';
                    var _id = $('#id').val();
                    $(ids.split(',')).each(function (i, id) {
                        // 如果节点已经在右侧打开,要更新状态
                        if (id == _id) {
                            $('[name="status"][value="' + status + '"]').prop('checked', true);
                        }
                        KTTool.saveNode('#depart-type-tree', {
                            id: id,
                            type: type
                        });
                    });
                }
            });
        } else {
            KTTool.warnTip(KTTool.commonTips.fail, '请选择角色后重试');
        }
    };
    /**
     * 批量删除节点
     *
     * @param ids {string} 要删除的节点id
     */
    var batchDelete = function (ids) {
        if (KTUtil.isNotBlank(ids)) {
            KTUtil.alertConfirm(KTTool.commonTips.delete.title, KTTool.commonTips.delete.subtitle, function () {
                KTUtil.ajax({
                    wait: '#depart-type-tree',
                    url: KTTool.getBaseUrl() + 'batch/delete/' + ids,
                    success: function (res) {
                        KTTool.deleteNode('#depart-type-tree', ids);
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
            KTTool.warnTip(KTTool.commonTips.fail, '请选择角色后重试');
        }
    };

    /**
     * 添加下级权限
     *
     * @param pId {string} 上级id
     */
    var add = function (pId) {
        if (KTUtil.isBlank(pId)) {
            pId = $('#id').val();
        }
        KTUtil.ajax({
            type: 'get',
            dataType: 'html',
            wait: '#depart-type-info',
            url: KTTool.getBaseUrl() + 'add/' + pId,
            success: function (res) {
                $('#depart-type-info').html(res);
                KTApp.initComponents();
                initRolesTree();
            }
        });
    };
    /**
     * 初始化权限tree
     */
    var initRolesTree = function () {
        KTUtil.ajax({
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
                    KTTool.checkNodes('#roles-tree', $('#roles').val());
                });
            }
        });
    };
    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/depart/type/');
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