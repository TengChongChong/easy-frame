package com.frame.easy.modular.sample.service;

import com.frame.easy.modular.sample.model.SampleGeneral;
import com.frame.easy.common.page.Page;

import java.util.List;

/**
 * 代码生成示例
 *
 * @author TengChong
 * @date 2019-04-09
 */
public interface SampleGeneralService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SampleGeneral object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SampleGeneral input(Long id);
    /**
     * 新增
     *
     * @return 默认值
     */
    SampleGeneral add();
    /**
     * 删除
     *
     * @param ids 数据ids
     * @return 是否成功
     */
    boolean delete(String ids);
    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    SampleGeneral saveData(SampleGeneral object);

    /**
     * 导出查询结果
     *
     * @param object 查询条件
     * @return 数据
     */
    Object exportData(SampleGeneral object);
}
