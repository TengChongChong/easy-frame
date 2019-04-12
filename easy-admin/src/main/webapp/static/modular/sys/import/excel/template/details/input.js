//== 导入模板详情-详情页
var importExcelTemplateDetails = function () {
    /**
     * 模板id
     */
    var templateId = null;
    /**
     * 导入表
     */
    var importTable = null;
    /**
     * 已查询的表结构缓存
     */
    var tableCache = {};
    /**
     * 加载配置
     */
    var loadConfig = function () {
        // 表字段
        var tableFields = loadTableFields(importTable);
        // 已配置规则
        var templateDetails = loadTemplateDetails();
        var templateSet = $('#template-set > tbody');
        /**
         * 根据字段名获取字段信息
         *
         * @param fieldName {string} 字段名
         * @return {*} 字段信息
         */
        var selectField = function (fieldName) {
            var field = null;
            $(tableFields).each(function (index, _field) {
                if (fieldName === _field.columnName) {
                    field = _field;
                    tableFields.splice(index, 1);
                    return;
                }
            });
            return field;
        };
        /**
         * 生成一行配置
         *
         * @param field {object} 数据库列
         * @param detail {object|null} 导入规则
         */
        var generateRow = function (field, detail) {
            templateSet.append('<tr>\
                    <td class="cell-base">' + getCheckbox('needImport', null) + '</td>\
                    <td class="cell-base m--padding-top-15"><input type="hidden" name="columnName" value="' + field['name'] + '" />' + (field['keyFlag'] ? '<i class="text-info la la-key"></i>' : '') + field['name'] + '</td>\
                    <td class="cell-base m--padding-top-15">' + field['type'] + '</td>\
                    <td class="cell-base m--padding-top-15"><div title="' + field['comment'] + '" class="ell" style="max-width: 140px;">' + field['comment'] + '<span/></td>\
                    <td class="cell-base">' + getCheckbox('needReplace', (detail && detail.replaceTableFieldName ? 'checked' : '')) + '</td>\
                    <td class="cell-base">' + getSelect('table-name', 'replaceTable', detail ? detail.replaceTable : null) + '</td>\
                    <td class="cell-base">\
                        <select class="form-control m-bootstrap-select select-picker"\
                                name="replaceTableDictType" data-live-search="true">' + getDictTypeOption(detail ? detail.replaceTableDictType : null) + '\
                        </select>\
                    </td>\
                    <td class="cell-base">' + getSelect('table-field', 'replaceTableFieldName', detail ? detail.replaceTableFieldName : null) + '</td>\
                    <td class="cell-base">' + getSelect('table-field', 'replaceTableFieldValue', detail ? detail.replaceTableFieldValue : null) + '</td>\
                    <td class="cell-base">' + getCheckbox('required', (detail && detail.required ? 'checked' : '')) + '</td>\
                    <td class="cell-base">' + getCheckbox('isOnly', (detail && detail.isOnly ? 'checked' : '')) + '</td>\
                    <td class="cell-base">'+getInput('orderNo', detail ? detail.orderNo : null)+'</td>\
                </tr>');
        };
        /**
         * 查询表结构,优先从变量里获取
         *
         * @param tableName {string} 表名
         */
        var selectTableFields = function (tableName) {
            var fileds;
            if(typeof tableCache[tableName] !== 'undefined'){
                fileds = tableCache[tableName];
            }else{
                fileds = loadTableFields(tableName);
                tableCache[tableName] = fileds;
            }
            return fileds;
        };
        /**
         * 根据表设置字段select
         *
         * @param tableName {string} 表名
         * @param $element {object} 要设置的select
         */
        var initTableField = function ($element, tableName, value) {
            var fileds = selectTableFields(tableName);
            var html = '';
            $(fileds).each(function (index, obj) {
                html += '<option value="' + obj.name + '" '+(value === obj.name ? 'selected' : '')+'>' +
                    (mUtil.isNotBlank(value) ? obj.name + '(' + obj.comment + ')' : obj.name) + '</option>';
            });
            $element.html(html).target('change');
        };
        if (tableFields != null && tableFields.length > 0) {
            if (templateDetails != null && templateDetails.length > 0) {
                // 设置过导入规则
                $(templateDetails).each(function (index, detail) {
                    // 查找配置规则中字段是否存在
                    var field = selectField(detail.fieldName);
                    generateRow(field, detail);
                });
            }
            // 将未配置字段加载到后面
            $(tableFields).each(function (index, field) {
                generateRow(field, null);
            });
            // 初始化select
            var tableList = loadTableList();
            if(tableList != null && tableList.length > 0){
                var html = '';
                $(tableList).each(function (index, obj) {
                    html += '<option data-comment="' + obj.text + '" value="' + obj.value + '">' +
                        (mUtil.isNotBlank(obj.text) ? obj.value + '(' + obj.text + ')' : obj.value) + '</option>';
                });
                $('.table-name').append(html).change(function () {
                    var $replaceTableFieldName = $(this).parents('tr').find('[name="replaceTableFieldName"]');
                    var $replaceTableFieldValue = $(this).parents('tr').find('[name="replaceTableFieldValue"]');
                    initTableField($replaceTableFieldName, $(this).val(), $replaceTableFieldName.data('value'));
                    initTableField($replaceTableFieldValue, $(this).val(), $replaceTableFieldValue.data('value'));
                });
                mApp.initSelectPicker('.table-name, .table-field, .select-picker');
            }
        }
    };
    /**
     * 加载表列表
     * @return {*}
     */
    var loadTableList = function () {
        var tableList = null;
        mUtil.ajax({
            url: basePath + '/auth/generation/select/table',
            async: false,
            success: function (res) {
                tableList = res.data;
            }
        });
        return tableList;
    };
    /**
     * 加载表字段
     *
     * @param tableName {string} 表名
     * @return {array} 字段列表
     */
    var loadTableFields = function (tableName) {
        var tableFields = null;
        mUtil.ajax({
            url: basePath + '/auth/generation/select/fields',
            async: false,
            data: {
                tableName: tableName
            },
            success: function (res) {
                tableFields = res.data.fields;
            }
        });
        return tableFields;
    };
    /**
     * 根据模板id获取已配置规则
     *
     * @return {array} 已配置规则
     */
    var loadTemplateDetails = function () {
        var templateDetails = null;
        mUtil.ajax({
            url: mTool.getBaseUrl() + 'select/details/' + templateId,
            async: false,
            success: function (res) {
                templateDetails = res.data;
            }
        });
        return templateDetails;
    };
    /**
     * 获取字典类型option,并标记默认值
     *
     * @param value {string} 默认值
     * @return {string}
     */
    var getDictTypeOption = function (value) {
        if (mUtil.isArray(importExcelTemplateDetails.dictType) && importExcelTemplateDetails.dictType.length > 0) {
            var _html = '<option value=""></option>';
            $(importExcelTemplateDetails.dictType).each(function (index, _dt) {
                _html += '<option ' + (_dt.type === value ? 'checked' : '') + ' value="' + _dt.type + '">' + _dt.name + '</option>'
            });
            return _html;
        }
        return '';
    };
    /**
     * 查询字典类型
     */
    var initDictType = function () {
        var dictType = null;
        mUtil.ajax({
            url: basePath + '/auth/sys/dict/type/select/all',
            async: false,
            success: function (res) {
                dictType = res.data;
            }
        });
        return dictType;
    };
    /**
     * 获取下拉
     *
     * @param className {string} 类名
     * @param name {string} 元素name
     * @param value {string} 默认值
     * @return {string}
     */
    var getSelect = function (className, name, value) {
        return '<select class="form-control m-bootstrap-select ' + className + '" name="' + name + '" \
                    data-value="' + value + '" data-live-search="true"><option value=""></option></select>';
    };
    /**
     * 获取checkbox
     * @param name {string} 元素name
     * @param status {string|null} 选中状态
     * @return {string}
     */
    var getCheckbox = function (name, status) {
        return '<label class="m-checkbox">\
                    <input type="checkbox" name="' + name + '" value="true" ' + (status ? status : '') + '>\
                    <span></span>\
                </label>';
    };
    /**
     * 获取input
     * @param name {string} 元素name
     * @param value {string} 默认值
     * @return {string}
     */
    var getInput = function (name, value) {
        return '<div style="width: 100px;"><input type="text" class="form-control" name="' + name + '" \
                    value="' + (mUtil.isNotBlank(value) ? value : '') + '" /></div>';
    };
    /**
     * 设置模板id
     *
     * @param id {string} 模板id
     */
    var setTemplateId = function (id) {
        templateId = id;
    };
    /**
     * 设置导入表
     *
     * @param table {string} 表名
     */
    var setImportTable = function (table) {
        importTable = table;
    };
    return {
        //== 初始化页面
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/sys/import/excel/template/details/');
            importExcelTemplateDetails.dictType = initDictType();
            loadConfig();
        },
        /**
         * 设置模板id
         *
         * @param id {string} 模板id
         */
        setTemplateId: function (id) {
            setTemplateId(id);
        },
        /**
         * 设置导入表
         *
         * @param table {string} 表名
         */
        setImportTable: function (table) {
            setImportTable(table);
        }
    };
}();
//== 初始化
$(document).ready(function () {
    // 设置导入模板id
    importExcelTemplateDetails.setTemplateId($('#templateId').val());
    // 设置导入表
    importExcelTemplateDetails.setImportTable($('#importTable').val());
    // 初始化
    importExcelTemplateDetails.init();
});