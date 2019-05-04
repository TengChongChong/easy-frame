package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.ImportConst;
import com.frame.easy.common.page.Page;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.dao.SysImportExcelTemporaryMapper;
import com.frame.easy.modular.sys.model.SysImportExcelTemplateDetails;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;
import com.frame.easy.modular.sys.model.SysImportSummary;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateDetailsService;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateService;
import com.frame.easy.modular.sys.service.SysImportExcelTemporaryService;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/**
 * 导入临时表
 *
 * @author TengChong
 * @date 2019-04-10
 */
@Service
public class SysImportExcelTemporaryServiceImpl extends ServiceImpl<SysImportExcelTemporaryMapper, SysImportExcelTemporary> implements SysImportExcelTemporaryService {

    @Autowired
    private SysImportExcelTemplateService importExcelTemplateService;

    @Autowired
    private SysImportExcelTemplateDetailsService importExcelTemplateDetailsService;

    /**
     * 列表
     *
     * @param object 查询条件
     * @return 数据集合
     */
    @Override
    public Page select(SysImportExcelTemporary object) {
        QueryWrapper<SysImportExcelTemporary> queryWrapper = new QueryWrapper<>();
        // 导入用户id
        queryWrapper.eq("user_id", ShiroUtil.getCurrentUser().getId());
        if (object == null || object.getTemplateId() == null) {
            // 必须指定模板id
            throw new EasyException("未指定模板id");
        }
        // 查询导入规则,用户翻译转换后的字段
        List<SysImportExcelTemplateDetails> configs = importExcelTemplateDetailsService.selectDetails(object.getTemplateId());
        StringBuilder selectFields = new StringBuilder();
        StringBuilder leftJoinTables = new StringBuilder();
        for (int i = 0; i < configs.size(); i++) {
            // 如果设置了转换表,除了字典表数据在前端处理,其他表从数据库查询
            if (StrUtil.isNotBlank(configs.get(i).getReplaceTable()) &&
                    !ImportConst.SYS_DICT.equals(configs.get(i).getReplaceTable())) {
                // 替换表
                String tableName = configs.get(i).getReplaceTable();
                // 表别名
                String tableSlug = configs.get(i).getReplaceTable() + configs.get(i).getOrderNo();
                // 拼接查询字段
                selectFields.append("(case when ").append(tableSlug).append(".").append(configs.get(i).getReplaceTableFieldName())
                        .append(" is null then temp.field").append(i + 1).append(" else ")
                        .append(tableSlug).append(".").append(configs.get(i).getReplaceTableFieldName())
                        .append(" end) as field").append(i + 1);
                // 拼接left join
                leftJoinTables.append("left join ").append(tableName).append(" ").append(tableSlug)
                        .append(" on ")
                        .append(tableSlug).append(".").append(configs.get(i).getReplaceTableFieldValue())
                        .append(" = temp.field").append(i + 1).append(" ");
            } else {
                // 没有设置转换表,直接查询
                selectFields.append("temp.field").append(i + 1);
            }
            // 始终在最后添加 , 因为后面还有个verification_results字段
            selectFields.append(CommonConst.SPLIT);
        }
        // 查询条件
        // 模板id
        if (Validator.isNotEmpty(object.getTemplateId())) {
            queryWrapper.eq("template_id", object.getTemplateId());
        }
        // 关键字暂时只关联field1查询
        if (Validator.isNotEmpty(object.getField1())) {
            queryWrapper.and(i -> i.like("field1", object.getField1()));
        }
        Page page = ToolUtil.getPage(object);
        if (Validator.isEmpty(page.ascs()) && Validator.isEmpty(page.descs())) {
            page.setAsc("verification_status");
        }
        page.setRecords(baseMapper.select(page, selectFields.toString(), leftJoinTables.toString(), queryWrapper));
        return page;
    }

    @Override
    public List<SysImportExcelTemporary> selectData(Long templateId, Long userId, String status) {

        return null;
    }

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    @Override
    public SysImportExcelTemporary input(Long id) {
        ToolUtil.checkParams(id);
        QueryWrapper<SysImportExcelTemporary> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", id);
        queryWrapper.eq("user_id", ShiroUtil.getCurrentUser().getId());
        return getOne(queryWrapper);
    }

    /**
     * 删除
     *
     * @param ids 数据ids
     * @return 是否成功
     */
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(String ids) {
        ToolUtil.checkParams(ids);
        List<String> idList = Arrays.asList(ids.split(","));
        return ToolUtil.checkResult(removeByIds(idList));
    }

    @Override
    public boolean checkLastData(Long templateId) {
        SysUser sysUser = ShiroUtil.getCurrentUser();
        QueryWrapper<SysImportExcelTemporary> selectLastData = new QueryWrapper<>();
        selectLastData.eq("user_id", sysUser.getId());
        selectLastData.eq("template_id", templateId);
        return count(selectLastData) > 0;
    }

    @Override
    public boolean cleanMyImport(Long templateId) {
        ToolUtil.checkParams(templateId);
        SysUser sysUser = ShiroUtil.getCurrentUser();
        QueryWrapper<SysImportExcelTemporary> clean = new QueryWrapper<>();
        clean.eq("user_id", sysUser.getId());
        clean.eq("template_id", templateId);
        return remove(clean);
    }

    @Override
    public boolean cleanSuccessData(Long templateId) {
        SysUser sysUser = ShiroUtil.getCurrentUser();
        // 删除已导入成功的数据
        QueryWrapper<SysImportExcelTemporary> deleteSuccess = new QueryWrapper<>();
        deleteSuccess.eq("verification_status", ImportConst.VERIFICATION_STATUS_SUCCESS);
        deleteSuccess.eq("user_id", sysUser.getId());
        deleteSuccess.eq("template_id", templateId);
        return remove(deleteSuccess);
    }

    @Override
    public boolean deleteByTemplateIds(String templateIds) {
        QueryWrapper<SysImportExcelTemporary> clean = new QueryWrapper<>();
        List<String> idList = Arrays.asList(templateIds.split(","));
        clean.in("template_id", idList);
        return remove(clean);
    }

    @Override
    public SysImportSummary selectImportSummary(Long templateId) {
        SysUser sysUser = ShiroUtil.getCurrentUser();
        List<SysImportExcelTemporary> temporaries = getBaseMapper().selectImportSummary(templateId, sysUser.getId());
        SysImportSummary summary = new SysImportSummary();
        if (temporaries != null && temporaries.size() > 0) {
            for (SysImportExcelTemporary temporary : temporaries) {
                int count = Integer.parseInt(temporary.getField1());
                if (ImportConst.VERIFICATION_STATUS_SUCCESS.equals(temporary.getVerificationStatus())) {
                    summary.setSuccess(count);
                }
                if (ImportConst.VERIFICATION_STATUS_FAIL.equals(temporary.getVerificationStatus())) {
                    summary.setFail(count);
                }
            }
            summary.setTotal(summary.getSuccess() + summary.getFail());
        }
        return summary;
    }

    @Override
    public SysImportExcelTemporary saveData(SysImportExcelTemporary object) {
        ToolUtil.checkParams(object);
        return (SysImportExcelTemporary) ToolUtil.checkResult(updateById(object), object);
    }

    @Override
    public boolean saveBatch(List<SysImportExcelTemporary> list) {
        return super.saveBatch(list);
    }

}