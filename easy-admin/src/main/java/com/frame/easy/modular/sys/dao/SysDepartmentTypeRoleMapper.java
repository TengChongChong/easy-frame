package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.frame.easy.common.jstree.JsTree;
import com.frame.easy.modular.sys.model.SysDepartmentTypeRole;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 机构类型角色管理
 *
 * @Author tengchong
 * @Date 2018/12/3
 */
public interface SysDepartmentTypeRoleMapper extends BaseMapper<SysDepartmentTypeRole> {

    /**
     * 根据部门类型获取可分配的角色数据
     *
     * @param deptId 部门类型id
     * @return
     */
    List<JsTree> selectRoleByDepart(@Param("deptId") String deptId);
}