package com.frame.easy.modular.sys.service;

import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;
import com.frame.easy.modular.sys.model.SysImportSummary;

import java.util.List;

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
    SysImportExcelTemporary input(String id);
    /**
     * 删除
     *
     * @param ids 数据ids
     * @return 是否成功
     */
    boolean delete(String ids);
    /**
     * 检查上次导入数据
     *
     * @param templateId 模板id
     * @return true/false
     */
    boolean checkLastData(String templateId);
    /**
     * 清空指定导入代码中数据
     *
     * @param templateId 模板id
     * @return true/false
     */
    boolean cleanMyImport(String templateId);

    /**
     * 删除验证成功的数据,用于保存数据后删除数据
     *
     * @param templateId 模板id
     * @return true/false
     */
    boolean cleanSuccessData(String templateId);

    /**
     * 清空指定模板ids数据
     *
     * @param templateIds 模板ids
     * @return true/false
     */
    boolean deleteByTemplateIds(String templateIds);

    /**
     * 获取导入汇总信息
     *
     * @param templateId 模板id
     * @return 导入汇总
     */
    SysImportSummary selectImportSummary(String templateId);
    /**
     * 保存
     *
     * @param object 表单内容
     * @return 保存后信息
     */
    SysImportExcelTemporary saveData(SysImportExcelTemporary object);

    /**
     * 批量插入
     *
     * @param list 数据
     * @return true/false
     */
    boolean saveBatch(List<SysImportExcelTemporary> list);

    /**
     * 更新重复数据状态
     *
     * @param field      唯一约束字段
     * @param templateId 导入模板id
     * @param userId     用户id
     */
    void updateDuplicateData(String field, String templateId, String userId);
}
