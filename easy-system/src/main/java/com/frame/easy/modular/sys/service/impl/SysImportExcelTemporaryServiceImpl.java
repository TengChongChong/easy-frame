package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.ImportConst;
import com.frame.easy.common.page.Page;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.dao.SysImportExcelTemporaryMapper;
import com.frame.easy.modular.sys.model.SysImportExcelTemplateDetails;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;
import com.frame.easy.modular.sys.model.SysImportSummary;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateDetailsService;
import com.frame.easy.modular.sys.service.SysImportExcelTemporaryService;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import com.frame.easy.util.office.ImportExportUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
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

    private Logger logger = LoggerFactory.getLogger(this.getClass());

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
        // 查询导入规则,翻译转换后的字段(此处不翻译字典)
        List<SysImportExcelTemplateDetails> configs = importExcelTemplateDetailsService.selectDetails(object.getTemplateId());
        String selectFields = ImportExportUtil.getSelectFields(configs, true);
        String leftJoinTables = ImportExportUtil.getLeftJoinTables(configs, true);
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
        page.setRecords(baseMapper.select(page, selectFields, leftJoinTables, queryWrapper));
        return page;
    }

    /**
     * 详情
     *
     * @param id id
     * @return 详细信息
     */
    @Override
    public SysImportExcelTemporary input(String id) {
        ToolUtil.checkParams(id);
        QueryWrapper<SysImportExcelTemporary> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("id", "template_id");
        queryWrapper.eq("id", id);
        queryWrapper.eq("user_id", ShiroUtil.getCurrentUser().getId());
        SysImportExcelTemporary object = getOne(queryWrapper);
        // 查询导入规则,翻译转换后的字段(此处不翻译字典)
        List<SysImportExcelTemplateDetails> configs = importExcelTemplateDetailsService.selectDetails(object.getTemplateId());
        String selectFields = ImportExportUtil.getSelectFields(configs, true);
        String leftJoinTables = ImportExportUtil.getLeftJoinTables(configs, true);
        return baseMapper.getOne(selectFields, leftJoinTables, id);
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
        return removeByIds(idList);
    }

    @Override
    public boolean checkLastData(String templateId) {
        SysUser sysUser = ShiroUtil.getCurrentUser();
        QueryWrapper<SysImportExcelTemporary> selectLastData = new QueryWrapper<>();
        selectLastData.eq("user_id", sysUser.getId());
        selectLastData.eq("template_id", templateId);
        return count(selectLastData) > 0;
    }

    @Override
    public boolean cleanMyImport(String templateId) {
        ToolUtil.checkParams(templateId);
        SysUser sysUser = ShiroUtil.getCurrentUser();
        QueryWrapper<SysImportExcelTemporary> clean = new QueryWrapper<>();
        clean.eq("user_id", sysUser.getId());
        clean.eq("template_id", templateId);
        return remove(clean);
    }

    @Override
    public boolean cleanSuccessData(String templateId) {
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
    public SysImportSummary selectImportSummary(String templateId) {
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
        // 保存之前检查数据状态
        List<SysImportExcelTemplateDetails> configs = importExcelTemplateDetailsService.selectDetails(object.getTemplateId());
        if (configs != null && configs.size() > 0) {
            Class temporaryClass = ImportExportUtil.getTemporaryClass();
            for (int i = 0; i < configs.size(); i++) {
                String value;
                // 获取当前校验值
                try {
                    Method method = temporaryClass.getMethod("getField" + (i + 1));
                    value = (String) method.invoke(object);
                } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                    logger.debug("导入数据数据校验失败", e);
                    throw new EasyException("数据数据校验失败" + e.getMessage());
                }
                // 校验数据, 如失败直接抛异常到前端
                // 基本校验
                baseVerificationData(value, configs.get(i));
                // 替换校验
                String replaceValue = getReplaceTableFieldValue(value, configs.get(i));
                try {
                    Method method = temporaryClass.getMethod("setField" + (i + 1), String.class);
                    method.invoke(object, replaceValue);
                } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                    logger.debug("设置替换值失败", e);
                    throw new EasyException("设置替换值失败" + e.getMessage());
                }
                if (ImportConst.IS_ONLY == configs.get(i).getIsOnly()) {
                    /**
                     * 唯一校验, 这里只检查临时表中是否唯一,在正式表中是否唯一请在导入前回调中检查
                     * 因为此处校验无意义,正式表中数据可能会发生变动导致校验过时
                     */
                    int count = getBaseMapper().count("field" + (i + 1), replaceValue, object.getId());
                    if (count > 0) {
                        throw new EasyException("数据中已存在[" + configs.get(i).getTitle() + "=" + value + "]的数据，请勿重复导入");
                    }
                }
            }
        }
        object.setVerificationResults("");
        object.setVerificationStatus(ImportConst.VERIFICATION_STATUS_SUCCESS);
        return (SysImportExcelTemporary) ToolUtil.checkResult(updateById(object), object);
    }

    /**
     * 根据规则校验值是否正确
     *
     * @param value  值
     * @param config 规则
     */
    private void baseVerificationData(String value, SysImportExcelTemplateDetails config) {
        StringBuffer verificationResults = new StringBuffer();
        // 非空
        if (Validator.isEmpty(value) && ImportConst.REQUIRED == config.getRequired()) {
            verificationResults.append(config.getTitle()).append("不能为空;");
        }
        // 数据类型以及长度
        try {
            ImportExportUtil.verificationData(value, config);
        } catch (EasyException e) {
            verificationResults.append(e.getMessage());
        }
        if (StrUtil.isNotBlank(verificationResults.toString())) {
            throw new EasyException(verificationResults.toString());
        }
    }

    /**
     * 获取替换值
     *
     * @param value  值
     * @param config 规则
     * @return 替换值
     */
    private String getReplaceTableFieldValue(String value, SysImportExcelTemplateDetails config) {
        String replaceValue;
        if (StrUtil.isNotBlank(value) &&
                StrUtil.isNotBlank(config.getReplaceTable()) &&
                StrUtil.isNotBlank(config.getReplaceTableFieldValue()) &&
                StrUtil.isNotBlank(config.getReplaceTableFieldName())) {
            // 如果设置了替换信息, 先判断value是否已经是替换后的值,如果不是在替换
            if (ImportConst.SYS_DICT.equals(config.getReplaceTable())) {
                // 字典表中有字典类型 单独处理
                replaceValue = getBaseMapper().getDictReplaceTableFieldValue(
                        config.getReplaceTable(),
                        config.getReplaceTableFieldValue(),
                        config.getReplaceTableFieldValue(),
                        value, config.getReplaceTableDictType());
                if (StrUtil.isBlank(replaceValue)) {
                    // 字典表中有字典类型 单独处理
                    replaceValue = getBaseMapper().getDictReplaceTableFieldValue(
                            config.getReplaceTable(),
                            config.getReplaceTableFieldName(),
                            config.getReplaceTableFieldValue(),
                            value, config.getReplaceTableDictType());
                }
            } else {
                replaceValue = getBaseMapper().getReplaceTableFieldValue(
                        config.getReplaceTable(),
                        config.getReplaceTableFieldValue(),
                        config.getReplaceTableFieldValue(),
                        value);
                if (StrUtil.isBlank(replaceValue)) {
                    replaceValue = getBaseMapper().getReplaceTableFieldValue(
                            config.getReplaceTable(),
                            config.getReplaceTableFieldName(),
                            config.getReplaceTableFieldValue(),
                            value);
                }
            }
            if (StrUtil.isBlank(replaceValue)) {
                throw new EasyException(config.getTitle() + "转换失败;");
            }
            return replaceValue;
        }
        return value;
    }

    @Override
    public boolean saveBatch(List<SysImportExcelTemporary> list) {
        return super.saveBatch(list);
    }

    @Override
    public void updateDuplicateData(String field, String templateId, String userId) {
        baseMapper.updateDuplicateData(field, templateId, userId, ImportConst.VERIFICATION_STATUS_FAIL);
    }
}