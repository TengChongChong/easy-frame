//== 字典管理-新增/修改
var mDictInput = function () {
    /**
     * 加载上级字典列表
     *
     * @param dictType 字典类型
     */
    var loadUpDicts = function (dictType) {
        var $pCode = $('#pCode');
        if (KTUtil.isNotBlank(dictType)) {
            KTUtil.ajax({
                url: KTTool.getBaseUrl() + dictType + '/dicts',
                success: function (res) {
                    console.log(res);
                    $pCode.empty();
                    if (res.data.length > 0) {
                        $pCode.append('<option value=""></option>');
                        $(res.data).each(function (index, data) {
                            $pCode.append('<option value="' + data.value + '">' + data.text + '</option>');
                        });
                    } else {
                        $pCode.html('<option value="">暂无父字典</option>')
                    }
                    if (KTUtil.isNotBlank($pCode.attr('data-value'))) {
                        $pCode.val($pCode.attr('data-value'));
                    }
                    $pCode.selectpicker('refresh');
                }
            });
        } else {
            $pCode.html('<option value="">请选择字典类型</option>').selectpicker('refresh');
        }
    };
    /**
     * 绑定点击图标事件
     * 用于选择字典图标
     */
    var bindIconClick = function f() {
        // $('#icon_modal').on('shown.bs.modal', function (e) {
            $('.kt-demo-icon').click(function () {
                var icon = $(this).find('i').attr('class');
                $('#dict-icon > i').removeClass().addClass(icon);
                $('#icon').val(icon);
                $('#icon_modal').modal('hide');
            });
        // });
    };
    /**
     * 绑定事件
     */
    var bind = function () {
        $('#dictType').change(function () {
            var dictType = $(this).val();
            loadUpDicts(dictType);
        }).change();
        bindIconClick();
    };
    return {
        //== 初始化页面
        init: function () {
            KTTool.setBaseUrl(basePath + '/auth/sys/dict/');
            bind();
        }
    };
}();

//== 初始化
$(document).ready(function () {
    mDictInput.init();
});