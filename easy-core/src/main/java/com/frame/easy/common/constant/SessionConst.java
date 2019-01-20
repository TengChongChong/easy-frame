package com.frame.easy.common.constant;

/**
 * Session常量
 *
 * @Author tengchong
 * @Date 2018/9/4
 */
public class SessionConst {
    /**
     * 当前登录用户session key
     */
    public static final String USER_SESSION_KEY = "user";
    /**
     * 记住我cookie
     */
    public static final String REMEMBER_ME = "rememberMe";
    /**
     * shiro session前缀
     */
    public static final String SHIRO_SESSION_PREFIX = "shiro_session:";
    /**
     * shiro session前缀
     */
    public static final String SHIRO_AUTHORIZATION_PREFIX = "shiro_authorization:";
    /**
     * 管理员强制退出
     */
    public static final String FORCE_LOGOUT = "force_logout";
    /**
     * 在其他地方登录,被踢出
     */
    public static final String LOGIN_ELSEWHERE = "login_elsewhere";


}
