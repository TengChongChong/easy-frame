package com.frame.easy.config.properties;

import cn.hutool.core.lang.Validator;
import com.frame.easy.core.util.ToolUtil;
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
@ConfigurationProperties(prefix = "project")
public class ProjectProperties {
    /**
     * 模式
     */
    @Value("${spring.profiles.active}")
    private String profilesActive;
    /**
     * 项目名称
     */
    private String name;
    /**
     * 项目路径
     */
    @Value("${project.path}")
    private String projectPath;
    /**
     * 项目包路径
     */
    @Value("${project.debug.package}")
    private String projectPackage;
    /**
     * 是否开启记住我功能
     */
    @Value("${project.login.remember}")
    private Boolean loginRemember = true;
    /**
     * 记住我过期时间 默认30天 单位: 秒
     */
    @Value("${project.login.remember-invalidate-time}")
    private Integer loginRememberInvalidateTime = 259200;
    /**
     * 开启记住我功能,敏感操作仍要客户登录 比如 支付/删除/审核
     */
    @Value("${project.login.remember-security}")
    private Boolean loginRememberSecurity = true;
    /**
     * 是否开启登录验证码,默认开启
     */
    @Value("${project.login.verification-code}")
    private Boolean loginVerificationCode = false;
    /**
     * 登录是密码错误尝试次数,超过5次后会被锁定
     */
    @Value("${project.login.attempts}")
    private Integer loginAttempts = 5;
    /**
     * 锁定时长,默认10分钟 单位: 秒
     */
    @Value("${project.login.lock-length}")
    private Integer loginLockLength = 600;
    /**
     * 新增用户时的默认密码
     */
    @Value("${project.default.password}")
    private String defaultPassword;
    /**
     * 下换线转驼峰
     * 用于页面传回的排序字段驼峰转下划线
     */
    @Value("${mybatis-plus.configuration.map-underscore-to-camel-case}")
    private boolean underscoreToCamelCase;
    /**
     * 文件上传路径
     */
    private String fileUploadPath;
    /**
     * session过期时间 单位：秒
     */
    private Integer sessionInvalidateTime = 60 * 30;
    /**
     * 设置session失效的扫描时间, 清理用户直接关闭浏览器造成的孤立会话 默认为 30分钟
     */
    private Integer sessionValidationInterval = 60 * 30;
    /**
     * 缓存类型
     */
    private String cacheType = "redis";
    /**
     * 版本号
     */
    private String version;

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
        return sessionInvalidateTime;
    }

    public void setSessionInvalidateTime(Integer sessionInvalidateTime) {
        this.sessionInvalidateTime = sessionInvalidateTime;
    }

    public Boolean getLoginVerificationCode() {
        return loginVerificationCode;
    }

    public void setLoginVerificationCode(Boolean loginVerificationCode) {
        this.loginVerificationCode = loginVerificationCode;
    }

    public Integer getLoginAttempts() {
        return loginAttempts;
    }

    public void setLoginAttempts(Integer loginAttempts) {
        this.loginAttempts = loginAttempts;
    }

    public Integer getLoginLockLength() {
        return loginLockLength;
    }

    public void setLoginLockLength(Integer loginLockLength) {
        this.loginLockLength = loginLockLength;
    }

    public String getCacheType() {
        return cacheType;
    }

    public void setCacheType(String cacheType) {
        this.cacheType = cacheType;
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

    public Integer getSessionValidationInterval() {
        return sessionValidationInterval;
    }

    public void setSessionValidationInterval(Integer sessionValidationInterval) {
        this.sessionValidationInterval = sessionValidationInterval;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfilesActive() {
        return profilesActive;
    }

    public void setProfilesActive(String profilesActive) {
        this.profilesActive = profilesActive;
    }

    public String getProjectPackage() {
        return projectPackage;
    }

    public void setProjectPackage(String projectPackage) {
        this.projectPackage = projectPackage;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDefaultPassword() {
        return defaultPassword;
    }

    public void setDefaultPassword(String defaultPassword) {
        this.defaultPassword = defaultPassword;
    }

    public String getProjectPath() {
        return projectPath;
    }

    public void setProjectPath(String projectPath) {
        if (projectPath.endsWith(File.separator)) {
            projectPath = projectPath.substring(0, projectPath.length() - 1);
        }
        this.projectPath = projectPath;
    }

    public boolean getUnderscoreToCamelCase() {
        return underscoreToCamelCase;
    }

    public void setUnderscoreToCamelCase(boolean underscoreToCamelCase) {
        this.underscoreToCamelCase = underscoreToCamelCase;
    }
}
