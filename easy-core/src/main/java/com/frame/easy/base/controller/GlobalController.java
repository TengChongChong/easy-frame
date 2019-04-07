package com.frame.easy.base.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 通用错误页
 *
 * @author tengchong
 * @date 2018/10/22
 */
@Controller
@RequestMapping("/global")
public class GlobalController {

    private final static String PREFIX = "global/";

    /**
     * 未找到
     *
     * @return view
     */
    @RequestMapping("/404")
    public String err404() {
        return PREFIX + "404";
    }

    /**
     * 没有权限访问
     *
     * @return view
     */
    @RequestMapping("/401")
    public String err401() {
        return PREFIX + "401";
    }

    /**
     * 业务异常
     *
     * @return view
     */
    @RequestMapping("/500")
    public String err500() {
        return PREFIX + "500";
    }

    /**
     * 开发中
     *
     * @return view
     */
    @RequestMapping("/in-development")
    public String inDevelopment() {
        return PREFIX + "in-development";
    }

    @RequestMapping("/session/time/out")
    public String errSessionTimeOut() {
        return PREFIX + "session-time-out";
    }

}
