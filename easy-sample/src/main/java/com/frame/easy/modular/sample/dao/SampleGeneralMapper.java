package com.frame.easy.modular.sample.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.modular.sample.model.SampleGeneral;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 代码生成示例
 *
 * @author TengChong
 * @date 2019-04-09
 */
public interface SampleGeneralMapper extends BaseMapper<SampleGeneral> {
    /**
     * 查询数据用于测试导出
     * @param queryWrapper 查询条件
     * @return 数据列表
     */
    List<SampleGeneral> selectData(@Param("ew") QueryWrapper<SampleGeneral> queryWrapper);
}