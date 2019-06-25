package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.util.ShiroUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 首页
 *
 * @author tengchong
 */
@Controller
public class IndexController extends BaseController {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    private final String PREFIX = "modular/sys/index/";

    @GetMapping(value = "/")
    @RequiresPermissions("sys:index")
    public String index(Model model) {
        logger.debug("/");
        if (SecurityUtils.getSubject().isAuthenticated() || SecurityUtils.getSubject().isRemembered()) {
            model.addAttribute("user", ShiroUtil.getCurrentUser());
            return PREFIX + "index";
        } else {
            return REDIRECT + "/login";
        }
    }

    @GetMapping(value = {"/auth/dashboard"})
    public String dashboard() {
        return PREFIX + "dashboard";
    }
}
