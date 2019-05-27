//== 异常日志-详情页
var mSysExceptionInput = function () {
    /**
     * 项目包前缀
     * @type {string}
     */
    var package = 'com.frame.easy';
    /**
     * 初始化错误栈
     * 将项目内class高亮显示
     */
    var initTrace = function () {
        var $trace = $('#trace');
        if ($trace.length > 0) {
            var trace = $trace.html();
            if (KTUtil.isNotBlank(trace)) {
                var traces = trace.split('<br>');
                $trace.empty();
                $(traces).each(function (index, _trace) {
                    if (_trace.indexOf(package) > -1) {
                        $trace.append('<span class="kt-font-danger">' + _trace + '</span><br>');
                    } else {
                        $trace.append(_trace + '<br>')
                    }
                });
            }
        }
    };
    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/exception/');
            initTrace();
        }
    };
}();
//== 初始化
$(document).ready(function () {
    mSysExceptionInput.init();
});