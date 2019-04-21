package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.dao.SysImportExcelTemporaryMapper;
import com.frame.easy.modular.sys.model.SysImportExcelTemplate;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;
import com.frame.easy.modular.sys.model.SysUser;
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
        if (Validator.isNotEmpty(object.getUserId())) {
            queryWrapper.eq("user_id", ShiroUtil.getCurrentUser().getId());
        }
        if (object != null) {
            // 查询条件
            // 模板id
            if (Validator.isNotEmpty(object.getTemplateId())) {
                queryWrapper.eq("template_id", object.getTemplateId());
            }
            // 关键字暂时只关联field1查询
            if (Validator.isNotEmpty(object.getField1())) {
                queryWrapper.and(i -> i.like("field1", object.getField1()));
            }
        }
        return (Page) page(ToolUtil.getPage(object), queryWrapper);
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
    public boolean cleanMyImport(String templateCode) {
        ToolUtil.checkParams(templateCode);
        SysImportExcelTemplate template = importExcelTemplateService.getByImportCode(templateCode);
        if (template != null) {
            SysUser sysUser = ShiroUtil.getCurrentUser();
            QueryWrapper<SysImportExcelTemporary> clean = new QueryWrapper<>();
            clean.eq("user_id", sysUser.getId());
            clean.eq("template_id", template.getId());
            return remove(clean);
        }
        return false;
    }

    @Override
    public boolean deleteByTemplateIds(String templateIds) {
        QueryWrapper<SysImportExcelTemporary> clean = new QueryWrapper<>();
        List<String> idList = Arrays.asList(templateIds.split(","));
        clean.in("template_id", idList);
        return remove(clean);
    }

    @Override
    public SysImportExcelTemporary saveData(SysImportExcelTemporary object) {
        ToolUtil.checkParams(object);
        return (SysImportExcelTemporary) ToolUtil.checkResult(updateById(object), object);
    }
}