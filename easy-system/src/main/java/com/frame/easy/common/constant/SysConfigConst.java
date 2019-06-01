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

    /**
     * 是否开启验证码
     */
    public static final String LOGIN_VERIFICATION_CODE = "loginVerificationCode";

    /**
     * 登录失败累计多少次后需要输入验证码后才可以登录,需要同时开启loginVerificationCode生效
     */
    public static final String LOGIN_ATTEMPTS_VERIFICATION_CODE = "loginAttemptsVerificationCode";

    /**
     * 是否开启用户注册
     */
    public static final String OPEN_REGISTRATION = "openRegistration";

    /**
     * 是否允许多点登录
     */
    public static final String LOGIN_MULTIPOINT = "loginMultipoint";

    /**
     * 修改密码时密码的等级要求，分为0~5级，默认为3级
     */
    public static final String PASSWORD_SECURITY_LEVEL = "passwordSecurityLevel";



}
