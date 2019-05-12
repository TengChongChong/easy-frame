package com.frame.easy.modular.scheduler.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.scheduler.model.SchedulerJobLog;
import com.frame.easy.modular.scheduler.service.SchedulerJobLogService;
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
        @RequestMapping("list/{jobId}")
    public String list(@PathVariable("jobId") String jobId, Model model) {
        logger.debug("/auth/scheduler/job/log/list/" + jobId);
        model.addAttribute("jobId", jobId);
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
    public Tips select(@RequestBody(required = false) SchedulerJobLog object) {
        logger.debug("/auth/scheduler/job/log/select");
        return Tips.getSuccessTips(service.select(object));
    }
}
