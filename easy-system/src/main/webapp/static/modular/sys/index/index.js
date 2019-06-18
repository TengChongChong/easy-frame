//== 首页
var mIndex = function () {
    var rootId = '0'; // 根菜单id
    var currentUser = null;
    /**
     * 加载菜单
     */
    var loadMenu = function () {
        var menus = currentUser.menus;
        if (typeof menus !== 'undefined') {
            var $menuNav = $('#kt_aside_menu > ul');
            // 水平菜单
            var $horizontalMenu = $('#kt_header_menu > ul');
            // 侧边菜单
            var $varMenu = $('#kt_aside_menu');

            if (menus.length > 0) {
                menus = objectToArray(buildTree(menus));
                // 初始化水平方向菜单
                $horizontalMenu.html(initHorizontalMenu(menus));

                // 初始化侧边菜单
                // $menuNav.append(initMenu(menus, true));
                $varMenu.append(initVarMenu(menus));
            } else {
                $menuNav.append(
                    '<li class="kt-menu__section ">\
                        <h4 class="kt-menu__section-text">用户暂无菜单</h4>\
                        <i class="kt-menu__section-icon flaticon-more-v2"></i>\
                    </li>'
                );
            }
            // mLayout.init();
            setDefaultHorMenu();
        }
    };
    /**
     * 获取水平方向菜单
     *
     * @param menus {array} 菜单
     * @returns {string} html
     */
    var initHorizontalMenu = function (menus) {
        var html = '';
        $(menus).each(function (index, menu) {
            html += '<li class="kt-menu__item kt-menu__item--rel">\
                        <a data-target="#sub_menu_' + menu.id + '" href="javascript:;" class="kt-menu__link">' + getMenuIcon(menu, true) + getMenuText(menu) + '</a>\
                    </li>';
        });
        return html;
    };
    /**
     * 获取侧边菜单
     *
     * @param menus {array} 菜单
     * @returns {string} html
     */
    var initVarMenu = function (menus) {
        var html = '';
        $(menus).each(function (index, menu) {
            if (typeof menu.children !== 'undefined') {
                html += '<ul id="sub_menu_' + menu.id + '" style="display: none;" class="kt-menu__nav">' + initMenu(menu.children, true) + '</ul>';
            }
        });
        return html;
    };
    /**
     * 将一维的扁平数组转换为多层级对象
     * @param  {[type]} list 一维数组，数组中每一个元素需包含id和pId两个属性
     * @return {[type]} tree 多层级树状结构
     */
    var buildTree = function (list) {
        var temp = {};
        var tree = {};
        for (var i in list) {
            temp[list[i].id] = list[i];
        }
        for (var i in temp) {
            // 不是根菜单&&没有父菜单
            if (temp[i].pId !== rootId && temp[temp[i].pId]) {
                if (!temp[temp[i].pId].children) {
                    temp[temp[i].pId].children = {};
                }
                temp[temp[i].pId].children[temp[i].id] = temp[i];
            } else {
                tree[temp[i].id] = temp[i];
            }
        }
        return tree;
    };
    /**
     * 获取菜单html
     *
     * @param menus {object} 菜单
     * @param isBase {boolean} 是否是一级菜单
     * @returns {string} html
     */
    var initMenu = function (menus, isBase) {
        var _html = '';
        $(objectToArray(menus)).each(function (i, menu) {
            _html += getMenuHtml(menu, isBase);
        });
        return _html;
    };
    /**
     * 将object菜单转为array并排序
     *
     * @param menus
     * @returns {*}
     */
    var objectToArray = function (menus) {
        var array = Object.values(menus);
        array.sort(function (a, b) {
            return a.orderNo - b.orderNo
        });
        return array;
    };
    /**
     * 获取菜单图标
     *
     * @param menu {object} 菜单
     * @param isBase {boolean} 是否是一级菜单
     * @returns {string}
     */
    var getMenuIcon = function (menu, isBase) {
        if (isBase) {
            return '<span class="kt-menu__link-icon">' + menu.icon + '</span>';
        } else {
            return '<i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>';
        }
    };
    /**
     * 获取菜单文字
     *
     * @param menu {object} 菜单
     * @returns {string} html
     */
    var getMenuText = function (menu) {
        return '<span class="kt-menu__link-text">' + menu.name + '</span>';
    };
    /**
     * 获取菜单url
     *
     * @param url {string} url
     * @returns {string} url
     */
    var getMenuUrl = function (url) {
        return basePath + (KTUtil.isNotBlank(url) ? url : '');
    };
    /**
     * 检查是否有子菜单
     *
     * @param submenu {object} 子菜单
     * @returns {boolean}
     */
    var hasSubMenu = function (submenu) {
        return typeof submenu !== 'undefined';
    };
    /**
     * 获取菜单链接
     *
     * @param content {string} 链接内容
     * @param menu {object} 菜单
     * @returns {string} html
     */
    var getMenuLink = function (content, menu) {
        return '<a href="javascript:;" class="kt-menu__link ' + (hasSubMenu(menu.children) ? 'kt-menu__toggle' : '') + '" data-url="' + getMenuUrl(menu.url) + '">' + content + '</a>';
    };
    /**
     * 获取菜单html代码
     *
     * @param menu {object} 菜单对象
     * @param isBase {boolean} 是否是一级菜单
     * @returns {string} html
     */
    var getMenuHtml = function (menu, isBase) {
        var menuArrow = '<i class="kt-menu__ver-arrow la la-angle-right"></i>';
        if (typeof menu !== 'undefined') {
            var _html = '<li class="kt-menu__item ' + (hasSubMenu(menu.children) ? 'kt-menu__item--submenu' : '') + '" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">';
            if (hasSubMenu(menu.children)) {
                _html += getMenuLink(getMenuIcon(menu, isBase) + getMenuText(menu) + menuArrow, menu) +
                    '<div class="kt-menu__submenu ">\
                        <span class="kt-menu__arrow"></span>\
                        <ul class="kt-menu__subnav">' + initMenu(menu.children, false) + '</ul>\
                    </div>';
            } else {
                if (isBase) {
                    _html += getMenuLink(
                        getMenuIcon(menu, isBase) +
                        '<span class="kt-menu__link-text">\
                            ' + getMenuText(menu) + '\
                        </span>'
                        , menu);
                } else {
                    _html += getMenuLink(getMenuIcon(menu, isBase) + getMenuText(menu), menu);
                }
            }
            return _html + '</li>';
        } else {
            return '';
        }
    };
    /**
     * 横向菜单点击事件
     *
     * @param $menu
     */
    var horMenuClick = function ($menu) {
        $menu.parents('ul').children().removeClass('kt-menu__item--active');
        $menu.parent().addClass('kt-menu__item--active');
        var target = $menu.data('target');
        var $target = $(target);
        if ($target.length > 0) {
            // 放到缓存里刷新页面后自动选中上次选中项
            KTTool.setCache('hor-menu', target);
            // 有目标子菜单
            $('#kt_aside_menu').children('ul').hide();
            $target.show();
            KTApp.animateCSS(target, KTApp.getAnimate('in'), null);
        } else {
            KTApp.openPage($menu.text(), $menu.data('url'));
        }
    };
    /**
     * 设置默认横向水平菜单选中项
     */
    var setDefaultHorMenu = function () {
        var target = KTTool.getCache('hor-menu');
        var $menu;
        if (KTUtil.isNotBlank(target)) {
            var _menu = $('[data-target="' + target + '"]');
            if (_menu.length > 0) {
                // 如果缓存里有选中的
                $menu = _menu;
            }
        }
        if ($menu == null) {
            $menu = $('#kt_header_menu > ul > li:nth-child(1) > a');
        }
        horMenuClick($menu);
    };
    /**
     * 添加点击链接事件
     */
    var bindLinkClick = function () {
        var selector = '.kt-menu__item > .kt-menu__link:not(.kt-menu__toggle):not(.kt-menu__link--toggle-skip)';
        // 横向菜单
        $('#kt_header_menu').on('click', selector, function (e) {
            e.preventDefault();
            horMenuClick($(this));
        });
        // 侧边菜单
        $('#kt_aside_menu').on('click', selector, function (e) {
            e.preventDefault();
            var $menu = $(this);
            var url = $menu.data('url');
            if (KTUtil.isBlank(url) || basePath === url) {
                url = basePath + '/global/in-development';
            }
            KTApp.openPage($menu.text(), url);
        });
        // 普通链接
        $('body').on('click', '.kt-menu-link, .kt-grid-nav__item', function (e) {
            e.preventDefault();
            var $link = $(this);
            var url = $link.data('url');
            var title = $link.data('title');
            KTApp.openPage(title, url);
        });
    };
    /**
     * 菜单回调
     */
    var menuCallback = function () {
        /**
         * 批量关闭标签页
         *
         * @param element {object} 标签页
         * @param type {string|null} closeOtherTabs/closeAllTabs/closeLeftTabs/closeRightTabs
         */
        var batchCloseTabs = function (element, type) {
            var $currentLi = $(element).parent();
            var $tabs = null;
            switch (type) {
                case 'closeOtherTabs':
                    // 获取除当前选中标签页以外的所有标签页
                    $currentLi.addClass('current-chose');
                    $tabs = $currentLi.parent().children(':not(.current-chose)');
                    $currentLi.removeClass('current-chose');
                    break;
                case 'closeAllTabs':
                    $tabs = $currentLi.parent().children();
                    break;
                case 'closeLeftTabs':
                    $tabs = $currentLi.prevAll();
                    break;
                case 'closeRightTabs':
                    $tabs = $currentLi.nextAll();
                    break;
                default:
                    // 默认关闭当前
                    $tabs = $currentLi;
            }
            $tabs.find('.tab-close').click();
        };

        /**
         * 刷新当前
         *
         * @param element {object} 标签页
         * @param key {string} 菜单key
         * @param opt {object} option
         */
        var refreshCurrentTabs = function (element, key, opt) {
            tabPage.refresh($(element).data('url'));
        };
        /**
         * 在新页面打开
         *
         * @param element {object} 标签页
         * @param key {string} 菜单key
         * @param opt {object} option
         */
        var cardingOnTheNewTab = function (element, key, opt) {
            window.open($(element).data('url'));
        };

        return {
            /**
             * 关闭当前
             *
             * @param key {string} 菜单key
             * @param opt {object} option
             */
            closeCurrentTab: function (key, opt) {
                batchCloseTabs(this, null);
            },
            /**
             * 关闭其他
             *
             * @param key {string} 菜单key
             * @param opt {object} option
             */
            closeOtherTabs: function (key, opt) {
                batchCloseTabs(this, 'closeOtherTabs');
            },
            /**
             * 关闭全部
             *
             * @param key {string} 菜单key
             * @param opt {object} option
             */
            closeAllTabs: function (key, opt) {
                batchCloseTabs(this, 'closeAllTabs');
            },
            /**
             * 关闭左边
             *
             * @param key {string} 菜单key
             * @param opt {object} option
             */
            closeLeftTabs: function (key, opt) {
                batchCloseTabs(this, 'closeLeftTabs');
            },
            /**
             * 关闭右边
             *
             * @param key {string} 菜单key
             * @param opt {object} option
             */
            closeRightTabs: function (key, opt) {
                batchCloseTabs(this, 'closeRightTabs');
            },
            /**
             * 刷新当前
             *
             * @param key {string} 菜单key
             * @param opt {object} option
             */
            refreshCurrentTabs: function (key, opt) {
                refreshCurrentTabs(this, key, opt)
            },
            /**
             * 在新标签页打开
             *
             * @param key {string} 菜单key
             * @param opt {object} option
             */
            cardingOnTheNewTab: function (key, opt) {
                cardingOnTheNewTab(this, key, opt);
            }
        }
    }();

    /**
     * 初始化标签页右键菜单
     */
    var initTabsRightMenu = function () {
        // 右键菜单绑定元素
        var defaultSelector = '.tab-page .con-tabs a.tab';
        /**
         * 菜单节点图标
         */
        var icon = {
            close: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">\n' +
                '    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
                '        <g id="Group" transform="translate(12.000000, 12.000000) rotate(-45.000000) translate(-12.000000, -12.000000) translate(4.000000, 4.000000)" fill="#000000">\n' +
                '            <rect id="Rectangle-185" x="0" y="7" width="16" height="2" rx="1"/>\n' +
                '            <rect id="Rectangle-185-Copy" opacity="0.3" transform="translate(8.000000, 8.000000) rotate(-270.000000) translate(-8.000000, -8.000000) " x="0" y="7" width="16" height="2" rx="1"/>\n' +
                '        </g>\n' +
                '    </g>\n' +
                '</svg>',
            left: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">\n' +
                '    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
                '        <polygon id="Shape" points="0 0 24 0 24 24 0 24"/>\n' +
                '        <rect id="Rectangle" fill="#000000" opacity="0.3" transform="translate(14.000000, 12.000000) scale(-1, 1) rotate(-90.000000) translate(-14.000000, -12.000000) " x="13" y="5" width="2" height="14" rx="1"/>\n' +
                '        <rect id="Rectangle-199-Copy" fill="#000000" opacity="0.3" x="3" y="3" width="2" height="18" rx="1"/>\n' +
                '        <path d="M5.7071045,15.7071045 C5.3165802,16.0976288 4.68341522,16.0976288 4.29289093,15.7071045 C3.90236664,15.3165802 3.90236664,14.6834152 4.29289093,14.2928909 L10.2928909,8.29289093 C10.6714699,7.914312 11.2810563,7.90106637 11.6757223,8.26284357 L17.6757223,13.7628436 C18.0828413,14.136036 18.1103443,14.7686034 17.7371519,15.1757223 C17.3639594,15.5828413 16.7313921,15.6103443 16.3242731,15.2371519 L11.0300735,10.3841355 L5.7071045,15.7071045 Z" id="Path-94" fill="#000000" fill-rule="nonzero" transform="translate(11.000001, 11.999997) scale(-1, -1) rotate(90.000000) translate(-11.000001, -11.999997) "/>\n' +
                '    </g>\n' +
                '</svg>',
            right: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">\n' +
                '    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
                '        <polygon id="Shape" points="0 0 24 0 24 24 0 24"/>\n' +
                '        <rect id="Rectangle" fill="#000000" opacity="0.3" transform="translate(14.000000, 12.000000) rotate(-90.000000) translate(-14.000000, -12.000000) " x="13" y="5" width="2" height="14" rx="1"/>\n' +
                '        <rect id="Rectangle-199-Copy" fill="#000000" opacity="0.3" x="3" y="3" width="2" height="18" rx="1"/>\n' +
                '        <path d="M11.7071032,15.7071045 C11.3165789,16.0976288 10.6834139,16.0976288 10.2928896,15.7071045 C9.90236532,15.3165802 9.90236532,14.6834152 10.2928896,14.2928909 L16.2928896,8.29289093 C16.6714686,7.914312 17.281055,7.90106637 17.675721,8.26284357 L23.675721,13.7628436 C24.08284,14.136036 24.1103429,14.7686034 23.7371505,15.1757223 C23.3639581,15.5828413 22.7313908,15.6103443 22.3242718,15.2371519 L17.0300721,10.3841355 L11.7071032,15.7071045 Z" id="Path-94" fill="#000000" fill-rule="nonzero" transform="translate(16.999999, 11.999997) scale(1, -1) rotate(90.000000) translate(-16.999999, -11.999997) "/>\n' +
                '    </g>\n' +
                '</svg>',
            refresh: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">\n' +
                '    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
                '        <rect id="bound" x="0" y="0" width="24" height="24"/>\n' +
                '        <path d="M8.43296491,7.17429118 L9.40782327,7.85689436 C9.49616631,7.91875282 9.56214077,8.00751728 9.5959027,8.10994332 C9.68235021,8.37220548 9.53982427,8.65489052 9.27756211,8.74133803 L5.89079566,9.85769242 C5.84469033,9.87288977 5.79661753,9.8812917 5.74809064,9.88263369 C5.4720538,9.8902674 5.24209339,9.67268366 5.23445968,9.39664682 L5.13610134,5.83998177 C5.13313425,5.73269078 5.16477113,5.62729274 5.22633424,5.53937151 C5.384723,5.31316892 5.69649589,5.25819495 5.92269848,5.4165837 L6.72910242,5.98123382 C8.16546398,4.72182424 10.0239806,4 12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 C7.581722,20 4,16.418278 4,12 L6,12 C6,15.3137085 8.6862915,18 12,18 C15.3137085,18 18,15.3137085 18,12 C18,8.6862915 15.3137085,6 12,6 C10.6885336,6 9.44767246,6.42282109 8.43296491,7.17429118 Z" id="Combined-Shape" fill="#000000" fill-rule="nonzero"/>\n' +
                '    </g>\n' +
                '</svg>',
            open: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">\n' +
                '    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
                '        <rect id="bound" x="0" y="0" width="24" height="24"/>\n' +
                '        <path d="M10.9,2 C11.4522847,2 11.9,2.44771525 11.9,3 C11.9,3.55228475 11.4522847,4 10.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,16 C20,15.4477153 20.4477153,15 21,15 C21.5522847,15 22,15.4477153 22,16 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L10.9,2 Z" id="Path-57" fill="#000000" fill-rule="nonzero" opacity="0.3"/>\n' +
                '        <path d="M24.0690576,13.8973499 C24.0690576,13.1346331 24.2324969,10.1246259 21.8580869,7.73659596 C20.2600137,6.12944276 17.8683518,5.85068794 15.0081639,5.72356847 L15.0081639,1.83791555 C15.0081639,1.42370199 14.6723775,1.08791555 14.2581639,1.08791555 C14.0718537,1.08791555 13.892213,1.15726043 13.7542266,1.28244533 L7.24606818,7.18681951 C6.93929045,7.46513642 6.9162184,7.93944934 7.1945353,8.24622707 C7.20914339,8.26232899 7.22444472,8.27778811 7.24039592,8.29256062 L13.7485543,14.3198102 C14.0524605,14.6012598 14.5269852,14.5830551 14.8084348,14.2791489 C14.9368329,14.140506 15.0081639,13.9585047 15.0081639,13.7695393 L15.0081639,9.90761477 C16.8241562,9.95755456 18.1177196,10.0730665 19.2929978,10.4469645 C20.9778605,10.9829796 22.2816185,12.4994368 23.2042718,14.996336 L23.2043032,14.9963244 C23.313119,15.2908036 23.5938372,15.4863432 23.9077781,15.4863432 L24.0735976,15.4863432 C24.0735976,15.0278051 24.0690576,14.3014082 24.0690576,13.8973499 Z" id="Shape" fill="#000000" fill-rule="nonzero" transform="translate(15.536799, 8.287129) scale(-1, 1) translate(-15.536799, -8.287129) "/>\n' +
                '    </g>\n' +
                '</svg>'
        };
        /**
         * 菜单节点
         */
        var items = {
            closeCurrentTab: {
                name: '关闭当前',
                icon: icon.close,
                type: 'format',
                disabled: checkMenu,
                callback: menuCallback.closeCurrentTab
            },
            closeOtherTabs: {
                name: '关闭其他',
                icon: icon.close,
                type: 'format',
                disabled: checkMenu,
                callback: menuCallback.closeOtherTabs
            },
            closeLeftTabs: {
                name: '关闭左侧',
                icon: icon.left,
                type: 'format',
                disabled: checkMenu,
                callback: menuCallback.closeLeftTabs
            },
            closeRightTabs: {
                name: '关闭右侧',
                icon: icon.right,
                type: 'format',
                disabled: checkMenu,
                callback: menuCallback.closeRightTabs
            },
            closeAllTabs: {
                name: '全部关闭',
                icon: icon.close,
                type: 'format',
                disabled: checkMenu,
                callback: menuCallback.closeAllTabs
            },
            sep1: '---------',
            refreshCurrentTabs: {
                name: '刷新页面',
                icon: icon.refresh,
                type: 'format',
                callback: menuCallback.refreshCurrentTabs
            },
            cardingOnTheNewTab: {
                name: '在新标签页打开',
                icon: icon.open,
                type: 'format',
                callback: menuCallback.cardingOnTheNewTab
            }
        };
        /**
         * 检查标签页是否可关闭
         *
         * @param $tab {object} 标签页
         * @return {true/false}
         */
        function checkCanClose($tab) {
            return $tab.find('.tab-close').length;
        }
        /**
         * 检查菜单节点是否 disabled
         *
         * @param key {string} 菜单节点key
         */
        function checkMenu(key) {
            var $currentLi = $(this).parent();
            var canClose = false;
            if ('closeCurrentTab' === key) {
                var tabClose = $(this).find('.tab-close');
                return !tabClose.length;
            } else if ('closeRightTabs' === key || 'closeLeftTabs' === key) {
                // 往左/右一个一个查找标签页是否可关闭,如遇到可关闭的则返回false
                var hasRightTab = true;
                var isCloseRightTabs = 'closeRightTabs' === key;
                while (hasRightTab) {
                    var next = null;
                    isCloseRightTabs ? next = $currentLi.next() : next = $currentLi.prev();
                    $currentLi = next;
                    if (!next.length) {
                        hasRightTab = false;
                    }
                    if (checkCanClose(next)) {
                        return false;
                    }
                }
                return true;
            } else if ('closeOtherTabs' === key || 'closeAllTabs' === key) {
                var isCloseOtherTabs = 'closeOtherTabs' === key;
                if(isCloseOtherTabs){
                    // 如果是关闭其他,排除当前选中tab
                    $currentLi.addClass('current-chose');
                }
                var $tabs = $currentLi.parent().children(':not(.current-chose)');
                if(isCloseOtherTabs){
                    $currentLi.removeClass('current-chose');
                }
                $($tabs).each(function (index, li) {
                    // 可以关闭
                    if(checkCanClose($(li))){
                        canClose = true;
                        return;
                    }
                });
                return !canClose;
            }
            return false;
        }

        /**
         * 菜单节点格式化
         *
         * @param item {object} 节点属性
         * @param opt {object} 菜单属性
         * @param root
         */
        $.contextMenu.types.format = function (item, opt, root) {
            $('<a class="dropdown-item" href="#">' + item.icon + item.name + '</a>').appendTo(this);
        };

        $.contextMenu({
            selector: defaultSelector,
            items: items,
            classNames: {
                // 自定义菜单节点class
                hover: '-hover',
                visible: '-visible'
            }
        });
    };

    /**
     * 消息图标
     */
    var messageIcon = {
        read: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon kt-svg-icon--invalid">\n' +
            '    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <rect id="bound" x="0" y="0" width="24" height="24"/>\n' +
            '        <path d="M6,2 L18,2 C18.5522847,2 19,2.44771525 19,3 L19,12 C19,12.5522847 18.5522847,13 18,13 L6,13 C5.44771525,13 5,12.5522847 5,12 L5,3 C5,2.44771525 5.44771525,2 6,2 Z M7.5,5 C7.22385763,5 7,5.22385763 7,5.5 C7,5.77614237 7.22385763,6 7.5,6 L13.5,6 C13.7761424,6 14,5.77614237 14,5.5 C14,5.22385763 13.7761424,5 13.5,5 L7.5,5 Z M7.5,7 C7.22385763,7 7,7.22385763 7,7.5 C7,7.77614237 7.22385763,8 7.5,8 L10.5,8 C10.7761424,8 11,7.77614237 11,7.5 C11,7.22385763 10.7761424,7 10.5,7 L7.5,7 Z" id="Combined-Shape" fill="#000000" opacity="0.3"/>\n' +
            '        <path d="M3.79274528,6.57253826 L12,12.5 L20.2072547,6.57253826 C20.4311176,6.4108595 20.7436609,6.46126971 20.9053396,6.68513259 C20.9668779,6.77033951 21,6.87277228 21,6.97787787 L21,17 C21,18.1045695 20.1045695,19 19,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,6.97787787 C3,6.70173549 3.22385763,6.47787787 3.5,6.47787787 C3.60510559,6.47787787 3.70753836,6.51099993 3.79274528,6.57253826 Z" id="Combined-Shape" fill="#000000"/>\n' +
            '    </g>\n' +
            '</svg>',
        unread: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">\n' +
            '    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <rect id="bound" x="0" y="0" width="24" height="24"/>\n' +
            '        <path d="M5,6 L19,6 C20.1045695,6 21,6.8954305 21,8 L21,17 C21,18.1045695 20.1045695,19 19,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,8 C3,6.8954305 3.8954305,6 5,6 Z M18.1444251,7.83964668 L12,11.1481833 L5.85557487,7.83964668 C5.4908718,7.6432681 5.03602525,7.77972206 4.83964668,8.14442513 C4.6432681,8.5091282 4.77972206,8.96397475 5.14442513,9.16035332 L11.6444251,12.6603533 C11.8664074,12.7798822 12.1335926,12.7798822 12.3555749,12.6603533 L18.8555749,9.16035332 C19.2202779,8.96397475 19.3567319,8.5091282 19.1603533,8.14442513 C18.9639747,7.77972206 18.5091282,7.6432681 18.1444251,7.83964668 Z" id="Combined-Shape" fill="#000000"/>\n' +
            '    </g>\n' +
            '</svg>'
    };

    /**
     * 加载消息
     * 首页这里只显示7天内的消息
     * 并且每种类型最多显示 {size} 条
     */
    var initMessage = function () {
        // 每种类型最多只显示20条
        var size = 20;

        /**
         * 根据类型获取消息
         *
         * @param type {string} 消息类型
         */
        var selectMessage = function (type) {
            KTUtil.ajax({
                url: basePath + '/auth/sys/message/select/receive',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    type: type,
                    page: {
                        size: size
                    }
                }),
                success: function (res) {
                    var $container = $('#message-' + type + ' > .kt-scroll');
                    if (res.data.records.length > 0) {
                        $(res.data.records).each(function (index, message) {
                            $container.append(
                                '<a href="javascript:;" data-url="' + basePath + '/auth/sys/message/info/' + message.messageId + '/' + message.id + '" class="kt-notification__item">\
                                    <div class="kt-notification__item-icon">\
                                    ' + (message.readDate ? messageIcon.read : messageIcon.unread) + '\
                                    </div>\
                                    <div class="kt-notification__item-details">\
                                        <div class="kt-notification__item-title ' + (message.readDate ? '' : ' unread') + '">\
                                            ' + message.title + '\
                                        </div>\
                                        <div class="kt-notification__item-time" title="' + message.sendDate + '">\
                                            ' + (moment(message.sendDate, 'YYYY-MM-DD HH:mm:ss').fromNow()) + '\
                                        </div>\
                                    </div>\
                                </a>'
                            )
                        });
                    } else {
                        $container.html(
                            '<div class="kt-grid kt-grid--ver" style="min-height: 200px;">\
                                <div class="kt-grid kt-grid--hor kt-grid__item kt-grid__item--fluid kt-grid__item--middle">\
                                    <div class="kt-grid__item kt-grid__item--middle kt-align-center">\
                                        暂无消息\
                                    </div>\
                                </div>\
                            </div>'
                        );
                    }
                }
            });
        };
        // 通知
        selectMessage(TYPE_NOTICE);
        // 事件
        selectMessage(TYPE_EVENT);
        // 日志
        selectMessage(TYPE_JOURNAL);
    };

    /**
     * 读消息
     *
     * @param element {object} 消息链接
     */
    var readMessage = function (element) {
        var $link = $(element);
        // 移除未读class
        $link.find('.kt-notification__item-title').removeClass('unread');
        // 更改消息图标
        $link.find('.kt-notification__item-icon').html(messageIcon.read);
        // 打开页面
        KTApp.openPage($link.text(), $link.data('url'));
    };
    /**
     * 给消息绑定事件
     */
    var bindMessage = function () {
        $('.message-container').on('click', '[data-url]', function () {
            readMessage(this);
        });
    };
    return {
        //== 初始化页面
        init: function () {
            // 更新缓存中的当前登录用户
            currentUser = KTTool.getUser(false);
            // 初始化标签页
            KTApp.initTabs();
            // 初始化标签页右键菜单
            initTabsRightMenu();

            // 加载菜单
            loadMenu();
            // 绑定菜单点击事件
            bindLinkClick();
            // 初始化消息
            initMessage();
            // 绑定消息事件
            bindMessage();
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mIndex.init();
});