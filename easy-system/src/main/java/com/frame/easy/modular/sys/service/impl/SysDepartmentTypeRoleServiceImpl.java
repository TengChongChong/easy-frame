package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.util.ToolUtil;
import com.frame.easy.modular.sys.dao.SysDepartmentTypeRoleMapper;
import com.frame.easy.modular.sys.model.SysDepartmentTypeRole;
import com.frame.easy.modular.sys.service.SysDepartmentTypeRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 机构类型可选择的角色
 *
 * @author tengchong
 * @date 2018/12/3
 */
@Service
public class SysDepartmentTypeRoleServiceImpl extends ServiceImpl<SysDepartmentTypeRoleMapper, SysDepartmentTypeRole> implements SysDepartmentTypeRoleService {

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean saveDepartTypeRole(Long deptTypeId, String roles) {
        ToolUtil.checkParams(deptTypeId);
        // 删除原权限
        remove(new QueryWrapper<SysDepartmentTypeRole>().eq("dept_type_id", deptTypeId));
        if (Validator.isNotEmpty(roles)) {
            List<SysDepartmentTypeRole> sysDepartmentTypeRoles = new ArrayList<>();
            SysDepartmentTypeRole sysDepartmentTypeRole;
            for (String roleId : roles.split(CommonConst.SPLIT)) {
                sysDepartmentTypeRole = new SysDepartmentTypeRole();
                sysDepartmentTypeRole.setRoleId(Long.parseLong(roleId));
                sysDepartmentTypeRole.setDeptTypeId(deptTypeId);
                sysDepartmentTypeRoles.add(sysDepartmentTypeRole);
            }
            saveBatch(sysDepartmentTypeRoles);
        }
        return true;
    }

    @Override
    public boolean deleteDepartTypeRoleByDepartTypeIds(String deptTypeIds) {
        return remove(new QueryWrapper<SysDepartmentTypeRole>().in("dept_type_id", deptTypeIds.split(CommonConst.SPLIT)));
    }

    @Override
    public boolean deleteDepartTypeRole(String roles) {
        return remove(new QueryWrapper<SysDepartmentTypeRole>().in("role_id", roles.split(CommonConst.SPLIT)));
    }

    @Override
    public List<JsTree> selectRoleByDepart(String deptId) {
        ToolUtil.checkParams(deptId);
        return getBaseMapper().selectRoleByDepart(deptId);
    }
}
