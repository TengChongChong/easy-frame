//== 系统参数-详情页
var mSysConfigInput = function () {
    var initDataType = function () {
        $('#type').change(function () {
            var val = $(this).val();
            if('boolean' === val){
                val = 'text';
            }
            $('#value').attr('type', val);
        });
    };
    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/config/');
            initDataType();
        }
    };
}();
//== 初始化
$(document).ready(function () {
    mSysConfigInput.init();
});