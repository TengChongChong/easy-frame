package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.base.result.Tips;
import com.frame.easy.modular.sys.model.SysDictType;
import com.frame.easy.modular.sys.service.SysDictTypeService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * 字典类型
 *
 * @author tengchong
 * @date 2018/11/4
 */
@Controller
@RequestMapping("/auth/sys/dict/type")
public class SysDictTypeController extends BaseController {

    private final String PREFIX = "modular/sys/dict/type/";

    @Autowired
    private SysDictTypeService service;

    /**
     * 列表
     *
     * @return view
     */
    @GetMapping("list")
    public String list() {
        logger.debug("/auth/sys/dict/type/list");
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
    @RequiresPermissions("sys:dict:type:select")
    public Tips select(@RequestBody SysDictType object) {
        logger.debug("/auth/sys/dict/type/select");
        return Tips.getSuccessTips(service.select(object));
    }

    /**
     * 查询所有
     *
     * @return Tips
     */
    @RequestMapping("select/all")
    @ResponseBody
    @RequiresPermissions("sys:dict:type:select")
    public Tips selectAll() {
        logger.debug("/auth/sys/dict/type/select/all");
        return Tips.getSuccessTips(service.selectAll());
    }

    /**
     * 删除
     *
     * @param ids 字典类型ids
     * @return Tips
     */
    @RequestMapping("/delete/{ids}")
    @ResponseBody
    @RequiresPermissions("sys:dict:type:delete")
    public Tips delete(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/dict/type/delete/" + ids);
        return Tips.getSuccessTips(service.delete(ids));
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @PostMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:dict:type:save")
    public Tips saveData(SysDictType object) {
        logger.debug("/auth/sys/dict/type/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

}
