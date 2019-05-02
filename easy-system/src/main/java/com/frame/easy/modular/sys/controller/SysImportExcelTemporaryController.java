package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.model.SysImportExcelTemporary;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateDetailsService;
import com.frame.easy.modular.sys.service.SysImportExcelTemporaryService;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 导入临时表
 * 注: 如提示权限问题需要给用户分配 "系统功能 > 数据导入" 权限
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
    @Autowired
    private SysImportExcelTemplateDetailsService detailsService;
    /**
     * 列表
     *
     * @param object 查询条件
     * @return Tips
     */
    @RequestMapping("select")
    @ResponseBody
    @RequiresPermissions("import:data")
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
    @RequiresPermissions("import:data")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sys/import/excel/temporary/input/" + id);
        SysImportExcelTemporary temporary = service.input(id);
        model.addAttribute("object", temporary);
        model.addAttribute("details", detailsService.selectDetails(temporary.getTemplateId()));
        return PREFIX + "input";
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @RequestMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("import:data")
    public Tips saveData(SysImportExcelTemporary object){
        logger.debug("/auth/sys/import/excel/temporary/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 删除
     *
     * @param ids 数据ids
     * @return Tips
     */
    @RequestMapping("/delete/{ids}")
    @ResponseBody
    @RequiresPermissions("import:data")
    public Tips delete(@PathVariable("ids") String ids) {
        logger.debug("/auth/sys/import/excel/temporary/delete/" + ids);
        return Tips.getSuccessTips(service.delete(ids));
    }

    /**
     * 清空指定导入代码中数据
     *
     * @param templateId 模板id
     * @return Tips
     */
    @RequestMapping("clean/my/import/{templateId}")
    @ResponseBody
    public Tips cleanMyImport(@PathVariable("templateId") Long templateId){
        return Tips.getSuccessTips(service.cleanMyImport(templateId));
    }
}
