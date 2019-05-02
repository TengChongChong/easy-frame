package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.model.SysImportExcelTemplate;
import com.frame.easy.modular.sys.service.SysImportExcelDataService;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateService;
import com.frame.easy.result.Tips;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * 数据导入
 *
 * @author tengchong
 * @date 2019-04-17
 */
@Controller
@RequestMapping("/auth/sys/import/excel/data")
public class SysImportExcelDataController extends BaseController {
    /**
     * view 路径
     */
    private static final String PREIFX = "modular/sys/import/excel/data/";

    @Autowired
    private SysImportExcelDataService service;

    @Autowired
    private SysImportExcelTemplateService importExcelTemplateService;

    /**
     * 导入页面
     *
     * @param model      model
     * @param importCode 模板代码
     * @return view
     */
    @RequestMapping("/{importCode}")
    public String list(Model model, @PathVariable("importCode") String importCode) {
        ToolUtil.checkParams(importCode);
        SysImportExcelTemplate template = importExcelTemplateService.getByImportCode(importCode);
        model.addAttribute("object", template);
        model.addAttribute("hasLast", service.checkLastData(template.getId()));
        return PREIFX + "list";
    }

    /**
     * 验证并解析文件
     *
     * @param templateId 模板id
     * @param path       excel文件路径
     * @return true/false
     */
    @RequestMapping("analysis/{templateId}")
    @ResponseBody
    public Tips analysis(@PathVariable("templateId") Long templateId, String path) {
        return Tips.getSuccessTips(service.analysis(templateId, path));
    }

    /**
     * 查询指定导入汇总信息
     *
     * @param templateId 模板id
     * @return true/false
     */
    @RequestMapping("select/summary/{templateId}")
    @ResponseBody
    public Tips selectSummary(@PathVariable("templateId") Long templateId) {
        return Tips.getSuccessTips(service.selectSummary(templateId));
    }

    /**
     * 插入数据
     *
     * @param templateId 模板id
     * @return true/false
     */
    @RequestMapping("insert/data/{templateId}")
    @ResponseBody
    public Tips insertData(@PathVariable("templateId") Long templateId) {
        return Tips.getSuccessTips(service.insertData(templateId));
    }

    /**
     * 导出验证失败数据
     *
     * @param templateId 模板id
     * @param request    request
     * @return 文件
     */
    @RequestMapping("export/verification/fail/data/{templateId}")
    @ResponseBody
    public ResponseEntity<FileSystemResource> exportVerificationFailData(@PathVariable("templateId") Long templateId,
                                                                         HttpServletRequest request) {
        return service.exportVerificationFailData(templateId, request);
    }
}
