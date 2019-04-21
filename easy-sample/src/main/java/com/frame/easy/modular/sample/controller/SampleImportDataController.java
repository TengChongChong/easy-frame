package com.frame.easy.modular.sample.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sample.model.SampleGeneral;
import com.frame.easy.modular.sample.service.SampleGeneralService;
import com.frame.easy.modular.sample.service.SampleImportDataService;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 数据导入示例
 *
 * @author tengchong
 * @date 2019-04-17
 */
@Controller
@RequestMapping("/auth/sample/import/data")
public class SampleImportDataController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sample/import/data/";


    @Autowired
    private SampleImportDataService service;

    /**
     * 代码生成示例 service
     */
    @Autowired
    private SampleGeneralService sampleGeneralService;

    /**
     * 列表
     *
     * @return String
     */
    @RequestMapping("list")
    public String list() {
        logger.debug("/auth/sample/export/data/list");
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
    @RequiresPermissions("sample:general:import:data")
    public Tips select(@RequestBody(required = false) SampleGeneral object) {
        logger.debug("/auth/sample/export/data/select");
        return Tips.getSuccessTips(sampleGeneralService.select(object));
    }

}
