/**
 * 偏好设置,可根据习惯自行修改
 * 用于设置字段的默属性 (如: 是否显示、是否搜索、输入框类型等)
 * @type {object}
 */
var preferenceSetting = {
    key: ['id'],
    // 列表页面
    list: {
        // 一般不会被搜索的字段
        excludeSearch: ['id', 'pIds', 'tips', 'createUser', 'createDate', 'content',
            'abstract', 'orderNo', 'describe', 'icon', 'version'],
        // 一般不显示以下字段
        exclude: ['id', 'pId', 'pIds', 'tips', 'createUser', 'createDate',
            'content', 'abstract', 'describe', 'version'],
        // 默认匹配方式
        matching: {
            // 一般使用 = 匹配的字段
            eq: ['status', 'state', 'typeCode', 'type'],
            // 一般使用 like 匹配的字段
            like: ['name', 'simpleName', 'tips', 'code', 'content', 'url']
        }
    },
    // 详情页面
    input: {
        // 一般隐藏以下字段
        hide: ['id'],
        // 一般不填写以下字段
        exclude: ['createUser', 'createDate', 'editUser', 'editDate', 'version', 'pIds'],
        // 以下为各种类型输入框对应的常用字段名
        type: {
            text: ['name', 'simpleName', 'title', 'subtitle', 'code', 'typeCode', 'username', 'author',
                'tableName', 'businessName', 'menuName', 'departName', 'deptName', 'path', 'typeName', 'IDNumber',
                'nickname', 'email', 'phone'],
            number: ['orderNo', 'sort', 'age', 'money', 'year', 'month', 'day', 'hour', 'version'],
            password: ['password', 'pwd'],
            textarea: ['content', 'introduce', 'tips', 'describe'],
            hidden: ['id', 'wid', 'pId'],
            select: ['type', 'status', 'state', 'level', 'levels'],
            select_multiple: [],
            radio: ['sex'],
            checkbox: ['roles'],
            date: ['date', 'birthday', 'buildDate'],
            datetime: ['strDate', 'endDate']
        }
    },
    // 默认使用number的字段类型
    number: ['Integer', 'Long', 'Double', 'BigInteger', 'BigDecimal'],
    // 默认使用Date的字段类型
    date: ['Date']
};