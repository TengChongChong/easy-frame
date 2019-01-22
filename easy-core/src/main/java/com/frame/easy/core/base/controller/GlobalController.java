package com.frame.easy.core.base.controller;

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
     * @return
     */
    @RequestMapping("/404")
    public String err404(){
        return PREFIX + "404";
    }

    /**
     * 没有权限访问
     *
     * @return
     */
    @RequestMapping("/401")
    public String err401(){
        return PREFIX + "401";
    }

    /**
     * 业务异常
     *
     * @return
     */
    @RequestMapping("/500")
    public String err500(){
        return PREFIX + "500";
    }

    @RequestMapping("/no-authority")
    public String errNoAuthority(){
        return PREFIX + "no-authority";
    }

    @RequestMapping("/session/time/out")
    public String errSessionTimeOut(){
        return PREFIX + "session-time-out";
    }

}
