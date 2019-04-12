//== 导入模板-详情页
var mSysImportExcelTemplateInput = function () {
    /**
     * 加载表
     */
    var initTableSelect = function () {
        var importTable = $('#importTable');
        importTable.append('<option value="">&nbsp;</option>');
        mUtil.ajax({
            url: basePath + '/auth/generation/select/table',
            success: function (res) {
                if (mUtil.isArray(res.data) && res.data.length > 0) {
                    $(res.data).each(function (index, obj) {
                        importTable.append('<option data-comment="' + obj.text + '" value="' + obj.value + '">' +
                            (mUtil.isNotBlank(obj.text) ? obj.value + '(' + obj.text + ')' : obj.value) + '</option>');
                    });
                    importTable.selectpicker().change(function () {
                        // 检查是否需要用表注释自动填充导入模板名称
                        var $name = $('#name');
                        var name = $name.val();
                        if(mUtil.isBlank(name) || name === mSysImportExcelTemplateInput.lastTimeName){
                            var checkedOption = importTable.find(':checked');
                            var comment = checkedOption.data('comment');
                            $name.val(comment);
                            mSysImportExcelTemplateInput.lastTimeName = comment;
                        }
                        // 检查是否需要用表名自动填充导入模板代码
                        var $importCode = $('#importCode');
                        var importCode = $importCode.val();
                        if(mUtil.isBlank(importCode) || importCode === mSysImportExcelTemplateInput.lastTimeCode){
                            var tableName = importTable.val();
                            var _importCode = tableName.replaceAll('_', ":");
                            $importCode.val(_importCode);
                            mSysImportExcelTemplateInput.lastTimeCode = _importCode;
                        }
                    });
                }
            }
        });
    };

    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/import/excel/template/');
            initTableSelect();
        }
    };
}();
//== 初始化
$(document).ready(function () {
    mSysImportExcelTemplateInput.init();
});