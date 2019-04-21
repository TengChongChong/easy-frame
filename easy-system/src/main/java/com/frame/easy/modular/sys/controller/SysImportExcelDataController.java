package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.service.SysImportExcelDataService;
import com.frame.easy.modular.sys.service.SysImportExcelTemplateService;
import com.frame.easy.result.Tips;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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
     * @param model model
     * @param importCode 模板代码
     * @return view
     */
    @RequestMapping("/{importCode}")
    public String list(Model model, @PathVariable("importCode") String importCode){
        ToolUtil.checkParams(importCode);
        model.addAttribute("object", importExcelTemplateService.getByImportCode(importCode));
        model.addAttribute("hasLast", service.checkLastData(importCode));
        return PREIFX + "list";
    }

    /**
     * 验证并解析文件
     *
     * @param importCode 导入代码
     * @param path excel文件路径
     * @return true/false
     */
    @RequestMapping("analysis/{importCode}")
    @ResponseBody
    public Tips analysis(@PathVariable("importCode") String importCode, String path){
        return Tips.getSuccessTips(service.analysis(importCode, path));
    }

    /**
     * 插入数据
     *
     * @param importCode 导入代码
     * @return true/false
     */
    @RequestMapping("insert/data/{importCode}")
    @ResponseBody
    public Tips insertData(@PathVariable("importCode") String importCode){
        return Tips.getSuccessTips(service.insertData(importCode));
    }

}
