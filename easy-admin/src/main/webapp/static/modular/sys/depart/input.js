//== 机构管理-列表页
let mDepartInput = function () {

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/depart/');

        }
    };
}();
//== 初始化
$(document).ready(function () {
    mDepartInput.init();
});