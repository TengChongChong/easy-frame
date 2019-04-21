package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateService;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.frame.easy.modular.sys.model.SysImportExcelTemplateDetails;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateDetailsService;

import java.util.List;

/**
 * 导入模板详情
 *
 * @author TengChong
 * @date 2019-04-10
 */
@Controller
@RequestMapping("/auth/sys/import/excel/template/details")
public class SysImportExcelTemplateDetailsController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sys/import/excel/template/details/";

    /**
     * 导入模板详情 service
     */
    @Autowired
    private SysImportExcelTemplateDetailsService service;

    @Autowired
    private SysImportExcelTemplateService sysImportExcelTemplateService;

    /**
     * 列表 view
     *
     * @param templateId 导入模板id
     * @return String
     */
    @RequestMapping("list/{templateId}")
    public String list(Model model, @PathVariable("templateId") Long templateId) {
        model.addAttribute("templateId", templateId);
        model.addAttribute("object", sysImportExcelTemplateService.input(templateId));
        logger.debug("/auth/sys/import/excel/template/details/list/" + templateId);
        return PREFIX + "list";
    }

    /**
     * 获取已配置字段
     *
     * @param templateId 导入模板id
     * @return Tips
     */
    @RequestMapping("select/details/{templateId}")
    @ResponseBody
    @RequiresPermissions("sys:import:excel:template:save")
    public Tips selectDetails(@PathVariable("templateId") Long templateId) {
        logger.debug("/auth/sys/import/excel/template/details/select");
        return Tips.getSuccessTips(service.selectDetails(templateId));
    }

    /**
     * 根据模板代码获取表格表头
     *
     * @param templateCode 模板代码
     * @return Tips
     */
    @RequestMapping("select/table/head/{templateCode}")
    @ResponseBody
    @RequiresPermissions("import:data")
    public Tips selectTableHeadByTemplateCode(@PathVariable("templateCode") String templateCode){
        return Tips.getSuccessTips(service.selectTableHeadByTemplateCode(templateCode));
    }

    /**
     * 保存
     *
     * @param templateId 导入模板id
     * @param list       表单内容
     * @return Tips
     */
    @RequestMapping("/save/data/{templateId}")
    @ResponseBody
    @RequiresPermissions("sys:import:excel:template:save")
    public Tips saveData(@PathVariable("templateId") Long templateId,
                         @RequestBody(required = false) List<SysImportExcelTemplateDetails> list) {
        logger.debug("/auth/sys/import/excel/template/details/save/data");
        return Tips.getSuccessTips(service.saveData(templateId, list));
    }
}
