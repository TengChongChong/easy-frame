package com.frame.easy.config.properties;

import cn.hutool.core.lang.Validator;
import com.frame.easy.common.constant.SysConfigConst;
import com.frame.easy.util.SysConfigUtil;
import com.frame.easy.util.ToolUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.io.File;

/**
 * 项目配置
 *
 * @author tengchong
 * @date 2018/9/4
 */
@Configuration
public class ProjectProperties {
    @Value("${project.url}")
    private String projectUrl;
    /**
     * 是否开启记住我功能
     */
    @Value("${project.login.remember.enabled}")
    private Boolean loginRemember = true;
    /**
     * 记住我过期时间 默认30天 单位: 秒
     */
    @Value("${project.login.remember.invalidate-time}")
    private Integer loginRememberInvalidateTime = 259200;
    /**
     * 开启记住我功能,敏感操作仍要客户登录 比如 支付/删除/审核
     */
    @Value("${project.login.remember.security}")
    private Boolean loginRememberSecurity = true;
    /**
     * 设置session失效的扫描时间, 清理用户直接关闭浏览器造成的孤立会话 默认为 30分钟
     */
    @Value("${project.session-validation-interval}")
    private Integer sessionValidationInterval = 60 * 30;
    /**
     * 是否开启登录验证码,默认开启
     */
    private Boolean loginVerificationCode = false;
    /**
     * 登录是密码错误尝试次数,超过5次后会被锁定
     */
    private Integer loginAttempts = 5;
    /**
     * 锁定时长,默认10分钟 单位: 秒
     */
    private Integer loginLockLength = 600;
    /**
     * 是否允许多点登录
     */
    private boolean loginMultipoint = false;
    /**
     * 新增用户时的默认密码
     */
    private String defaultPassword = "123";
    /**
     * session过期时间 单位：秒
     */
    private Integer sessionInvalidateTime = 60 * 30;
    /**
     * 缓存类型
     */
    private String cacheType = "redis";

    /**
     * 模式
     */
    @Value("${spring.profiles.active}")
    private String profilesActive;
    /**
     * 下换线转驼峰
     * 用于页面传回的排序字段驼峰转下划线
     */
    @Value("${mybatis-plus.configuration.map-underscore-to-camel-case}")
    private boolean underscoreToCamelCase;
    /**
     * 文件上传路径
     */
    @Value("${project.file-upload-path}")
    private String fileUploadPath;

    public String getFileUploadPath() {
        if (Validator.isNotEmpty(fileUploadPath)) {
            if (!fileUploadPath.endsWith(File.separator)) {
                fileUploadPath = fileUploadPath + File.separator;
            }
            File file = new File(fileUploadPath);
            if (!file.exists()) {
                file.mkdirs();
            }
            return fileUploadPath;
        } else {
            return ToolUtil.getTmpDir();
        }
    }

    public void setFileUploadPath(String fileUploadPath) {
        this.fileUploadPath = fileUploadPath;
    }

    public Integer getSessionInvalidateTime() {
        Object obj = SysConfigUtil.get(SysConfigConst.SESSION_INVALIDATE_TIME);
        if (obj != null) {
            return (int) obj;
        } else {
            return sessionInvalidateTime;
        }
    }

    public Boolean getLoginVerificationCode() {
        Object obj = SysConfigUtil.get(SysConfigConst.LOGIN_VERIFICATION_CODE);
        if (obj != null) {
            return (boolean) obj;
        } else {
            return loginVerificationCode;
        }
    }

    public Integer getLoginAttempts() {
        Object obj = SysConfigUtil.get(SysConfigConst.LOGIN_ATTEMPTS);
        if (obj != null) {
            return (int) obj;
        } else {
            return loginAttempts;
        }
    }

    public Integer getLoginLockLength() {
        Object obj = SysConfigUtil.get(SysConfigConst.LOGIN_LOCK_LENGTH);
        if (obj != null) {
            return (int) obj;
        } else {
            return loginLockLength;
        }
    }

    public boolean getLoginMultipoint() {
        Object obj = SysConfigUtil.get(SysConfigConst.LOGIN_MULTIPOINT);
        if (obj != null) {
            return (boolean) obj;
        } else {
            return loginMultipoint;
        }
    }

    public Boolean getLoginRemember() {
        return loginRemember;
    }

    public void setLoginRemember(Boolean loginRemember) {
        this.loginRemember = loginRemember;
    }

    public Boolean getLoginRememberSecurity() {
        return loginRememberSecurity;
    }

    public void setLoginRememberSecurity(Boolean loginRememberSecurity) {
        this.loginRememberSecurity = loginRememberSecurity;
    }

    public Integer getLoginRememberInvalidateTime() {
        return loginRememberInvalidateTime;
    }

    public void setLoginRememberInvalidateTime(Integer loginRememberInvalidateTime) {
        this.loginRememberInvalidateTime = loginRememberInvalidateTime;
    }

    public String getDefaultPassword() {
        Object obj = SysConfigUtil.get(SysConfigConst.DEFAULT_PASSWORD);
        if (obj != null) {
            return (String) obj;
        } else {
            return defaultPassword;
        }
    }
    public String getCacheType() {
        return cacheType;
    }

    public void setCacheType(String cacheType) {
        this.cacheType = cacheType;
    }

    public String getProfilesActive() {
        return profilesActive;
    }

    public void setProfilesActive(String profilesActive) {
        this.profilesActive = profilesActive;
    }

    public boolean getUnderscoreToCamelCase() {
        return underscoreToCamelCase;
    }

    public void setUnderscoreToCamelCase(boolean underscoreToCamelCase) {
        this.underscoreToCamelCase = underscoreToCamelCase;
    }

    public Integer getSessionValidationInterval() {
        return sessionValidationInterval;
    }

    public void setSessionValidationInterval(Integer sessionValidationInterval) {
        this.sessionValidationInterval = sessionValidationInterval;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }
}
