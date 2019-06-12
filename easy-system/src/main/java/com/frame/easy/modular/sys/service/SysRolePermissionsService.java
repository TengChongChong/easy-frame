package com.frame.easy.modular.sys.service;

/**
 * 角色权限管理
 *
 * @author tengchong
 * @date 2018/11/27
 */
public interface SysRolePermissionsService {
    /**
     * 保存角色权限
     *
     * @param roleId 角色id
     * @param permissions 权限ids 1,2,3,4,5
     * @return boolean
     */
    boolean saveRolePermissions(String roleId, String permissions);

    /**
     * 删除角色中的权限
     *
     * @param permissions 权限ids 1,2,3,4
     * @return
     */
    boolean deleteRolePermissions(String permissions);

}