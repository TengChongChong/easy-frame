package com.frame.easy.core.beetl;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.frame.easy.config.properties.ProjectProperties;
import org.beetl.ext.spring.BeetlGroupUtilConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;

import java.util.HashMap;
import java.util.Map;

/**
 * beetl拓展配置,绑定一些工具类/配置,方便在beetl中直接调用
 *
 * @author tengchong
 * @date 2018/9/4
 */
public class BeetlConfiguration extends BeetlGroupUtilConfiguration {

    @Autowired
    Environment env;

    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    ProjectProperties projectProperties;

    @Override
    public void initOther(){
        /**
         * 会话工具类
         */
        groupTemplate.registerFunctionPackage("shiro", new ShiroExt());
        /**
         * 项目配置
         */
        groupTemplate.registerFunctionPackage("project", projectProperties);

        groupTemplate.registerFunctionPackage("dateUtil", new DateUtil());
        groupTemplate.registerFunctionPackage("strUtil", new StrUtil());

    }
}
