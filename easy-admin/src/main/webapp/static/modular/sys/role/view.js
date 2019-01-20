//== 角色管理-列表页
let mRoleView = function () {
    let initRolesTree = function () {
        let option = {
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
                        let url = mTool.getBaseUrl() + 'select/data';
                        if ('#' != node.id) {
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
                    let _items = {};
                    if (mTool.hasPermissions('sys:role:add')) {
                        _items.add = {
                            label: '新增下级',
                            icon: 'la la-plus',
                            action: function (data) {
                                addRole(mTool.getClickNode(data).id);
                            }
                        };
                    }
                    if (mTool.hasPermissions('sys:role:save')) {
                        _items.edit = {
                            label: '修改',
                            icon: 'la la-edit',
                            action: function (data) {
                                activateNode(mTool.getClickNode(data));
                            }
                        };
                    }
                    if (mTool.hasPermissions('sys:role:delete')) {
                        _items.delete = {
                            label: '删除',
                            icon: 'la la-trash',
                            action: function (data) {
                                batchDelete(mTool.getOperationNodes(data).join(','));
                            }
                        };
                    }
                    if (mTool.hasPermissions('sys:role:status')) {
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
                            action: function (data) {
                                setStatus(mTool.getOperationNodes(data).join(','), 2);
                            }
                        };
                    }
                    return _items;
                }
            }
        };
        if (mTool.hasPermissions('sys:role:move')) {
            option.plugins = ['dnd', 'types', 'contextmenu'];
        } else {
            option.plugins = ['types', 'contextmenu'];
        }
        $('#roles-tree').jstree(option).on('activate_node.jstree', function (e, data) {
            activateNode(data.node)
        }).on('move_node.jstree', function (e, data) {
            //拖拽节点事件
            let moveData = {
                id: data.node.id,
                parent: data.parent,
                position: data.position,
                oldParent: data.old_parent,
                oldPosition: data.old_position
            };
            if (moveData.parent != moveData.oldParent || moveData.position != moveData.oldPosition) {
                mUtil.ajax({
                    type: 'get',
                    wait: '#roles-tree',
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
     * 搜索角色
     */
    let searchRoles = function () {
        let roleTitle = $('#role-title').val();
        if (mUtil.isNotBlank(roleTitle)) {
            $('#roles-tree').addClass('m--hide');
            $('#search-role').removeClass('m--hide');
            mUtil.ajax({
                type: 'get',
                wait: '#search-role',
                data: {
                    title: roleTitle
                },
                url: mTool.getBaseUrl() + 'search',
                success: function (res) {
                    let $tree = $('#search-role').find('.tree');
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
    let activateNode = function (node) {
        mUtil.ajax({
            type: 'get',
            dataType: 'html',
            wait: '#role-info',
            url: mTool.getBaseUrl() + 'input/' + node.id,
            success: function (res) {
                $('#role-info').html(res);
                mApp.initComponents();
                initPermissionsTree();
            }
        })
    };
    /**
     * 设置角色状态
     * @param ids {string} 要设置状态的id
     * @param status {number} 状态
     */
    let setStatus = function (ids, status) {
        if (mUtil.isNotBlank(ids)) {
            mUtil.ajax({
                wait: '#roles-tree',
                url: mTool.getBaseUrl() + 'set/' + ids + '/status/' + status,
                success: function (res) {
                    let type = status == 1 ? 'default' : 'disabled';
                    let _id = $('#id').val();
                    $(ids.split(',')).each(function (i, id) {
                        // 如果节点已经在右侧打开,要更新状态
                        if (id == _id) {
                            $('[name="status"][value="' + status + '"]').prop('checked', true);
                        }
                        mTool.saveNode('#roles-tree', {
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
     * 保存数据
     *
     * @param el {object} html 元素
     */
    let saveData = function (el) {
        let checked = mTool.getCheckedNodes('#permissions-tree', 'id');
        $('#permissions').val(checked.join(','));
        mTool.saveData(el, null, null, null, function (res) {
            mTool.saveNode('#roles-tree', {
                id: res.data.id,
                pId: res.data.pId,
                text: res.data.name
            });
            // 删除缓存用户数据
            mTool.cacheRemove(mTool.currentUser);
        });
    };

    /**
     * 删除角色
     *
     * @param el 删除按钮
     * @param id 要删除的数据id
     */
    let deleteById = function (el, id) {
        mTool.deleteById(el, id, null, false, function (res) {
            $('#role-info').html('');
            mTool.deleteNode('#roles-tree', id);
        })
    };
    /**
     * 批量删除节点
     *
     * @param ids {string} 要删除的节点id
     */
    let batchDelete = function (ids) {
        if (mUtil.isNotBlank(ids)) {
            mUtil.alertConfirm(mTool.commonTips.delete.title, mTool.commonTips.delete.subtitle, function () {
                mUtil.ajax({
                    wait: '#roles-tree',
                    url: mTool.getBaseUrl() + 'batch/delete/' + ids,
                    success: function (res) {
                        mTool.deleteNode('#roles-tree', ids);
                        // 如果删除的ids,已在右边打开,则清空
                        let _id = $('#id').val();
                        $(ids.split(',')).each(function (i, id) {
                            if (id == _id) {
                                $('#role-info').html('');
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
     * 新增角色
     *
     * @param pId {string} 上级id
     */
    let addRole = function (pId) {
        if (mUtil.isBlank(pId)) {
            pId = $('#id').val();
        }
        mUtil.ajax({
            type: 'get',
            dataType: 'html',
            wait: '#role-info',
            url: mTool.getBaseUrl() + 'add/' + pId,
            success: function (res) {
                $('#role-info').html(res);
                mApp.initComponents();
                initPermissionsTree();
            }
        });
    };
    /**
     * 初始化权限tree
     */
    let initPermissionsTree = function () {
        mUtil.ajax({
            url: basePath + '/auth/sys/permissions/select/all',
            success: function (res) {
                $('#permissions-tree').jstree({
                    plugins: ['checkbox'],
                    core: {
                        data: res.data
                    },
                    checkbox: {
                        tie_selection: false,
                        keep_selected_style: false
                    }
                }).on('loaded.jstree', function (e, data) {
                    mTool.checkNodes('#permissions-tree', $('#permissions').val());
                });
            }
        });
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/role/');
            $('#search-role-btn').click(searchRoles);
            initRolesTree();
            $('.back-btn').click(function () {
                $('#search-role').addClass('m--hide');
                $('#roles-tree').removeClass('m--hide');
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