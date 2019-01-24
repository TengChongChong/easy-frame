package com.frame.easy.modular.sys.service;

import com.frame.easy.common.jstree.JsTree;

import java.util.List;

/**
 * 机构类型可选择的角色
 *
 * @author tengchong
 * @date 2018/12/3
 */
public interface SysDepartmentTypeRoleService {
    /**
     * 保存机构类型可选择的角色
     *
     * @param deptTypeId 机构类型id
     * @param roles      角色ids 1,2,3,4,5
     * @return true/false
     */
    boolean saveDepartTypeRole(Long deptTypeId, String roles);

    /**
     * 删除机构类型可选择的角色
     *
     * @param deptTypeIds 机构类型ids
     * @return true/false
     */
    boolean deleteDepartTypeRoleByDepartTypeIds(String deptTypeIds);

    /**
     * 删除机构类型可选择的角色
     *
     * @param roles 角色ids 1,2,3,4,5
     * @return true/false
     */
    boolean deleteDepartTypeRole(String roles);

    /**
     * 根据部门类型获取可分配的角色数据
     *
     * @param deptId 部门类型id
     * @return List<JsTree>
     */
    List<JsTree> selectRoleByDepart(String deptId);
}