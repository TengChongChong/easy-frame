package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.jstree.JsTreeUtil;
import com.frame.easy.common.page.Page;
import com.frame.easy.common.select.Select;
import com.frame.easy.common.status.CommonStatus;
import com.frame.easy.exception.BusinessException;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.dao.SysDepartmentMapper;
import com.frame.easy.modular.sys.model.SysDepartment;
import com.frame.easy.modular.sys.service.SysDepartmentService;
import com.frame.easy.modular.sys.service.SysDepartmentTypeService;
import com.frame.easy.modular.sys.service.SysUserService;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 机构管理
 *
 * @author tengchong
 * @date 2018/12/3
 */
@Service
public class SysDepartmentServiceImpl extends ServiceImpl<SysDepartmentMapper, SysDepartment> implements SysDepartmentService {

    @Autowired
    private SysDepartmentTypeService sysDepartmentTypeService;

    @Autowired
    private SysUserService sysUserService;

    @Override
    public List<JsTree> selectData(String pId) {
        List<JsTree> jsTrees;
        // 第一次请求,返回项目名称 + 一级节点 数据
        if (pId == null || pId.equals(JsTreeUtil.BASE_ID)) {
            jsTrees = new ArrayList<>();
            // 根节点
            JsTree jsTree = JsTreeUtil.getBaseNode();
            jsTree.setChildren(getBaseMapper().selectData(JsTreeUtil.BASE_ID));
            jsTrees.add(jsTree);
        } else {
            jsTrees = getBaseMapper().selectData(pId);
        }
        return jsTrees;
    }

    @Override
    public List<JsTree> search(String title) {
        if (Validator.isNotEmpty(title)) {
            return getBaseMapper().search("%" + title + "%");
        } else {
            throw new RuntimeException("请输入关键字后重试！");
        }
    }

    @Override
    public Page select(SysDepartment sysDepartment) {
        QueryWrapper<SysDepartment> queryWrapper = new QueryWrapper<>();
        if (sysDepartment != null) {
            if (Validator.isNotEmpty(sysDepartment.getName())) {
                queryWrapper.like("t.name", sysDepartment.getName());
            }
            if (Validator.isNotEmpty(sysDepartment.getTypeCode())) {
                queryWrapper.eq("t.type_code", sysDepartment.getTypeCode());
            }
            if (Validator.isNotEmpty(sysDepartment.getStatus())) {
                queryWrapper.eq("t.status", sysDepartment.getStatus());
            }
            if (Validator.isNotEmpty(sysDepartment.getCode())) {
                queryWrapper.like("t.code", sysDepartment.getCode());
            }
            if (Validator.isNotEmpty(sysDepartment.getpName())) {
                queryWrapper.like("p.name", sysDepartment.getpName());
            }
        }
        Page page = ToolUtil.getPage(sysDepartment);
        page.setRecords(getBaseMapper().select(page, queryWrapper));
        return page;
    }

    @Override
    public SysDepartment input(String id) {
        ToolUtil.checkParams(id);
        return getById(id);
    }

    @Override
    public SysDepartment add(String pId, String departType) {
        if (Validator.isNotEmpty(pId) || Validator.isNotEmpty(departType)) {
            SysDepartment object = new SysDepartment();
            if (Validator.isNotEmpty(pId)) {
                SysDepartment parentDepartment = getById(pId);
                if (parentDepartment != null) {
                    object.setpId(pId);
                    object.setpName(parentDepartment.getName());
                }
            }
            if (Validator.isNotEmpty(departType)) {
                object.setTypeCode(departType);
            }
            object.setStatus(CommonStatus.ENABLE.getCode());
            return object;
        } else {
            throw new RuntimeException("获取机构信息失败");
        }
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(String ids) {
        ToolUtil.checkParams(ids);
        // 检查是否有子节点
        QueryWrapper<SysDepartment> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("p_id", ids.split(CommonConst.SPLIT));
        int count = count(queryWrapper);
        if (count > 0) {
            throw new EasyException(BusinessException.EXIST_CHILD.getMessage());
        }
        // 检查部门下是否有用户
        int userCount = sysUserService.countUser(ids);
        if (userCount > 0) {
            throw new EasyException("所选部门中包含 " + userCount + " 个用户，请移除后重试");
        }
        List<String> idList = Arrays.asList(ids.split(CommonConst.SPLIT));
        return removeByIds(idList);
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysDepartment saveData(SysDepartment object) {
        ToolUtil.checkParams(object);
        // 部门编码不能重复
        if (Validator.isNotEmpty(object.getCode())) {
            QueryWrapper<SysDepartment> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("code", object.getCode());
            if (object.getId() != null) {
                queryWrapper.ne("id", object.getId());
            }
            int count = getBaseMapper().selectCount(queryWrapper);
            if (count > 0) {
                throw new EasyException("已存在编码为[" + object.getCode() + "]的机构，请修改后重试");
            }
        }
        if (object.getpId() == null) {
            object.setpId(JsTreeUtil.BASE_ID);
        }
        if (object.getOrderNo() == null) {
            object.setOrderNo(getBaseMapper().getMaxOrderNo(object.getTypeCode()) + 1);
        }
        return (SysDepartment) ToolUtil.checkResult(saveOrUpdate(object), object);
    }

    @Override
    public int selectCountByTypeIds(String typeIds) {
        if (Validator.isNotEmpty(typeIds)) {
            QueryWrapper<SysDepartment> queryWrapper = new QueryWrapper<>();
            if (typeIds.contains(CommonConst.SPLIT)) {
                queryWrapper.in("dt.id", typeIds.split(CommonConst.SPLIT));
            } else {
                queryWrapper.eq("dt.id", typeIds);
            }
            return getBaseMapper().selectCountByTypeIds(queryWrapper);
        }
        return 0;
    }

    @Override
    public boolean updateDepartmentTypeCode(String oldCode, String newCode) {
        SysDepartment sysDepartment = new SysDepartment();
        sysDepartment.setTypeCode(newCode);
        QueryWrapper<SysDepartment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("type_code", oldCode);
        return update(sysDepartment, queryWrapper);
    }

    @Override
    public List<Select> selectDepartmentTypeOption(String pId, String departType) {
        List<Select> option = new ArrayList<>();
        // 获取当前机构下级机构类型
        if (Validator.isNotEmpty(pId) && !pId.equals(JsTreeUtil.BASE_ID)) {
            SysDepartment sysDepartment = getById(pId);
            option = sysDepartmentTypeService.selectOptionByParentCode(sysDepartment.getTypeCode());
        }
        // 当前机构类型
        if (Validator.isNotEmpty(departType)) {
            option = sysDepartmentTypeService.selectOptionBySameLevel(departType);
        }
        return option;
    }

    @Override
    public List<Select> selectUpDepartmentOption(String pId, String departType) {
        List<Select> option = new ArrayList<>();
        // 获取当前机构下级机构类型
        if (Validator.isNotEmpty(pId) && !pId.equals(JsTreeUtil.BASE_ID)) {
            SysDepartment sysDepartment = getById(pId);
            option = getBaseMapper().selectOptionByTypeCode(sysDepartment.getTypeCode());
        }
        // 当前机构类型
        if (Validator.isNotEmpty(departType)) {
            option = getBaseMapper().selectOptionByPTypeCode(departType);
        }
        return option;
    }
}
