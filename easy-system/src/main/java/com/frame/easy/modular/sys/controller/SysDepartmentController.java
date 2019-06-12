package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.common.page.Page;
import com.frame.easy.result.Tips;
import com.frame.easy.modular.sys.model.SysDepartment;
import com.frame.easy.modular.sys.service.SysDepartmentService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 机构管理
 *
 * @author tengchong
 * @date 2018/12/3
 */
@Controller
@RequestMapping("/auth/sys/depart")
public class SysDepartmentController extends BaseController {

    private final String PREFIX = "modular/sys/depart/";

    @Autowired
    private SysDepartmentService service;

    /**
     * 根据pId获取数据
     *
     * @return jstree data
     */
    @RequestMapping("/select/data")
    @ResponseBody
    @RequiresPermissions("sys:depart:select")
    public Object selectData(@RequestParam(name = "pId", required = false) String pId) {
        logger.debug("/auth/sys/depart/type/select/data");
        return service.selectData(pId);
    }

    /**
     * 搜索
     *
     * @param title 名称
     * @return Tips
     */
    @RequestMapping("/search")
    @ResponseBody
    @RequiresPermissions("sys:depart:select")
    public Object search(@RequestParam(name = "title", required = false) String title) {
        logger.debug("/auth/sys/depart/type/search");
        return Tips.getSuccessTips(service.search(title));
    }

    /**
     * 列表
     */
    @GetMapping("list")
    public String list() {
        logger.debug("/auth/sys/depart/list");
        return PREFIX + "list";
    }

    /**
     * 列表
     *
     * @return Tips
     */
    @RequestMapping("select")
    @ResponseBody
    @RequiresPermissions("sys:depart:select")
    public Object select(@RequestBody(required = false) SysDepartment object) {
        logger.debug("/auth/sys/depart/select");
        return Tips.getSuccessTips(service.select(object));
    }

    /**
     * 新增
     *
     * @param pId      上级 id
     * @param typeCode 字典类型
     * @return view
     */
    @GetMapping({"/add/{id}", "/add"})
    public String add(Model model, @PathVariable(value = "id", required = false) String pId,
                      @RequestParam(value = "typeCode", required = false) String typeCode) {
        logger.debug("/auth/sys/depart/add/" + pId);
        model.addAttribute("object", service.add(pId, typeCode));
        model.addAttribute("departTypes", service.selectDepartmentTypeOption(pId, typeCode));
        model.addAttribute("parentDeparts", service.selectUpDepartmentOption(pId, typeCode));
        return PREFIX + "input";
    }

    /**
     * 删除
     *
     * @return Tips
     */
    @RequestMapping("/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:depart:delete")
    public Object delete(@PathVariable("id") String id) {
        logger.debug("/auth/sys/depart/delete/" + id);
        return Tips.getSuccessTips(service.delete(id));
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @PostMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:depart:save")
    public Object saveData(@Valid SysDepartment object) {
        logger.debug("/auth/sys/depart/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 详情
     *
     * @param id id
     * @return view
     */
    @GetMapping("/input/{id}")
    public String input(Model model, @PathVariable("id") String id) {
        logger.debug("/auth/sys/depart/input/" + id);
        SysDepartment sysDepartment = service.input(id);
        model.addAttribute("object", sysDepartment);
        model.addAttribute("departTypes", service.selectDepartmentTypeOption(sysDepartment.getpId(), sysDepartment.getTypeCode()));
        model.addAttribute("parentDeparts", service.selectUpDepartmentOption(sysDepartment.getpId(), sysDepartment.getTypeCode()));
        return PREFIX + "input";
    }
}
