package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import cn.hutool.poi.excel.ExcelReader;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.base.service.ImportService;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.ImportConst;
import com.frame.easy.exception.BusinessException;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.dao.SysImportExcelDataMapper;
import com.frame.easy.modular.sys.model.*;
import com.frame.easy.modular.sys.service.*;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.SpringContextHolder;
import com.frame.easy.util.ToolUtil;
import com.frame.easy.util.http.HttpUtil;
import com.frame.easy.util.office.ExcelUtil;
import com.frame.easy.util.office.ImportExportUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;

/**
 * 数据导入
 *
 * @author tengchong
 * @date 2019-04-17
 */
@Service
public class SysImportExcelDataServiceImpl implements SysImportExcelDataService {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 导入模板
     */
    @Autowired
    private SysImportExcelTemplateService importExcelTemplateService;
    /**
     * 导入规则
     */
    @Autowired
    private SysImportExcelTemplateDetailsService importExcelTemplateDetailsService;

    /**
     * 临时表
     */
    @Autowired
    private SysImportExcelTemporaryService importExcelTemporaryService;

    /**
     * 字典
     */
    @Autowired
    private SysDictService sysDictService;
    /**
     * 导入数据mapper
     */
    @Autowired
    private SysImportExcelDataMapper mapper;

    @Override
    public boolean checkLastData(String template) {
        ToolUtil.checkParams(template);
        return importExcelTemporaryService.checkLastData(template);
    }

    @Override
    @Transactional(rollbackFor = RuntimeException.class)
    public boolean analysis(String templateId, String path) {
        logger.debug("解析文件:" + path);
        ToolUtil.checkParams(templateId);
        ToolUtil.checkParams(path);
        // 检查模板信息
        SysImportExcelTemplate importExcelTemplate = importExcelTemplateService.input(templateId);
        if (importExcelTemplate == null) {
            // 获取模板信息失败
            throw new EasyException(BusinessException.IMPORT_GET_TEMPLATE_FAIL);
        }
        // 检查是否有权限访问
        if (StrUtil.isNotBlank(importExcelTemplate.getPermissionCode())) {
            if (!hasPermission(importExcelTemplate.getPermissionCode())) {
                // 无权导入
                logger.debug("无权访问导入[" + importExcelTemplate.getPermissionCode() + "]" + importExcelTemplate.getName());
                throw new EasyException("无权访问导入" + importExcelTemplate.getName());
            }
        }
        // 检查导入规则
        List<SysImportExcelTemplateDetails> configs = importExcelTemplateDetailsService.selectDetails(importExcelTemplate.getId());
        if (configs == null || configs.size() == 0) {
            // 无导入规则
            logger.debug("模板[" + importExcelTemplate.getImportCode() + "]未配置导入规则");
            throw new EasyException("模板[" + importExcelTemplate.getImportCode() + "]未配置导入规则");
        }
        File file = new File(path);
        if (checkFile(file)) {
            // 读取Excel
            ExcelReader reader = cn.hutool.poi.excel.ExcelUtil.getReader(path);
            List<List<Object>> data = reader.read();
            // 最小行
            int minDataRow = 3;
            if (data.size() >= minDataRow) {
                data.remove(0);
                // 比对模板信息是否与导入规则匹配
                if (checkTemplate(data.get(0), configs)) {
                    // 模板验证通过,将数据插入到临时表
                    data.remove(0);
                    SysUser sysUser = ShiroUtil.getCurrentUser();
                    // 清空上次导入的信息
                    cleanLastImport(importExcelTemplate);
                    // 插入数据到临时表
                    if (!insertData(sysUser, importExcelTemplate, configs, data)) {
                        throw new EasyException(BusinessException.IMPORT_INSERT_FAIL);
                    }
                    if (StrUtil.isNotBlank(importExcelTemplate.getCallback())) {
                        ImportService importService = SpringContextHolder.getBean(importExcelTemplate.getCallback());
                        boolean isSuccess = importService.verificationData(templateId, sysUser.getId());
                        if (!isSuccess) {
                            throw new EasyException("执行验证数据回调失败");
                        }
                    }
                    return true;
                } else {
                    // 模板不匹配，请重新下载模板
                    throw new EasyException(BusinessException.IMPORT_TEMPLATE_MISMATCH);
                }
            } else {
                // 请至少录入一条数据后导入
                throw new EasyException(BusinessException.IMPORT_TEMPLATE_NO_DATA);
            }
        }
        return false;
    }

