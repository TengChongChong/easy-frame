//== 个人中心
var mPersonalCenter = function () {
    /**
     * 加载页面
     *
     * @param url {string} url
     */
    var loadPage = function (url) {
        mUtil.ajax({
            url: url,
            type: 'get',
            wait: '#m-right-page',
            dataType: 'html',
            success: function (res) {
                $('#m-right-page').html(res);
                mApp.initComponents();
            }
        });
    };
    /**
     * 绑定事件
     */
    var bind = function () {
        $('.m-nav__link').click(function () {
            loadPage($(this).data('url'));
        });
    };
    /**
     * 保存用户头像
     *
     * @param data
     */
    var saveUserAvatar = function (data) {
        mUtil.ajax({
            url: mTool.getBaseUrl() + 'save/user/avatar',
            data: {
                path: data.path
            },
            success: function (res) {
                mTool.successTip(mTool.commonTips.success, '头像更改成功，刷新页面后生效');
                var $userAvatar = $('.user-avatar');
                var $userAvatarImg = $userAvatar.find('img');
                if ($userAvatarImg.length > 0) {
                    $userAvatarImg.attr('src', res.data);
                } else {
                    $userAvatar.find('.m-type').remove();
                    $userAvatar.append('<img src="' + res.data + '" alt=""/>');
                }
                refreshLocalCache();
            }
        });
    };
    /**
     * 保存用户信息
     */
    var saveUserInfo = function (el) {
        mTool.saveData(el, mTool.getBaseUrl() + 'save/user/info', false, null, function () {
            mTool.successTip(mTool.commonTips.success, '资料更改成功，刷新页面后生效');
            refreshLocalCache();
        });
    };
    /**
     * 保存用户安全设置
     */
    var saveUserSecuritySetting = function (el) {
        mTool.saveData(el, mTool.getBaseUrl() + 'save/user/security/setting', null, null, function () {
            refreshLocalCache();
        });
    };
    /**
     * 保存用户设置
     */
    var saveUserSetting = function (el) {
        mTool.saveData(el, mTool.getBaseUrl() + 'save/user/setting', null, null, function () {
            refreshLocalCache();
        });
    };
    /**
     * 刷新本地缓存用户信息
     */
    var refreshLocalCache = function () {
        mTool.getUser(false);
    };
    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/personal/center/');
            // 绑定事件
            bind();
            // 打开默认页面
            $('.m-nav__link.active').click();
            new Crop.CropAvatar($('.user-avatar'), function (data) {
                saveUserAvatar(data);
            });
        },
        /**
         * 保存用户信息
         */
        saveUserInfo: function (el) {
            saveUserInfo(el);
        },
        /**
         * 保存用户安全设置
         */
        saveUserSecuritySetting: function (el) {
            saveUserSecuritySetting(el);
        },
        /**
         * 保存用户设置
         */
        saveUserSetting: function (el) {
            saveUserSetting(el);
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mPersonalCenter.init();
});