//== 偏好设置
let preferenceSetting = {
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
const template = {
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
            select_multiple: '<select class="form-control m-bootstrap-select select-picker" id="' + propertyName + '" name="' + propertyName + '" multiple></select>',
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


var chartOption = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        x: 35,
        y: 30,
    },
    toolbox: {
        show: false,
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: false
            },
            magicType: {
                show: true,
                type: ['line', 'bar']
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: false,
    xAxis: [{
        type: 'category',
        data: ['2018.11.30/09:16:29', '2018.11.30', '2018.12.01', '2018.12.01', '2018.12.01', '2018.12.01'],
        //坐标轴颜色
        axisLine: {
            lineStyle: {
                color: '#aaa'
            }
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#aaa',
                fontSize: '20'
            }
        },
    }],
    yAxis: [{
        type: 'value',
        min: 0,
        max: 9,
        splitArea: {
            show: true
        },
        axisLine: {
            lineStyle: {
                color: '#aaa'
            }
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#aaa',
                fontSize: '20'
            }
        },
    }],
    series: [{
        name: '蒸发量',
        type: 'line',
        data: [2.0, 4.9, 7.0, 6.4, 3.3],
        symbol: 'none', //标记的图形
        symbolSize: 1, // 拐点的大小
        label: {
            normal: {
                show: true,
                color: '#ddd', // 数字颜色
                position: 'top'
            }
        },
        itemStyle: {
            normal: {
                borderColor: 'red', // 边框颜色
                color: '#ff1b1b', // 折线上标记点的颜色 和 图例的颜色
                lineStyle: {
                    width: 2, //  折线图的粗细
                    color: '#ff1b1b' // 折线的颜色
                }
            }
        },

    }
    ]
};
