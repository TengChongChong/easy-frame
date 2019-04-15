package com.frame.easy.modular.sys.controller;

import com.frame.easy.result.Tips;
import com.frame.easy.modular.sys.service.SysDepartmentTypeRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * 部门类型与角色关系
 *
 * @author tengchong
 * @date 2018/12/18
 */
@Controller
@RequestMapping("/auth/sys/depart/type/role")
public class SysDepartmentTypeRoleController {

    @Autowired
    private SysDepartmentTypeRoleService service;

    /**
     * 根据部门类型
     *
     * @param deptId 部门id
     * @return Tips
     */
    @RequestMapping("/select/role/{deptId}")
    @ResponseBody
    public Object selectRoleByDepart(@PathVariable("deptId") String deptId) {
        return Tips.getSuccessTips(service.selectRoleByDepart(deptId));
    }

}
