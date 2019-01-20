package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.common.select.Select;
import com.frame.easy.modular.sys.model.SysDictType;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 字典类型管理
 * @author tengchong
 */
public interface SysDictTypeMapper extends BaseMapper<SysDictType> {
    /**
     * 获取字典类型
     *
     * @param status 状态
     * @return List<Select>
     */
    List<Select> selectType(@Param("status") int status);

    /**
     * 查询字典数量
     * @param queryWrapper 查询条件
     * @return int
     */
    int countDict(@Param("ew") QueryWrapper<SysDictType> queryWrapper);

}