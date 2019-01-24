package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.base.result.Tips;
import com.frame.easy.modular.sys.model.SysRole;
import com.frame.easy.modular.sys.service.SysRoleService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * 角色管理
 *
 * @author tengchong
 * @date 2018/11/2
 */
@Controller
@RequestMapping("/auth/sys/role")
public class SysRoleController extends BaseController {

    private final String PREFIX = "modular/sys/role/";

    @Autowired
    private SysRoleService service;

    @GetMapping("/view")
    public String view() {
        logger.debug("/auth/sys/role/view");
        return PREFIX + "view";
    }

    /**
     * 获取角色列表
     *
     * @param pId 父角色id
     * @return List<JsTree>
     */
    @RequestMapping("/select/data")
    @ResponseBody
    @RequiresPermissions("sys:role:select")
    public Object selectData(@RequestParam(name = "pId", required = false) Long pId) {
        logger.debug("/auth/sys/roles/select/data");
        return service.selectData(pId);
    }

    /**
     * 获取全部数据
     *
     * @return List<JsTree>
     */
    @RequestMapping("/select/all")
    @ResponseBody
    @RequiresPermissions("sys:role:select")
    public Tips selectAll() {
        logger.debug("/auth/sys/permissions/select/all");
        return Tips.getSuccessTips(service.selectAll());
    }

    /**
     * 新增
     *
     * @param pId 上级菜单/权限 id
     * @return view
     */
    @GetMapping("/add/{id}")
    public String add(Model model, @PathVariable("id") Long pId) {
        logger.debug("/auth/sys/role/add/" + pId);
        model.addAttribute("object", service.add(pId));
        return PREFIX + "input";
    }

    /**
     * 删除权限/菜单
     *
     * @param id 角色id
     * @return Tips
     */
    @RequestMapping("/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:role:delete")
    public Object delete(@PathVariable("id") Long id) {
        logger.debug("/auth/sys/role/delete/" + id);
        return Tips.getSuccessTips(service.delete(id));
    }

    /**
     * 批量删除
     *
     * @param ids 角色ids
     * @return Tips
     */
    @RequestMapping("/batch/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:role:delete")
    public Object batchDelete(@PathVariable("id") String ids) {
        logger.debug("/auth/sys/role/batch/delete/" + ids);
        return Tips.getSuccessTips(service.batchDelete(ids));
    }

    /**
     * 设置状态
     *
     * @param ids    角色ids
     * @param status 状态
     * @return Tips
     */
    @RequestMapping("/set/{id}/status/{status}")
    @ResponseBody
    @RequiresPermissions("sys:role:status")
    public Object setStatus(@PathVariable("id") String ids, @PathVariable("status") Integer status) {
        logger.debug("/auth/sys/role/set/" + ids + "/status/" + status);
        return Tips.getSuccessTips(service.setStatus(ids, status));
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @PostMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:role:save")
    public Object saveData(SysRole object) {
        logger.debug("/auth/sys/role/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 详情
     *
     * @param id 菜单/权限 id
     * @return view
     */
    @GetMapping("/input/{id}")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sys/role/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }

    /**
     * 搜索
     *
     * @param title 标题
     * @return Tips
     */
    @RequestMapping("/search")
    @ResponseBody
    @RequiresPermissions("sys:role:select")
    public Object search(@RequestParam(name = "title", required = false) String title) {
        logger.debug("/auth/sys/role/search");
        return Tips.getSuccessTips(service.search(title));
    }


    /**
     * 拖动菜单/权限改变目录或顺序
     *
     * @param id          拖动的菜单/权限id
     * @param parent      拖动后的父id
     * @param oldParent   拖动前的id
     * @param position    拖动前的下标
     * @param oldPosition 拖动后的下标
     * @return Tips
     */
    @RequestMapping("/move")
    @ResponseBody
    @RequiresPermissions("sys:role:move")
    public Object move(@RequestParam(name = "id", required = false) Long id,
                       @RequestParam(name = "parent", required = false) Long parent,
                       @RequestParam(name = "oldParent", required = false) Long oldParent,
                       @RequestParam(name = "position", required = false) Integer position,
                       @RequestParam(name = "oldPosition", required = false) Integer oldPosition) {
        logger.debug("/auth/sys/role/move");
        return Tips.getSuccessTips(service.move(id, parent, oldParent, position, oldPosition));
    }
}
