package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import com.frame.easy.modular.sys.model.SysRedis;
import com.frame.easy.modular.sys.service.SysRedisService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * redis 管理
 *
 * @author tengchong
 * @date 2019-01-25
 */
@Controller
@RequestMapping("/auth/sys/redis")
public class SysRedisController extends BaseController {

    private static String PREFIX = "modular/sys/redis/";

    @Autowired
    private SysRedisService service;

    /**
     * view
     *
     * @return view
     */
    @RequestMapping("/view")
    public String view(){
        logger.debug("/auth/sys/redis/view");
        return PREFIX + "view";
    }

    /**
     * 根据前缀查询redis列表
     *
     * @param prefix 前缀
     * @return Tips
     */
    @RequestMapping("/select/{prefix}")
    @RequiresPermissions("sys:redis:select")
    @ResponseBody
    public Tips selectByPrefix(@PathVariable("prefix") String prefix){
        logger.debug("/auth/sys/redis/select/" + prefix);
        return Tips.getSuccessTips(service.selectByPrefix(prefix));
    }

    /**
     * 根据键获取信息
     *
     * @param key 键
     * @return Tips
     */
    @RequestMapping("/get/{key}")
    @RequiresPermissions("sys:redis:select")
    @ResponseBody
    public Tips get(@PathVariable("key") String key){
        logger.debug("/auth/sys/redis/get/" + key);
        return Tips.getSuccessTips(service.get(key));
    }

    /**
     * 根据键删除信息
     *
     * @param key 键
     * @return Tips
     */
    @RequestMapping("/delete/{key}")
    @RequiresPermissions("sys:redis:delete")
    @ResponseBody
    public Tips delete(@PathVariable("key") String key){
        logger.debug("/auth/sys/redis/delete/" + key);
        return Tips.getSuccessTips(service.delete(key));
    }

    /**
     * 保存
     *
     * @param sysRedis redis信息
     * @return Tips
     */
    @RequestMapping("/save")
    @RequiresPermissions("sys:redis:save")
    @ResponseBody
    public Tips save(SysRedis sysRedis){
        logger.debug("/auth/sys/redis/save");
        return Tips.getSuccessTips(service.save(sysRedis));
    }

}
