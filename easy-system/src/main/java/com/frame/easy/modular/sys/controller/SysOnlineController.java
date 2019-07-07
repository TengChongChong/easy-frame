package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
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
 * @author tengchong
 * @date 2018/9/12
 */
@Controller
@RequestMapping("/auth/sys/online")
@Api(value = "会话管理")
public class SysOnlineController extends BaseController {

    private static String PREFIX = "modular/sys/online/";

    @Autowired
    private SysUserOnlineService service;

    /**
     * 在线用户列表
     *
     * @return view
     */
    @RequestMapping("list")
    public String listView() {
        logger.debug("/auth/sys/online/list");
        return PREFIX + "list";
    }

    /**
     * 获取在线用户
     *
     * @return Tips
     */
    @ApiOperation(value = "获取在线用户", notes = "获取当前在线用户列表")
    @PostMapping("select")
    @ResponseBody
    @RequiresPermissions("sys:online:select")
    public Object select() {
        logger.debug("/auth/sys/online/select");
        return Tips.getSuccessTips(service.select());
    }

    /**
     * 踢出用户
     *
     * @param sessionId 会话id
     * @return Tips
     */
    @ApiOperation(value = "踢出用户", notes = "清除会话信息")
    @RequestMapping("force/logout/{sessionId}")
    @ResponseBody
    @RequiresPermissions("sys:online:force")
    public Object forceLogin(@PathVariable("sessionId") String sessionId) {
        logger.debug("/auth/sys/online/force/logout/" + sessionId);
        return Tips.getSuccessTips(service.forceLogout(sessionId));
    }
}
