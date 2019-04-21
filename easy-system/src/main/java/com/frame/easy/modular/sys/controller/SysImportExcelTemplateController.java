package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.sys.model.SysImportExcelTemplate;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateService;

import javax.servlet.http.HttpServletRequest;

/**
 * 导入模板
 *
 * @author TengChong
 * @date 2019-04-10
 */
@Controller
@RequestMapping("/auth/sys/import/excel/template")
public class SysImportExcelTemplateController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/import/excel/template/";

    /**
     * 导入模板 service
     */
    @Autowired
    private SysImportExcelTemplateService service;

    /**
     * 列表
     *
     * @return String
     */
    @RequestMapping("list")
    public String list(){
        logger.debug("/auth/sys/import/excel/template/list");
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
    @RequiresPermissions("sys:import:excel:template:select")
    public Tips select(@RequestBody(required = false) SysImportExcelTemplate object){
        logger.debug("/auth/sys/import/excel/template/select");
        return Tips.getSuccessTips(service.select(object));
    }
    /**
     * 详情
     *
     * @param id id
     * @return String
     */
    @RequestMapping("/input/{id}")
    @RequiresPermissions("sys:import:excel:template:select")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sys/import/excel/template/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }

    /**
     * 新增
     *
     * @return String
     */
    @RequestMapping("/add")
    @RequiresPermissions("sys:import:excel:template:add")
    public String add(Model model) {
        logger.debug("/auth/sys/import/excel/template/add");
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
    @RequiresPermissions("sys:import:excel:template:delete")
    public Tips delete(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/import/excel/template/delete/" + ids);
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
    @RequiresPermissions("sys:import:excel:template:save")
    public Tips saveData(SysImportExcelTemplate object){
        logger.debug("/auth/sys/import/excel/template/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 下载导入模板
     *
     * @param importCode 模板代码
     * @return ResponseEntity
     */
    @RequestMapping("/download/template/{importCode}")
    @ResponseBody
    @RequiresPermissions("sys:import:excel:template:select")
    public ResponseEntity<FileSystemResource> downloadTemplate(@PathVariable("importCode") String importCode,
                                                               HttpServletRequest request){
        logger.debug("/auth/sys/import/excel/template/download/template/" + importCode);
        return service.downloadTemplate(importCode, request);
    }
}
