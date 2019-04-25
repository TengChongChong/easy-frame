package com.frame.easy.modular.sys.dao;

import org.apache.ibatis.annotations.Param;

/**
 * 数据导入
 *
 * @author tengchong
 * @date 2019-04-25
 */
public interface SysImportExcelDataMapper {
    /**
     * 查询
     *
     * @param table 表名
     * @param field 字段名
     * @param value 查询字段名
     * @param query 查询条件
     * @return 查询值
     */
    String queryString(@Param("table") String table, @Param("field") String field,
                       @Param("value") String value, @Param("query") String query);
}
