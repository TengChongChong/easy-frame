package com.frame.easy.modular.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;
import com.frame.easy.common.page.Page;
import cn.hutool.core.lang.Validator;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;
import com.frame.easy.modular.sys.dao.SysImportExcelTemporaryMapper;
import com.frame.easy.modular.sys.service.SysImportExcelTemporaryService;

/**
 * 导入临时表
 *
 * @author TengChong
 * @date 2019-04-10
 */
@Service
public class SysImportExcelTemporaryServiceImpl extends ServiceImpl<SysImportExcelTemporaryMapper, SysImportExcelTemporary> implements SysImportExcelTemporaryService {

    @Autowired
    private SysImportExcelTemporaryMapper mapper;

    /**
     * 列表
     * @param object 查询条件
     * @return 数据集合
     */
    @Override
    public Page select(SysImportExcelTemporary object) {
        QueryWrapper<SysImportExcelTemporary> queryWrapper = new QueryWrapper<>();
        if(object != null){
            // 查询条件
            // 模板id
            if (Validator.isNotEmpty(object.getTemplateId())) {
                queryWrapper.eq("template_id", object.getTemplateId());
            }
            // 导入用户id
            if (Validator.isNotEmpty(object.getUserId())) {
                queryWrapper.eq("user_id", object.getUserId());
            }
            // 验证结果
            if (Validator.isNotEmpty(object.getVerificationResults())) {
                queryWrapper.eq("verification_results", object.getVerificationResults());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField1())) {
                queryWrapper.eq("field1", object.getField1());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField2())) {
                queryWrapper.eq("field2", object.getField2());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField3())) {
                queryWrapper.eq("field3", object.getField3());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField4())) {
                queryWrapper.eq("field4", object.getField4());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField5())) {
                queryWrapper.eq("field5", object.getField5());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField6())) {
                queryWrapper.eq("field6", object.getField6());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField7())) {
                queryWrapper.eq("field7", object.getField7());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField8())) {
                queryWrapper.eq("field8", object.getField8());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField9())) {
                queryWrapper.eq("field9", object.getField9());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField10())) {
                queryWrapper.eq("field10", object.getField10());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField11())) {
                queryWrapper.eq("field11", object.getField11());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField12())) {
                queryWrapper.eq("field12", object.getField12());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField13())) {
                queryWrapper.eq("field13", object.getField13());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField14())) {
                queryWrapper.eq("field14", object.getField14());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField15())) {
                queryWrapper.eq("field15", object.getField15());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField16())) {
                queryWrapper.eq("field16", object.getField16());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField17())) {
                queryWrapper.eq("field17", object.getField17());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField18())) {
                queryWrapper.eq("field18", object.getField18());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField19())) {
                queryWrapper.eq("field19", object.getField19());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField20())) {
                queryWrapper.eq("field20", object.getField20());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField21())) {
                queryWrapper.eq("field21", object.getField21());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField22())) {
                queryWrapper.eq("field22", object.getField22());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField23())) {
                queryWrapper.eq("field23", object.getField23());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField24())) {
                queryWrapper.eq("field24", object.getField24());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField25())) {
                queryWrapper.eq("field25", object.getField25());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField26())) {
                queryWrapper.eq("field26", object.getField26());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField27())) {
                queryWrapper.eq("field27", object.getField27());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField28())) {
                queryWrapper.eq("field28", object.getField28());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField29())) {
                queryWrapper.eq("field29", object.getField29());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField30())) {
                queryWrapper.eq("field30", object.getField30());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField31())) {
                queryWrapper.eq("field31", object.getField31());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField32())) {
                queryWrapper.eq("field32", object.getField32());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField33())) {
                queryWrapper.eq("field33", object.getField33());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField34())) {
                queryWrapper.eq("field34", object.getField34());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField35())) {
                queryWrapper.eq("field35", object.getField35());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField36())) {
                queryWrapper.eq("field36", object.getField36());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField37())) {
                queryWrapper.eq("field37", object.getField37());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField38())) {
                queryWrapper.eq("field38", object.getField38());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField39())) {
                queryWrapper.eq("field39", object.getField39());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField40())) {
                queryWrapper.eq("field40", object.getField40());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField41())) {
                queryWrapper.eq("field41", object.getField41());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField42())) {
                queryWrapper.eq("field42", object.getField42());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField43())) {
                queryWrapper.eq("field43", object.getField43());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField44())) {
                queryWrapper.eq("field44", object.getField44());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField45())) {
                queryWrapper.eq("field45", object.getField45());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField46())) {
                queryWrapper.eq("field46", object.getField46());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField47())) {
                queryWrapper.eq("field47", object.getField47());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField48())) {
                queryWrapper.eq("field48", object.getField48());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField49())) {
                queryWrapper.eq("field49", object.getField49());
            }
            // 导入字段
            if (Validator.isNotEmpty(object.getField50())) {
                queryWrapper.eq("field50", object.getField50());
            }
        }
        return (Page)page(ToolUtil.getPage(object), queryWrapper);
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
        return getById(id);
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
}