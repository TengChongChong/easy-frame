package com.frame.easy.modular.sys.controller;

import com.frame.easy.core.base.controller.BaseController;
import com.frame.easy.core.base.result.Tips;
import com.frame.easy.modular.sys.service.SysUserOnlineService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 会话管理
 *
 * @Author tengchong
 * @Date 2018/9/12
 */
@Controller
@RequestMapping("/auth/sys/online")
@Api(description = "会话管理")
public class SysOnlineController extends BaseController {

    @Autowired
    private SysUserOnlineService service;

    @RequestMapping("list/view")
    public String listView(){
        logger.debug("/auth/sys/online/list/view");
        return "list-view";
    }

    @ApiOperation(value = "获取在线用户", notes = "获取当前在线用户列表")
    @PostMapping("select")
    @ResponseBody
    @RequiresPermissions("sys:online:select")
    public Object select(){
        logger.debug("/auth/sys/online/select");
        return Tips.getSuccessTips(service.select());
    }

    @RequestMapping("force/logout/{sessionId}")
    @ResponseBody
    @RequiresPermissions("sys:online:force")
    public Object forceLogin(@PathVariable("sessionId") String sessionId){
        logger.debug("/auth/sys/online/force/logout/" + sessionId);
        return Tips.getSuccessTips(service.forceLogout(sessionId));
    }
}
