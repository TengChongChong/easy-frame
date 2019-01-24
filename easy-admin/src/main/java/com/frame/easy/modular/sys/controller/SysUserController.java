package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.base.result.Tips;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysUserService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * 用户管理
 *
 * @author tengchong
 * @date 2018/12/6
 */
@Controller
@RequestMapping("/auth/sys/user")
public class SysUserController extends BaseController {

    private final String PREFIX = "modular/sys/user/";

    @Autowired
    private SysUserService service;

    /**
     * 列表
     *
     * @return view
     */
    @GetMapping("list")
    public String list() {
        ShiroUtil.setAttribute("test", "test message");
        logger.debug("/auth/sys/user/list");
        return PREFIX + "list";
    }

    /**
     * 列表
     *
     * @param object 查询条件
     * @return Tips
     */
    @RequestMapping("select")
    @ResponseBody
    @RequiresPermissions("sys:user:select")
    public Object select(@RequestBody SysUser object) {
        logger.debug("/auth/sys/user/select");
        return Tips.getSuccessTips(service.select(object));
    }

    /**
     * 新增
     *
     * @param deptId 用户id
     * @return view
     */
    @GetMapping({"/add/{id}"})
    public String add(Model model, @PathVariable(value = "id", required = false) Long deptId) {
        logger.debug("/auth/sys/user/add/" + deptId);
        model.addAttribute("object", service.add(deptId));
        return PREFIX + "input";
    }

    /**
     * 删除
     *
     * @param id 用户id
     * @return Tips
     */
    @RequestMapping("/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:user:delete")
    public Object delete(@PathVariable("id") String id) {
        logger.debug("/auth/sys/user/delete/" + id);
        return Tips.getSuccessTips(service.delete(id));
    }

    /**
     * 禁用用户
     *
     * @param ids 用户ids
     * @return Tips
     */
    @RequestMapping("/disable/user/{ids}")
    @ResponseBody
    @RequiresPermissions("sys:user:disable")
    public Object disableUser(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/user/disable/account/" + ids);
        return Tips.getSuccessTips(service.disableUser(ids));
    }

    /**
     * 启用账号
     *
     * @param ids 用户ids
     * @return Tips
     */
    @RequestMapping("/enable/user/{ids}")
    @ResponseBody
    @RequiresPermissions("sys:user:enable")
    public Object enableUser(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/user/enable/account/" + ids);
        return Tips.getSuccessTips(service.enableUser(ids));
    }

    /**
     * 重置密码
     *
     * @param ids 用户ids
     * @return Tips
     */
    @RequestMapping("/reset/password/{ids}")
    @ResponseBody
    @RequiresPermissions("sys:user:reset:password")
    public Object resetPassword(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/user/reset/password/" + ids);
        return Tips.getSuccessTips(service.resetPassword(ids));
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @PostMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:user:save")
    public Object saveData(SysUser object) {
        logger.debug("/auth/sys/user/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 详情
     *
     * @param id id
     * @return view
     */
    @GetMapping("/input/{id}")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sys/user/input/" + id);
        SysUser sysUser = service.input(id);
        model.addAttribute("object", sysUser);
        return PREFIX + "input";
    }

    /**
     * 获取当前登录用户
     *
     * @return Tips
     */
    @RequestMapping("/current")
    @ResponseBody
    @RequiresPermissions("sys:current:user")
    public Object getCurrent() {
        logger.debug("/current");
        return Tips.getSuccessTips(service.getCurrentUser());
    }
}
