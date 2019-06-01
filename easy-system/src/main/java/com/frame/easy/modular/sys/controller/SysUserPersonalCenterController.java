package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.model.SysUserSetting;
import com.frame.easy.modular.sys.service.SysUserPersonalCenterService;
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
@RequestMapping("/auth/sys/user/personal/center")
public class SysUserPersonalCenterController extends BaseController {
    /**
     * 个人中心 service
     */
    @Autowired
    private SysUserPersonalCenterService service;

    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/user/personal/center/";

    /**
     * 个人中心
     *
     * @param model model
     * @return view
     */
    @GetMapping("view")
    public String view(Model model){
        logger.debug("/auth/sys/user/personal/center/view");
        model.addAttribute("user", ShiroUtil.getCurrentUser());
        return PREFIX + "view";
    }

    /**
     * 个人设置
     *
     * @param model model
     * @return view
     */
    @GetMapping("overview")
    public String overview(Model model){
        logger.debug("/auth/sys/user/personal/center/overview");
        model.addAttribute("user", service.getCurrentUser());
        return PREFIX + "overview";
    }

    /**
     * 个人设置
     *
     * @param model model
     * @return view
     */
    @GetMapping("personal/settings")
    public String personalSettings(Model model){
        logger.debug("/auth/sys/user/personal/center/personal/settings");
        model.addAttribute("user", service.getCurrentUser());
        return PREFIX + "personal-settings";
    }
    /**
     * 安全设置
     *
     * @param model model
     * @return view
     */
    @GetMapping("security/settings")
    public String securitySettings(Model model){
        logger.debug("/auth/sys/user/personal/center/security/settings");
        model.addAttribute("user", service.getCurrentUser());
        return PREFIX + "security-settings";
    }
    /**
     * 密码修改
     *
     * @param model model
     * @return view
     */
    @GetMapping("change/password")
    public String changePassword(Model model){
        logger.debug("/auth/sys/user/personal/center/change/password");
        model.addAttribute("user", service.getCurrentUser());
        return PREFIX + "change-password";
    }
    /**
     * 密码修改
     *
     * @return view
     */
    @PostMapping("change/password")
    @ResponseBody
    public Tips changePassword(@RequestParam(value = "oldPassword") String oldPassword,
                               @RequestParam(value = "password")String password){
        logger.debug("/auth/sys/user/personal/center/change/password");
        return Tips.getSuccessTips(service.changePassword(oldPassword, password));
    }


    /**
     * 待办任务
     *
     * @return view
     */
    @GetMapping("task/to/do")
    public String taskToDo(){
        logger.debug("/auth/sys/user/personal/center/task/to/do");
        return PREFIX + "task-to-do";
    }

    /**
     * 我的消息
     *
     * @return view
     */
    @GetMapping("message")
    public String message(){
        logger.debug("/auth/sys/user/personal/center/message");
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
        logger.debug("/auth/sys/user/personal/center/save/user/avatar");
        return Tips.getSuccessTips("操作成功", service.saveUserAvatar(path));
    }
    /**
     * 保存用户信息
     *
     * @param sysUser 用户信息
     * @return Tips
     */
    @RequestMapping("save/user/info")
    @ResponseBody
    public Tips saveUserInfo(SysUser sysUser){
        logger.debug("/auth/sys/user/personal/center/save/user/info");
        return Tips.getSuccessTips(service.saveUserInfo(sysUser));
    }
    /**
     * 申请绑定密保邮箱
     *
     * @param mail 邮箱地址
     * @return Tips
     */
    @RequestMapping("application/binding/mail")
    @ResponseBody
    public Tips applicationBindingMail(String mail){
        logger.debug("/auth/sys/user/personal/center/application/binding/mail");
        return Tips.getSuccessTips(service.applicationBindingMail(mail));
    }

    /**
     * 保存用户设置
     *
     * @param sysUserSetting 用户设置
     * @return Tips
     */
    @RequestMapping("save/user/setting")
    @ResponseBody
    public Tips saveUserSetting(SysUserSetting sysUserSetting){
        logger.debug("/auth/sys/user/personal/center/save/user/setting");
        return Tips.getSuccessTips(service.saveUserSetting(sysUserSetting));
    }


}
