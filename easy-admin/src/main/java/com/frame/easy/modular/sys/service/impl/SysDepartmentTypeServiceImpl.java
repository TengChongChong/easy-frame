package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.status.CommonStatus;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.jstree.State;
import com.frame.easy.common.select.Select;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.core.exception.ExceptionEnum;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.core.util.ToolUtil;
import com.frame.easy.modular.sys.dao.SysDepartmentTypeMapper;
import com.frame.easy.modular.sys.model.SysDepartmentType;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysDepartmentService;
import com.frame.easy.modular.sys.service.SysDepartmentTypeRoleService;
import com.frame.easy.modular.sys.service.SysDepartmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 机构类型管理
 *
 * @Author tengchong
 * @Date 2018/12/3
 */
@Service
public class SysDepartmentTypeServiceImpl extends ServiceImpl<SysDepartmentTypeMapper, SysDepartmentType> implements SysDepartmentTypeService {

    @Autowired
    private SysDepartmentTypeMapper mapper;

    @Autowired
    private ProjectProperties projectProperties;

    @Autowired
    private SysDepartmentTypeRoleService departmentTypeRoleService;

    @Autowired
    private SysDepartmentService sysDepartmentService;

    /**
     * 根节点id
     */
    private Long baseId = 0L;

    @Override
    public List<JsTree> selectData(Long pId) {
        List<JsTree> jsTrees;
        // 第一次请求,返回项目名称 + 一级节点 数据
        if (pId == null || pId.equals(baseId)) {
            jsTrees = new ArrayList<>();
            JsTree jsTree = new JsTree();
            // 项目名称
            jsTree.setText(projectProperties.getName());
            jsTree.setId(baseId);
            jsTree.setIcon(CommonConst.DEFAULT_FOLDER_ICON);;
            jsTree.setChildren(mapper.selectData(baseId));
            State state = new State();
            state.setOpened(true);
            jsTree.setState(state);
            jsTrees.add(jsTree);
        } else {
            jsTrees = mapper.selectData(pId);
        }
        return jsTrees;
    }

    @Override
    public List<JsTree> selectAll() {
        List<JsTree> jsTrees = mapper.selectAll(CommonStatus.ENABLE.getCode());
        JsTree jsTree = new JsTree();
        State state = new State();
        jsTree.setId(baseId);
        jsTree.setParent("#");
        jsTree.setIcon(CommonConst.DEFAULT_FOLDER_ICON);;
        jsTree.setText(projectProperties.getName());
        state.setOpened(true);
        jsTree.setState(state);
        jsTrees.add(jsTree);
        return jsTrees;
    }

    @Override
    public SysDepartmentType input(Long id) {
        SysDepartmentType sysDepartmentType;
        // 表示点击的是根目录
        if (id == null || id.equals(baseId)) {
            sysDepartmentType = new SysDepartmentType();
            sysDepartmentType.setId(baseId);
            sysDepartmentType.setName(projectProperties.getName());
        } else {
            sysDepartmentType = mapper.selectInfo(id);
            if (sysDepartmentType != null && sysDepartmentType.getpId().equals(baseId)) {
                sysDepartmentType.setpName(projectProperties.getName());
            }
        }
        return sysDepartmentType;
    }

