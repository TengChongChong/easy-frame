package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.sys.model.SysException;
import com.frame.easy.modular.sys.service.SysExceptionService;

/**
 * 异常日志
 *
 * @author TengChong
 * @date 2019-04-08
 */
@Controller
@RequestMapping("/auth/sys/exception")
public class SysExceptionController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/exception/";

    /**
     * 异常日志 service
     */
    @Autowired
    private SysExceptionService service;

    /**
     * 列表
     *
     * @return String
     */
    @RequestMapping("list")
    public String list(){
        logger.debug("/auth/sys/exception/list");
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
    @RequiresPermissions("sys:exception:select")
    public Tips select(@RequestBody(required = false) SysException object){
        logger.debug("/auth/sys/exception/select");
        return Tips.getSuccessTips(service.select(object));
    }
    /**
     * 详情
     *
     * @param id id
     * @return String
     */
    @RequestMapping("/input/{id}")
    @RequiresPermissions("sys:exception:select")
    public String input(Model model, @PathVariable("id") String id) {
        logger.debug("/auth/sys/exception/input/" + id);
        model.addAttribute("object", service.input(id));
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
    @RequiresPermissions("sys:exception:delete")
    public Tips delete(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/exception/delete/" + ids);
        return Tips.getSuccessTips(service.delete(ids));
    }
    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @RequestMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:exception:save")
    public Tips saveData(SysException object){
        logger.debug("/auth/sys/exception/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }
}
