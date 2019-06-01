//== 个人中心
var mPersonalCenter = function () {
    /**
     * 修改密码时密码的等级要求，分为0~5级
     * 默认为3级
     * @type {number}
     */
    var passwordSecurityLevel = 3;
    /**
     * 记录是否未输入过新密码
     * @type {boolean}
     */
    var noPasswordEntered = true;
    /**
     * 加载页面
     *
     * @param url {string} url
     * @param type {string} 类型
     */
    var loadPage = function (url, type) {
        /**
         * 初始化密码强度验证工具
         */
        var initPasswordValid = function () {
            // 设置密码等级要求
            var _passwordSecurityLevel = $('#passwordSecurityLevel').val();
            if (KTUtil.isNotBlank(_passwordSecurityLevel)) {
                try {
                    _passwordSecurityLevel = Number(_passwordSecurityLevel);
                    passwordSecurityLevel = _passwordSecurityLevel;
                } catch (e) {
                }
            }
            $('#password').pwstrength({
                ui: {
                    showVerdictsInsideProgressBar: true
                },
                common: {
                    usernameField: '#username', // 设置用户名,如果密码包含用户名会不记用户名部分分数
                    onKeyUp: function (evt, data) {
                        var password = $('#password').val();
                        if (data.verdictLevel >= passwordSecurityLevel) {
                            $('#change-password-tip').removeClass('show');
                            $('.change-password').removeAttr('disabled');
                        } else {
                            if (KTUtil.isNotBlank(password) && noPasswordEntered) {
                                // 是否未输入过密码
                                noPasswordEntered = false;
                            }
                            if (KTUtil.isNotBlank(password) && !noPasswordEntered) {
                                $('#change-password-tip').addClass('show');
                            }
                            $('.change-password').attr('disabled', 'disabled');
                        }
                    }
                }
            });
        };
        KTUtil.ajax({
            url: url,
            type: 'get',
            wait: '#kt-right-page',
            dataType: 'html',
            success: function (res) {
                $('#kt-right-page').html(res);
                KTApp.initComponents();
                if ('change-password' === type) {
                    initPasswordValid();
                }
            }
        });
    };
    /**
     * 绑定事件
     */
    var bind = function () {
        // 链接
        $('.kt-widget__item').click(function () {
            loadPage($(this).data('url'), $(this).data('link-type'));
            $(this).parent().find('.kt-widget__item').removeClass('kt-widget__item--active');
            $(this).addClass('kt-widget__item--active');
        });
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
        $body.on('click', '.show-password', function () {
            showPassword(this);
        });
        $body.on('click', '.change-password', function () {
            changePassword(this);
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
        if ($form.valid()) {
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
     * 切换显示/隐藏密码
     */
    var showPassword = function (el) {
        var $el = $(el);
        var $password = $el.parents('.kt-input-icon').find('input');
        if ('password' === $password.attr('type')) {
            $password.attr('type', 'text');
            $el.find('i').removeClass().addClass('la la-eye');
        } else {
            $password.attr('type', 'password');
            $el.find('i').removeClass().addClass('la la-eye-slash');
        }
    };
    /**
     * 更改密码
     *
     * @param el
     */
    var changePassword = function (el) {
        var $oldPassword = $('#oldPassword');
        var $password = $('#password');
        /**
         * 发送修改密码请求
         */
        var requestChangePassword = function () {
            KTUtil.ajax({
                url: KTTool.getBaseUrl() + 'change/password',
                wait: '.change-password-portlet',
                type: 'post',
                data: {
                    oldPassword: $.md5($oldPassword.val()),
                    password: $.md5($password.val())
                },
                success: function (res) {
                    KTTool.successTip(KTTool.commonTips.success, '密码修改成功');
                    // 清空密码
                    $oldPassword.val('');
                    $password.val('');
                    noPasswordEntered = true;
                }
            });
        };

        // 修改密码前是否弹出密码让用户确认一下
        var userConfirmationPassword = true;
        var $form = $(el).parents('.kt-form');
        if ($form.valid()) {
            if (userConfirmationPassword) {
                KTUtil.alertConfirm('确认要修改密码吗？', '确定要将密码修改为 ' + $password.val() + ' 吗?', function () {
                    requestChangePassword();
                });
            } else {
                requestChangePassword();
            }
        }
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
            // 打开默认页面
            $('.kt-widget__item.kt-widget__item--active').click();
            new Crop.CropAvatar($('#user-avatar'), function (data) {
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