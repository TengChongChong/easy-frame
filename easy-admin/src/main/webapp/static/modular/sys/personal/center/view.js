//== 个人中心
var mPersonalCenter = function () {

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/personal/center/');

        }
    };
}();

//== 初始化
$(document).ready(function () {
    mPersonalCenter.init();
});