package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import cn.hutool.poi.excel.ExcelReader;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.ImportConst;
import com.frame.easy.exception.BusinessException;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.dao.SysImportExcelDataMapper;
import com.frame.easy.modular.sys.dao.SysImportExcelTemporaryMapper;
import com.frame.easy.modular.sys.model.*;
import com.frame.easy.modular.sys.service.SysDictService;
import com.frame.easy.modular.sys.service.SysImportExcelDataService;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateDetailsService;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateService;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import com.frame.easy.util.office.ExcelUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
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
public class SysImportExcelDataServiceImpl extends ServiceImpl<SysImportExcelTemporaryMapper, SysImportExcelTemporary> implements SysImportExcelDataService {

    @Autowired
    private SysImportExcelTemplateService importExcelTemplateService;
    @Autowired
    private SysImportExcelTemplateDetailsService importExcelTemplateDetailsService;
    @Autowired
    private SysDictService sysDictService;
    @Autowired
    private SysImportExcelDataMapper mapper;

    @Override
    public boolean checkLastData(String importCode) {
        ToolUtil.checkParams(importCode);
        SysImportExcelTemplate importExcelTemplate = importExcelTemplateService.getByImportCode(importCode);
        if (importExcelTemplate != null) {
            SysUser sysUser = ShiroUtil.getCurrentUser();
            QueryWrapper<SysImportExcelTemporary> selectLastData = new QueryWrapper<>();
            selectLastData.eq("user_id", sysUser.getId());
            selectLastData.eq("template_id", importExcelTemplate.getId());
            return count(selectLastData) > 0;
        }
        return false;
    }

    @Override
    @Transactional(rollbackFor = RuntimeException.class)
    public boolean analysis(String importCode, String path) {
        ToolUtil.checkParams(importCode);
        ToolUtil.checkParams(path);
        // 检查模板信息
        SysImportExcelTemplate importExcelTemplate = importExcelTemplateService.getByImportCode(importCode);
        if (importExcelTemplate == null) {
            // 获取模板信息失败
            throw new EasyException(BusinessException.IMPORT_GET_TEMPLATE_FAIL);
        }
        // 检查是否有权限访问
        if (StrUtil.isNotBlank(importExcelTemplate.getPermissionCode())) {
            if (!hasPermission(importExcelTemplate.getPermissionCode())) {
                // 无权导入
                throw new EasyException("无权访问导入" + importExcelTemplate.getName());
            }
        }
        // 检查导入规则
        List<SysImportExcelTemplateDetails> configs = importExcelTemplateDetailsService.selectDetails(importExcelTemplate.getId());
        if (configs == null || configs.size() == 0) {
            // 无导入规则
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
                    cleanLastImport(sysUser, importExcelTemplate);
                    // 插入数据到临时表
                    if (!insertData(sysUser, importExcelTemplate, configs, data)) {
                        throw new EasyException(BusinessException.IMPORT_INSERT_FAIL);
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

    /**
     * 清除上次导入的信息
     *
     * @param sysUser             当前登录用户
     * @param importExcelTemplate 导入模板信息
     */
    private void cleanLastImport(SysUser sysUser, SysImportExcelTemplate importExcelTemplate) {
        QueryWrapper<SysImportExcelTemporary> deleteLastData = new QueryWrapper<>();
        deleteLastData.eq("template_id", importExcelTemplate.getId());
        deleteLastData.eq("user_id", sysUser.getId());
        remove(deleteLastData);
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
        return saveBatch(temporaries);
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
            Class temporaryClass = Class.forName("com.frame.easy.modular.sys.model.SysImportExcelTemporary");
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
                    // 转换数据
                    try {
                        cell = replaceData(cell, configs.get(configLength), cacheMap);
                    } catch (EasyException e) {
                        verificationResults.append(configs.get(configLength).getTitle()).append("转换失败;");
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
        } catch (ClassNotFoundException e) {
            throw new EasyException("com.frame.easy.modular.sys.model.SysImportExcelTemporary 未找到");
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
    public boolean insertData(String importCode) {
        return false;
    }

    public static void main(String[] args) {

    }
}
