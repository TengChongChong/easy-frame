package com.frame.easy.modular.sys.controller;

import com.frame.easy.base.controller.BaseController;
import com.frame.easy.modular.sys.service.SysMessageDetailsService;
import com.frame.easy.result.Tips;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 消息-收信
 *
 * @author tengchong
 * @date 2019-06-13
 */
@RestController
@RequestMapping("/auth/sys/message/details")
public class SysMessageDetailsController extends BaseController {

    @Autowired
    private SysMessageDetailsService service;

    /**
     * 设置消息标星/取消标星
     *
     * @param id 接受消息id
     * @param type true/false 是否标星
     * @return Tips
     */
    @RequestMapping("set/star/{id}/{type}")
    public Tips setStar(@PathVariable("id") String id,
                        @PathVariable("type") boolean type){
        return Tips.getSuccessTips(service.setStar(id, type));
    }

    /**
     * 根据接收消息id删除
     *
     * @param ids 消息ids
     * @param deleteCompletely true/false 是否彻底删除
     * @return Tips
     */
    @RequestMapping("delete/{ids}/{deleteCompletely}")
    public Tips deleteByIds(@PathVariable("ids") String ids,
                        @PathVariable("deleteCompletely") boolean deleteCompletely){
        return Tips.getSuccessTips(service.deleteByIds(ids, deleteCompletely));
    }

    /**
     * 根据接收消息id恢复
     *
     * @param ids 消息ids
     * @return Tips
     */
    @RequestMapping("reduction/{ids}")
    public Tips reductionByIds(@PathVariable("ids") String ids){
        return Tips.getSuccessTips(service.reductionByIds(ids));
    }

    /**
     * 设置消息已读
     *
     * @param ids 消息ids
     * @return Tips
     */
    @RequestMapping("set/read")
    public Tips setRead(@RequestParam(value = "ids", required = false) String ids){
        return Tips.getSuccessTips(service.setRead(ids));
    }

}
