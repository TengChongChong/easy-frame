//== 角色管理-列表页
var mRoleView = function () {
    var initRolesTree = function () {
        var option = {
            types: {
                '#': {
                    max_children: 1 // //根节点只能有一个
                },
                default: {
                    icon: 'la la-group'
                },
                disabled: {
                    icon: 'la la-ban'
                }
            },
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
            dnd:{
                drag_selection: false // 只能拖动单个节点
            },
            contextmenu: {
                select_node: false,
                show_at_node: true,
                items: function (){
                    var _items = {};
                    if (KTTool.hasPermissions('sys:role:add')) {
                        _items.add = {
                            label: '新增下级',
                            icon: 'la la-plus',
                            action: function (data) {
                                addRole(KTTool.getClickNode(data).id);
                            }
                        };
                    }
                    if (KTTool.hasPermissions('sys:role:save')) {
                        _items.edit = {
                            label: '修改',
                            icon: 'la la-edit',
                            action: function (data) {
                                activateNode(KTTool.getClickNode(data));
                            }
                        };
                    }
                    if (KTTool.hasPermissions('sys:role:delete')) {
                        _items.delete = {
                            label: '删除',
                            icon: 'la la-trash',
                            action: function (data) {
                                batchDelete(KTTool.getOperationNodes(data).join(','));
                            }
                        };
                    }
                    if (KTTool.hasPermissions('sys:role:status')) {
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
                            action: function (data) {
                                setStatus(KTTool.getOperationNodes(data).join(','), 2);
                            }
                        };
                    }
                    return _items;
                }
            }
        };
        if (KTTool.hasPermissions('sys:role:move')) {
            option.plugins = ['dnd', 'types', 'contextmenu'];
        } else {
            option.plugins = ['types', 'contextmenu'];
        }
        $('#roles-tree').jstree(option).on('activate_node.jstree', function (e, data) {
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
                    wait: '#roles-tree',
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
     * 搜索角色
     */
    var searchRoles = function () {
        var roleTitle = $('#role-title').val();
        if (KTUtil.isNotBlank(roleTitle)) {
            $('#roles-tree').addClass('kt-hide');
            $('#search-role').removeClass('kt-hide');
            KTUtil.ajax({
                type: 'get',
                wait: '#search-role',
                data: {
                    title: roleTitle
                },
                url: KTTool.getBaseUrl() + 'search',
                success: function (res) {
                    var $tree = $('#search-role').find('.tree');
                    if ($tree.jstree(true)) {
                        $tree.jstree(true).destroy();
                    }
                    $tree.jstree({
                        core: {
                            data: res.data
                        }
                    }).on('activate_node.jstree', function (e, data) {
                        activateNode(data.node)
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
            wait: '#role-info',
            url: KTTool.getBaseUrl() + 'input/' + node.id,
            success: function (res) {
                $('#role-info').html(res);
                KTApp.initComponents();
                initPermissionsTree();
            }
        })
    };
    /**
     * 设置角色状态
     * @param ids {string} 要设置状态的id
     * @param status {number} 状态
     */
    var setStatus = function (ids, status) {
        if (KTUtil.isNotBlank(ids)) {
            KTUtil.ajax({
                wait: '#roles-tree',
                url: KTTool.getBaseUrl() + 'set/' + ids + '/status/' + status,
                success: function (res) {
                    var type = status == 1 ? 'default' : 'disabled';
                    var _id = $('#id').val();
                    $(ids.split(',')).each(function (i, id) {
                        // 如果节点已经在右侧打开,要更新状态
                        if (id == _id) {
                            $('[name="status"][value="' + status + '"]').prop('checked', true);
                        }
                        KTTool.saveNode('#roles-tree', {
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
     * 保存数据
     *
     * @param el {object} html 元素
     */
    var saveData = function (el) {
        var checked = KTTool.getCheckedNodes('#permissions-tree', 'id');
        $('#permissions').val(checked.join(','));
        KTTool.saveData(el, null, null, null, function (res) {
            KTTool.saveNode('#roles-tree', {
                id: res.data.id,
                pId: res.data.pId,
                text: res.data.name
            });
            // 删除缓存用户数据
            KTTool.cacheRemove(KTTool.currentUser);
        });
    };

    /**
     * 删除角色
     *
     * @param el 删除按钮
     * @param id 要删除的数据id
     */
    var deleteById = function (el, id) {
        KTTool.deleteById(el, id, null, false, function (res) {
            $('#role-info').html('');
            KTTool.deleteNode('#roles-tree', id);
        })
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
                    wait: '#roles-tree',
                    url: KTTool.getBaseUrl() + 'batch/delete/' + ids,
                    success: function (res) {
                        KTTool.deleteNode('#roles-tree', ids);
                        // 如果删除的ids,已在右边打开,则清空
                        var _id = $('#id').val();
                        $(ids.split(',')).each(function (i, id) {
                            if (id == _id) {
                                $('#role-info').html('');
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
     * 新增角色
     *
     * @param pId {string} 上级id
     */
    var addRole = function (pId) {
        if (KTUtil.isBlank(pId)) {
            pId = $('#id').val();
        }
        KTUtil.ajax({
            type: 'get',
            dataType: 'html',
            wait: '#role-info',
            url: KTTool.getBaseUrl() + 'add/' + pId,
            success: function (res) {
                $('#role-info').html(res);
                KTApp.initComponents();
                initPermissionsTree();
            }
        });
    };
    /**
     * 初始化权限tree
     */
    var initPermissionsTree = function () {
        KTUtil.ajax({
            url: basePath + '/auth/sys/permissions/select/all',
            success: function (res) {
                $('#permissions-tree').jstree({
                    plugins: ['checkbox'],
                    core: {
                        themes: {
                            icons: false
                        },
                        data: res.data
                    },
                    checkbox: {
                        tie_selection: false,
                        keep_selected_style: false
                    }
                }).on('loaded.jstree', function (e, data) {
                    KTTool.checkNodes('#permissions-tree', $('#permissions').val());
                });
            }
        });
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/role/');
            $('#search-role-btn').click(searchRoles);
            initRolesTree();
            $('.back-btn').click(function () {
                $('#search-role').addClass('kt-hide');
                $('#roles-tree').removeClass('kt-hide');
                $('#role-title').val('');
            });
        },
        /**
         * 新增角色
         */
        addRole: function () {
            addRole();
        },
        /**
         * 保存数据
         *
         * @param el {object} html 元素
         */
        saveData: function (el) {
            saveData(el);
        },
        /**
         * 删除角色
         *
         * @param el 删除按钮
         * @param id 要删除的数据id
         */
        deleteRole: function (el, id) {
            deleteById(el, id);
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mRoleView.init();

});