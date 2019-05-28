//== 个人中心
var mPersonalCenter = function () {
    /**
     * 加载页面
     *
     * @param url {string} url
     */
    var loadPage = function (url) {
        KTUtil.ajax({
            url: url,
            type: 'get',
            wait: '#kt-right-page',
            dataType: 'html',
            success: function (res) {
                $('#kt-right-page').html(res);
                KTApp.initComponents();
            }
        });
    };
    /**
     * 绑定事件
     */
    var bind = function () {
        $('.kt-widget__item').click(function () {
            loadPage($(this).data('url'));
        });
    };
    /**
     * 更改密保邮箱
     */
    var changeMail = function () {
        $('#change-mail').modal();
    };
    /**
     * 保存邮箱
     *
     * @param element
     */
    var saveMail = function (element) {
        var $form = $(element).parents('.kt-form');
        if($form.valid()) {
            KTUtil.ajax({
                url: KTTool.getBaseUrl() + 'application/binding/mail',
                data: {
                    mail: $form.find('#mail').val()
                },
                success: function (res) {
                    KTTool.successTip(KTTool.commonTips.success, '邮件已发送，请于24小时内前往邮箱验证');
                }
            });
            $('#change-mail').modal('hide');
        }
    };
    /**
     * 更改密保手机
     */
    var changePhone = function () {
        $('#change-phone').modal();
    };
    /**
     * 绑定个人设置页面事件
     */
    var bindPersonalSettings = function () {
        var $body = $('body');
        $body.on('click', '.change-mail', function () {
            changeMail();
        });
        $body.on('click', '.mail-save', function () {
            saveMail(this);
        });

        $body.on('click', '.change-phone', function () {
            changePhone();
        });
    };
    /**
     * 保存用户头像
     *
     * @param data
     */
    var saveUserAvatar = function (data) {
        KTUtil.ajax({
            url: KTTool.getBaseUrl() + 'save/user/avatar',
            data: {
                path: data.path
            },
            success: function (res) {
                KTTool.successTip(KTTool.commonTips.success, '头像更改成功，刷新页面后生效');
                var $userAvatar = $('.user-avatar');
                var $userAvatarImg = $userAvatar.find('img');
                if ($userAvatarImg.length > 0) {
                    $userAvatarImg.attr('src', res.data);
                } else {
                    $userAvatar.find('.kt-type').remove();
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
        KTTool.saveData(el, KTTool.getBaseUrl() + 'save/user/info', false, null, function () {
            KTTool.successTip(KTTool.commonTips.success, '资料更改成功，刷新页面后生效');
            refreshLocalCache();
        });
    };
    /**
     * 保存用户安全设置
     */
    var saveUserSecuritySetting = function (el) {
        KTTool.saveData(el, KTTool.getBaseUrl() + 'save/user/security/setting', null, null, function () {
            refreshLocalCache();
        });
    };
    /**
     * 保存用户设置
     */
    var saveUserSetting = function (el) {
        KTTool.saveData(el, KTTool.getBaseUrl() + 'save/user/setting', null, null, function () {
            refreshLocalCache();
        });
    };
    /**
     * 刷新本地缓存用户信息
     */
    var refreshLocalCache = function () {
        KTTool.getUser(false);
    };
    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/user/personal/center/');
            // 绑定事件
            bind();
            bindPersonalSettings();
            // 打开默认页面
            $('.kt-widget__item.active').click();
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