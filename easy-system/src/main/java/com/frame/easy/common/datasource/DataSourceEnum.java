package com.frame.easy.common.datasource;

/**
 * 数据源
 *
 * @author tengchong
 * @date 2019-05-16
 */
public enum DataSourceEnum {
    // 主库
    MASTER("master", "主库"),
    // 从库
    SLAVE_1("slave_1", "从库_1");

    /**
     * 数据源代码
     */
    String code;
    /**
     * 数据源名称
     */
    String name;

    DataSourceEnum(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
}
