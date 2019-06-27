package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.model.SysLog;
import com.frame.easy.modular.sys.service.SysLogService;
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
 * 日志 
 *
 * @author TengChong
 * @date 2019-06-27
 */
@Controller
@RequestMapping("/auth/sys/log")
public class SysLogController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/log/";

    /**
     * 日志  service
     */
    @Autowired
    private SysLogService service;

    /**
     * 列表
     *
     * @return String
     */
    @RequestMapping("list")
    public String list(){
        logger.debug("/auth/sys/log/list");
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
    @RequiresPermissions("sys:log:select")
    public Tips select(@RequestBody(required = false) SysLog object){
        logger.debug("/auth/sys/log/select");
        return Tips.getSuccessTips(service.select(object));
    }
    /**
     * 详情
     *
     * @param id id
     * @return String
     */
    @RequestMapping("/input/{id}")
    @RequiresPermissions("sys:log:select")
    public String input(Model model, @PathVariable("id") String id) {
        logger.debug("/auth/sys/log/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }
}
