package com.frame.easy.modular.generator.dao;

import com.frame.easy.common.select.Select;
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
}
