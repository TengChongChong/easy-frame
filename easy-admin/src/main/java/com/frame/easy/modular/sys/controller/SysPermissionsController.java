package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.base.result.Tips;
import com.frame.easy.modular.sys.model.SysPermissions;
import com.frame.easy.modular.sys.service.SysPermissionsService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


/**
 * 权限管理
 *
 * @author tengchong
 * @date 2018/10/30
 */
@Controller
@RequestMapping("/auth/sys/permissions")
public class SysPermissionsController extends BaseController {

    private final String PREFIX = "modular/sys/permissions/";

    @Autowired
    private SysPermissionsService service;

    /**
     * view
     *
     * @return view
     */
    @GetMapping("/view")
    public String view() {
        logger.debug("/auth/sys/permissions/view");
        return PREFIX + "view";
    }

    /**
     * 新增
     *
     * @param pId 上级菜单/权限 id
     * @return view
     */
    @GetMapping("/add/{id}")
    public String add(Model model, @PathVariable("id") Long pId) {
        logger.debug("/auth/sys/permissions/add/" + pId);
        model.addAttribute("object", service.add(pId));
        return PREFIX + "input";
    }

    /**
     * 删除
     *
     * @param id 权限id
     * @return Tips
     */
    @RequestMapping("/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:permissions:delete")
    public Object delete(@PathVariable("id") Long id) {
        logger.debug("/auth/sys/permissions/delete/" + id);
        return Tips.getSuccessTips(service.delete(id));
    }

    /**
     * 批量删除
     *
     * @param ids 权限ids
     * @return Tips
     */
    @RequestMapping("/batch/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:permissions:delete")
    public Object batchDelete(@PathVariable("id") String ids) {
        logger.debug("/auth/sys/permissions/batch/delete/" + ids);
        return Tips.getSuccessTips(service.batchDelete(ids));
    }

    /**
     * 设置状态
     *
     * @param ids    权限ids
     * @param status 状态
     * @return Tips
     */
    @RequestMapping("/set/{id}/status/{status}")
    @ResponseBody
    @RequiresPermissions("sys:permissions:status")
    public Object setStatus(@PathVariable("id") String ids, @PathVariable("status") Integer status) {
        logger.debug("/auth/sys/permissions/set/" + ids + "/status/" + status);
        return Tips.getSuccessTips(service.setStatus(ids, status));
    }

    /**
     * 复制节点到目标id
     *
     * @param nodeIds  复制的节点ids [1,2,3]
     * @param targetId 目标节点id
     * @return Tips
     */
    @RequestMapping("/copy/{nodeIds}/to/{targetId}")
    @ResponseBody
    @RequiresPermissions("sys:permissions:save")
    public Object copyNodes(@PathVariable("nodeIds") String nodeIds, @PathVariable("targetId") Long targetId) {
        logger.debug("/auth/sys/permissions/copy/" + nodeIds + "/to/" + targetId);
        return Tips.getSuccessTips(service.copyNode(nodeIds, targetId));
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @PostMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:permissions:save")
    public Object saveData(SysPermissions object) {
        logger.debug("/auth/sys/permissions/save/data");
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
        logger.debug("/auth/sys/permissions/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }

    /**
     * 根据pId获取数据
     *
     * @param pId 父权限id
     * @return List<JsTree>
     */
    @RequestMapping("/select/data")
    @ResponseBody
    @RequiresPermissions("sys:permissions:select")
    public Object selectData(@RequestParam(name = "pId", required = false) Long pId) {
        logger.debug("/auth/sys/permissions/select/data");
        return service.selectData(pId);
    }

    /**
     * 获取全部数据
     *
     * @return List<JsTree>
     */
    @RequestMapping("/select/all")
    @ResponseBody
    @RequiresPermissions("sys:permissions:select")
    public Object selectAll() {
        logger.debug("/auth/sys/permissions/select/all");
        return Tips.getSuccessTips(service.selectAll());
    }

    /**
     * 搜索
     *
     * @param title 标题
     * @return List<JsTree>
     */
    @RequestMapping("/search")
    @ResponseBody
    @RequiresPermissions("sys:permissions:select")
    public Object search(@RequestParam(name = "title", required = false) String title) {
        logger.debug("/auth/sys/permissions/search");
        return Tips.getSuccessTips(service.search(title));
    }


    /**
     * 拖动改变目录或顺序
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
    @RequiresPermissions("sys:permissions:move")
    public Object move(@RequestParam(name = "id", required = false) Long id,
                       @RequestParam(name = "parent", required = false) Long parent,
                       @RequestParam(name = "oldParent", required = false) Long oldParent,
                       @RequestParam(name = "position", required = false) Integer position,
                       @RequestParam(name = "oldPosition", required = false) Integer oldPosition) {
        logger.debug("/auth/sys/permissions/move");
        return Tips.getSuccessTips(service.move(id, parent, oldParent, position, oldPosition));
    }

}
