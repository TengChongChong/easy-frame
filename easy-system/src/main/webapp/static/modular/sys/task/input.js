//== 任务 -详情页
var SysTaskInput = function () {

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/task/');
        }
    };
}();
//== 初始化
$(document).ready(function () {
    SysTaskInput.init();
});