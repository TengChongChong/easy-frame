package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.sys.model.SysConfig;
import com.frame.easy.modular.sys.service.SysConfigService;

/**
 * 系统参数
 *
 * @author admin
 * @date 2019-03-03 15:52:44
 */
@Controller
@RequestMapping("/auth/sys/config")
public class SysConfigController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/config/";

    /**
     * 系统参数 service
     */
    @Autowired
    private SysConfigService service;

    /**
     * 列表
     *
     * @return String
     */
    @GetMapping("list")
    public String list(){
        logger.debug("/auth/sys/config/list");
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
    @RequiresPermissions("sys:config:select")
    public Tips select(@RequestBody SysConfig object){
        logger.debug("/auth/sys/config/select");
        return Tips.getSuccessTips(service.select(object));
    }
    /**
     * 详情
     *
     * @param id id
     * @return String
     */
    @GetMapping("/input/{id}")
    @RequiresPermissions("sys:config:select")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sys/config/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }

    /**
     * 新增
     *
     * @return String
     */
    @GetMapping("/add")
    @RequiresPermissions("sys:config:add")
    public String add(Model model) {
        logger.debug("/auth/sys/config/add");
        model.addAttribute("object", service.add());
        return PREFIX + "input";
    }
    /**
     * 删除
     *
     * @param ids 数据ids
     * @return Tips
     */
    @RequestMapping("/delete/{ids}")
    @ResponseBody
    @RequiresPermissions("sys:config:delete")
    public Tips delete(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/config/delete/" + ids);
        return Tips.getSuccessTips(service.delete(ids));
    }
    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @PostMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:config:save")
    public Tips saveData(SysConfig object){
        logger.debug("/auth/sys/config/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 刷新缓存中的系统参数
     *
     * @return Tips
     */
    @PostMapping("/refresh/cache")
    @ResponseBody
    @RequiresPermissions("sys:config:save")
    public Tips refreshCache(){
        logger.debug("/auth/sys/config/refresh/cache");
        return Tips.getSuccessTips(service.refreshCache());
    }
}
