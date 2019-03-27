package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.sys.service.SysMailVerifiesService;

/**
 * 邮箱验证
 *
 * @author TengChong
 * @date 2019-03-24
 */
@Controller
public class SysMailVerifiesController extends BaseController {

    private final String PREFIX = "modular/mail/verifies/";

    /**
     * 邮箱验证 service
     */
    @Autowired
    private SysMailVerifiesService service;

    /**
     * 验证
     *
     * @param code 校验码
     * @return Tips
     */
    @RequestMapping("/sys/mail/verifies/{code}")
    @ResponseBody
    public String verifies(Model model, @PathVariable String code) {
        logger.debug("/auth/sys/mail/verifies/verifies");
        try {
            model.addAttribute("isSuccess", service.verifies(code));
        } catch (RuntimeException e) {
            model.addAttribute("isSuccess", false);
            model.addAttribute("message", e.getMessage());
        }
        return PREFIX + "verifies";
    }
}