    @Override
    public SysImportSummary selectSummary(String templateId) {
        ToolUtil.checkParams(templateId);
        return importExcelTemporaryService.selectImportSummary(templateId);
    }

    /**
     * 清除上次导入的信息
     *
     * @param importExcelTemplate 导入模板信息
     */
    private void cleanLastImport(SysImportExcelTemplate importExcelTemplate) {
        importExcelTemporaryService.cleanMyImport(importExcelTemplate.getId());
    }

    /**
     * 用户是否拥有指定权限标识
     *
     * @param code 权限标识
     * @return true/false
     */
    private boolean hasPermission(String code) {
        Subject subject = SecurityUtils.getSubject();
        if (subject != null && StrUtil.isNotBlank(code)) {
            return subject.isPermitted(code);
        }
        return false;
    }

    /**
     * 检查excel文件
     *
     * @param file 文件
     * @return true/false
     */
    private boolean checkFile(File file) {
        if (file.exists()) {
            String suffix = file.getName().substring(file.getName().indexOf("."));
            if (ExcelUtil.EXCEL_SUFFIX_XLSX.equals(suffix) || ExcelUtil.EXCEL_SUFFIX_XLS.equals(suffix)) {
                return true;
            }
            // 文件类型错误
            throw new EasyException(BusinessException.IMPORT_FILE_TYPE_ERROR);
        }
        // 文件不存在
        throw new EasyException(BusinessException.IMPORT_FILE_NOT_FIND);
    }

