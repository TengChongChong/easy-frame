package com.frame.easy.modular.scheduler.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.scheduler.model.SchedulerJobLog;
import com.frame.easy.modular.scheduler.service.SchedulerJobLogService;

/**
 * 定时任务执行日志
 *
 * @author TengChong
 * @date 2019-05-11
 */
@Controller
@RequestMapping("/auth/scheduler/job/log")
public class SchedulerJobLogController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/scheduler/job/log/";

    /**
     * 定时任务执行日志 service
     */
    @Autowired
    private SchedulerJobLogService service;

    /**
     * 列表
     *
     * @return String
     */
    @RequestMapping("list")
    public String list(){
        logger.debug("/auth/scheduler/job/log/list");
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
    @RequiresPermissions("scheduler:job:log:select")
    public Tips select(@RequestBody(required = false) SchedulerJobLog object){
        logger.debug("/auth/scheduler/job/log/select");
        return Tips.getSuccessTips(service.select(object));
    }
    /**
     * 详情
     *
     * @param id id
     * @return String
     */
    @RequestMapping("/input/{id}")
    @RequiresPermissions("scheduler:job:log:select")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/scheduler/job/log/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @RequestMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("scheduler:job:log:save")
    public Tips saveData(SchedulerJobLog object){
        logger.debug("/auth/scheduler/job/log/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }
}
