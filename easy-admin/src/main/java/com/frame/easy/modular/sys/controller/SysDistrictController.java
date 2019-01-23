package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.base.result.Tips;
import com.frame.easy.modular.sys.model.SysDistrict;
import com.frame.easy.modular.sys.service.SysDistrictService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * 行政区划
 *
 * @author tengchong
 * @date 2018/12/18
 */
@Controller
@RequestMapping("/auth/sys/district")
public class SysDistrictController extends BaseController {

    private final String PREFIX = "modular/sys/district/";

    @Autowired
    private SysDistrictService service;

    /**
     * view
     *
     * @return String
     */
    @GetMapping("/view")
    public String view() {
        logger.debug("/auth/sys/district/view");
        return PREFIX + "view";
    }

    /**
     * 新增
     *
     * @param pId 上级行政区划 id
     * @return String
     */
    @GetMapping("/add/{id}")
    public String add(Model model, @PathVariable("id") Long pId) {
        logger.debug("/auth/sys/district/add/" + pId);
        model.addAttribute("object", service.add(pId));
        model.addAttribute("parentSelect", service.selectByPId(pId));
        return PREFIX + "input";
    }

    /**
     * 删除
     *
     * @return Tips
     */
    @RequestMapping("/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:district:delete")
    public Tips delete(@PathVariable("id") Long id) {
        logger.debug("/auth/sys/district/delete/" + id);
        return Tips.getSuccessTips(service.delete(id));
    }

    /**
     * 批量删除
     *
     * @return Tips
     */
    @RequestMapping("/batch/delete/{id}")
    @ResponseBody
    @RequiresPermissions("sys:district:delete")
    public Tips batchDelete(@PathVariable("id") String ids) {
        logger.debug("/auth/sys/district/batch/delete/" + ids);
        return Tips.getSuccessTips(service.batchDelete(ids));
    }

    /**
     * 保存
     *
     * @param object 表单内容
     * @return Tips
     */
    @PostMapping("/save/data")
    @ResponseBody
    @RequiresPermissions("sys:district:save")
    public Tips saveData(SysDistrict object){
        logger.debug("/auth/sys/district/save/data");
        return Tips.getSuccessTips(service.saveData(object));
    }

    /**
     * 详情
     *
     * @param id 行政区划 id
     * @return String
     */
    @GetMapping("/input/{id}")
    public String input(Model model, @PathVariable("id") Long id) {
        logger.debug("/auth/sys/district/input/" + id);
        SysDistrict object = service.input(id);
        model.addAttribute("object", object);
        model.addAttribute("parentSelect", service.selectByPId(object.getpId()));
        return PREFIX + "input";
    }

    /**
     * 根据pId获取数据
     *
     * @return List<jsTree>
     */
    @RequestMapping("/select/data")
    @ResponseBody
    @RequiresPermissions("sys:district:select")
    public Object selectData(@RequestParam(name = "pId", required = false) Long pId) {
        logger.debug("/auth/sys/district/select/data");
        return service.selectData(pId);
    }

    /**
     * 获取全部数据
     *
     * @return Tips
     */
    @RequestMapping("/select/all")
    @ResponseBody
    @RequiresPermissions("sys:district:select")
    public Tips selectAll() {
        logger.debug("/auth/sys/district/select/all");
        return Tips.getSuccessTips(service.selectAll());
    }

    /**
     * 搜索
     * @param title 标题
     * @return Tips
     */
    @RequestMapping("/search")
    @ResponseBody
    @RequiresPermissions("sys:district:select")
    public Tips search(@RequestParam(name = "title", required = false) String title) {
        logger.debug("/auth/sys/district/search");
        return Tips.getSuccessTips(service.search(title));
    }


    /**
     * 拖动改变目录或顺序
     *
     * @param id 拖动的行政区划id
     * @param parent 拖动后的父id
     * @param oldParent 拖动前的id
     * @param position 拖动前的下标
     * @param oldPosition 拖动后的下标
     * @return Tips
     */
    @RequestMapping("/move")
    @ResponseBody
    @RequiresPermissions("sys:district:move")
    public Object move(@RequestParam(name = "id", required = false) Long id,
                       @RequestParam(name = "parent", required = false) Long parent,
                       @RequestParam(name = "oldParent", required = false) Long oldParent,
                       @RequestParam(name = "position", required = false) Integer position,
                       @RequestParam(name = "oldPosition", required = false) Integer oldPosition) {
        logger.debug("/auth/sys/district/move");
        return Tips.getSuccessTips(service.move(id, parent, oldParent, position, oldPosition));
    }
}
