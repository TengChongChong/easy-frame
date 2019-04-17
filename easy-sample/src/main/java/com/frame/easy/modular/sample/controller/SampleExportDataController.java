package com.frame.easy.modular.sample.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sample.model.SampleGeneral;
import com.frame.easy.modular.sample.service.SampleExportDataService;
import com.frame.easy.modular.sample.service.SampleGeneralService;
import com.frame.easy.result.Tips;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * 导出数据示例
 *
 * @author TengChong
 * @date 2019-04-16
 */
@Controller
@RequestMapping("/auth/sample/export/data")
public class SampleExportDataController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sample/export/data/";

    /**
     * 代码生成示例 service
     */
    @Autowired
    private SampleGeneralService sampleGeneralService;

    @Autowired
    private SampleExportDataService service;

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
    public Tips select(@RequestBody(required = false) SampleGeneral object) {
        logger.debug("/auth/sample/export/data/select");
        return Tips.getSuccessTips(sampleGeneralService.select(object));
    }

    /**
     * 导出查询结果
     *
     * @param object 查询条件
     * @return ResponseEntity
     */
    @RequestMapping("export/data")
    @ResponseBody
    @RequiresPermissions("sample:general:export:data")
    public ResponseEntity<FileSystemResource> exportData(SampleGeneral object,
                                                         HttpServletRequest request) {
        logger.debug("/auth/sample/export/data/export/data");
        return service.exportData(object, request);
    }


}
