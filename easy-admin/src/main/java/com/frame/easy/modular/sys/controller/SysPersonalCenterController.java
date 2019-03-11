package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.service.SysPersonalCenterService;
import com.frame.easy.result.Tips;
import com.frame.easy.util.ShiroUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * 个人中心
 *
 * @author TengChong
 * @date 2019-03-04
 */
@Controller
@RequestMapping("/auth/sys/personal/center")
public class SysPersonalCenterController extends BaseController {
    /**
     * 个人中心 service
     */
    @Autowired
    private SysPersonalCenterService service;

    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/personal/center/";

    /**
     * 个人中心
     *
     * @param model model
     * @return view
     */
    @GetMapping("view")
    public String view(Model model){
        logger.debug("/auth/sys/personal/center/view");
        model.addAttribute("user", ShiroUtil.getCurrentUser());
        return PREFIX + "view";
    }

    /**
     * 个人设置
     *
     * @param model model
     * @return view
     */
    @GetMapping("personal/settings")
    public String personalSettings(Model model){
        logger.debug("/auth/sys/personal/center/personal/settings");
        model.addAttribute("user", ShiroUtil.getCurrentUser());
        return PREFIX + "personal-settings";
    }

    /**
     * 待办任务
     *
     * @return view
     */
    @GetMapping("task/to/do")
    public String taskToDo(){
        logger.debug("/auth/sys/personal/center/task/to/do");
        return PREFIX + "task-to-do";
    }

    /**
     * 我的消息
     *
     * @return view
     */
    @GetMapping("message")
    public String message(){
        logger.debug("/auth/sys/personal/center/message");
        return PREFIX + "message";
    }

    /**
     * 保存用户头像
     *
     * @param path 文件路径
     * @return Tips
     */
    @RequestMapping("save/user/avatar")
    @ResponseBody
    public Tips saveUserAvatar(@RequestParam("path") String path){
        return Tips.getSuccessTips("操作成功", service.saveAvatar(path));
    }

}
