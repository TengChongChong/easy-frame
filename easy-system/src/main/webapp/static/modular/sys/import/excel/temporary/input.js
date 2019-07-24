//== 导入临时表-列表页
var temporaryInput = function () {

    /**
     * 保存回调
     */
    var saveCallback = function () {
        // 由于后端限制只有验证通过数据才能保存,所以这里写死
        $('#verification-results').removeClass('kt-font-danger').addClass('kt-font-success').html('验证通过');
    };

    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/import/excel/temporary/');
        },
        /**
         * 保存回调
         */
        saveCallback: function () {
            saveCallback();
        }
    };
}();
//== 初始化
$(document).ready(function () {
    temporaryInput.init();
});