package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.base.result.Tips;
import com.frame.easy.modular.sys.model.SysDepartmentType;
import com.frame.easy.modular.sys.service.SysDepartmentTypeService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * 机构类型管理
 *
 * @author tengchong
 * @date 2018/12/3
 */
@Controller
@RequestMapping("/auth/sys/depart/type")
public class SysDepartmentTypeController extends BaseController {

    private final String PREFIX = "modular/sys/depart/type/";

    @Autowired
    private SysDepartmentTypeService service;

    /**
     * view
     *
     * @return
     */
    @GetMapping("/view")
    public String view() {
        logger.debug("/auth/sys/depart/type/view");
        return PREFIX + "view";
    }

    /**
     * 新增
     *
     * @param pId 上级菜单/权限 id
     * @return
     */
    @GetMapping("/add/{id}")
    public String add(Model model, @PathVariable("id") Long pId) {
        logger.debug("/auth/sys/depart/type/add/" + pId);
        model.addAttribute("object", service.add(pId));
        return PREFIX + "input";
    }

    /**
     * 删除
     *
     * @return
     */
    @RequestMapping("/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:depart:type:delete")
    public Object delete(@PathVariable("id") Long id) {
        logger.debug("/auth/sys/depart/type/delete/" + id);
        return Tips.getSuccessTips(service.delete(id));
    }

    /**
     * 批量删除
     *
     * @return
     */
    @RequestMapping("/batch/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:depart:type:delete")
    public Object batchDelete(@PathVariable("id") String ids) {
        logger.debug("/auth/sys/depart/type/batch/delete/" + ids);
        return Tips.getSuccessTips(service.batchDelete(ids));
    }

    /**
     * 设置状态
     *
     * @return
     */
    @RequestMapping("/set/{id}/status/{status}")
    @ResponseBody
    @RequiresPermissions("sys:depart:type:status")
    public Object setStatus(@PathVariable("id") String ids,@PathVariable("status") Integer status) {
        logger.debug("/auth/sys/depart/type/set/" + ids + "/status/" + status);
        return Tips.getSuccessTips(service.setStatus(ids, status));
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return
     */
    @PostMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:depart:type:save")
    public Object saveData(SysDepartmentType object){
        logger.debug("/auth/sys/depart/type/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 详情
     *
     * @param id 菜单/权限 id
     * @return
     */
    @GetMapping("/input/{id}")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sys/depart/type/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }

    /**
     * 根据pId获取数据
     *
     * @return
     */
    @RequestMapping("/select/data")
    @ResponseBody
    @RequiresPermissions("sys:depart:type:select")
    public Object selectData(@RequestParam(name = "pId", required = false) Long pId) {
        logger.debug("/auth/sys/depart/type/select/data");
        return service.selectData(pId);
    }

    /**
     * 获取全部数据
     *
     * @return
     */
    @RequestMapping("/select/all")
    @ResponseBody
    @RequiresPermissions("sys:depart:type:select")
    public Object selectAll() {
        logger.debug("/auth/sys/depart/type/select/all");
        return service.selectAll();
    }

    @RequestMapping("/search")
    @ResponseBody
    @RequiresPermissions("sys:depart:type:select")
    public Object search(@RequestParam(name = "title", required = false) String title) {
        logger.debug("/auth/sys/depart/type/search");
        return Tips.getSuccessTips(service.search(title));
    }


    /**
     * 拖动改变目录或顺序
     *
     * @param id 拖动的菜单/权限id
     * @param parent 拖动后的父id
     * @param oldParent 拖动前的id
     * @param position 拖动前的下标
     * @param oldPosition 拖动后的下标
     * @return {Tips}
     */
    @RequestMapping("/move")
    @ResponseBody
    @RequiresPermissions("sys:depart:type:move")
    public Object move(@RequestParam(name = "id", required = false) Long id,
                       @RequestParam(name = "parent", required = false) Long parent,
                       @RequestParam(name = "oldParent", required = false) Long oldParent,
                       @RequestParam(name = "position", required = false) Integer position,
                       @RequestParam(name = "oldPosition", required = false) Integer oldPosition) {
        logger.debug("/auth/sys/depart/type/move");
        return Tips.getSuccessTips(service.move(id, parent, oldParent, position, oldPosition));
    }



}
