//== 日志 -详情页
var SysLogInput = function () {

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/log/');
        }
    };
}();
//== 初始化
$(document).ready(function () {
    SysLogInput.init();
});