package com.frame.easy.modular.sys.dao;

import com.frame.easy.common.table.Column;
import com.frame.easy.modular.sys.model.SysImportExcelTemplateDetails;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 导入模板详情
 *
 * @author TengChong
 * @date 2019-04-10
 */
public interface SysImportExcelTemplateDetailsMapper extends BaseMapper<SysImportExcelTemplateDetails> {
    /**
     * 根据模板id获取表格表头
     *
     * @param templateId 模板id
     * @return heads
     */
    List<Column> selectTableHeadByTemplateCode(@Param("templateId") Long templateId);
}