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
                $('.user-avatar > img').attr('src', res.data);
                refreshLocalCache();
            }
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
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mPersonalCenter.init();
});