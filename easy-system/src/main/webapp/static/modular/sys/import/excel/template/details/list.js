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
                if (fieldName === _field.name) {
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
            templateSet.append('<tr data-field="' + field['name'] + '">\
                    <td class="cell-base text-center"><div class="m--block-center" style="width: 20px;">' + getCheckbox('needImport', (detail ? 'checked' : null)) + '</div></td>\
                    <td class="cell-base m--padding-top-15"><input type="hidden" name="columnName" value="' + field['name'] + '" />' + (field['keyFlag'] ? '<i class="text-info la la-key"></i>' : '') + field['name'] + '</td>\
                    <td class="cell-base m--padding-top-15"><input type="hidden" name="type" value="' + field['type'] + '">' + field['type'] + '</td>\
                    <td class="cell-base"><div class="m--block-center" style="width: 75px;">' + getInput('title', detail ? detail.title : (field.comment)) + '</div></td>\
                    <td class="cell-base text-center"><div class="m--block-center" style="width: 20px;">' + getCheckbox('needReplace', (detail && detail.replaceTableFieldName ? 'checked' : '')) + '</div></td>\
                    <td class="cell-base"><div class="m--block-center" style="width: 200px;">' + getSelect('table-name', 'replaceTable', detail ? detail.replaceTable : null) + '</div></td>\
                    <td class="cell-base">\
                        <div class="m--block-center" style="width: 120px;">\
                            <select disabled class="form-control m-bootstrap-select dict-type select-picker" data-value="' + (detail ? detail.replaceTableDictType : '') + '" \
                                    name="replaceTableDictType" data-live-search="true">' + getDictTypeOption(detail ? detail.replaceTableDictType : null) + '\
                            </select>\
                        </div>\
                    </td>\
                    <td class="cell-base"><div class="m--block-center" style="width: 120px;">' + getSelect('table-field', 'replaceTableFieldName', detail ? detail.replaceTableFieldName : null) + '</div></td>\
                    <td class="cell-base"><div class="m--block-center" style="width: 120px;">' + getSelect('table-field', 'replaceTableFieldValue', detail ? detail.replaceTableFieldValue : null) + '</div></td>\
                    <td class="cell-base text-center"><div class="m--block-center" style="width: 20px;">' + getCheckbox('required', (detail && detail.required ? 'checked' : '')) + '</div></td>\
                    <td class="cell-base text-center"><div class="m--block-center" style="width: 20px;">' + getCheckbox('isOnly', (detail && detail.isOnly ? 'checked' : '')) + '</div></td>\
                    <td class="cell-base"><div class="m--block-center" style="width: 40px;">' + getInput('orderNo', detail ? detail.orderNo : null) + '</div></td>\
                </tr>');
        };
        /**
         * 查询表结构,优先从变量里获取
         *
         * @param tableName {string} 表名
         */
        var selectTableFields = function (tableName) {
            var fields;
            if (typeof tableCache[tableName] !== 'undefined') {
                fields = tableCache[tableName];
            } else {
                fields = loadTableFields(tableName);
                tableCache[tableName] = fields;
            }
            return fields;
        };
        /**
         * 根据表设置字段select
         *
         * @param tableName {string} 表名
         * @param $element {object} 要设置的select
         * @param value {object} 默认值
         */
        var initTableField = function ($element, tableName, value) {
            var html = '';
            if (mUtil.isNotBlank(tableName)) {
                var fields = selectTableFields(tableName);
                $(fields).each(function (index, obj) {
                    html += '<option value="' + obj.name + '" ' + (value === obj.name ? 'selected' : '') + '>' +
                        obj.name + (mUtil.isNotBlank(obj.comment) ? '(' + obj.comment + ')' : '') + '</option>';
                });
            }
            refreshSelectPicker($element.html(html));
        };
        /**
         * 绑定勾选/取消替换checkbox
         */
        var bindNeedReplaceChange = function () {
            $('[name="needReplace"]').change(function () {
                var checked = $(this).is(':checked');
                if (checked) {
                    refreshSelectPicker($(this).parents('tr').find('select.table-name, select.table-field').removeAttr('disabled'));
                } else {
                    refreshSelectPicker($(this).parents('tr').find('select.table-name, select.table-field').attr('disabled', true));
                }
            }).change();
            // 如果选择的是字典表,启用类别选项
            $('select.table-name').change(function () {
                var tableName = $(this).val();
                if ('sys_dict' === tableName) {
                    refreshSelectPicker($(this).parents('tr').find('select.dict-type').removeAttr('disabled'));
                } else {
                    refreshSelectPicker($(this).parents('tr').find('select.dict-type').attr('disabled', true));
                }
            }).change();
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
            new PerfectScrollbar('#template-set-scrollable');
            // 初始化select
            var tableList = loadTableList();
            if (tableList != null && tableList.length > 0) {
                var html = '';
                $(tableList).each(function (index, obj) {
                    html += '<option data-comment="' + obj.text + '" value="' + obj.value + '">' +
                        (mUtil.isNotBlank(obj.text) ? obj.value + '(' + obj.text + ')' : obj.value) + '</option>';
                });
                var $tableSelect = $('select.table-name');
                $tableSelect.append(html).change(function () {
                    var $replaceTableFieldName = $(this).parents('tr').find('[name="replaceTableFieldName"]');
                    var $replaceTableFieldValue = $(this).parents('tr').find('[name="replaceTableFieldValue"]');
                    initTableField($replaceTableFieldName, $(this).val(), $replaceTableFieldName.data('value'));
                    initTableField($replaceTableFieldValue, $(this).val(), $replaceTableFieldValue.data('value'));
                });
                mApp.initSelectPicker('.table-name, .table-field, .dict-type');
                $tableSelect.change();
            }
            //
            bindNeedReplaceChange();
        }
    };
    /**
     * 保存配置
     */
    var saveData = function ($btn) {
        mUtil.setButtonWait($btn);
        /**
         * 根据勾选的checkbox获取配置
         *
         * return {array} config
         */
        var getFieldConfig = function () {
            var rows = $('#template-set > tbody > tr');
            var configs = [];
            $(rows).each(function (index, row) {
                var $row = $(row);
                if ($row.find('[name="needImport"]').is(':checked')) {
                    var _config = {};
                    $row.find('[name]').each(function (index, element) {
                        if(!element.disabled){
                            if (element.type === 'checkbox') {
                                if (element.checked) {
                                    _config[element.name] = 1;
                                } else {
                                    _config[element.name] = 0;
                                }
                            } else {
                                _config[element.name] = element.value;
                            }
                        }else{
                            _config[element.name] = '';
                        }
                    });
                    _config.fieldName = $row.data('field');
                    _config.templateId = templateId;
                    configs.push(_config);
                }
            });
            return configs;
        };
        var configs = getFieldConfig();
        if (configs.length === 0) {
            mTool.warnTip(mTool.commonTips.fail, '请至少配置一条导入规则');
            mUtil.offButtonWait($btn);
            return;
        }
        mUtil.ajax({
            url: mTool.getBaseUrl() + 'save/data/' + templateId,
            data: JSON.stringify(configs),
            contentType: 'application/json',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                mUtil.offButtonWait($btn);
                mUtil.ajaxError(XMLHttpRequest, textStatus, errorThrown);
            },
            fail: function (res) {
                mUtil.offButtonWait($btn);
                mTool.warnTip(mTool.commonTips.fail, res.message);
            },
            success: function (res) {
                mUtil.offButtonWait($btn);
                mTool.successTip(mTool.commonTips.success, '导入规则已保存');
            }
        });

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
     * 刷新select
     *
     * @param $elements {array} select
     */
    var refreshSelectPicker = function ($elements) {
        if ($elements != null) {
            $($elements).each(function (index, element) {
                var $element = $(element);
                $element.selectpicker('refresh');
                if (mUtil.isNotBlank($element.data('value'))) {
                    $element.val($element.data('value')).change();
                }
            });
        }
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
        return '<select disabled class="form-control m-bootstrap-select ' + className + '" name="' + name + '" \
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
                    <input type="checkbox" name="' + name + '" value="1" ' + (status ? status : '') + '>\
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
        return '<input type="text" class="form-control" name="' + name + '" \
                    value="' + (mUtil.isNotBlank(value) ? value : '') + '" />';
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
            $('.btn-save').removeAttr('onclick').click(function () {
                saveData($(this));
            });
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