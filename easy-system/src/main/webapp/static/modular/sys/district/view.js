//== 行政区划-列表页
var mDistrictView = function () {
    var initDistrictTree = function () {
        var option = {
            types: {
                '#': {
                    'max_children': 1 // //根节点只能有一个
                },
                default: {
                    icon: 'la la-bars'
                }
            },
            core: {
                check_callback: true,
                data: {
                    url: function (node) {
                        var url = KTTool.getBaseUrl() + 'select/data';
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
                    if (KTTool.hasPermissions('sys:district:add')) {
                        _items.add = {
                            label: '新增下级',
                            icon: 'la la-plus',
                            action: function (data) {
                                addDistrict(KTTool.getClickNode(data).id);
                            }
                        }
                    }
                    if (KTTool.hasPermissions('sys:district:save')) {
                        _items.edit = {
                            label: '修改',
                            icon: 'la la-edit',
                            _disabled: function (data) {
                                var node = KTTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                activateNode(KTTool.getClickNode(data));
                            }
                        };
                    }
                    if (KTTool.hasPermissions('sys:district:delete')) {
                        _items.delete = {
                            label: '删除',
                            icon: 'la la-trash',
                            _disabled: function (data) {
                                var node = KTTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                batchDelete(KTTool.getOperationNodes(data).join(','));
                            }
                        };
                    }
                    if (KTTool.hasPermissions('sys:district:save')) {
                        _items.copy = {
                            label: '复制',
                            icon: 'la la-copy',
                            _disabled: function (data) {
                                var node = KTTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                copyNode($.jstree.reference(data.reference), KTTool.getOperationNodes(data));
                            }
                        };
                        _items.paste = {
                            label: '粘贴',
                            icon: 'la la-paste',
                            _disabled: function (data) {
                                return !$.jstree.reference(data.reference).can_paste();
                            },
                            action: function (data) {
                                pasteNode($.jstree.reference(data.reference), KTTool.getClickNode(data));
                            }
                        };
                    }
                    if (KTTool.hasPermissions('sys:district:status')) {
                        _items.enable = {
                            label: '启用',
                            icon: 'la la-check',
                            _disabled: function (data) {
                                var node = KTTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                setStatus(KTTool.getOperationNodes(data).join(','), 1);
                            }
                        };
                        _items.disabled = {
                            label: '禁用',
                            icon: 'la la-ban',
                            _disabled: function (data) {
                                var node = KTTool.getClickNode(data);
                                return node.id == '1';
                            },
                            action: function (data) {
                                setStatus(KTTool.getOperationNodes(data).join(','), 2);
                            }
                        };
                    }
                    return _items;
                }
            }
        };
        if (KTTool.hasPermissions('sys:district:move')) {
            option.plugins = ['dnd', 'types', 'contextmenu'];
        } else {
            option.plugins = ['types', 'contextmenu'];
        }
        $('#district-tree').jstree(option).on('activate_node.jstree', function (e, data) {
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
                    wait: '#district-tree',
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
    var searchDistrict = function () {
        var permissionsTitle = $('#district-title').val();
        if (KTUtil.isNotBlank(permissionsTitle)) {
            $('#district-tree').addClass('kt-hide');
            $('#search-permissions').removeClass('kt-hide');
            KTUtil.ajax({
                type: 'get',
                wait: '#search-permissions',
                data: {
                    title: permissionsTitle
                },
                url: KTTool.getBaseUrl() + 'search',
                success: function (res) {
                    var $tree = $('#search-permissions').find('.tree');
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
    var copyNode = function (tree, nodeIds) {
        if (KTUtil.isArray(nodeIds)) {
            var nodes = [];
            $(nodeIds).each(function (i, id) {
                var _node = tree.get_node(id);
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
    var pasteNode = function (tree, node) {
        var buffer = tree.get_buffer();
        if (KTUtil.isArray(buffer.node)) {
            var ids = [];
            $(buffer.node).each(function (i, _node) {
                ids.push(_node.id);
            });
            KTUtil.ajax({
                url: KTTool.getBaseUrl() + 'copy/' + ids.join(',') + '/to/' + node.id,
                wait: '#district-tree',
                success: function (res) {
                    $(res.data).each(function (i, _node) {
                        KTTool.saveNode('#district-tree', {
                            id: _node.id,
                            pId: _node.pId,
                            text: _node.name,
                            icon: _node.icon
                        });
                    });
                }
            });
        } else {
            KTTool.warnTip(KTTool.commonTips.fail, '请先复制节点后重试');
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
            wait: '#district-info',
            url: KTTool.getBaseUrl() + 'input/' + node.id,
            success: function (res) {
                $('#district-info').html(res);
                KTApp.initComponents();
            }
        })
    };

    /**
     * 保存数据
     *
     * @param el {object} html 元素
     */
    var saveData = function (el) {
        KTTool.saveData(el, null, null, null, function (res) {
            KTTool.saveNode('#district-tree', {
                id: res.data.id,
                pId: res.data.pId,
                text: res.data.name + res.data.extra + res.data.suffix
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
            $('#district-info').html('');
            KTTool.deleteNode('#district-tree', id);
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
                wait: '#district-tree',
                url: KTTool.getBaseUrl() + 'set/' + ids + '/status/' + status,
                success: function (res) {
                    var type = status == 1 ? 'default' : 'disabled';
                    var _id = $('#id').val();
                    $(ids.split(',')).each(function (i, id) {
                        // 如果节点已经在右侧打开,要更新状态
                        if (id == _id) {
                            $('[name="status"][value="' + status + '"]').prop('checked', true);
                        }
                        KTTool.saveNode('#district-tree', {
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
                    wait: '#district-tree',
                    url: KTTool.getBaseUrl() + 'batch/delete/' + ids,
                    success: function (res) {
                        KTTool.deleteNode('#district-tree', ids);
                        // 如果删除的ids,已在右边打开,则清空
                        var _id = $('#id').val();
                        $(ids.split(',')).each(function (i, id) {
                            if (id == _id) {
                                $('#district-info').html('');
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
    var addDistrict = function (pId) {
        if (KTUtil.isBlank(pId)) {
            pId = $('#id').val();
        }
        KTUtil.ajax({
            type: 'get',
            dataType: 'html',
            wait: '#district-info',
            url: KTTool.getBaseUrl() + 'add/' + pId,
            success: function (res) {
                $('#district-info').html(res);
                KTApp.initComponents();
            }
        });
    };
    /**
     * 绑定点击图标事件
     * 用于选择菜单/权限图标
     */
    var bindIconClick = function f() {
        $('#icon_modal').on('shown.bs.modal', function (e) {
            $('.m-demo-icon').click(function () {
                var icon = $(this).find('i').attr('class');
                $('#district-icon > i').removeClass().addClass(icon);
                $('#icon').val(icon);
                $('#icon_modal').modal('hide');
            });
        });
    };
    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/district/');
            initDistrictTree();
            $('#search-district-btn').click(searchDistrict);
            $('.back-btn').click(function () {
                $('#search-permissions').addClass('kt-hide');
                $('#district-tree').removeClass('kt-hide');
                $('#district-title').val('');
            });
            bindIconClick();
        },
        /**
         * 添加下级权限
         */
        addDistrict: function () {
            addDistrict();
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
        deleteDistrict: function (el) {
            deleteById(el);
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mDistrictView.init();
});