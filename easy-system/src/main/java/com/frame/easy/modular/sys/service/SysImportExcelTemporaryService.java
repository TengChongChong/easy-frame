package com.frame.easy.modular.sys.service;

import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;

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

    /**
     * 清空指定导入代码中数据
     *
     * @param templateCode 导入代码
     * @return true/false
     */
    boolean cleanMyImport(String templateCode);

    /**
     * 清空指定模板ids数据
     *
     * @param templateIds 模板ids
     * @return true/false
     */
    boolean deleteByTemplateIds(String templateIds);

    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    SysImportExcelTemporary saveData(SysImportExcelTemporary object);
}
