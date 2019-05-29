//== 首页
var mIndex = function () {
    var rootId = 0; // 根菜单id
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
            // bindMenuClick();
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
            if (temp[i].pId !== rootId || temp[temp[i].pId]) {
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
     * 添加点击菜单事件
     */
    var bindMenuClick = function () {
        KTLayout.getAsideMenu().on('click', function (obj, menu) {
            var $menu = $(menu);
            var url = $menu.data('url');
            if (KTUtil.isBlank(url)) {
                url = basePath + '/global/in-development';
            }
            KTApp.openPage($menu.text(), url);
            return false;
        });
        KTLayout.getHeaderMenu().on('click', function (obj, menu) {
            horMenuClick($(menu));
            return false;
        });
    };
    /**
     * 添加点击链接事件
     */
    var bindLinkClick = function () {
        var selector = '.kt-menu__item > .kt-menu__link:not(.kt-menu__toggle):not(.kt-menu__link--toggle-skip)';
        $('#kt_header_menu').on('click', selector, function(e) {
            e.preventDefault();
            horMenuClick($(this));
        });
        $('#kt_aside_menu').on('click', selector, function(e) {
            e.preventDefault();
            var $menu = $(this);
            var url = $menu.data('url');
            if (KTUtil.isBlank(url)) {
                url = basePath + '/global/in-development';
            }
            KTApp.openPage($menu.text(), url);
        });
        $('body').on('click', '.kt-menu-link, .kt-grid-nav__item', function(e) {
            e.preventDefault();
            var $link = $(this);
            var url = $link.data('url');
            KTApp.openPage($link.text(), url);
        });
    };

    return {
        //== 初始化页面
        init: function () {
            // 更新缓存中的当前登录用户
            currentUser = KTTool.getUser(false);
            KTApp.initTabs();
            loadMenu();
            bindLinkClick();
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mIndex.init();
});