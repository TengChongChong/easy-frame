//== 偏好设置
var preferenceSetting = {
    key: ['id'],
    list: {
        search: ['id', 'pIds', 'tips', 'createUser', 'createDate', 'content', 'abstract', 'orderNo'],
        /**
         * 一般不显示以下字段
         * @type {Array}
         */
        exclude: ['id', 'pId', 'pIds', 'tips', 'createUser', 'createDate', 'content', 'abstract'],
        matching: {
            eq: ['status', 'state', 'typeCode'],
            like: ['name', 'simpleName', 'tips', 'code', 'content']
        }
    },
    input: {
        /**
         * 一般隐藏以下字段
         *
         * @type {Array}
         */
        hide: ['id'],
        /**
         * 一般不填写以下字段
         * @type {Array}
         */
        exclude: ['createUser', 'createDate', 'editUser', 'editDate', 'version', 'pIds'],
        // == 以下为各种类型输入框对应的常用字段名
        type: {
            text: ['name', 'simpleName', 'title', 'subtitle', 'code', 'typeCode', 'username', 'author',
                'tableName', 'businessName', 'menuName', 'departName', 'path', 'typeName', 'IDNumber',
                'nickname', 'email', 'phone'],
            number: ['orderNo', 'sort', 'age', 'money', 'year', 'month', 'day', 'hour', 'version'],
            password: ['password', 'pwd'],
            textarea: ['content', 'introduce', 'tips'],
            hidden: ['id', 'wid', 'pId'],
            select: ['type', 'status', 'level', 'levels'],
            select_multiple: [],
            radio: ['sex'],
            checkbox: ['roles'],
            date: ['date', 'birthday', 'buildDate'],
            datetime: ['strDate', 'endDate']
        }
    }
};
//== 模板
var template = {
    configLayout: {
        /**
         * 输入框组
         *
         * @param gridClass {string} 栅格class
         * @param content {string} html
         * @param propertyName {string} 实体类属性
         * @return {string} html
         */
        group: function (gridClass, content, propertyName) {
            return '<div data-prpperty-name="' + propertyName + '" class="' + gridClass + '">' + content + '</div>';
        },
        /**
         * 获取label
         * @param propertyName {string} 实体类属性
         * @param label {string} 文字说明
         * @param labelGrid {string} label 栅格class
         * @return {string} html
         */
        label: function (propertyName, label, labelGrid) {
            return '<label class="' + labelGrid + ' control-label" for="' + propertyName + '">' + label + '</label>';
        },
        input: {
            /**
             * 获取text
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            text: function (propertyName) {
                return '<input type="text" class="form-control" id="' + propertyName + '" name="' + propertyName + '" />';
            },
            /**
             * 获取 hidden
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            hidden: function (propertyName) {
                return '<input type="text" class="form-control" id="' + propertyName + '" name="' + propertyName + '" />';
            },
            /**
             * 获取 select
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            select: function (propertyName) {
                return '<select class="form-control m-bootstrap-select select-picker" id="' + propertyName + '" name="' + propertyName + '"></select>';
            },
            /**
             * 获取 select_multiple
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            select_multiple: function (propertyName) {
                return '<select class="form-control m-bootstrap-select select-picker" id="' + propertyName + '" name="' + propertyName + '"></select>';
            },
            /**
             * 获取 textarea
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            textarea: function (propertyName) {
                return '<texearea class="form-control" id="' + propertyName + '" name="' + propertyName + '"></texearea>';
            },
            /**
             * 获取 radio
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            radio: function (propertyName) {
                return '<input type="radio" class="form-control" id="' + propertyName + '" name="' + propertyName + '" />';
            },
            /**
             * 获取 checkbox
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            checkbox: function (propertyName) {
                return '<input type="checkbox" class="form-control" id="' + propertyName + '" name="' + propertyName + '" />';
            },
            /**
             * 获取 date
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            date: function (propertyName) {
                return '<input type="text" class="form-control" id="' + propertyName + '" name="' + propertyName + '" />';
            },
            /**
             * 获取 datetime
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            datetime: function (propertyName) {
                return '<input type="text" class="form-control" id="' + propertyName + '" name="' + propertyName + '" />';
            },
            /**
             * 获取 password
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            password: function (propertyName) {
                return '<input type="password" class="form-control" id="' + propertyName + '" name="' + propertyName + '" />';
            },
            /**
             * 获取 number
             *
             * @param propertyName {string} 实体类属性
             * @return {string} html
             */
            number: function (propertyName) {
                return '<input type="number" class="form-control" id="' + propertyName + '" name="' + propertyName + '" />';
            },
        }
    }
};
var generationTool = {
    /**
     * 生成模板
     * @type {object}
     */
    generatorTemplate: {
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
    },
    /**
     * 字典类型
     */
    dictType: [],
    /**
     * 列配置
     */
    fieldConfig: [],

    /**
     * 使用表名第一个_之前的作为模块名,如果模块不存在默认为"business"
     * @param tableName {string} 表名
     * @returns {string} 模块名
     */
    getModule: function (tableName) {
        var _module = tableName.substr(0, tableName.indexOf('_'));
        if ($('#module').find('[value="' + _module + '"]').length > 0) {
            return _module;
        } else {
            return 'business';
        }
    },
    /**
     * 获取实体类名称
     *
     * @param tableName {string} 表名
     * @returns {string} 实体类名称
     */
    getModelName: function (tableName) {
        var temp = tableName.split('_');
        var modelName;
        if (temp.length === 1) {
            modelName = tableName;
        } else {
            modelName = '';
            $(temp).each(function (index, _temp) {
                modelName += _temp.substr(0, 1).toLocaleUpperCase() + _temp.substr(1, _temp.length);
            });
        }
        return modelName;
    },
    /**
     * 获取controller中@RequestMapping值
     * @param tableName {string} 表名
     * @returns {string}
     */
    getControllerMapping: function (tableName) {
        return tableName.replaceAll('_', '/');
    },
    /**
     * 获取controller方法中@RequiresPermissions值
     * @param tableName {string} 表名
     * @returns {string}
     */
    getPermissionsCode: function (tableName) {
        return tableName.replaceAll('_', ':');
    },
    /**
     * 设置最近使用的项目路径
     */
    setLatelyPath: function () {
        var projectPath = $('#projectPath').val();
        if (mUtil.isNotBlank(projectPath)) {
            var latelyPath = mTool.cacheGet('latelyPath');
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
    },
    /**
     * 获取最近使用的项目路径
     *
     * @return {array|null}
     */
    getLatelyPath: function () {
        var latelyPath = mTool.cacheGet('latelyPath');
        if (mUtil.isNotBlank(latelyPath)) {
            latelyPath = $.parseJSON(latelyPath);
        } else {
            latelyPath = null;
        }
        return latelyPath;
    },
    /**
     * 重置表单
     */
    resetForm: function () {
        $('#module').val('').trigger("change");
        $('#controllerMapping, #viewPath, #permissionsCode, #modelName, #businessName, #menuName').val('');
        $('#field-set > tbody').html('');
    },
    /**
     * 获取字典下拉
     *
     * @param dictType {string} 字典类型
     * @param name {string} 元素name
     * @param value {string} 默认值
     * @return {string}
     */
    getDictSelect: function (dictType, name, value) {
        return '<select class="form-control m-bootstrap-select select-picker" name="' + name + '" \
                    data-value="' + value + '" data-dict-type="' + dictType + '" data-live-search="true"></select>';
    },
    /**
     * 获取checkbox
     * @param name {string} 元素name
     * @param status {string} 选中状态
     * @return {string}
     */
    getCheckbox: function (name, status) {
        return '<label class="m-checkbox">\
                        <input type="checkbox" name="' + name + '" value="true" ' + status + '>\
                        <span></span>\
                    </label>';
    },
    /**
     * 获取input
     * @param name {string} 元素name
     * @param value {string} 默认值
     * @return {string}
     */
    getInput: function (name, value) {
        return '<div style="width: 100px;"><input type="text" class="form-control" name="' + name + '" \
                    value="' + (mUtil.isNotBlank(value) ? value : '') + '" /></div>';
    },
    /**
     * 根据偏好设置获取checkbox是否默认选中
     *
     * @param propertyName {string} 列名
     * @param setting 偏好设置
     * @return {string} 选中状态
     */
    getCheckStatusByPreferenceSetting: function (propertyName, setting) {
        if (mUtil.isArray(setting) && setting.length > 0) {
            if (setting.indexOf(propertyName) > -1) {
                return '';
            }
        }
        return 'checked';
    },
    /**
     * 根据偏好设置获取elementType/matching默认值
     *
     * @param propertyName {string} 列名
     * @param setting {object} 偏好设置
     * @param defaultValue {string} 默认值
     * @return {string} 选中状态
     */
    getDefaultDictByPreferenceSetting: function (propertyName, setting, defaultValue) {
        if (typeof setting !== 'undefined') {
            for (var type in setting) {
                if (setting[type].indexOf(propertyName) > -1) {
                    return type;
                }
            }
        }
        return defaultValue;
    },

    /**
     * 获取字典类型option,并标记默认值
     *
     * @param propertyName {string} 列名
     * @return {string}
     */
    getDictTypeOption: function (propertyName) {
        if (mUtil.isArray(generationTool.dictType) && generationTool.dictType.length > 0) {
            var _html = '<option value=""></option>';
            $(generationTool.dictType).each(function (index, _dt) {
                _html += '<option ' + (_dt.type === propertyName ? 'checked' : '') + ' value="' + _dt.type + '">' + _dt.name + '</option>'
            });
            return _html;
        }
        return '';
    },
    /**
     * 根据勾选的checkbox获取配置
     *
     * return {array} config
     */
    getFieldConfig: function () {
        var rows = $('#field-set > tbody > tr');
        var configs = [];
        $(rows).each(function (index, row) {
            row = $(row);
            var _config = {};
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
    },
    /**
     * 根据指定类型获取config
     *
     * @param type {string} showInInput/showInList/showInSearch
     * @return {Array} configs
     */
    selectFieldConfig: function (type) {
        var configs = [];
        if (generationTool.fieldConfig.length > 0) {
            $(generationTool.fieldConfig).each(function (index, config) {
                if (config[type]) {
                    configs.push(config);
                }
            });
        }
        return configs;
    },
    /**
     * 用栅格将输入框包起来
     *
     * @param grid {string} 栅格
     * @param content {string} 内容
     * @return {string} html
     */
    wrapUpGrid: function (grid, content) {
        var gridClass = null;
        if ('12/2/10' === grid || '12/2/5' === grid || '12/2/8' === grid) {
            gridClass = 'col-12';
        } else if ('6/4/8' === grid) {
            gridClass = 'col-xl-4 col-lg-6 col-12';
        } else if ('4/4/8' === grid) {
            gridClass = 'col-xl-3 col-lg-4 col-md-6 col-12';
        } else if ('3/4/8' === grid) {
            gridClass = 'col-lg-3 col-md-4 col-sm-6 col-12';
        }
        return '<div class="' + gridClass + '">' + content + '</div>';
    },
    /**
     * 设置默认值
     * 如: 作者/项目路径
     */
    setDefault: function () {
        var latelyPath = generationTool.getLatelyPath();
        if (latelyPath != null) {
            $('#projectPath').val(latelyPath[0]);
            var $latelyPath = $('#lately-path');
            $(latelyPath).each(function (index, path) {
                $latelyPath.append('<a class="dropdown-item" href="javascript:;">' + path + '</a>');
            });
            $latelyPath.find('a').click(function () {
                $('#projectPath').val($(this).html());
            });
        }
        $('#author').val(mTool.getUser(true)['nickname']);
    },

    /**
     * 初始化生成模板
     */
    initGeneratorTemplate: function () {
        var $generatorTemplate = $('#generatorTemplate');
        $generatorTemplate.change(function () {
            var template = $generatorTemplate.val();
            generationTool.resetFileAndMethod();
            if (typeof generationTool.generatorTemplate[template] !== 'undefined') {
                // 如果选择的生成模板有对应的配置
                generationTool.setFileAndMethodChecked(generationTool.generatorTemplate[template]);
            }
        }).change();
    },
    /**
     * 设置文件以及方法checkbox
     *
     * @param config {object} 勾选内容
     */
    setFileAndMethodChecked: function (config) {
        var checkedCheckbox = function (elementNames) {
            if (typeof elementNames !== 'undefined') {
                $(elementNames).each(function (index, elementName) {
                    $('[name="' + elementName + '"]').prop('checked', true);
                });
            }
        };
        checkedCheckbox(config['file']);
        checkedCheckbox(config['method']);
    },
    /**
     * 重置文件以及方法checkbox
     */
    resetFileAndMethod: function () {
        $(generationTool.generatorTemplate.default.file).each(function (index, elementName) {
            $('[name="' + elementName + '"]').prop('checked', false);
        });
        $(generationTool.generatorTemplate.default.method).each(function (index, elementName) {
            $('[name="' + elementName + '"]').prop('checked', false);
        });
    },
    /**
     * 查询字典类型
     */
    initDictType: function () {
        mUtil.ajax({
            url: basePath + '/auth/sys/dict/type/select/all',
            success: function (res) {
                generationTool.dictType = res.data;
            }
        });
    },

};