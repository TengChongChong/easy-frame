package com.frame.easy.common.constant;

/**
 * 系统参数key
 *
 * @author tengchong
 * @date 2019-03-03
 */
public class SysConfigConst {
    /**
     * 登录时密码错误尝试次数，超过后会被账号会被锁定
     */
    public static final String LOGIN_ATTEMPTS = "loginAttempts";
    /**
     * 尝试登录次数过多账号锁定时长 单位：秒
     */
    public static final String LOGIN_LOCK_LENGTH = "loginLockLength";
    /**
     * 是否开启验证码
     */
    public static final String LOGIN_VERIFICATION_CODE = "loginVerificationCode";
    /**
     * 系统名称
     */
    public static final String PROJECT_NAME = "projectName";
    /**
     * 系统版本号
     */
    public static final String PROJECT_VERSION = "projectVersion";
    /**
     * session失效时间 单位：秒
     */
    public static final String SESSION_INVALIDATE_TIME = "sessionInvalidateTime";

    /**
     * 新增用户时的默认密码
     */
    public static final String DEFAULT_PASSWORD = "defaultPassword";

}
