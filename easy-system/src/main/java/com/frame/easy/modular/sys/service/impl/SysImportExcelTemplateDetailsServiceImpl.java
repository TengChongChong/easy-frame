package com.frame.easy.modular.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.table.Column;
import com.frame.easy.modular.sys.dao.SysImportExcelTemplateDetailsMapper;
import com.frame.easy.modular.sys.model.SysImportExcelTemplateDetails;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateDetailsService;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateService;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/**
 * 导入模板详情
 *
 * @author TengChong
 * @date 2019-04-10
 */
@Service
public class SysImportExcelTemplateDetailsServiceImpl extends ServiceImpl<SysImportExcelTemplateDetailsMapper, SysImportExcelTemplateDetails> implements SysImportExcelTemplateDetailsService {

    @Autowired
    private SysImportExcelTemplateService importExcelTemplateService;

    /**
     * 获取已配置字段
     *
     * @param templateId 导入模板id
     * @return 数据列表
     */
    @Override
    public List<SysImportExcelTemplateDetails> selectDetails(Long templateId) {
        ToolUtil.checkParams(templateId);
        QueryWrapper<SysImportExcelTemplateDetails> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("template_id", templateId);
        queryWrapper.orderByAsc("order_no");
        return list(queryWrapper);
    }

    @Override
    public List<Column> selectTableHeadByTemplateCode(Long templateId) {
        ToolUtil.checkParams(templateId);
        List<Column> columns = getBaseMapper().selectTableHeadByTemplateId(templateId);
        int columnsLength = columns.size();
        while (columnsLength-- > 0) {
            columns.get(columnsLength).setField("field" + (columnsLength + 1));
        }
        return columns;
    }

    /**
     * 保存
     *
     * @param templateId 导入模板id
     * @param list       表单内容
     * @return true/false
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean saveData(Long templateId, List<SysImportExcelTemplateDetails> list) {
        ToolUtil.checkParams(list);
        QueryWrapper<SysImportExcelTemplateDetails> deleteOld = new QueryWrapper<>();
        deleteOld.eq("template_id", templateId);
        remove(deleteOld);
        return saveBatch(list);
    }

    @Override
    public boolean deleteByTemplateIds(String templateIds) {
        QueryWrapper<SysImportExcelTemplateDetails> delete = new QueryWrapper<>();
        List<String> idList = Arrays.asList(templateIds.split(","));
        delete.in("template_id", idList);
        return remove(delete);
    }
}