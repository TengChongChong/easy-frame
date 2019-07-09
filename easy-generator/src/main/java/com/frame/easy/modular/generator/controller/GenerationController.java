package com.frame.easy.modular.generator.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.result.Tips;
import com.frame.easy.modular.generator.model.Generator;
import com.frame.easy.modular.generator.service.GenerationService;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 代码生成
 *
 * @author tengchong
 * @date 2019-01-09
 */
@Controller
@RequestMapping("/auth/generation")
public class GenerationController extends BaseController {

    private final static String PREFIX = "modular/generation/";

    @Autowired
    private GenerationService service;

    @RequiresRoles("sys:admin")
    @RequestMapping("/view")
    public String view(){
        logger.debug("/auth/generation/view");
        return PREFIX + "view";
    }

    /**
     * 获取表名
     *
     * @param dataSourceCode 数据源
     * @return Tips
     */
    @RequiresRoles("sys:admin")
    @RequestMapping("/select/table")
    @ResponseBody
    public Tips selectTable(String dataSourceCode){
        logger.debug("/auth/generation/select/table");
        return Tips.getSuccessTips(service.selectTable(dataSourceCode));
    }

    /**
     * 根据表名获取字段列表
     *
     * @param dataSourceCode 数据源
     * @param tableName 表名
     * @return Tips
     */
    @RequiresRoles("sys:admin")
    @RequestMapping("/select/fields")
    @ResponseBody
    public Tips selectFields(String dataSourceCode, String tableName){
        logger.debug("/auth/generation/select/fields");
        return Tips.getSuccessTips(service.selectFields(dataSourceCode, tableName));
    }

    /**
     * 生成代码
     * @param object 参数
     * @return Tips
     */
    @RequestMapping("/generate")
    @ResponseBody
    public Tips generate(@RequestBody Generator object){
        logger.debug("/auth/generation/generate");
        return Tips.getSuccessTips(service.generate(object));
    }
}
