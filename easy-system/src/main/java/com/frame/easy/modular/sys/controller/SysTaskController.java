package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.model.SysTask;
import com.frame.easy.modular.sys.service.SysTaskService;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 任务 
 *
 * @author TengChong
 * @date 2019-06-19
 */
@Controller
@RequestMapping("/auth/sys/task")
public class SysTaskController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/task/";

    /**
     * 任务  service
     */
    @Autowired
    private SysTaskService service;

    /**
     * 列表
     *
     * @return String
     */
    @RequestMapping("list")
    public String list(){
        logger.debug("/auth/sys/task/list");
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
    @RequiresPermissions("sys:task:select")
    public Tips select(@RequestBody(required = false) SysTask object){
        logger.debug("/auth/sys/task/select");
        return Tips.getSuccessTips(service.select(object));
    }
    /**
     * 详情
     *
     * @param id id
     * @return String
     */
    @RequestMapping("/input/{id}")
    @RequiresPermissions("sys:task:select")
    public String input(Model model, @PathVariable("id") String id) {
        logger.debug("/auth/sys/task/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }

    /**
     * 设置任务已完成
     *
     * @param id id
     * @return Tips
     */
    @RequestMapping("/set/completed/{id}")
    @ResponseBody
    @RequiresPermissions("sys:task:save")
    public Tips setCompleted(@PathVariable("id") String id){
        logger.debug("/auth/sys/task/set/completed/" + id);
        return Tips.getSuccessTips(service.setCompleted(id));
    }
}
