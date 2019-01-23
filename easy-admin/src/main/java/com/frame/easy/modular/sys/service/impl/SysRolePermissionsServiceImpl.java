package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.CommonConst;
import com.frame.easy.util.ToolUtil;
import com.frame.easy.modular.sys.dao.SysRolePermissionsMapper;
import com.frame.easy.modular.sys.model.SysRolePermissions;
import com.frame.easy.modular.sys.service.SysRolePermissionsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 角色权限
 *
 * @author tengchong
 * @date 2018/11/27
 */
@Service
public class SysRolePermissionsServiceImpl extends ServiceImpl<SysRolePermissionsMapper, SysRolePermissions> implements SysRolePermissionsService {

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean saveRolePermissions(Long roleId, String permissions) {
        ToolUtil.checkParams(roleId);
        // 删除原权限
        remove(new QueryWrapper<SysRolePermissions>().eq("role_id", roleId));
        if (Validator.isNotEmpty(permissions)) {
            List<SysRolePermissions> sysRolePermissions = new ArrayList<>();
            SysRolePermissions sysRolePermission;
            for (String permissionId : permissions.split(CommonConst.SPLIT)) {
                sysRolePermission = new SysRolePermissions();
                sysRolePermission.setRoleId(roleId);
                sysRolePermission.setPermissionsId(Long.parseLong(permissionId));
                sysRolePermissions.add(sysRolePermission);
            }
            saveBatch(sysRolePermissions);
        }
        return true;
    }

    @Override
    public boolean deleteRolePermissions(String permissions) {
        return remove(new QueryWrapper<SysRolePermissions>().in("permissions_id", permissions.split(CommonConst.SPLIT)));
    }
}
