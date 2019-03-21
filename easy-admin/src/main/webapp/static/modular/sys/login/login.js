//== 登录 Class
var Login = function () {
    //== 私有函数
    /**
     * 显示提示信息
     *
     * @param form 表单
     * @param type 提示类型
     * @param msg 文字
     */
    var showMsg = function (form, type, msg) {
        var alert = $('<div class="m-alert alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        mUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    };
    /**
     * 表单验证
     * @param $form {object} 表单对象
     * @param data {object} 表单内容
     * @return {boolean} true/false
     */
    var validate = function ($form, data) {
        if (mUtil.isBlank(data.username)) {
            showMsg($form, 'danger', '请输入用户名');
            return false;
        }
        if (mUtil.isBlank(data.password)) {
            showMsg($form, 'danger', '请输入密码');
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
            rememberMe: $form.find('[name="rememberMe"]').prop('checked')
        };
        if (validate($form, data)) {
            data.password = $.md5(data.password);
            var $btnLogin = $('#btn-login');
            mUtil.setButtonWait($btnLogin);
            mUtil.ajax({
                url: basePath + '/login',
                type: 'post',
                data: data,
                needAlert: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    mUtil.offButtonWait($btnLogin);
                    showMsg($form, 'danger', '网络异常，请稍后重试');
                },
                fail: function (res) {
                    mUtil.offButtonWait($btnLogin);
                    showMsg($form, 'danger', res.message);
                },
                success: function (res) {
                    showMsg($form, 'success', '登录成功');
                    window.location.href = basePath;
                }
            });
        }
    };

    //== 公开函数
    return {
        init: function () {
            $('#btn-login').click(function () {
                login();
            });
        }
    };
}();

//== Class 初始化
$(document).ready(function () {
    Login.init();
});