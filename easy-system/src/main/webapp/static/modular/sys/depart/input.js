//== 机构管理-列表页
var mDepartInput = function () {

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/depart/');

        }
    };
}();
//== 初始化
$(document).ready(function () {
    mDepartInput.init();
});