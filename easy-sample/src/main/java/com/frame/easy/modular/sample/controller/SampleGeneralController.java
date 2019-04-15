package com.frame.easy.modular.sample.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sample.model.SampleGeneral;
import com.frame.easy.modular.sample.service.SampleGeneralService;
import com.frame.easy.result.Tips;
import com.frame.easy.util.http.HttpUtil;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.UnsupportedEncodingException;

/**
 * 代码生成示例
 *
 * @author TengChong
 * @date 2019-04-09
 */
@Controller
@RequestMapping("/auth/sample/general")
public class SampleGeneralController extends BaseController {
    /**
     * view 路径
     */
    private final String PREFIX = "modular/sample/general/";

    /**
     * 代码生成示例 service
     */
    @Autowired
    private SampleGeneralService service;

    /**
     * 列表
     *
     * @return String
     */
    @RequestMapping("list")
    public String list() {
        logger.debug("/auth/sample/general/list");
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
    @RequiresPermissions("sample:general:select")
    public Tips select(@RequestBody(required = false) SampleGeneral object) {
        logger.debug("/auth/sample/general/select");
        return Tips.getSuccessTips(service.select(object));
    }

    /**
     * 详情
     *
     * @param id id
     * @return String
     */
    @RequestMapping("/input/{id}")
    @RequiresPermissions("sample:general:select")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sample/general/input/" + id);
        model.addAttribute("object", service.input(id));
        return PREFIX + "input";
    }

    /**
     * 新增
     *
     * @return String
     */
    @RequestMapping("/add")
    @RequiresPermissions("sample:general:add")
    public String add(Model model) {
        logger.debug("/auth/sample/general/add");
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
    @RequiresPermissions("sample:general:delete")
    public Tips delete(@PathVariable("ids") String ids) {
        logger.debug("/auth/sample/general/delete/" + ids);
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
    @RequiresPermissions("sample:general:save")
    public Tips saveData(@RequestBody(required = false) SampleGeneral object) {
        logger.debug("/auth/sample/general/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 导出查询结果
     *
     * @param object 查询条件
     * @return Tips
     */
    @RequestMapping("export/data")
    @ResponseBody
    @RequiresPermissions("sample:general:select")
    public ResponseEntity<FileSystemResource> exportData(@RequestBody(required = false) SampleGeneral object,
                                                         HttpServletRequest request) throws UnsupportedEncodingException {
        logger.debug("/auth/sample/general/export/data");
        return HttpUtil.getResponseEntity(new File((String)service.exportData(object)), "测试文件-test.xls", request);
    }



}
