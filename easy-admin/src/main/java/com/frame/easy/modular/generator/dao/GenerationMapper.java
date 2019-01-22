package com.frame.easy.modular.generator.dao;

import com.frame.easy.common.select.Select;
import com.frame.easy.generator.model.FieldSet;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 代码生成
 *
 * @author tengchong
 * @date 2019-01-09
 */
public interface GenerationMapper {
    /**
     * 获取表名
     *
     * @param dbName 数据库名称
     * @return List<Select>
     */
    List<Select> selectTable(@Param("dbName") String dbName);
    /**
     * 根据表名获取字段列表
     * @param  dbName 数据库名称
     * @param tableName 表名
     * @return List<FieldSet>
     */
    List<FieldSet> selectFields(@Param("dbName") String dbName, @Param("tableName") String tableName);
}
