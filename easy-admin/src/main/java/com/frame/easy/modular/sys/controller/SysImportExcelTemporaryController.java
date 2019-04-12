package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;
import com.frame.easy.modular.sys.service.SysImportExcelTemporaryService;

/**
 * 导入临时表
 *
 * @author TengChong
 * @date 2019-04-10
 */
@Controller
@RequestMapping("/auth/sys/import/excel/temporary")
public class SysImportExcelTemporaryController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/import/excel/temporary/";

    /**
     * 导入临时表 service
     */
    @Autowired
    private SysImportExcelTemporaryService service;

    /**
     * 列表
     *
     * @return String
     */
    @RequestMapping("list")
    public String list(){
        logger.debug("/auth/sys/import/excel/temporary/list");
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
    @RequiresPermissions("sys:import:excel:temporary:select")
    public Tips select(@RequestBody(required = false) SysImportExcelTemporary object){
        logger.debug("/auth/sys/import/excel/temporary/select");
        return Tips.getSuccessTips(service.select(object));
    }
    /**
     * 详情
     *
     * @param id id
     * @return String
     */
    @RequestMapping("/input/{id}")
    @RequiresPermissions("sys:import:excel:temporary:select")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sys/import/excel/temporary/input/" + id);
        model.addAttribute("object", service.input(id));
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
    @RequiresPermissions("sys:import:excel:temporary:delete")
    public Tips delete(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/import/excel/temporary/delete/" + ids);
        return Tips.getSuccessTips(service.delete(ids));
    }
}
