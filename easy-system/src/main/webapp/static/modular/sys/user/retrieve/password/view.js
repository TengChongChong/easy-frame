//== 找回密码
var mRetrievePassword = function () {
    // 当前激活向导页
    var currentWizardSelector = '.kt-wizard-v3__content[data-ktwizard-state="current"]';

    var wizard;
    var initWizard = function () {
        //== 初始化
        wizard = new KTWizard('m_wizard', {
            startStep: 1
        });

        //== 下一步
        wizard.on('beforeNext', function (wizardObj) {
            var needValid = $(currentWizardSelector).find('input,select');
            if (needValid.length > 0) {
                if (!needValid.valid()) {
                    // 表单验证失败 不跳转到下一步
                    wizardObj.stop();
                }
            }
        });
    };
    /**
     * 发送验证邮件
     */
    var sendMail = function () {
        var needValid = $(currentWizardSelector).find('input');
        if (needValid.length > 0) {
            if (needValid.valid()) {
                KTUtil.ajax({
                    url: KTTool.getBaseUrl() + 'send/mail',
                    wait: '.m-portlet',
                    data: {
                        username: $('#username').val(),
                        mail: $('#email').val()
                    },
                    success: function (res) {
                        wizard.goTo(3);
                    }
                });
            }
        }
    };
    /**
     * 验证验证码是否正确
     */
    var verifiesCode = function () {
        var username = $('#username').val();
        var code = $('#verificationCode').val();
        var needValid = $(currentWizardSelector).find('input');
        if (needValid.length > 0) {
            if (needValid.valid()) {
                KTUtil.ajax({
                    url: KTTool.getBaseUrl() + 'verifies/' + username + '/' + $.md5(code),
                    wait: '.m-portlet',
                    success: function (res) {
                        wizard.goTo(4);
                    }
                });
            }
        }
    };
    /**
     * 切换显示/隐藏密码
     */
    var showPassword = function (el) {
        var $el = $(el);
        var $password = $('#password');
        if('password' === $password.attr('type')){
            $password.attr('type', 'text');
            $el.find('i').removeClass().addClass('la la-eye');
        } else {
            $password.attr('type', 'password');
            $el.find('i').removeClass().addClass('la la-eye-slash');
        }
    };
    /**
     * 重置密码
     */
    var resetPassword = function () {
        var needValid = $(currentWizardSelector).find('input');
        if (needValid.length > 0) {
            if (needValid.valid()) {
                var username = $('#username').val();
                var code = $('#verificationCode').val();
                KTUtil.ajax({
                    url: KTTool.getBaseUrl() + 'reset/password/' + username + '/' + $.md5(code),
                    wait: '.m-portlet',
                    data:{
                        password: $.md5($('#password').val())
                    },
                    success: function (res) {
                        wizard.goTo(5);
                    }
                });
            }
        }
    };
    /**
     * 绑定重置密码
     */
    var bindResetPassword = function () {
        $('#reset-password').click(function () {
            resetPassword();
        });    
    };
    /**
     * 绑定切换显示/隐藏密码事件
     */
    var bindShowPassword = function () {
        $('#show-password').click(function () {
            showPassword(this);
        });
    };
    /**
     * 绑定点击验证验证码事件
     */
    var bindVerificationCode = function () {
        $('#verification-code').click(function () {
            verifiesCode();
        });    
    };
    /**
     * 绑定发送mail事件
     */
    var bindSendMailClick = function () {
        $('#send-mail').click(function () {
            sendMail();
        });
    };
    /**
     * 绑定点击找回方式事件
     */
    var bindChoseModel = function () {
        $('.retrieve-model .model').click(function () {
            var model = $(this).data('type');
            if ('mail' === model) {
                // 通过邮箱找回
                wizard.goTo(2);
            } else if ('phone' === model) {
                // 通过手机找回
                KTTool.warnTip(KTTool.commonTips.fail, '暂未开放，请使用邮箱找回密码');
            }
        });
    };
    /**
     * 绑定事件
     */
    var bind = function () {
        bindChoseModel();
        bindSendMailClick();
        bindVerificationCode();
        bindShowPassword();
    };
    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/sys/user/retrieve/password/');
            initWizard();
            bindResetPassword();
            bind();
        }
    };
}();
//== 初始化
$(document).ready(function () {
    mRetrievePassword.init();
});