package com.frame.easy.common.redis;

/**
 * redis key前缀
 *
 * @author tengchong
 * @date 2019-01-23
 */
public class RedisPrefix {
    /**
     * 用户登录尝试次数以及锁定账号
     */
    public static final String ACCOUNT = "account:";

    /**
     * shiro session
     */
    public static final String SHIRO_SESSION = "shiro:session:";

    /**
     * shiro 授权
     */
    public static final String SHIRO_AUTHORIZATION = "shiro:authorization:";

    /**
     * 系统参数
     */
    public static final String SYS_CONFIG = "sys:config:";
}
