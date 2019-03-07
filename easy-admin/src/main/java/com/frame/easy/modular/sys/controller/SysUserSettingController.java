package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.sys.model.SysUserSetting;
import com.frame.easy.modular.sys.service.SysUserSettingService;

/**
 * 用户偏好设置
 *
 * @author TengChong
 * @date 2019-03-04 23:41:03
 */
@Controller
@RequestMapping("/auth/sys/user/setting")
public class SysUserSettingController extends BaseController {
    /**
     * 用户偏好设置 service
     */
    @Autowired
    private SysUserSettingService service;

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @PostMapping("/save/data")
    @ResponseBody
    public Tips saveData(SysUserSetting object){
        logger.debug("sys/user/setting/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }
}
