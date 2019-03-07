package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.sys.model.SysUserSecuritySetting;
import com.frame.easy.modular.sys.service.SysUserSecuritySettingService;

/**
 * 用户安全设置
 *
 * @author TengChong
 * @date 2019-03-04 23:41:49
 */
@Controller
@RequestMapping("/auth/sys/user/security/setting")
public class SysUserSecuritySettingController extends BaseController {

    /**
     * 用户安全设置 service
     */
    @Autowired
    private SysUserSecuritySettingService service;


    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @PostMapping("/save/data")
    @ResponseBody
    public Tips saveData(SysUserSecuritySetting object){
        logger.debug("sys/user/security/setting/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }
}
