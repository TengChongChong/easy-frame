package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.service.SysPersonalCenterService;
import com.frame.easy.util.ShiroUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

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

    @GetMapping("view")
    public String view(Model model){
        logger.debug("/auth/sys/personal/center/list");
        model.addAttribute("user", ShiroUtil.getCurrentUser());
        return PREFIX + "view";
    }

}
