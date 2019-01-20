//== 菜单管理-列表页
let mPermissionsView = function () {
    let initPermissionsTree = function () {
        let option = {
            types: {
                '#': {
                    'max_children': 1 // //根节点只能有一个
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
            dnd: {
                drag_selection: false // 只能拖动单个节点
            },
            contextmenu: {
                select_node: false,
                show_at_node: true,
                items: function () {
                    let _items = {};
                    if (mTool.hasPermissions('sys:permissions:add')) {
                        _items.add = {
                            label: '新增下级',
                            icon: 'la la-plus',
                            _disabled: function (data) {
                                let node = mTool.getClickNode(data);
                                return node.levels < 4;
                            },
                            action: function (data) {
                                addPermission(mTool.getClickNode(data).id);
                            }
                        }
                    }
                    if (mTool.hasPermissions('sys:permissions:save')) {
                        _items.edit = {
                            label: '修改',
                            icon: 'la la-edit',
                            _disabled: function (data) {
                                let node = mTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                activateNode(mTool.getClickNode(data));
                            }
                        };
                    }
                    if (mTool.hasPermissions('sys:permissions:delete')) {
                        _items.delete = {
                            label: '删除',
                            icon: 'la la-trash',
                            _disabled: function (data) {
                                let node = mTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                batchDelete(mTool.getOperationNodes(data).join(','));
                            }
                        };
                    }
                    if (mTool.hasPermissions('sys:permissions:save')) {
                        _items.copy = {
                            label: '复制',
                            icon: 'la la-copy',
                            _disabled: function (data) {
                                let node = mTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                copyNode($.jstree.reference(data.reference), mTool.getOperationNodes(data));
                            }
                        };
                        _items.paste = {
                            label: '粘贴',
                            icon: 'la la-paste',
                            _disabled: function (data) {
                                return !$.jstree.reference(data.reference).can_paste();
                            },
                            action: function (data) {
                                pasteNode($.jstree.reference(data.reference), mTool.getClickNode(data));
                            }
                        };
                    }
                    if (mTool.hasPermissions('sys:permissions:status')) {
                        _items.enable = {
                            label: '启用',
                            icon: 'la la-check',
                            _disabled: function (data) {
                                let node = mTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                setStatus(mTool.getOperationNodes(data).join(','), 1);
                            }
                        };
                        _items.disabled = {
                            label: '禁用',
                            icon: 'la la-ban',
                            _disabled: function (data) {
                                let node = mTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                setStatus(mTool.getOperationNodes(data).join(','), 2);
                            }
                        };
                    }
                    return _items;
                }
            }
        };
        if (mTool.hasPermissions('sys:permissions:move')) {
            option.plugins = ['dnd', 'types', 'contextmenu'];
        } else {
            option.plugins = ['types', 'contextmenu'];
        }
        $('#permissions-tree').jstree(option).on('activate_node.jstree', function (e, data) {
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
                    wait: '#permissions-tree',
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
    let searchPermissions = function () {
        let permissionsTitle = $('#permissions-title').val();
        if (mUtil.isNotBlank(permissionsTitle)) {
            $('#permissions-tree').addClass('m--hide');
            $('#search-permissions').removeClass('m--hide');
            mUtil.ajax({
                type: 'get',
                wait: '#search-permissions',
                data: {
                    title: permissionsTitle
                },
                url: mTool.getBaseUrl() + 'search',
                success: function (res) {
                    let $tree = $('#search-permissions').find('.tree');
                    if ($tree.jstree(true)) {
                        $tree.jstree(true).destroy();
                    }
                    $tree.jstree({
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
     * 复制节点
     *
     * @param tree {object} jsTree对象
     * @param nodeIds {array} 数组
     */
    let copyNode = function (tree, nodeIds) {
        if (mUtil.isArray(nodeIds)) {
            let nodes = [];
            $(nodeIds).each(function (i, id) {
                let _node = tree.get_node(id);
                if (_node != null && _node) {
                    nodes.push(_node);
                }
            });
            tree.copy(nodes);
            console.log(nodes);
        }
    };
    /**
     * 粘贴节点
     * 默认放到节点最后
     *
     * @param tree {object} jsTree对象
     * @param node {object} 粘贴到的节点
     */
    let pasteNode = function (tree, node) {
        let buffer = tree.get_buffer();
        if (mUtil.isArray(buffer.node)) {
            let ids = [];
            $(buffer.node).each(function (i, _node) {
                ids.push(_node.id);
            });
            mUtil.ajax({
                url: mTool.getBaseUrl() + 'copy/' + ids.join(',') + '/to/' + node.id,
                wait: '#permissions-tree',
                success: function (res) {
                    $(res.data).each(function (i, _node) {
                        mTool.saveNode('#permissions-tree', {
                            id: _node.id,
                            pId: _node.pId,
                            text: _node.name,
                            icon: _node.icon
                        });
                    });
                }
            });
        } else {
            mTool.warnTip(mTool.commonTips.fail, '请先复制节点后重试');
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
            wait: '#permissions-info',
            url: mTool.getBaseUrl() + 'input/' + node.id,
            success: function (res) {
                $('#permissions-info').html(res);
                mApp.initComponents();
            }
        })
    };

    /**
     * 保存数据
     *
     * @param el {object} html 元素
     */
    let saveData = function (el) {
        mTool.saveData(el, null, null, null, function (res) {
            mTool.saveNode('#permissions-tree', {
                id: res.data.id,
                pId: res.data.pId,
                text: res.data.name,
                icon: res.data.icon
            });
        });
    };
    /**
     * 删除权限/菜单
     *
     * @param el 删除按钮
     */
    let deleteById = function (el) {
        let id = $('#id').val();
        mTool.deleteById(el, id, null, false, function (res) {
            console.log(res);
            $('#permissions-info').html('');
            mTool.deleteNode('#permissions-tree', id);
        })
    };
    /**
     * 设置状态
     *
     * @param ids {string} 要设置状态的id
     * @param status {number} 状态
     */
    let setStatus = function (ids, status) {
        if (mUtil.isNotBlank(ids)) {
            mUtil.ajax({
                wait: '#permissions-tree',
                url: mTool.getBaseUrl() + 'set/' + ids + '/status/' + status,
                success: function (res) {
                    let type = status == 1 ? 'default' : 'disabled';
                    let _id = $('#id').val();
                    $(ids.split(',')).each(function (i, id) {
                        // 如果节点已经在右侧打开,要更新状态
                        if (id == _id) {
                            $('[name="status"][value="' + status + '"]').prop('checked', true);
                        }
                        mTool.saveNode('#permissions-tree', {
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
    let batchDelete = function (ids) {
        if (mUtil.isNotBlank(ids)) {
            mUtil.alertConfirm(mTool.commonTips.delete.title, mTool.commonTips.delete.subtitle, function () {
                mUtil.ajax({
                    wait: '#permissions-tree',
                    url: mTool.getBaseUrl() + 'batch/delete/' + ids,
                    success: function (res) {
                        mTool.deleteNode('#permissions-tree', ids);
                        // 如果删除的ids,已在右边打开,则清空
                        let _id = $('#id').val();
                        $(ids.split(',')).each(function (i, id) {
                            if (id == _id) {
                                $('#permissions-info').html('');
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
    let addPermission = function (pId) {
        if (mUtil.isBlank(pId)) {
            pId = $('#id').val();
        }
        mUtil.ajax({
            type: 'get',
            dataType: 'html',
            wait: '#permissions-info',
            url: mTool.getBaseUrl() + 'add/' + pId,
            success: function (res) {
                $('#permissions-info').html(res);
                mApp.initComponents();
            }
        });
    };
    /**
     * 绑定点击图标事件
     * 用于选择菜单/权限图标
     */
    let bindIconClick = function f() {
        $('#icon_modal').on('shown.bs.modal', function (e) {
            $('.m-demo-icon').click(function () {
                let icon = $(this).find('i').attr('class');
                $('#permissions-icon > i').removeClass().addClass(icon);
                $('#icon').val(icon);
                $('#icon_modal').modal('hide');
            });
        });
    };
    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/permissions/');
            initPermissionsTree();
            $('#search-permissions-btn').click(searchPermissions);
            $('.back-btn').click(function () {
                $('#search-permissions').addClass('m--hide');
                $('#permissions-tree').removeClass('m--hide');
                $('#permissions-title').val('');
            });
            bindIconClick();
        },
        /**
         * 添加下级权限
         */
        addPermission: function () {
            addPermission();
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
         * 删除权限/菜单
         *
         * @param el 删除按钮
         */
        deletePermission: function (el) {
            deleteById(el);
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mPermissionsView.init();
});