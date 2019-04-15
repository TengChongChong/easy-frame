package com.frame.easy.common.constant;

import com.frame.easy.config.properties.ProjectProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 系统模块公用常量
 *
 * @Author tengchong
 * @Date 2019-04-15
 */
@Component
public class SysConst {
    /**
     * 项目属性
     */
    public static ProjectProperties projectProperties;

    @Autowired
    public void setProjectProperties(ProjectProperties projectProperties) {
        SysConst.projectProperties = projectProperties;
    }
}
