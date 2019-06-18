//== 通知 - 列表页
var SysMessageList = function () {
    /**
     * 初始化列表
     */
    var initTable = function (options) {
        if (SysMessageList.dataTable != null) {
            // 销毁表格
            SysMessageList.dataTable.destroy();
        }
        SysMessageList.dataTable = KTTool.initDataTable(options);
    };
    /**
     * 打开页面
     *
     * @param url {string} 访问地址
     */
    var openUrl = function (url) {
        var $ListView = $('#list-view');
        var $inputView = $('#input-view');

        KTUtil.ajax({
            url: url,
            wait: '.view-container',
            dataType: 'html',
            success: function (res) {
                $inputView.html(res);
                $ListView.addClass('kt-hide');
                $inputView.removeClass('kt-hide');
                KTApp.animateCSS('#input-view', KTApp.getAnimate('in'), null);
            }
        });
    };

    /**
     * 处理链接点击事件
     *
     * @param element
     */
    var processingLinks = function (element) {
        function updateNavActive($element) {
            $element.parents('ul.kt-nav').find('.kt-nav__item').removeClass('active');
            $element.parent().addClass('active');
        }

        var $element = $(element);
        var type = $element.data('type');
        var $ListView = $('#list-view');
        var $inputView = $('#input-view');
        var $messageTypeUl = $('ul.kt-nav.message-type');

        // 更新nav
        updateNavActive($element);
        if ('html' === type) {
            // 隐藏类型筛选
            KTApp.animateCSS('ul.kt-nav.message-type', KTApp.getAnimate('out'), function () {
                $messageTypeUl.addClass('kt-hide');
            });
            // 普通链接
            openUrl($element.data('url'));
        } else {
            // 显示类型筛选
            if ($messageTypeUl.hasClass('kt-hide') ||
                $messageTypeUl.hasClass(KTApp.getAnimate('out'))) {
                // 防止用户点了写信马上点收信导致类型筛选器隐藏,所以同时检查筛选器是否正在隐藏过程中
                $messageTypeUl.removeClass('kt-hide');
                KTApp.animateCSS('ul.kt-nav.message-type', KTApp.getAnimate('in'), function () {
                    $messageTypeUl.removeClass('kt-hide');
                });
                // 恢复默认类型筛选
                $messageTypeUl.find('.kt-nav__item').removeClass('active');
                $messageTypeUl.find('.kt-nav__item:eq(0)').addClass('active');
                $('#type').val('');
            }

            // 显示列表
            if ($ListView.hasClass('kt-hide')) {
                // 切换到列表视图
                $inputView.addClass('kt-hide');
                $ListView.removeClass('kt-hide');
                KTApp.animateCSS('#list-view', KTApp.getAnimate('in'), null);
            }

            // 调用指定callback
            var callback = KTTool.getObject($element.data('callback'), window);
            if (KTUtil.isFunction(callback)) {
                callback($element);
            }
        }
    };
    /**
     * 绑定导航点击事件
     */
    var bindNavClick = function () {
        $('.kt-nav a[data-type], .kt-nav a[data-callback]').click(function () {
            processingLinks(this);
        });

        $('body').on('click', '.message-link', function () {
            openUrl($(this).data('url'));
        })
    };
    /**
     * 获取标题区域可用宽度
     * @return {number}
     */
    var getTitleWidth = function () {
        var minWidth = 320;
        var width = KTUtil.getViewPort().width - 800;
        return Math.max(minWidth, width);
    };
    /**
     * 初始化收信表格
     * @param $element 触发的按钮
     */
    var initReceive = function ($element) {
        var messageType = $element.data('message-type');
        var $status = $('#status');
        var $star = $('#star');
        var $detailsStatus = $('#detailsStatus');
        // 消息必须是已发送
        $status.val(STATUS_HAS_BEEN_SENT);
        $star.val('');
        $detailsStatus.val('');

        if (INBOX === messageType) {
            // 收信箱
            $('.btn-delete, .btn-delete-completely, .btn-all-read').removeClass('kt-hide');
        } else if (INSTAR_SIGNBOX === messageType) {
            $('.btn-delete, .btn-delete-completely, .btn-all-read').removeClass('kt-hide');
            // 标星
            $star.val(STAR_YES);
        } else if (RECYCLE_BIN === messageType) {
            $('.btn-delete-completely').removeClass('kt-hide');
            $('.btn-delete, .btn-all-read').addClass('kt-hide');
            // 回收站
            $detailsStatus.val(RECEIVE_STATUS_DELETED);
        }
        var titleWidth = getTitleWidth();
        var columns = [
            {
                field: 'id',
                title: '#',
                sortable: false, // 禁用此列排序
                width: 40,
                selector: {class: 'kt-checkbox--solid'}
            }
        ];
        if (RECYCLE_BIN !== messageType) {
            // 如果不是回收站则显示收藏/取消收藏
            columns.push({
                field: 'star',
                title: '标星',
                width: 40,
                template: function (row) {
                    var stared = null;
                    if (STAR_YES === row.star) {
                        stared = 'kt-svg-icon--brand';
                    }
                    return '<a href="#" data-id="' + row.id + '" data-star="' + (STAR_YES === row.star) + '" onclick="SysMessageList.setStar(this)" class="star-message">' +
                        '   <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon ' + (stared ? stared : 'kt-svg-icon--invalid') + '">\n' +
                        '     <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
                        '            <polygon id="Shape" points="0 0 24 0 24 24 0 24"/>\n' +
                        '            <path d="M12,18 L7.91561963,20.1472858 C7.42677504,20.4042866 6.82214789,20.2163401 6.56514708,19.7274955 C6.46280801,19.5328351 6.42749334,19.309867 6.46467018,19.0931094 L7.24471742,14.545085 L3.94038429,11.3241562 C3.54490071,10.938655 3.5368084,10.3055417 3.92230962,9.91005817 C4.07581822,9.75257453 4.27696063,9.65008735 4.49459766,9.61846284 L9.06107374,8.95491503 L11.1032639,4.81698575 C11.3476862,4.32173209 11.9473121,4.11839309 12.4425657,4.36281539 C12.6397783,4.46014562 12.7994058,4.61977315 12.8967361,4.81698575 L14.9389263,8.95491503 L19.5054023,9.61846284 C20.0519472,9.69788046 20.4306287,10.2053233 20.351211,10.7518682 C20.3195865,10.9695052 20.2170993,11.1706476 20.0596157,11.3241562 L16.7552826,14.545085 L17.5353298,19.0931094 C17.6286908,19.6374458 17.263103,20.1544017 16.7187666,20.2477627 C16.5020089,20.2849396 16.2790408,20.2496249 16.0843804,20.1472858 L12,18 Z" id="Star" fill="#000000"/>\n' +
                        '      </g>\n' +
                        '    </svg>' +
                        '</a>';
                }
            });
        }
        columns.push({
            field: 'title',
            title: '主题',
            width: titleWidth,
            template: function (row) {
                return '\
                    <div class="kt-user-card-v2">\
                        <div class="kt-user-card-v2__pic">\
                            <img src="' + row.avatar + '" alt="photo">\
                        </div>\
                        <div class="kt-user-card-v2__details">\
                            <a href="#" data-url="' + KTTool.getBaseUrl() + 'info/' + row.messageId + '/' + row.id + '" class="kt-user-card-v2__name message-link' + (row.readDate ? '' : ' unread') + '">' +
                            (row.important === IMPORTANT_YES ? '<span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--unified-danger">重要</span> ' : '') +
                            row.title + '</a>\
                            <span class="kt-user-card-v2__email">' + row.nickname + '</span>\
                        </div>\
                    </div>';
            }
        });

        columns.push({
            field: 'sendDate',
            title: '类型/时间',
            width: 120,
            template: function (row) {
                var typeDicts = KTTool.getSysDictsObject('messageType');
                return '\
                        <div class="kt-user-card-v2">\
                            <div class="kt-user-card-v2__details">\
                                <a href="#" class="kt-user-card-v2__name">' + KTTool.getDictElement(row.type, typeDicts) + '</a>\
                                <span class="kt-user-card-v2__email" title="' + row.sendDate + '">' + (moment(row.sendDate, 'YYYY-MM-DD HH:mm:ss').fromNow()) + '</span>\
                            </div>\
                        </div>';
            }
        });
        columns.push({
            field: 'Actions',
            width: 110,
            title: '操作',
            sortable: false,
            overflow: 'visible',
            template: function (row, index, datatable) {
                var _btn = '';
                if (KTTool.hasPermissions('sys:message:delete')) {
                    if (RECYCLE_BIN === messageType) {
                        // 回收站
                        _btn += '<a href="#" data-id="' + row.id + '" onclick="SysMessageList.reduction(this)" class="' + KTTool.ACTIONS_SUCCESS + '" title="还原">\
                                    <i class="la la-rotate-left"></i>\
                                </a>';
                        _btn += '<a href="#" data-id="' + row.id + '" onclick="SysMessageList.deleteData(this, true)" class="' + KTTool.ACTIONS_DANGER + '" title="彻底删除">\
                                    <i class="la la-trash"></i>\
                                </a>';
                    } else {
                        _btn += '<a href="#" data-id="' + row.id + '" onclick="SysMessageList.deleteData(this, false)" class="' + KTTool.ACTIONS_DANGER + '" title="移至回收站">\
                                    <i class="la la-trash"></i>\
                                </a>';
                    }
                }
                return _btn;
            }
        });
        // 收信
        initTable({
            url: KTTool.getBaseUrl() + 'select/receive',
            columns: columns
        });
    };
    /**
     * 初始化发信表格
     * @param $element 触发的按钮
     */
    var initSend = function ($element) {
        var messageType = $element.data('message-type');
        var $status = $('#status');
        if (DRAFTS === messageType) {
            // 草稿箱
            $status.val(STATUS_DRAFT);
        } else if (HAS_BEEN_SENT === messageType) {
            // 已发送
            $status.val(STATUS_HAS_BEEN_SENT);
        }
        $('.btn-delete, .btn-delete-completely, .btn-all-read').addClass('kt-hide');
        var titleWidth = getTitleWidth();
        var columns = [
            {
                field: 'id',
                title: '#',
                sortable: false, // 禁用此列排序
                width: 40,
                selector: {class: 'kt-checkbox--solid'}
            },
            {
                field: 'title',
                title: '主题',
                width: titleWidth,
                template: function (row) {
                    return '\
                        <div class="kt-user-card-v2">\
                            <div class="kt-user-card-v2__pic">\
                                <img src="' + row.avatar + '" alt="photo">\
                            </div>\
                            <div class="kt-user-card-v2__details">\
                                <a href="#" class="kt-user-card-v2__name">' +
                        (row.important === 1 ? '<span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--unified-danger">重要</span> ' : '') +
                        row.title + '</a>\
                                <span class="kt-user-card-v2__email">' + row.nickname + '</span>\
                            </div>\
                        </div>';
                }
            },
            {
                field: 'sendDate',
                title: '类型/时间',
                width: 100,
                template: function (row) {
                    var typeDicts = KTTool.getSysDictsObject('messageType');
                    return '\
                        <div class="kt-user-card-v2">\
                            <div class="kt-user-card-v2__details">\
                                <a href="#" class="kt-user-card-v2__name">' + KTTool.getDictElement(row.type, typeDicts) + '</a>\
                                ' + (row.sendDate ? '<span class="kt-user-card-v2__email">' + row.sendDate + '</span>' : '<span class="kt-user-card-v2__email">--</span>') + '\
                            </div>\
                        </div>';
                }
            }
        ];
        if ($status.val() !== STATUS_HAS_BEEN_SENT) {
            columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                overflow: 'visible',
                template: function (row, index, datatable) {
                    var _btn = '';
                    if (KTTool.hasPermissions('sys:message:save')) {
                        _btn += '<a href="#" data-id="' + row.id + '" onclick="SysMessageList.send(this)" class="' + KTTool.ACTIONS_INFO + '" title="发送">\
                                <i class="la la-send"></i>\
                            </a>';
                    }
                    if (KTTool.hasPermissions('sys:message:save')) {
                        _btn += '<a href="#" data-url="'+KTTool.getBaseUrl() + 'input/' + row.id +'" class="message-link ' + KTTool.ACTIONS_INFO + '" title="编辑">\
                                <i class="la la-edit"></i>\
                            </a>';
                    }
                    if (KTTool.hasPermissions('sys:message:delete')) {
                        _btn += '<a href="#" onclick="KTTool.deleteById(this, \'' + row.id + '\')" class="' + KTTool.ACTIONS_DANGER + '" title="删除">\
                                <i class="la la-trash"></i>\
                            </a>';
                    }
                    return _btn;
                }
            });
        }
        // 刷新表格数据
        initTable({
            url: KTTool.getBaseUrl() + 'select',
            columns: columns
        });
    };
    /**
     * 根据类型过滤信息
     *
     * @param $element 触发的按钮
     */
    var filterByType = function ($element) {
        $('#type').val($element.data('data-type'));
        // 重新加载数据
        SysMessageList.dataTable.reload();
    };
    /**
     * 设置标星/取消标星
     *
     * @param element {object} 触发按钮
     */
    var setStar = function (element) {
        var $element = $(element);
        KTUtil.ajax({
            url: KTTool.getBaseUrl() + 'details/set/star/' + $element.data('id') + '/' + !$element.data('star'),
            success: function (res) {
                KTTool.successTip(KTTool.commonTips.success, $element.data('star') ? '已取消收藏' : '已收藏');
                SysMessageList.dataTable.reload();
            }
        });
    };
    /**
     * 移至回收站/彻底删除
     *
     * @param element {object} 触发按钮
     * @param deleteCompletely {boolean} true/false 是否彻底删除
     */
    var deleteData = function (element, deleteCompletely) {
        var id = null;
        if (element) {
            // 传入了按钮对象
            id = $(element).data('id');
        }
        if (KTUtil.isBlank(id)) {
            // 获取表格中的选中项
            id = SysMessageList.dataTable.getValue().join(',');
        }
        if (KTUtil.isBlank(id)) {
            KTTool.warnTip(KTTool.commonTips.fail, '请在表格中选中要删除的数据后重试');
            return;
        }
        var _delete = function () {
            KTUtil.ajax({
                url: KTTool.getBaseUrl() + 'details/delete/' + id + '/' + deleteCompletely,
                success: function (res) {
                    KTTool.successTip(KTTool.commonTips.success, deleteCompletely ? '消息已彻底删除' : '消息已移至回收站');
                    SysMessageList.dataTable.reload();
                }
            });
        };
        if (deleteCompletely) {
            KTUtil.alertConfirm('彻底删除', '彻底删除后无法还原，确定要删除吗？', function () {
                _delete(element);
            });
        } else {
            _delete(element);
        }
    };

    /**
     * 从回收站还原消息
     *
     * @param element {object} 触发按钮
     */
    var reduction = function (element) {
        var $element = $(element);
        KTUtil.ajax({
            url: KTTool.getBaseUrl() + 'details/reduction/' + $element.data('id'),
            success: function (res) {
                KTTool.successTip(KTTool.commonTips.success, '消息已还原');
                SysMessageList.dataTable.reload();
            }
        });
    };

    /**
     * 设置消息已读
     */
    var setRead = function () {
        var _setRead = function (ids) {
            KTUtil.ajax({
                url: KTTool.getBaseUrl() + 'details/set/read',
                data: {
                    ids: ids
                },
                success: function (res) {
                    KTTool.successTip(KTTool.commonTips.success, '消息已设置为已读');
                    SysMessageList.dataTable.reload();
                }
            });
        };
        var ids = SysMessageList.dataTable.getValue();
        var idStr = ids.join(',');
        // 如果未勾选数据,表示全部标记已读
        var subtitle;
        if (KTUtil.isBlank(idStr)) {
            subtitle = '确定要将所有消息设置为已读吗？'
        } else {
            subtitle = '确定要将选择的' + ids.length + '条消息设置为已读吗？';
        }
        KTUtil.alertConfirm('标记已读', subtitle, function () {
            _setRead(idStr);
        })
    };

    /**
     * 发送
     *
     * @param element {object} 触发按钮
     */
    var send = function (element) {
        KTUtil.alertConfirm('发送消息', '发送后无法撤销，确定要发送吗？', function () {
            var $element = $(element);
            KTUtil.ajax({
                url: KTTool.getBaseUrl() + 'send/' + $element.data('id'),
                success: function (res) {
                    KTTool.successTip(KTTool.commonTips.success, '消息已发送');
                    SysMessageList.dataTable.reload();
                }
            });
        })
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/message/');
            bindNavClick();
            // 加载默认菜单
            $('.kt-nav.data-type .kt-nav__item.active > a').click();
        },
        /**
         * 初始化收信表格
         * @param $element 触发的按钮
         */
        initReceive: function ($element) {
            initReceive($element);
        },
        /**
         * 初始化发信表格
         * @param $element 触发的按钮
         */
        initSend: function ($element) {
            initSend($element);
        },
        /**
         * 根据类型过滤信息
         *
         * @param $element 触发的按钮
         */
        filterByType: function ($element) {
            filterByType($element);
        },
        /**
         * 设置标星/取消标星
         *
         * @param element {object} 触发按钮
         */
        setStar: function (element) {
            setStar(element);
        },
        /**
         * 移至回收站/彻底删除
         *
         * @param element {object} 触发按钮
         * @param deleteCompletely {boolean} true/false 是否彻底删除
         */
        deleteData: function (element, deleteCompletely) {
            deleteData(element, deleteCompletely);
        },
        /**
         * 从回收站还原消息
         *
         * @param element {object} 触发按钮
         */
        reduction: function (element) {
            reduction(element);
        },
        /**
         * 发送
         *
         * @param element {object} 触发按钮
         */
        send: function (element) {
            send(element);
        },
        /**
         * 设置消息已读
         */
        setRead: function () {
            setRead();
        }
    };
}();
/**
 * 当前tab激活时是否需要重新加载数据
 *
 * @return {boolean} true/false
 */
KTTab.needSubmitForm = function () {
    return true;
};
//== 初始化
$(document).ready(function () {
    SysMessageList.init();
});