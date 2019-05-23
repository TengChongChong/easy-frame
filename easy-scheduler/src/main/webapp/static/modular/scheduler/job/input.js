//== 定时任务 -详情页
var mSchedulerJobInput = function () {

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/scheduler/job/');
        }
    };
}();
//== 初始化
$(document).ready(function () {
    mSchedulerJobInput.init();
});