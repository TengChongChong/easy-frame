package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysImportExcelTemplateDetails;
import com.frame.easy.common.page.Page;

import java.util.List;

/**
 * 导入模板详情
 *
 * @author TengChong
 * @date 2019-04-10
 */
public interface SysImportExcelTemplateDetailsService {
    /**
     * 获取已配置字段
     *
     * @param templateId 导入模板id
     * @return 数据列表
     */
    List<SysImportExcelTemplateDetails> selectDetails(Long templateId);

    /**
     * 保存
     *
     * @param templateId 导入模板id
     * @param list       表单内容
     * @return true/false
     */
    boolean saveData(Long templateId, List<SysImportExcelTemplateDetails> list);
}
