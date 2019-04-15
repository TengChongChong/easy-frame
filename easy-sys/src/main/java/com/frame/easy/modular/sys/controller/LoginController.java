package com.frame.easy.modular.sys.controller;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.CircleCaptcha;
import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.web.Servlets;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


/**
 * 登录
 *
 * @author tengchong
 */
@Controller
public class LoginController extends BaseController {

    private final String PREFIX = "modular/sys/login/";

    /**
     * 登录页面
     *
     * @return String
     */
    @GetMapping("/login")
    public String login(Model model) {
        logger.debug("/login");
        HttpServletRequest request = Servlets.getRequest();
        if ((request != null ? request.getParameter(SessionConst.FORCE_LOGOUT) : null) != null) {
            model.addAttribute("message", "您已经被管理员强制退出，请重新登录！");
            return PREFIX + "login";
        }
        if ((request != null ? request.getParameter(SessionConst.LOGIN_ELSEWHERE) : null) != null) {
            model.addAttribute("message", "您的账号在其他地方登录，您被迫退出，请重新登录！");
            return PREFIX + "login";
        }
        // 已登录
        if (SecurityUtils.getSubject().isAuthenticated() || SecurityUtils.getSubject().isRemembered()) {
            return REDIRECT + "/";
        }
        return PREFIX + "login";
    }

    /**
     * 执行登录
     *
     * @param username 用户名
     * @param password 密码
     * @return Tips
     */
    @PostMapping("/login")
    @ResponseBody
    public Object login(String username, String password, boolean rememberMe) {
        logger.debug("/login");
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken(username, password, rememberMe);
        logger.debug("用户登录=>" + username);
        subject.login(token);
        return Tips.getSuccessTips("登录成功");
    }

    /**
     * 退出
     *
     * @return view
     */
    @RequestMapping("/logout")
    public String logout() {
        logger.debug("/logout");
        SecurityUtils.getSubject().logout();
        return REDIRECT + "/login";
    }
    @RequestMapping("/get/verification/code")
    public void getVerificationCode(HttpServletResponse response) throws IOException {
        // 定义图形验证码的长、宽、验证码字符数、干扰元素个数
        CircleCaptcha captcha = CaptchaUtil.createCircleCaptcha(100, 30, 4, 10);
        captcha.createCode();
        // 验证码放到session中
        ShiroUtil.setAttribute(SessionConst.VERIFICATION_CODE, captcha.getCode());
        captcha.write(response.getOutputStream());
    }
}