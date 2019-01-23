package com.frame.easy.modular.sys.controller;

import com.alibaba.fastjson.JSON;
import com.frame.easy.base.controller.BaseController;
import com.frame.easy.base.result.Tips;
import com.frame.easy.modular.sys.model.SysDict;
import com.frame.easy.modular.sys.service.SysDictService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * 字典
 *
 * @author tengchong
 * @date 2018/11/4
 */
@Controller
@RequestMapping("/auth/sys/dict")
public class SysDictController extends BaseController {

    private final String PREFIX = "modular/sys/dict/";

    @Autowired
    private SysDictService service;
    /**
     * 列表
     *
     * @return 视图
     */
    @GetMapping("list")
    public String list(Model model){
        logger.debug("/auth/sys/dict/list");
        model.addAttribute("dictTypes", JSON.toJSON(service.getDictType()));
        return PREFIX + "list";
    }

    /**
     * 生成静态文件
     *
     * @return Tips
     */
    @RequestMapping("generate/dict/data")
    @ResponseBody
    @RequiresRoles("sys:admin")
    public Tips select(){
        logger.debug("/auth/sys/dict/generate/dict/data");
        return Tips.getSuccessTips(service.generateDictData());
    }

    /**
     * 列表
     *
     * @return Tips
     */
    @RequestMapping("select")
    @ResponseBody
    @RequiresPermissions("sys:dict:select")
    public Tips select(@RequestBody SysDict object){
        logger.debug("/auth/sys/dict/select");
        return Tips.getSuccessTips(service.select(object));
    }

    /**
     * 列表
     *
     * @return Tips
     */
    @PostMapping("/{dictType}/dicts")
    @ResponseBody
    @RequiresPermissions("sys:dict:select")
    public Tips dictTypeDicts(@PathVariable("dictType") String dictType){
        logger.debug("/auth/sys/dict/" + dictType + "/dicts");
        return Tips.getSuccessTips(service.dictTypeDicts(dictType));
    }

    /**
     * 新增
     *
     * @param pId 上级 id
     * @param dictType 字典类型
     * @return 视图
     */
    @GetMapping({"/add/{id}", "/add"})
    public String add(Model model, @PathVariable(value = "id", required = false) Long pId,
                      @RequestParam(value = "dictType", required = false) String dictType) {
        logger.debug("/auth/sys/dict/add/" + pId);
        model.addAttribute("dictTypes", service.getDictType());
        model.addAttribute("object", service.add(pId, dictType));
        return PREFIX + "input";
    }

    /**
     * 删除
     *
     * @return Tips
     */
    @RequestMapping("/delete/{ids}")
    @ResponseBody
    @RequiresPermissions("sys:dict:delete")
    public Tips delete(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/dict/delete/" + ids);
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
    @RequiresPermissions("sys:dict:save")
    public Tips saveData(SysDict object){
        logger.debug("/auth/sys/dict/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 详情
     *
     * @param id id
     * @return 视图
     */
    @GetMapping("/input/{id}")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sys/dict/input/" + id);
        model.addAttribute("object", service.input(id));
        model.addAttribute("dictTypes", service.getDictType());
        return PREFIX + "input";
    }

    /**
     * 将数据库中字典数据生成成js文件
     *
     * @return Tips
     */
    @GetMapping("/generate/dict/data")
    @ResponseBody
    @RequiresPermissions("sys:dict:generate")
    public Tips generateDictData(){
        logger.debug("/auth/sys/dict/generate/dict/data");
        return Tips.getSuccessTips(service.generateDictData());
    }

}
