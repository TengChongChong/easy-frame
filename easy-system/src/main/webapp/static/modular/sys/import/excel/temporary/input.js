//== 导入临时表-列表页
var temporaryInput = function () {
    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/import/excel/temporary/');
        }
    };
}();
//== 初始化
$(document).ready(function () {
    temporaryInput.init();
});