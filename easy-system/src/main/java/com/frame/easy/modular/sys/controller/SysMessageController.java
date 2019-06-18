package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.service.SysMessageDetailsService;
import com.frame.easy.result.Tips;
import com.frame.easy.util.web.Servlets;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.sys.model.SysMessage;
import com.frame.easy.modular.sys.service.SysMessageService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

/**
 * 消息
 *
 * @author TengChong
 * @date 2019-06-02
 */
@Controller
@RequestMapping("/auth/sys/message")
public class SysMessageController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/message/";

    /**
     * 通知  service
     */
    @Autowired
    private SysMessageService service;

    @Autowired
    private SysMessageDetailsService sysMessageDetailsService;

    /**
     * 列表
     *
     * @return String
     */
    @RequestMapping("list")
    public String list() {
        logger.debug("/auth/sys/message/list");
        return PREFIX + "list";
    }

    /**
     * 列表
     *
     * @param object 查询条件
     * @return Tips
     */
    @RequestMapping("select")
    @ResponseBody
    @RequiresPermissions("sys:message:select")
    public Tips select(@RequestBody(required = false) SysMessage object) {
        logger.debug("/auth/sys/message/select");
        return Tips.getSuccessTips(service.select(object));
    }

    /**
     * 收信列表
     *
     * @param object 查询条件
     * @return Tips
     */
    @RequestMapping("select/receive")
    @ResponseBody
    @RequiresPermissions("sys:message:select")
    public Tips selectReceive(@RequestBody(required = false) SysMessage object) {
        logger.debug("/auth/sys/message/select");
        return Tips.getSuccessTips(service.selectReceive(object));
    }

    /**
     * 详情
     *
     * @param id id
     * @return String
     */
    @RequestMapping("/input/{id}")
    @RequiresPermissions("sys:message:select")
    public String input(Model model, @PathVariable("id") String id) {
        logger.debug("/auth/sys/message/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }

    /**
     * 阅读消息
     *
     * @param id        消息 id
     * @param messageId 收信id
     * @return String
     */
    @RequestMapping("/info/{id}/{messageId}")
    @RequiresPermissions("sys:message:select")
    public String info(Model model, @PathVariable("id") String id,
                       @PathVariable("messageId") String messageId,
                       HttpServletRequest request) {
        logger.debug("/auth/sys/message/info/" + id + "/" + messageId);
        // 获取消息详情
        model.addAttribute("object", service.input(id));
        // 标记一度
        sysMessageDetailsService.setRead(messageId);
        if (Servlets.isAjaxRequest(request)) {
            // 如果是ajax请求只返回内容部分(用于消息页面)
            return PREFIX + "info";
        } else {
            return PREFIX + "full-info";
        }
    }

    /**
     * 新增
     *
     * @return String
     */
    @RequestMapping("/add")
    @RequiresPermissions("sys:message:add")
    public String add(Model model) {
        logger.debug("/auth/sys/message/add");
        model.addAttribute("object", service.add());
        return PREFIX + "input";
    }

    /**
     * 删除
     *
     * @param ids 数据ids
     * @return Tips
     */
    @RequestMapping("/delete/{ids}")
    @ResponseBody
    @RequiresPermissions("sys:message:delete")
    public Tips delete(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/message/delete/" + ids);
        return Tips.getSuccessTips(service.delete(ids));
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @RequestMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:message:save")
    public Tips saveData(@Valid SysMessage object) {
        logger.debug("/auth/sys/message/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 发送
     *
     * @param ids 消息ids
     * @return Tips
     */
    @RequestMapping("/send/{ids}")
    @ResponseBody
    @RequiresPermissions("sys:message:save")
    public Tips send(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/message/send/" + ids);
        return Tips.getSuccessTips(service.send(ids));
    }
}
