//== 登录 Class
let Login = function () {
    let showErrorMsg = function (form, type, msg) {
        let alert = $('<div class="m-alert alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        mUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    };

    //== 私有函数
    let handleSignInFormSubmit = function () {
        $('#m_login_signin_submit').click(function (e) {
            e.preventDefault();
            let btn = $(this);
            let form = $('.m-login__form');

            form.validate({
                rules: {
                    username: {
                        required: true
                    },
                    password: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }
            // 设置登录按钮状态
            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            form.ajaxSubmit({
                url: basePath + '/login',
                type: 'post',
                success: function (response, status, xhr, $form) {
                    if (response.code == 200) {
                        window.location.href = "/";
                    } else {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        showErrorMsg(form, 'danger', response.message);
                    }
                }
            });
        });
    };

    //== 公开函数
    return {
        init: function () {
            handleSignInFormSubmit();
        }
    };
}();

//== Class 初始化
$(document).ready(function () {
    Login.init();
});