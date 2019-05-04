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
                        importTable.append('<option data-subtext="' + obj.text + '" value="' + obj.value + '">' +
                            obj.value + '</option>');
                    });
                    importTable.val(importTable.data('value')).selectpicker().change(function () {
                        // 检查是否需要用表注释自动填充导入模板名称
                        var $name = $('#name');
                        var name = $name.val();
                        if (mUtil.isBlank(name) || name === mSysImportExcelTemplateInput.lastTimeName) {
                            var checkedOption = importTable.find(':checked');
                            var subtext = checkedOption.data('subtext');
                            $name.val(subtext);
                            mSysImportExcelTemplateInput.lastTimeName = subtext;
                        }
                        // 检查是否需要用表名自动填充导入模板代码
                        var tableName = importTable.val();

                        var $importCode = $('#importCode');
                        var importCode = $importCode.val();
                        if (mUtil.isBlank(importCode) || importCode === mSysImportExcelTemplateInput.lastTimeCode) {
                            var _importCode = tableName.replaceAll('_', ":");
                            $importCode.val(_importCode);
                            mSysImportExcelTemplateInput.lastTimeCode = _importCode;
                        }
                        // 检查是否需要用表名自动填充导入权限代码
                        var $permissionCode = $('#permissionCode');
                        var permissionCode = $permissionCode.val();
                        if (mUtil.isBlank(permissionCode) || permissionCode === mSysImportExcelTemplateInput.lastTimePermissionCode) {
                            var _permissionCode = tableName.replaceAll('_', ":") + ":import:data";
                            $permissionCode.val(_permissionCode);
                            mSysImportExcelTemplateInput.lastTimePermissionCode = _permissionCode;
                        }

                        // 检查是否需要用表名自动填充导入回调Bean
                        var $callback = $('#callback');
                        var callback = $callback.val();
                        if (mUtil.isBlank(callback) || callback === mSysImportExcelTemplateInput.lastTimeCallback) {
                            var _callback = underlineToHump(tableName) + "ServiceImpl";
                            $callback.val(_callback);
                            mSysImportExcelTemplateInput.lastTimeCallback = _callback;
                        }
                    });
                }
            }
        });
    };
    /**
     * 下换下转驼峰
     *
     * @param tableName {string} 表名
     * @return {string} 驼峰命名
     */
    var underlineToHump = function (tableName) {
        var temp = tableName.split('_');
        var modelName;
        if (temp.length === 1) {
            modelName = tableName;
        } else {
            modelName = '';
            $(temp).each(function (index, _temp) {
                if (index !== 0) {
                    modelName += _temp.substr(0, 1).toLocaleUpperCase() + _temp.substr(1, _temp.length);
                } else {
                    modelName += _temp;
                }
            });
        }
        return modelName;
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