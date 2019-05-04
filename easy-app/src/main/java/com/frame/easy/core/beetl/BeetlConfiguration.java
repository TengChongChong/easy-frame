package com.frame.easy.core.beetl;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.frame.easy.common.constant.ImportConst;
import com.frame.easy.common.constant.SysConfigConst;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.core.beetl.function.ProjectNameFunction;
import com.frame.easy.core.beetl.function.ProjectVersionFunction;
import com.frame.easy.core.beetl.function.SysConfigFunction;
import org.beetl.ext.spring.BeetlGroupUtilConfiguration;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

/**
 * beetl拓展
 * 绑定一些工具类/配置/常量
 *
 * @author tengchong
 * @date 2018/9/4
 */
public class BeetlConfiguration extends BeetlGroupUtilConfiguration {

    @Autowired
    ProjectProperties projectProperties;

    @Override
    public void initOther(){
        // 会话工具
        groupTemplate.registerFunctionPackage("shiro", new ShiroExt());
        // 项目配置
        groupTemplate.registerFunctionPackage("project", projectProperties);

        // 获取系统参数
        groupTemplate.registerFunction("sysConfig", new SysConfigFunction());
        // 获取项目版本，也可使用 sysConfig(SysConfigConst.PROJECT_VERSION) 获取
        groupTemplate.registerFunction("version", new ProjectVersionFunction());

        // 获取项目版本，也可使用 sysConfig(SysConfigConst.PROJECT_VERSION) 获取
        groupTemplate.registerFunction("projectName", new ProjectNameFunction());
        // 系统参数常量
        groupTemplate.setSharedVars(getVars(SysConfigConst.class));
        groupTemplate.setSharedVars(getVars(ImportConst.class));

        groupTemplate.registerFunctionPackage("dateUtil", new DateUtil());
        groupTemplate.registerFunctionPackage("strUtil", new StrUtil());

    }

    /**
     * 获取类中的变量
     *
     * @param c class
     * @return map
     */
    private Map<String, Object> getVars(Class c){
        Field[] fields = c.getFields();
        Map<String, Object> property = new HashMap<>(fields.length);
        for( Field field : fields ){
            try {
                property.put(field.getName(), field.get(c));
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        Map<String, Object> clazz = new HashMap<>(1);
        clazz.put(c.getSimpleName(), property);
        return clazz;
    }
}