    /**
     * 比对模板信息是否与导入规则匹配
     *
     * @param heads   标题
     * @param configs 导入规则
     * @return true/false
     */
    private boolean checkTemplate(List<Object> heads, List<SysImportExcelTemplateDetails> configs) {
        if (heads != null) {
            if (heads.size() == configs.size()) {
                int length = heads.size();
                for (int i = 0; i < length; i++) {
                    if (!heads.get(i).equals(configs.get(i).getTitle())) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * 将数据导入临时表
     *
     * @param sysUser             当前登录用户
     * @param importExcelTemplate 模板信息
     * @param configs             导入规则
     * @param rows                excel中数据
     * @return true/false
     */
    private boolean insertData(SysUser sysUser,
                               SysImportExcelTemplate importExcelTemplate,
                               List<SysImportExcelTemplateDetails> configs,
                               List<List<Object>> rows) {
        List<SysImportExcelTemporary> temporaries = new ArrayList<>();
        // 查询所有本次导入所需的字典
        List<String> dictTypes = getDictType(configs);
        Map<String, String> cacheMap = new HashMap<>();
        if (dictTypes != null && dictTypes.size() > 0) {
            List<SysDict> dicts = sysDictService.selectDictType(dictTypes);
            setDictMap(cacheMap, dicts);
        }
        for (List<Object> row : rows) {
            temporaries.add(getTemporaryInfo(sysUser, importExcelTemplate, configs, row, cacheMap));
        }
        return importExcelTemporaryService.saveBatch(temporaries);
    }

    /**
     * 向缓存中添加字典
     *
     * @param cacheMap 缓存map
     * @param dicts    本次导入所需的字典
     */
    private void setDictMap(Map<String, String> cacheMap, List<SysDict> dicts) {
        if (dicts != null) {
            for (SysDict dict : dicts) {
                cacheMap.put(dict.getDictType() + dict.getName(), dict.getCode());
            }
        }
    }

    /**
     * 获取本次导入所需的全部字典类型
     *
     * @param configs 导入规则
     * @return list
     */
    private List<String> getDictType(List<SysImportExcelTemplateDetails> configs) {
        List<String> dictTypes = new ArrayList<>();
        for (SysImportExcelTemplateDetails detail : configs) {
            if ("sys_dict".equals(detail.getReplaceTable())) {
                dictTypes.add(detail.getReplaceTableDictType());
            }
        }
        return dictTypes;
    }

    /**
     * 将excel单行转为SysImportExcelTemporary对象
     *
     * @param sysUser             操作用户
     * @param importExcelTemplate 模板信息
     * @param configs             导入规则
     * @param data                行
     * @param cacheMap            缓存
     * @return SysImportExcelTemporary
     */
    private SysImportExcelTemporary getTemporaryInfo(SysUser sysUser,
                                                     SysImportExcelTemplate importExcelTemplate,
                                                     List<SysImportExcelTemplateDetails> configs,
                                                     List<Object> data,
                                                     Map<String, String> cacheMap) {
        try {
            Class temporaryClass = ImportExportUtil.getTemporaryClass();
            Object object = temporaryClass.newInstance();
            StringBuffer verificationResults = new StringBuffer();
            int configLength = configs.size();
            while (configLength-- > 0) {
                Method method = temporaryClass.getMethod("setField" + (configLength + 1), String.class);
                // 简单验证,此处只做非空检查
                boolean addVerificationResults = (data.size() <= configLength || Validator.isEmpty(data.get(configLength)))
                        && ImportConst.REQUIRED == configs.get(configLength).getRequired();
                if (addVerificationResults) {
                    verificationResults.append(configs.get(configLength).getTitle()).append("不能为空;");
                } else {
                    // 将单元格数据转为string
                    String cell = objectToString(data.get(configLength));
                    // 转换数据 name to code/id
                    try {
                        cell = replaceData(cell, configs.get(configLength), cacheMap);
                    } catch (EasyException e) {
                        verificationResults.append(configs.get(configLength).getTitle()).append("转换失败;");
                    }

                    // 验证数据格式以及长度
                    try {
                        ImportExportUtil.verificationData(cell, configs.get(configLength));
                    } catch (EasyException e) {
                        verificationResults.append(e.getMessage());
                    }

                    method.invoke(object, cell);
                }
            }
            SysImportExcelTemporary temporary = (SysImportExcelTemporary) object;
            // 设置模板信息
            temporary.setTemplateId(importExcelTemplate.getId());
            temporary.setUserId(sysUser.getId());
            // 设置验证结果
            if (StrUtil.isNotBlank(verificationResults)) {
                temporary.setVerificationResults(verificationResults.toString());
                temporary.setVerificationStatus(ImportConst.VERIFICATION_STATUS_FAIL);
            } else {
                // 成功
                temporary.setVerificationStatus(ImportConst.VERIFICATION_STATUS_SUCCESS);
            }
            return temporary;
        } catch (IllegalAccessException | InvocationTargetException | InstantiationException | NoSuchMethodException e) {
            e.printStackTrace();
            throw new EasyException(e.getMessage());
        }
    }

    /**
     * 替换数据
     *
     * @param data     原数据
     * @param config   规则
     * @param cacheMap 缓存
     * @return 转换后数据
     */
    private String replaceData(String data, SysImportExcelTemplateDetails config, Map<String, String> cacheMap) {
        // 转换后的值
        String value;
        if (StrUtil.isNotBlank(config.getReplaceTable())) {
            // 字典表
            if (ImportConst.SYS_DICT.equals(config.getReplaceTable())) {
                value = cacheMap.get(config.getReplaceTableDictType() + data);
            } else {
                // 其他表
                value = mapper.queryString(config.getReplaceTable(), config.getReplaceTableFieldName(),
                        config.getReplaceTableFieldValue(), data);
                // 能不能查到都放缓存里,防止重复从数据库查询
                cacheMap.put(config.getReplaceTable() + data, value);
            }
            if (StrUtil.isBlank(value)) {
                // 抛出转换失败异常
                throw new EasyException(BusinessException.IMPORT_REPLACE_FAIL);
            }
        } else {
            // 转换失败了直接用导入值
            value = data;
        }
        return value;
    }


    /**
     * 将object类型转为string
     *
     * @param object object
     * @return string
     */
    private String objectToString(Object object) {
        if (object instanceof Date) {
            return DateUtil.format((Date) object, DatePattern.NORM_DATETIME_PATTERN);
        } else {
            return String.valueOf(object);
        }
    }

    @Override
    @Transactional(rollbackFor = RuntimeException.class)
    public int insertData(String templateId) {
        ToolUtil.checkParams(templateId);
        SysUser sysUser = ShiroUtil.getCurrentUser();
        SysImportExcelTemplate importExcelTemplate = importExcelTemplateService.input(templateId);
        // 检查是否有权限访问
        if (StrUtil.isNotBlank(importExcelTemplate.getPermissionCode())) {
            if (!hasPermission(importExcelTemplate.getPermissionCode())) {
                // 无权导入
                throw new EasyException("无权访问导入" + importExcelTemplate.getName());
            }
        }
        // 回调Bean
        ImportService importService = null;
        if (StrUtil.isNotBlank(importExcelTemplate.getCallback())) {
            importService = SpringContextHolder.getBean(importExcelTemplate.getCallback());
            boolean isSuccess = importService.beforeImport(templateId, sysUser.getId());
            if (!isSuccess) {
                throw new EasyException("执行导入前回调失败");
            }
        }
        // 插入的字段
        List<String> insertFields = new ArrayList<>();
        // 查询字段
        List<String> selectFields = new ArrayList<>();
        // 导入规则
        List<SysImportExcelTemplateDetails> configs = importExcelTemplateDetailsService.selectDetails(importExcelTemplate.getId());
        if (configs != null && configs.size() > 0) {
            for (int i = 0; i < configs.size(); i++) {
                insertFields.add(configs.get(i).getFieldName());
                selectFields.add("field" + (i + 1));
            }
            int count = mapper.insert(importExcelTemplate.getImportTable(),
                    StrUtil.join(",", insertFields),
                    StrUtil.join(",", selectFields),
                    importExcelTemplate.getId(),
                    sysUser.getId(),
                    ImportConst.VERIFICATION_STATUS_SUCCESS);
            // 调用导入后回调
            if (importService != null) {
                boolean isSuccess = importService.afterImport();
                if (!isSuccess) {
                    throw new EasyException("执行导入后回调失败");
                }
                // 删除导入成功的数据
                isSuccess = importExcelTemporaryService.cleanSuccessData(templateId);
                if (!isSuccess) {
                    throw new EasyException("删除验证成功数据失败");
                }
            }
            return count;
        } else {
            throw new EasyException("模板[" + importExcelTemplate.getImportCode() + "]未配置导入规则");
        }
    }

    @Override
    public ResponseEntity<FileSystemResource> exportVerificationFailData(String templateId, HttpServletRequest request) {
        ToolUtil.checkParams(templateId);
        SysImportExcelTemplate importExcelTemplate = importExcelTemplateService.input(templateId);
        // 导入规则
        List<SysImportExcelTemplateDetails> configs = importExcelTemplateDetailsService.selectDetails(importExcelTemplate.getId());
        if (configs != null && configs.size() > 0) {
            StringBuilder selectFields = new StringBuilder();
            StringBuilder leftJoinTables = new StringBuilder();
            for (int i = 0; i < configs.size(); i++) {
                // 如果设置了转换表,除了字典表数据在前端处理,其他表从数据库查询
                if (StrUtil.isNotBlank(configs.get(i).getReplaceTable())) {
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
                    if (ImportConst.SYS_DICT.equals(configs.get(i).getReplaceTable())) {
                        leftJoinTables.append(" and ").append(tableSlug).append(".dict_type = '").append(configs.get(i).getReplaceTableDictType()).append("' ");
                    }
                } else {
                    // 没有设置转换表,直接查询
                    selectFields.append("temp.field").append(i + 1);
                }
                // 始终在最后添加 , 因为后面还有个verification_results字段
                selectFields.append(CommonConst.SPLIT);
            }
            QueryWrapper<SysImportExcelTemporary> queryWrapper = new QueryWrapper<>();
            // 导入用户id
            queryWrapper.eq("user_id", ShiroUtil.getCurrentUser().getId());
            queryWrapper.eq("template_id", importExcelTemplate.getId());
            // 查询验证失败数据
            List<SysImportExcelTemporary> temporaryList = mapper.selectVerificationFailData(selectFields.toString(),
                    leftJoinTables.toString(),
                    queryWrapper);
            // 数据
            List<List<Object>> rows = ImportExportUtil.toExportData(temporaryList, configs, true);
            // 表头
            List<String> titles = ImportExportUtil.getTitles(configs, true);
            String path = ExcelUtil.writFile(rows, titles.toArray(new String[]{}),
                    importExcelTemplate.getName() + "验证失败数据", "验证失败", null);
            try {
                return HttpUtil.getResponseEntity(new File(path),
                        importExcelTemplate.getName() + "验证失败数据" + DateUtil.today() + ExcelUtil.EXCEL_SUFFIX_XLSX, request);
            } catch (UnsupportedEncodingException e) {
                throw new EasyException("导出文件失败");
            }
        } else {
            throw new EasyException("模板[" + importExcelTemplate.getImportCode() + "]未配置导入规则");
        }
    }
}