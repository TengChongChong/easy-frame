package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.service.SysUserRetrievePasswordService;
import com.frame.easy.result.Tips;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 找回密码
 *
 * @author tengchong
 * @date 2019-03-28
 */
@Controller
@RequestMapping("/sys/user/retrieve/password")
public class SysUserRetrievePasswordController extends BaseController {

    /**
     * 找回密码 service
     */
    @Autowired
    private SysUserRetrievePasswordService service;
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/user/retrieve/password/";

    /**
     * 找回密码页面
     *
     * @return view
     */
    @RequestMapping("view")
    public String view() {
        logger.debug("/sys/user/retrieve/password/view");
        return PREFIX + "view";
    }

    /**
     * 发送重置密码邮件
     *
     * @param username 用户名
     * @param mail     邮箱
     * @return true/false
     */
    @RequestMapping("send/mail")
    @ResponseBody
    public Tips sendMail(String username, String mail) {
        logger.debug("/sys/user/retrieve/password/send/mail");
        return Tips.getSuccessTips(service.sendMail(username, mail));
    }

    /**
     * 验证用户名与校验码是否匹配
     *
     * @param username 用户名
     * @param code     校验码
     * @return
     */
    @RequestMapping("verifies/{username}/{code}")
    @ResponseBody
    public Tips verifiesCode(@PathVariable("username") String username, @PathVariable("code") String code) {
        logger.debug("/sys/user/retrieve/password/verifies/{username}/{code}");
        return Tips.getSuccessTips(service.verifiesCode(username, code));
    }

    /**
     * 重设密码
     *
     * @param username 用户名
     * @param code     校验码
     * @param password 密码
     * @return Tips
     */
    @RequestMapping("reset/password/{username}/{code}")
    @ResponseBody
    public Tips resetPassword(@PathVariable("username") String username, @PathVariable("code") String code,
                              @RequestParam("password") String password) {
        logger.debug("/sys/user/retrieve/password/reset/password/{username}/{code}");
        return Tips.getSuccessTips(service.resetPassword(username, code, password));
    }
}
