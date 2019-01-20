//== 代码自动生成
let mGeneration = function () {
    //== Private functions
    /**
     * 是否是跳转到指定页进入的回调
     *
     * @type {boolean}
     */
    let isGoTo = false;
    /**
     * 字典类型
     */
    let dictType = [];
    /**
     * 列配置
     */
    let fieldConfig = [];
    /**
     * 生成模板
     * @type {object}
     */
    let generatorTemplate = {
        default: {
            file: ['controllerSwitch', 'daoSwitch', 'mappingSwitch', 'serviceSwitch', 'serviceImplSwitch',
                'listSwitch', 'listJsSwitch', 'inputSwitch', 'inputJsSwitch'],
            method: ['add', 'delete', 'save', 'select']
        },
        defaultOnlySelect: {
            file: ['controllerSwitch', 'daoSwitch', 'mappingSwitch', 'serviceSwitch',
                'serviceImplSwitch', 'listSwitch', 'listJsSwitch'],
            method: ['select']
        },
        bizAndDao: {
            file: ['daoSwitch', 'mappingSwitch', 'serviceSwitch', 'serviceImplSwitch'],
        },
        dao: {
            file: ['daoSwitch', 'mappingSwitch'],
        }
    };

    let wizard;
    /**
     * 初始化表单向导
     */
    let initWizard = function () {
        //== 初始化
        wizard = new mWizard('m_wizard', {
            startStep: 1
        });

        //== 下一步
        wizard.on('beforeNext', function (wizardObj) {
            if (!isGoTo) {
                let listSwitch = $('[name="listSwitch"]').prop('checked');
                let inputSwitch = $('[name="inputSwitch"]').prop('checked');
                if (wizardObj.currentStep === 1) {
                    // 保存最近使用的路径
                    setLatelyPath();
                } else if (wizardObj.currentStep === 2) {
                    // 第二步点击下一步的时候要检查有无必要配置 [	字段信息] [list 页面布局] [input 页面布局]
                    if (!listSwitch && !inputSwitch) {
                        isGoTo = true;
                        wizard.goTo(6);
                        wizardObj.stop();
                    }
                } else if (wizardObj.currentStep === 3) {
                    fieldConfig = getFieldConfig();
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
                let needValid = $('#m_wizard_form_step_' + wizardObj.currentStep).find('input,select');
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
                let listSwitch = $('[name="listSwitch"]').prop('checked');
                let inputSwitch = $('[name="inputSwitch"]').prop('checked');
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
    let initSubmit = function () {
        let btn = $('#m_form').find('[data-wizard-action="submit"]');
        btn.on('click', function (e) {
            e.preventDefault();
        });
    };
    /**
     * 加载表
     */
    let initTableSelect = function () {
        let tableName = $('#tableName');
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
    let tableChange = function () {
        /**
         * 使用表名第一个_之前的作为模块名,如果模块不存在默认为"business"
         * @param tableName {string} 表名
         * @returns {string} 模块名
         */
        let getModule = function (tableName) {
            let _module = tableName.substr(0, tableName.indexOf('_'));
            if ($('#module').find('[value="' + _module + '"]').length > 0) {
                return _module;
            } else {
                return 'business';
            }
        };
        /**
         * 获取实体类名称
         *
         * @param tableName {string} 表名
         * @returns {string} 实体类名称
         */
        let getModelName = function (tableName) {
            let temp = tableName.split('_');
            let modelName;
            if (temp.length === 1) {
                modelName = tableName;
            } else {
                modelName = '';
                $(temp).each(function (index, _temp) {
                    modelName += _temp.substr(0, 1).toLocaleUpperCase() + _temp.substr(1, _temp.length);
                });
            }
            return modelName;
        };
        /**
         * 获取controller中@RequestMapping值
         * @param tableName {string} 表名
         * @returns {string}
         */
        let getControllerMapping = function (tableName) {
            return tableName.replaceAll('_', '/');
        };
        /**
         * 获取controller方法中@RequiresPermissions值
         * @param tableName {string} 表名
         * @returns {string}
         */
        let getPermissionsCode = function (tableName) {
            return tableName.replaceAll('_', ':');
        };
        /**
         * 加载列设置
         * @param tableName {string} 表名
         */
        let loadFieldSet = function (tableName) {
            /**
             * 获取字典下拉
             *
             * @param dictType {string} 字典类型
             * @param name {string} 元素name
             * @param value {string} 默认值
             * @return {string}
             */
            let getDictSelect = function (dictType, name, value) {
                return '<select class="form-control m-bootstrap-select select-picker" name="' + name + '" \
                    data-value="' + value + '" data-dict-type="' + dictType + '" data-live-search="true"></select>';
            };
            /**
             * 获取checkbox
             * @param name {string} 元素name
             * @param status {string} 选中状态
             * @return {string}
             */
            let getCheckbox = function (name, status) {
                return '<label class="m-checkbox">\
                        <input type="checkbox" name="' + name + '" value="true" ' + status + '>\
                        <span></span>\
                    </label>';
            };
            /**
             * 获取input
             * @param name {string} 元素name
             * @param value {string} 默认值
             * @return {string}
             */
            let getInput = function (name, value) {
                return '<div style="width: 100px;"><input type="text" class="form-control" name="' + name + '" \
                    value="' + (mUtil.isNotBlank(value) ? value : '') + '" /></div>';
            };
            /**
             * 根据偏好设置获取checkbox是否默认选中
             *
             * @param propertyName {string} 列名
             * @param setting 偏好设置
             * @return {string} 选中状态
             */
            let getCheckStatusByPreferenceSetting = function (propertyName, setting) {
                if (mUtil.isArray(setting) && setting.length > 0) {
                    if (setting.indexOf(propertyName) > -1) {
                        return '';
                    }
                }
                return 'checked';
            };
            /**
             * 根据偏好设置获取elementType/matching默认值
             *
             * @param propertyName {string} 列名
             * @param setting {object} 偏好设置
             * @param defaultValue {string} 默认值
             * @return {string} 选中状态
             */
            let getDefaultDictByPreferenceSetting = function (propertyName, setting, defaultValue) {
                if (typeof setting !== 'undefined') {
                    for (let type in setting) {
                        if (setting[type].indexOf(propertyName) > -1) {
                            return type;
                        }
                    }
                }
                return defaultValue;
            };

            /**
             * 获取字典类型option,并标记默认值
             *
             * @param propertyName {string} 列名
             * @return {string}
             */
            let getDictTypeOption = function (propertyName) {
                if (mUtil.isArray(dictType) && dictType.length > 0) {
                    let _html = '<option value=""></option>';
                    $(dictType).each(function (index, _dt) {
                        _html += '<option ' + (_dt.type === propertyName ? 'checked' : '') + ' value="' + _dt.type + '">' + _dt.name + '</option>'
                    });
                    return _html;
                }
                return '';
            };
            /**
             * 获取当前 field 配置
             * @param index {number} 序号
             * @param field {object} 列配置
             * @return {string} html
             */
            let getConfigRow = function (index, field) {
                return '<tr data-name="' + field['name'] + '" data-property-name="' + field['propertyName'] + '">\
                    <td class="cell-base m--padding-top-15">' + (index + 1) + '</td>\
                    <td class="cell-base m--padding-top-15">' + (field['keyIdentityFlag'] ? '<i class="text-info la la-key"></i>' : '') + field['name'] + '</td>\
                    <td class="cell-base m--padding-top-15">' + field['type'] + '</td>\
                    <td class="cell-base m--padding-top-15"><div title="' + field['comment'] + '" class="ell" style="max-width: 140px;">' + field['comment'] + '<span/></td>\
                    <td class="cell-base m--padding-top-15">' + field['propertyName'] + '</td>\
                    <td class="cell-base m--padding-top-15">' + field['propertyType'] + '</td>\
                    <td class="cell-list">' + getCheckbox('showInSearch', getCheckStatusByPreferenceSetting(field['propertyName'], preferenceSetting.list.search)) + '</td>\
                    <td class="cell-list">' + getInput('title', field['comment']) + '</td>\
                    <td class="cell-list">' + getCheckbox('showInList', getCheckStatusByPreferenceSetting(field['propertyName'], preferenceSetting.list.exclude)) + '</td>\
                    <td class="cell-list">' + getDictSelect('matchingMode', 'matchingMode', getDefaultDictByPreferenceSetting(field['propertyName'], preferenceSetting.list.matching, 'eq')) + '</td>\
                    <td class="cell-input">' + getCheckbox('showInInput', getCheckStatusByPreferenceSetting(field['propertyName'], preferenceSetting.input.exclude)) + '</td>\
                    <td class="cell-input">' + getInput('label', field['comment']) + '</td>\
                    <td class="cell-input">' + getDictSelect('elementType', 'elementType', getDefaultDictByPreferenceSetting(field['propertyName'], preferenceSetting.input.type, 'text')) + '</td>\
                    <td class="cell-input">' + getDictSelect('grid', 'grid', '4/4/8') + '</td>\
                    <td class="cell-input">\
                        <select class="form-control m-bootstrap-select select-picker"\
                                name="dictType" data-live-search="true">' + getDictTypeOption(field['name']) + '\
                        </select>\
                    </td>\
                    <td class="cell-input">' + getCheckbox('required', '') + '</td>\
                    <td class="cell-input">' + getDictSelect('verification', 'validate', '') + '</td>\
                </tr>'
            };
            mUtil.ajax({
                url: mTool.getBaseUrl() + 'select/fields',
                data: {
                    tableName: tableName
                },
                success: function (res) {
                    let fieldSet = $('#field-set > tbody');
                    $(res.data.fields).each(function (index, field) {
                        fieldSet.append(getConfigRow(index, field));
                    });
                    mApp.initSelectPicker(fieldSet.find('[data-dict-type], .select-picker'));
                    new PerfectScrollbar('#field-set-scrollable');
                }
            });
        };
        // 重置表单
        resetForm();
        let checkedOption = $('#tableName > :checked');
        let tableName = checkedOption.attr('value');
        let tableComment = checkedOption.data('comment');
        if (mUtil.isNotBlank(tableName)) {
            if (mUtil.isNotBlank(tableComment)) {
                $('#businessName, #menuName').val(tableComment);
            }
            $('#module').val(getModule(tableName)).trigger("change");
            $('#modelName').val(getModelName(tableName));
            $('#controllerMapping').val(getControllerMapping(tableName));
            $('#viewPath').val(getControllerMapping(tableName));
            $('#permissionsCode').val(getPermissionsCode(tableName));
        }
        loadFieldSet(tableName);
    };
    /**
     * 设置最近使用的项目路径
     */
    let setLatelyPath = function () {
        let projectPath = $('#projectPath').val();
        if (mUtil.isNotBlank(projectPath)) {
            let latelyPath = mTool.cacheGet('latelyPath');
            if (mUtil.isNotBlank(latelyPath)) {
                latelyPath = $.parseJSON(latelyPath);
                // 检查是否路径已缓存
                $(latelyPath).each(function (index, path) {
                    if (path === projectPath) {
                        // 如果已经缓存则删掉,在下面重新添加
                        latelyPath.splice(index, 1);
                    }
                });
                if (latelyPath.length >= 5) {
                    latelyPath.pop();
                }
            } else {
                latelyPath = [];
            }
            latelyPath.unshift(projectPath);
            mTool.cacheSet('latelyPath', latelyPath);
        }
    };
    /**
     * 获取最近使用的项目路径
     *
     * @return {array|null}
     */
    let getLatelyPath = function () {
        let latelyPath = mTool.cacheGet('latelyPath');
        if (mUtil.isNotBlank(latelyPath)) {
            latelyPath = $.parseJSON(latelyPath);
        } else {
            latelyPath = null;
        }
        return latelyPath;
    };
    /**
     * 设置默认值
     * 如: 作者/项目路径
     */
    let setDefault = function () {
        let latelyPath = getLatelyPath();
        if (latelyPath != null) {
            $('#projectPath').val(latelyPath[0]);
            let $latelyPath = $('#lately-path');
            $(latelyPath).each(function (index, path) {
                $latelyPath.append('<a class="dropdown-item" href="javascript:;">' + path + '</a>');
            });
            $latelyPath.find('a').click(function () {
                $('#projectPath').val($(this).html());
            });
        }
        $('#author').val(mTool.getUser(true)['nickname']);
    };
    /**
     * 重置表单
     */
    let resetForm = function () {
        $('#module').val('').trigger("change");
        $('#controllerMapping, #viewPath, #permissionsCode, #modelName, #businessName, #menuName').val('');
        $('#field-set > tbody').html('');
    };
    /**
     * 初始化生成模板
     */
    let initGeneratorTemplate = function () {
        let $generatorTemplate = $('#generatorTemplate');
        $generatorTemplate.change(function () {
            let template = $generatorTemplate.val();
            resetFileAndMethod();
            if (typeof generatorTemplate[template] !== 'undefined') {
                // 如果选择的生成模板有对应的配置
                setFileAndMethodChecked(generatorTemplate[template]);
            }
        }).change();
    };
    /**
     * 设置文件以及方法checkbox
     *
     * @param config {object} 勾选内容
     */
    let setFileAndMethodChecked = function (config) {
        let checkedCheckbox = function (elementNames) {
            if (typeof elementNames !== 'undefined') {
                $(elementNames).each(function (index, elementName) {
                    $('[name="' + elementName + '"]').prop('checked', true);
                });
            }
        };
        checkedCheckbox(config['file']);
        checkedCheckbox(config['method']);
    };
    /**
     * 重置文件以及方法checkbox
     */
    let resetFileAndMethod = function () {
        $(generatorTemplate.default.file).each(function (index, elementName) {
            $('[name="' + elementName + '"]').prop('checked', false);
        });
        $(generatorTemplate.default.method).each(function (index, elementName) {
            $('[name="' + elementName + '"]').prop('checked', false);
        });
    };
    /**
     * 查询字典类型
     */
    let initDictType = function () {
        mUtil.ajax({
            url: basePath + '/auth/sys/dict/type/select/all',
            success: function (res) {
                dictType = res.data
            }
        });
    };
    /**
     * 根据勾选的checkbox获取配置
     *
     * return {array} config
     */
    let getFieldConfig = function () {
        let rows = $('#field-set > tbody > tr');
        let configs = [];
        $(rows).each(function (index, row) {
            row = $(row);
            let _config = {};
            $(row).find('[name]').each(function (index, element) {
                if (element.type === 'checkbox') {
                    _config[element.name] = element.checked;
                } else {
                    _config[element.name] = element.value;
                }
            });
            _config.propertyName = row.data('property-name');
            configs.push(_config);
        });
        return configs;
    };
    /**
     * 根据指定类型获取config
     *
     * @param type {string} showInInput/showInList/showInSearch
     * @return {Array} configs
     */
    let selectFieldConfig = function (type) {
        let configs = [];
        if (fieldConfig.length > 0) {
            $(fieldConfig).each(function (index, config) {
                if (config[type]) {
                    configs.push(config);
                }
            });
        }
        return configs;
    };
    let getInputElement = function (config) {

    };
    /**
     * 获取缩进
     *
     * @param lev {number} 缩进数量
     * @return {string}
     */
    let getTab = function (lev) {
        let tab = '';
        while (lev--) {
            tab += '    ';
        }
        return tab;
    };
    /**
     * 用栅格将输入框包起来
     *
     * @param grid {string} 栅格
     * @param content {string} 内容
     * @param tagLev {number} tagLev 用于缩进
     * @return {string} html
     */
    let wrapUpGrid = function (grid, content, tagLev) {
        let gridClass = null;
        if ('12/2/10' === grid || '12/2/5' === grid || '12/2/8' === grid) {
            gridClass = 'col-12';
        } else if ('6/4/8' === grid) {
            gridClass = 'col-xl-4 col-lg-6 col-12';
        } else if ('4/4/8' === grid) {
            gridClass = 'col-xl-3 col-lg-4 col-md-6 col-12';
        } else if ('3/4/8' === grid) {
            gridClass = 'col-lg-3 col-md-4 col-sm-6 col-12';
        }
        // return getTab(tagLev) + '<div class="' + gridClass + '">\n' + getTab(tagLev + 1) + content + '\n' + getTab(tagLev) + '</div>\n';

        return getTab(tagLev) + '<div class="' + gridClass + '">\n' + getTab(tagLev + 1) + content + '\n' + getTab(tagLev) + '</div>\n';
    };

    /**
     * 初始化list页面
     */
    let initStepList = function () {
        /**
         * 初始化查询条件
         */
        let initSearch = function () {
            let configs = selectFieldConfig('showInSearch');
            if (configs.length > 0) {
                $(configs).each(function (index, config) {
                    // 通过propertyName属性检查是不是已经放到页面中
                    let propertyName = $('#search-body [data-property-name]');
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
        let initTable = function () {

        };
        $('.business-name').html($('#businessName').val());
        initSearch();
        initTable();
    };
    /**
     * 初始化list页面
     */
    let initStepInput = function () {
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
            setDefault();
            initGeneratorTemplate();
            initDictType();
        },
        getTemplate: function(config, templatePath){
            return getTemplate(config, templatePath);
        }
    };
}();
//== 初始化
$(document).ready(function () {
    mGeneration.init();
});