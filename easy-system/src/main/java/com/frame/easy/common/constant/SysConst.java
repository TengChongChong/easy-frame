package com.frame.easy.common.constant;

import com.frame.easy.common.status.ProfilesActiveStatus;
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

    /**
     * 是否为生产环境
     */
    public static boolean IS_PROD = false;

    @Autowired
    public void setProjectProperties(ProjectProperties projectProperties) {
        SysConst.projectProperties = projectProperties;
        IS_PROD = ProfilesActiveStatus.prod.getProfilesActive().equals(projectProperties.getProfilesActive());
    }
}