    @Override
    public SysDepartmentType add(Long pId) {
        if (pId != null) {
            SysDepartmentType sysDepartmentType = new SysDepartmentType();
            sysDepartmentType.setpId(pId);
            sysDepartmentType.setStatus(CommonStatus.ENABLE.getCode());
            if (baseId.equals(pId)) {
                sysDepartmentType.setpName(projectProperties.getName());
            } else {
                SysDepartmentType parentSysDepartmentType = getById(pId);
                if (parentSysDepartmentType != null) {
                    sysDepartmentType.setpName(parentSysDepartmentType.getName());
                }
            }
            return sysDepartmentType;
        } else {
            throw new RuntimeException("获取父机构类型信息失败，请重试！");
        }
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(Long id) {
        ToolUtil.checkParams(id);
        // 检查是否有子机构类型
        QueryWrapper<SysDepartmentType> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("p_id", id);
        int count = count(queryWrapper);
        if (count > 0) {
            throw new RuntimeException(ExceptionEnum.EXIST_CHILD.getMessage());
        }
        // 检查机构类型下是否有机构
        count = sysDepartmentService.selectCountByTypeIds(String.valueOf(id));
        if (count > 0) {
            throw new RuntimeException("要删除的类型中包含机构信息，请删除机构信息后重试！");
        }
        boolean isSuccess = removeById(id);
        if(isSuccess){
            // 删除部门类型可选择的角色
            departmentTypeRoleService.deleteDepartTypeRole(String.valueOf(id));
        }
        return ToolUtil.checkResult(isSuccess);
    }
    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean batchDelete(String ids) {
        ToolUtil.checkParams(ids);
        // 检查是否有子权限
        QueryWrapper<SysDepartmentType> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("p_id", ids.split(CommonConst.SPLIT));
        int count = count(queryWrapper);
        if (count > 0) {
            throw new RuntimeException(ExceptionEnum.EXIST_CHILD.getMessage());
        }
        // 检查机构类型下是否有机构
        count = sysDepartmentService.selectCountByTypeIds(ids);
        if (count > 0) {
            throw new RuntimeException("要删除的类型中包含机构信息，请删除机构信息后重试！");
        }
        List<String> idList = Arrays.asList(ids.split(CommonConst.SPLIT));
        boolean isSuccess = removeByIds(idList);
        if(isSuccess){
            // 删除部门类型可选择的角色
            departmentTypeRoleService.deleteDepartTypeRole(ids);
        }
        return ToolUtil.checkResult(isSuccess);
    }

    @Override
    public boolean setStatus(String ids, Integer status) {
        ToolUtil.checkParams(ids);
        ToolUtil.checkParams(status);
        List<SysDepartmentType> permissionsList = new ArrayList<>();
        SysDepartmentType sysDepartmentType;
        for (String id : ids.split(CommonConst.SPLIT)) {
            sysDepartmentType = new SysDepartmentType();
            sysDepartmentType.setId(Long.parseLong(id));
            sysDepartmentType.setStatus(status);
            permissionsList.add(sysDepartmentType);
        }
        return ToolUtil.checkResult(updateBatchById(permissionsList));
    }


    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysDepartmentType saveData(SysDepartmentType object) {
        ToolUtil.checkParams(object);
        // 是否是修改了编码
        boolean isModifyCode = false;
        SysDepartmentType oldDepartType = null;
        SysUser sysUser = ShiroUtil.getCurrentUser();
        if (object.getId() == null) {
            object.setCreateDate(new Date());
            object.setCreateUser(sysUser.getId());
        } else {
            oldDepartType = getById(object.getId());
            isModifyCode = !oldDepartType.equals(object.getCode());
        }
        object.setEditDate(new Date());
        object.setEditUser(sysUser.getId());
        // 机构类型代码不能重复
        QueryWrapper<SysDepartmentType> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("code", object.getCode());
        if (Validator.isNotEmpty(object.getId())) {
            queryWrapper.ne("id", object.getId());
        }
        int count = mapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new RuntimeException("结构类型代码[" + object.getCode() + "]已存在！");
        }

        if (object.getOrderNo() == null) {
            object.setOrderNo(mapper.getMaxOrderNo(object.getpId()) + 1);
        }
        boolean isSuccess = saveOrUpdate(object);
        if (isSuccess) {
            departmentTypeRoleService.saveDepartTypeRole(object.getId(), object.getRoles());
            /**
             * 如果修改了机构类型代码
             * 需要将sys_department(机构)表中的typeCode一并修改
             */
            if (isModifyCode) {
                if (oldDepartType != null) {
                    sysDepartmentService.updateDepartmentTypeCode(oldDepartType.getCode(), object.getCode());
                }
            }
        }
        return (SysDepartmentType) ToolUtil.checkResult(isSuccess, object);
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean move(Long id, Long parent, Long oldParent, Integer position, Integer oldPosition) {
        if (Validator.isNotEmpty(id) && Validator.isNotEmpty(parent) && Validator.isNotEmpty(oldParent) &&
                Validator.isNotEmpty(position) && Validator.isNotEmpty(oldPosition)) {
            // 如机构类型下有机构信息,不允许拖动
            int count = sysDepartmentService.selectCountByTypeIds(String.valueOf(id));
            if (count > 0) {
                throw new RuntimeException("要拖动的类型中包含机构信息，请删除机构信息后重试！");
            }

            boolean isSuccess;
            // 没有改变所属节点,内部排序
            if (parent.equals(oldParent)) {
                // 拖动影响节点顺序的开始序号
                int str = Math.min(position, oldPosition);
                // 拖动影响顺序节点数量
                int length = Math.abs(position - oldPosition) + 1;
                List<SysDepartmentType> oldSysDepartmentType = mapper.selectOrderInfo(parent, str, length);
                List<SysDepartmentType> newSysDepartmentType = new ArrayList<>();
                // 是否需要偏移
                boolean needDeviation = false;
                // 偏移量
                int deviation;
                if (position > oldPosition) {
                    deviation = -1;
                } else {
                    deviation = 1;
                }
                for (int i = 0; i < oldSysDepartmentType.size(); i++) {
                    if ((i + str) == position) {
                        newSysDepartmentType.add(new SysDepartmentType(id, oldSysDepartmentType.get(i).getOrderNo()));
                        newSysDepartmentType.add(new SysDepartmentType(oldSysDepartmentType.get(i).getId(), oldSysDepartmentType.get(i + deviation).getOrderNo()));
                        needDeviation = true;
                    } else {
                        if ((i + str) == oldPosition) {
                            needDeviation = true;
                        }
                        if (!id.equals(oldSysDepartmentType.get(i).getId())) {
                            newSysDepartmentType.add(new SysDepartmentType(oldSysDepartmentType.get(i).getId(), oldSysDepartmentType.get(i + (needDeviation ? deviation : 0)).getOrderNo()));
                        }
                    }
                }
                isSuccess = updateBatchById(newSysDepartmentType);
            } else {
                List<SysDepartmentType> oldSysDepartmentType = mapper.selectOrderInfo(parent, null, null);
                List<SysDepartmentType> newSysDepartmentType = new ArrayList<>();
                // 是否需要偏移
                boolean needDeviation = false;
                // 偏移量
                int deviation = 1;
                // 放到了最后一个
                if (position == oldSysDepartmentType.size()) {
                    if (oldSysDepartmentType.size() == 0) {
                        newSysDepartmentType.add(new SysDepartmentType(id, parent, 1));
                    } else {
                        newSysDepartmentType.add(new SysDepartmentType(id, parent, oldSysDepartmentType.get(oldSysDepartmentType.size() - 1).getOrderNo() + 1));
                    }
                } else {
                    for (int i = 0; i < oldSysDepartmentType.size(); i++) {
                        if (i == position) {
                            newSysDepartmentType.add(new SysDepartmentType(id, parent, oldSysDepartmentType.get(i).getOrderNo()));
                            newSysDepartmentType.add(new SysDepartmentType(oldSysDepartmentType.get(i).getId(), oldSysDepartmentType.get(i).getOrderNo() + 1));
                            needDeviation = true;
                        } else {
                            newSysDepartmentType.add(new SysDepartmentType(oldSysDepartmentType.get(i).getId(), oldSysDepartmentType.get(i).getOrderNo() + (needDeviation ? deviation : 0)));
                        }
                    }
                }
                isSuccess = updateBatchById(newSysDepartmentType);
            }
            return isSuccess;
        } else {
            throw new RuntimeException(ExceptionEnum.FAILED_TO_GET_DATA.getMessage());
        }
    }

    @Override
    public List<JsTree> search(String title) {
        if (Validator.isNotEmpty(title)) {
            return mapper.search("%" + title + "%");
        } else {
            throw new RuntimeException("请输入关键字后重试！");
        }
    }

    @Override
    public List<Select> selectOptionBySameLevel(String code) {
        if(Validator.isNotEmpty(code)){
            return mapper.selectOptionBySameLevel(code);
        }else{
            return null;
        }
    }

    @Override
    public List<Select> selectOptionByParentCode(String parentCode) {
        if(Validator.isNotEmpty(parentCode)){
            return mapper.selectOptionByParentCode(parentCode);
        }else{
            return null;
        }
    }
}
