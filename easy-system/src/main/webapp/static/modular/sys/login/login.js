//== 登录 Class
var login = function () {
    /**
     * 登录失败累计多少次后需要输入验证码后才可以登录
     * @type {number}
     */
    var loginAttemptsVerificationCode = 5;
    /**
     * 登录尝试次数
     * @type {number}
     */
    var loginAttempts = 0;
    //== 私有函数
    /**
     * 显示提示信息
     *
     * @param form 表单
     * @param type 提示类型
     * @param msg 文字
     */
    var showMsg = function (form, type, msg) {
        var alert = $('<div class="alert alert-' + type + '" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    };
    /**
     * 表单验证
     * @param $form {object} 表单对象
     * @param data {object} 表单内容
     * @return {boolean} true/false
     */
    var validate = function ($form, data) {
        if (KTUtil.isBlank(data.username)) {
            showMsg($form, 'danger', '请输入用户名');
            return false;
        }
        if (KTUtil.isBlank(data.password)) {
            showMsg($form, 'danger', '请输入密码');
            return false;
        }
        if (loginAttempts >= loginAttemptsVerificationCode && KTUtil.isBlank(data.code)) {
            showMsg($form, 'danger', '请输入验证码');
            return false;
        }
        return true;
    };
    /**
     * 登录
     */
    var login = function () {
        var $form = $('form');
        var data = {
            username: $form.find('[name="username"]').val(),
            password: $form.find('[name="password"]').val(),
            code: $form.find('[name="code"]').val(),
            rememberMe: $form.find('[name="rememberMe"]').prop('checked')
        };
        if (validate($form, data)) {
            data.password = $.md5(data.password);
            var $btnLogin = $('#btn-login');
            KTUtil.setButtonWait($btnLogin);
            KTUtil.ajax({
                url: basePath + '/login',
                type: 'post',
                data: data,
                needAlert: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    KTUtil.offButtonWait($btnLogin);
                    showMsg($form, 'danger', '网络异常，请稍后重试');
                },
                fail: function (res) {
                    loginAttempts++;
                    KTUtil.offButtonWait($btnLogin);
                    if(loginAttempts >= loginAttemptsVerificationCode || '请输入验证码' === res.message){
                        // 登录失败次数达到设定值,需要输入验证码才能登录
                        $('.verification-group').removeClass('kt-hide');
                        changeVerificationCode();
                    }
                    showMsg($form, 'danger', res.message);
                },
                success: function (res) {
                    showMsg($form, 'success', '登录成功');
                    if (KTUtil.isNotBlank(basePath)) {
                        window.location.href = basePath;
                    } else {
                        window.location.href = '/';
                    }
                }
            });
        }
    };
    /**
     * 更换验证码
     */
    var changeVerificationCode = function () {
        $('.verification-code img').attr('src', basePath + '/get/verification/code?' + new Date().getTime());
    };

    //== 公开函数
    return {
        init: function () {
            try{
                loginAttemptsVerificationCode = Number($('#loginAttemptsVerificationCode').val());
            }catch (e) {}
            $('#btn-login').click(function () {
                login();
            });
            $('.verification-code img').click(function () {
                changeVerificationCode();
            });
        }
    };
}();

//== Class 初始化
$(document).ready(function () {
    login.init();
});