package com.frame.easy.common.redis;

/**
 * redis key前缀
 *
 * @author tengchong
 * @date 2019-01-23
 */
public class RedisPrefix {
    /**
     * 登录尝试次数
     */
    public static final String ACCOUNT = "account:";

    /**
     * shiro session前缀
     */
    public static final String SHIRO_SESSION = "shiro_session:";
    /**
     * shiro session前缀
     */
    public static final String SHIRO_AUTHORIZATION = "shiro_authorization:";
}
