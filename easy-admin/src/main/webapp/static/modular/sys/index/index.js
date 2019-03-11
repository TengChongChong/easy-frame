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
            var $menuNav = $('#m_ver_menu > ul');
            if (menus.length > 0) {
                $menuNav.append(initMenu(buildTree(menus), true));
            } else {
                $menuNav.append(
                    '<li class="m-menu__section ">\
                        <h4 class="m-menu__section-text">用户暂无菜单</h4>\
                        <i class="m-menu__section-icon flaticon-more-v2"></i>\
                    </li>'
                );
            }
        }
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
            if (temp[i].pId != rootId || temp[temp[i].pId]) {
                if (!temp[temp[i].pId].children) {
                    temp[temp[i].pId].children = new Object();
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
            return '<i class="m-menu__link-icon ' + menu.icon + '"></i>';
        } else {
            return '<i class="m-menu__link-bullet m-menu__link-bullet--dot"><span></span></i>';
        }
    };
    /**
     * 获取菜单文字
     *
     * @param menu {object} 菜单
     * @returns {string} html
     */
    var getMenuText = function (menu) {
        return '<span class="m-menu__link-text">' + menu.name + '</span>';
    };
    /**
     * 获取菜单url
     *
     * @param url {string} url
     * @returns {string} url
     */
    var getMenuUrl = function (url) {
        return basePath + (mUtil.isNotBlank(url) ? url : '');
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
        return '<a href="javascript:;" class="m-menu__link ' + (hasSubMenu(menu.children) ? 'm-menu__toggle' : '') + '" data-url="' + getMenuUrl(menu.url) + '">' + content + '</a>';
    };
    /**
     * 获取菜单html代码
     *
     * @param menu {object} 菜单对象
     * @param isBase {boolean} 是否是一级菜单
     * @returns {string} html
     */
    var getMenuHtml = function (menu, isBase) {
        var menuArrow = '<i class="m-menu__ver-arrow la la-angle-right"></i>';
        if (typeof menu !== 'undefined') {
            var _html = '<li class="m-menu__item ' + (hasSubMenu(menu.children) ? 'm-menu__item--submenu' : '') + '" aria-haspopup="true">';
            if (hasSubMenu(menu.children)) {
                _html += getMenuLink(getMenuIcon(menu, isBase) + getMenuText(menu) + menuArrow, menu) +
                    '<div class="m-menu__submenu ">\
                        <span class="m-menu__arrow"></span>\
                        <ul class="m-menu__subnav">' + initMenu(menu.children, false) + '</ul>\
                    </div>';
            } else {
                if (isBase) {
                    _html += getMenuLink(
                        getMenuIcon(menu, isBase) +
                        '<span class="m-menu__link-title">\
                            <span class="m-menu__link-wrap">\
                                ' + getMenuText(menu) + '\
                            </span>\
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
     * 添加点击菜单事件
     */
    var bindMenuClick = function () {
        mLayout.getAsideMenu().on('linkClick', function (obj, menu) {
            mApp.openPage(menu.innerText, menu.attributes['data-url'].nodeValue);
            return false;
        });
    };
    /**
     * 添加点击链接事件
     */
    var bindLinkClick = function () {
        $('.m-menu-link').click(function () {
            mApp.openPage($(this).data('tab-title'), $(this).data('url'));
            $('.m-topbar__user-profile').removeClass('m-dropdown--open');
        });
    };

    return {
        //== 初始化页面
        init: function () {
            // 更新缓存中的当前登录用户
            currentUser = mTool.getUser(false);
            mApp.initTabs();
            loadMenu();
            bindMenuClick();
            bindLinkClick();
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mIndex.init();
});