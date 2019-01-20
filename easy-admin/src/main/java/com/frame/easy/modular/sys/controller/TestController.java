package com.frame.easy.modular.sys.controller;

import com.frame.easy.modular.sys.model.SysDict;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 测试类
 * @author tengchong
 */
@Controller
public class TestController {

//    @Autowired
//    private TestService service;

//    @Autowired
//    private TestService TestService;

//    @Autowired
//    private SysUserService sysUserService;

    @RequestMapping(value="/test")
    @ResponseBody
    public Object testException(@RequestBody SysDict sysDict){
//        return metricsEndpoint.metric("process.cpu.usage", null);
        return sysDict;
//        return new Page<SysDict>();
//        return environmentEndpoint.environment("");
    }

    @RequestMapping("/delete/{id}")
    @ResponseBody
    public Object delete(@PathVariable("id") String id) {
//        return Tips.getSuccessTips(service.delete(id));
//        return Tips.getSuccessTips(sysUserService.delete(id));
//        return Tips.getSuccessTips(sysTestService.delete(id));
        return null;
    }

}
