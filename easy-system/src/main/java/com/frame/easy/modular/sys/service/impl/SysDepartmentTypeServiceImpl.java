package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.common.jstree.JsTreeUtil;
import com.frame.easy.common.jstree.State;
import com.frame.easy.common.select.Select;
import com.frame.easy.common.status.CommonStatus;
import com.frame.easy.exception.BusinessException;
import com.frame.easy.exception.EasyException;
import com.frame.easy.exception.ExceptionEnum;
import com.frame.easy.modular.sys.dao.SysDepartmentTypeMapper;
import com.frame.easy.modular.sys.model.SysDepartmentType;
import com.frame.easy.modular.sys.service.SysDepartmentService;
import com.frame.easy.modular.sys.service.SysDepartmentTypeRoleService;
import com.frame.easy.modular.sys.service.SysDepartmentTypeService;
import com.frame.easy.util.SysConfigUtil;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 机构类型管理
 *
 * @author tengchong
 * @date 2018/12/3
 */
@Service
public class SysDepartmentTypeServiceImpl extends ServiceImpl<SysDepartmentTypeMapper, SysDepartmentType> implements SysDepartmentTypeService {

    @Autowired
    private SysDepartmentTypeRoleService departmentTypeRoleService;

    @Autowired
    private SysDepartmentService sysDepartmentService;

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
    public List<JsTree> selectAll() {
        List<JsTree> jsTrees = getBaseMapper().selectAll(CommonStatus.ENABLE.getCode());
        JsTree jsTree = new JsTree();
        State state = new State();
        jsTree.setId(JsTreeUtil.BASE_ID);
        jsTree.setParent("#");
        jsTree.setIcon(CommonConst.DEFAULT_FOLDER_ICON);
        jsTree.setText(SysConfigUtil.getProjectName());
        state.setOpened(true);
        jsTree.setState(state);
        jsTrees.add(jsTree);
        return jsTrees;
    }

    @Override
    public SysDepartmentType input(String id) {
        SysDepartmentType sysDepartmentType;
        // 表示点击的是根目录
        if (id == null || id.equals(JsTreeUtil.BASE_ID)) {
            sysDepartmentType = new SysDepartmentType();
            sysDepartmentType.setId(JsTreeUtil.BASE_ID);
            sysDepartmentType.setName(SysConfigUtil.getProjectName());
        } else {
            sysDepartmentType = getBaseMapper().selectInfo(id);
            if (sysDepartmentType != null && sysDepartmentType.getpId().equals(JsTreeUtil.BASE_ID)) {
                sysDepartmentType.setpName(SysConfigUtil.getProjectName());
            }
        }
        return sysDepartmentType;
    }

    @Override
    public SysDepartmentType add(String pId) {
        if (pId != null) {
            SysDepartmentType sysDepartmentType = new SysDepartmentType();
            sysDepartmentType.setpId(pId);
            sysDepartmentType.setStatus(CommonStatus.ENABLE.getCode());
            if (JsTreeUtil.BASE_ID.equals(pId)) {
                sysDepartmentType.setpName(SysConfigUtil.getProjectName());
            } else {
                SysDepartmentType parentSysDepartmentType = getById(pId);
                if (parentSysDepartmentType != null) {
                    sysDepartmentType.setpName(parentSysDepartmentType.getName());
                }
            }
            return sysDepartmentType;
        } else {
            throw new EasyException("获取父机构类型信息失败，请重试！");
        }
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(String id) {
        ToolUtil.checkParams(id);
        // 检查是否有子机构类型
        QueryWrapper<SysDepartmentType> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("p_id", id);
        int count = count(queryWrapper);
        if (count > 0) {
            throw new EasyException(BusinessException.EXIST_CHILD.getMessage());
        }
        // 检查机构类型下是否有机构
        count = sysDepartmentService.selectCountByTypeIds(String.valueOf(id));
        if (count > 0) {
            throw new EasyException("要删除的类型中包含 " + count + " 个机构信息，请删除机构信息后重试！");
        }
        boolean isSuccess = removeById(id);
        if (isSuccess) {
            // 删除部门类型可选择的角色
            departmentTypeRoleService.deleteDepartTypeRole(String.valueOf(id));
        }
        return isSuccess;
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
            throw new EasyException(BusinessException.EXIST_CHILD.getMessage());
        }
        // 检查机构类型下是否有机构
        count = sysDepartmentService.selectCountByTypeIds(ids);
        if (count > 0) {
            throw new EasyException("要删除的类型中包含 " + count + " 个机构信息，请删除机构信息后重试！");
        }
        List<String> idList = Arrays.asList(ids.split(CommonConst.SPLIT));
        boolean isSuccess = removeByIds(idList);
        if (isSuccess) {
            // 删除部门类型可选择的角色
            departmentTypeRoleService.deleteDepartTypeRoleByDepartTypeIds(ids);
        }
        return isSuccess;
    }

