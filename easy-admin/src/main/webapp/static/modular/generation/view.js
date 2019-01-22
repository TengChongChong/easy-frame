//== 代码自动生成
var mGeneration = function () {
    //== Private functions
    /**
     * 是否是跳转到指定页进入的回调
     *
     * @type {boolean}
     */
    var isGoTo = false;

    var wizard;
    /**
     * 初始化表单向导
     */
    var initWizard = function () {
        //== 初始化
        wizard = new mWizard('m_wizard', {
            startStep: 1
        });

        //== 下一步
        wizard.on('beforeNext', function (wizardObj) {
            if (!isGoTo) {
                var listSwitch = $('[name="listSwitch"]').prop('checked');
                var inputSwitch = $('[name="inputSwitch"]').prop('checked');
                if (wizardObj.currentStep === 1) {
                    // 保存最近使用的路径
                    generationTool.setLatelyPath();
                } else if (wizardObj.currentStep === 2) {
                    // 第二步点击下一步的时候要检查有无必要配置 [	字段信息] [list 页面布局] [input 页面布局]
                    if (!listSwitch && !inputSwitch) {
                        isGoTo = true;
                        wizard.goTo(6);
                        wizardObj.stop();
                    }
                } else if (wizardObj.currentStep === 3) {
                    fieldConfig = generationTool.getFieldConfig();
                    // 第三步点击下一步的时候要检查有无必要配置 [list 页面布局] [input 页面布局]
                    if (!listSwitch && !inputSwitch) {
                        isGoTo = true;
                        wizard.goTo(6);
                        wizardObj.stop();
                    } else if (!listSwitch && inputSwitch) {
                        isGoTo = true;
                        wizard.goTo(5);
                        wizardObj.stop();
                    }
                } else if (wizardObj.currentStep === 4) {
                    // 第四步点击下一步的时候要检查有无必要配置[input 页面布局]
                    if (!inputSwitch) {
                        isGoTo = true;
                        wizard.goTo(6);
                        wizardObj.stop();
                    }
                }
                var needValid = $('#m_wizard_form_step_' + wizardObj.currentStep).find('input,select');
                if (needValid.length > 0) {
                    if (!needValid.valid()) {
                        // 表单验证失败 不跳转到下一步
                        wizardObj.stop();
                    }
                }
            } else {
                return true;
            }
        });
        wizard.on('beforePrev', function (wizardObj) {
            if (!isGoTo) {
                var listSwitch = $('[name="listSwitch"]').prop('checked');
                var inputSwitch = $('[name="inputSwitch"]').prop('checked');
                if (wizardObj.currentStep === 6) {
                    if (!listSwitch && !inputSwitch) {
                        // 如果不用生成list/input直接返回第2步
                        isGoTo = true;
                        wizard.goTo(2);
                        wizardObj.stop();
                    } else if (listSwitch) {
                        isGoTo = true;
                        wizard.goTo(4);
                        wizardObj.stop();
                    }
                } else if (wizardObj.currentStep === 5) {
                    // 如果不用生成list.html,则跳过第4步
                    if (!listSwitch) {
                        isGoTo = true;
                        wizard.goTo(3);
                        wizardObj.stop();
                    }
                }
            } else {
                return true;
            }

        });
        wizard.on('change', function (wizardObj) {
            isGoTo = false;
            // 每次切换,页面回到顶部
            mUtil.scrollTop();
            if (wizardObj.currentStep === 4) {
                initStepList();
            }
        });
    };
    /**
     * 初始化提交
     */
    var initSubmit = function () {
        var btn = $('#m_form').find('[data-wizard-action="submit"]');
        btn.on('click', function (e) {
            e.preventDefault();
        });
    };
    /**
     * 加载表
     */
    var initTableSelect = function () {
        var tableName = $('#tableName');
        tableName.append('<option value="">&nbsp;</option>');
        mUtil.ajax({
            url: mTool.getBaseUrl() + 'select/table',
            success: function (res) {
                if (mUtil.isArray(res.data) && res.data.length > 0) {
                    $(res.data).each(function (index, obj) {
                        tableName.append('<option data-comment="' + obj.text + '" value="' + obj.value + '">' +
                            (mUtil.isNotBlank(obj.text) ? obj.value + '(' + obj.text + ')' : obj.value) + '</option>');
                    });
                    tableName.selectpicker().change(function () {
                        tableChange();
                    });
                }
            }
        });
    };
    /**
     * 表名改变事件
     * 自动生成表单中的默认值
     */
    var tableChange = function () {
        /**
         * 加载列设置
         * @param tableName {string} 表名
         */
        var loadFieldSet = function (tableName) {
            /**
             * 获取当前 field 配置
             * @param index {number} 序号
             * @param field {object} 列配置
             * @return {string} html
             */
            var getConfigRow = function (index, field) {
                return '<tr data-name="' + field['name'] + '" data-property-name="' + field['propertyName'] + '">\
                    <td class="cell-base m--padding-top-15">' + (index + 1) + '</td>\
                    <td class="cell-base m--padding-top-15">' + (field['keyIdentityFlag'] ? '<i class="text-info la la-key"></i>' : '') + field['name'] + '</td>\
                    <td class="cell-base m--padding-top-15">' + field['type'] + '</td>\
                    <td class="cell-base m--padding-top-15"><div title="' + field['comment'] + '" class="ell" style="max-width: 140px;">' + field['comment'] + '<span/></td>\
                    <td class="cell-base m--padding-top-15">' + field['propertyName'] + '</td>\
                    <td class="cell-base m--padding-top-15">' + field['propertyType'] + '</td>\
                    <td class="cell-list">' + generationTool.getCheckbox('showInSearch', generationTool.getCheckStatusByPreferenceSetting(field['propertyName'], preferenceSetting.list.search)) + '</td>\
                    <td class="cell-list">' + generationTool.getInput('title', field['comment']) + '</td>\
                    <td class="cell-list">' + generationTool.getCheckbox('showInList', generationTool.getCheckStatusByPreferenceSetting(field['propertyName'], preferenceSetting.list.exclude)) + '</td>\
                    <td class="cell-list">' + generationTool.getDictSelect('matchingMode', 'matchingMode', generationTool.getDefaultDictByPreferenceSetting(field['propertyName'], preferenceSetting.list.matching, 'eq')) + '</td>\
                    <td class="cell-input">' + generationTool.getCheckbox('showInInput', generationTool.getCheckStatusByPreferenceSetting(field['propertyName'], preferenceSetting.input.exclude)) + '</td>\
                    <td class="cell-input">' + generationTool.getInput('label', field['comment']) + '</td>\
                    <td class="cell-input">' + generationTool.getDictSelect('elementType', 'elementType', generationTool.getDefaultDictByPreferenceSetting(field['propertyName'], preferenceSetting.input.type, 'text')) + '</td>\
                    <td class="cell-input">' + generationTool.getDictSelect('grid', 'grid', '4/4/8') + '</td>\
                    <td class="cell-input">\
                        <select class="form-control m-bootstrap-select select-picker"\
                                name="dictType" data-live-search="true">' + generationTool.getDictTypeOption(field['name']) + '\
                        </select>\
                    </td>\
                    <td class="cell-input">' + generationTool.getCheckbox('required', '') + '</td>\
                    <td class="cell-input">' + generationTool.getDictSelect('verification', 'validate', '') + '</td>\
                </tr>'
            };
            mUtil.ajax({
                url: mTool.getBaseUrl() + 'select/fields',
                data: {
                    tableName: tableName
                },
                success: function (res) {
                    var fieldSet = $('#field-set > tbody');
                    $(res.data.fields).each(function (index, field) {
                        fieldSet.append(getConfigRow(index, field));
                    });
                    mApp.initSelectPicker(fieldSet.find('[data-dict-type], .select-picker'));
                    new PerfectScrollbar('#field-set-scrollable');
                }
            });
        };
        // 重置表单
        generationTool.resetForm();
        var checkedOption = $('#tableName > :checked');
        var tableName = checkedOption.attr('value');
        var tableComment = checkedOption.data('comment');
        if (mUtil.isNotBlank(tableName)) {
            if (mUtil.isNotBlank(tableComment)) {
                $('#businessName, #menuName').val(tableComment);
            }
            $('#module').val(generationTool.getModule(tableName)).trigger("change");
            $('#modelName').val(generationTool.getModelName(tableName));
            $('#controllerMapping').val(generationTool.getControllerMapping(tableName));
            $('#viewPath').val(generationTool.getControllerMapping(tableName));
            $('#permissionsCode').val(generationTool.getPermissionsCode(tableName));
        }
        loadFieldSet(tableName);
    };

    /**
     * 初始化list页面
     */
    var initStepList = function () {
        /**
         * 初始化查询条件
         */
        var initSearch = function () {
            var configs = generationTool.selectFieldConfig('showInSearch');
            if (configs.length > 0) {
                $(configs).each(function (index, config) {
                    // 通过propertyName属性检查是不是已经放到页面中
                    var propertyName = $('#search-body [data-property-name]');
                    if (propertyName.length === 0) {
                        // 没有

                    } else {
                        // 更新label, label可能发生改变
                        propertyName.find('label').html(config.label);
                    }
                });
            }
        };
        /**
         * 初始化表格
         */
        var initTable = function () {

        };
        $('.business-name').html($('#businessName').val());
        initSearch();
        initTable();
    };
    /**
     * 初始化input页面
     */
    var initStepInput = function () {
        $('.business-name').html($('#businessName').val());
    };


    return {
        //== public functions
        /**
         * 初始化页面
         */
        init: function () {
            mTool.setBaseUrl(basePath + '/auth/generation/');
            initWizard();
            initSubmit();
            initTableSelect();
            generationTool.setDefault();
            generationTool.initGeneratorTemplate();
            generationTool.initDictType();
        }
    };
}();
//== 初始化
$(document).ready(function () {
    mGeneration.init();
});