//== 500 错误页面
var m500 = function () {
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
            if (mUtil.isNotBlank(trace)) {
                var traces = trace.split('<br>');
                $trace.empty();
                $(traces).each(function (index, _trace) {
                    if (_trace.indexOf(package) > -1) {
                        $trace.append('<span class="m--font-danger">' + _trace + '</span><br>');
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
            initTrace();
        }
    };
}();
//== 初始化
$(document).ready(function () {
    m500.init();
});