    @Override
    public boolean setStatus(String ids, Integer status) {
        ToolUtil.checkParams(ids);
        ToolUtil.checkParams(status);
        UpdateWrapper<SysDepartmentType> updateWrapper = new UpdateWrapper<>();
        updateWrapper.in("id", ids.split(CommonConst.SPLIT));
        updateWrapper.set("status", status);
        return ToolUtil.checkResult(update(updateWrapper));
    }


    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public SysDepartmentType saveData(SysDepartmentType object) {
        ToolUtil.checkParams(object);
        // 是否是修改了编码
        boolean isModifyCode = false;
        SysDepartmentType oldDepartType = null;
        if (object.getId() != null) {
            oldDepartType = getById(object.getId());
            isModifyCode = !oldDepartType.getCode().equals(object.getCode());
        }
        // 机构类型代码不能重复
        QueryWrapper<SysDepartmentType> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("code", object.getCode());
        if (Validator.isNotEmpty(object.getId())) {
            queryWrapper.ne("id", object.getId());
        }
        int count = getBaseMapper().selectCount(queryWrapper);
        if (count > 0) {
            throw new EasyException("机构类型代码 " + object.getCode() + " 已存在");
        }

        if (object.getOrderNo() == null) {
            object.setOrderNo(getBaseMapper().getMaxOrderNo(object.getpId()) + 1);
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
    public boolean move(String id, String parent, String oldParent, Integer position, Integer oldPosition) {
        if (Validator.isNotEmpty(id) && Validator.isNotEmpty(parent) && Validator.isNotEmpty(oldParent) &&
                Validator.isNotEmpty(position) && Validator.isNotEmpty(oldPosition)) {
            // 如机构类型下有机构信息,不允许拖动
            // 会导致机构数据上下层级错误
            int count = sysDepartmentService.selectCountByTypeIds(String.valueOf(id));
            if (count > 0) {
                throw new EasyException("要拖动的类型中包含 " + count + " 个机构信息，请删除机构信息后重试");
            }

            boolean isSuccess;
            // 没有改变所属节点,内部排序
            if (parent.equals(oldParent)) {
                // 拖动影响节点顺序的开始序号
                int str = Math.min(position, oldPosition);
                // 拖动影响顺序节点数量
                int length = Math.abs(position - oldPosition) + 1;
                List<SysDepartmentType> oldSysDepartmentType = getBaseMapper().selectOrderInfo(parent, str, length);
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
                List<SysDepartmentType> oldSysDepartmentType = getBaseMapper().selectOrderInfo(parent, null, null);
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
            throw new EasyException(ExceptionEnum.FAILED_TO_GET_DATA.getMessage());
        }
    }

    @Override
    public List<JsTree> search(String title) {
        if (Validator.isNotEmpty(title)) {
            return getBaseMapper().search("%" + title + "%");
        } else {
            throw new EasyException("请输入关键字后重试");
        }
    }

    @Override
    public List<Select> selectOptionBySameLevel(String code) {
        if (Validator.isNotEmpty(code)) {
            return getBaseMapper().selectOptionBySameLevel(code);
        } else {
            return null;
        }
    }

    @Override
    public List<Select> selectOptionByParentCode(String parentCode) {
        if (Validator.isNotEmpty(parentCode)) {
            return getBaseMapper().selectOptionByParentCode(parentCode);
        } else {
            return null;
        }
    }
}
