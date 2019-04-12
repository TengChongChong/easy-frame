package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysImportExcelTemporary;
import com.frame.easy.common.page.Page;

/**
 * 导入临时表
 *
 * @author TengChong
 * @date 2019-04-10
 */
public interface SysImportExcelTemporaryService {
    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    Page select(SysImportExcelTemporary object);

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    SysImportExcelTemporary input(Long id);
    /**
     * 删除
     *
     * @param ids 数据ids
     * @return 是否成功
     */
    boolean delete(String ids);
}
