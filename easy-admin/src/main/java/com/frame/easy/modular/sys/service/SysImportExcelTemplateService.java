package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysImportExcelTemplate;
import com.frame.easy.common.page.Page;

/**
 * 导入模板
 *
 * @author TengChong
 * @date 2019-04-10
 */
public interface SysImportExcelTemplateService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SysImportExcelTemplate object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SysImportExcelTemplate input(Long id);
    /**
     * 新增
     *
     * @return 默认值
     */
    SysImportExcelTemplate add();
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
    SysImportExcelTemplate saveData(SysImportExcelTemplate object);
}
