package com.frame.easy.modular.sample.dao;

import com.frame.easy.modular.sample.model.SampleGeneral;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

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
     *
     * @return 数据列表
     */
    List<List<String>> selectDate();
}