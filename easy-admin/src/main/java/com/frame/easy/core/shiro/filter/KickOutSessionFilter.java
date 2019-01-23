package com.frame.easy.core.shiro.filter;

import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.util.RedisUtil;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * 检查被踢出用户
 *
 * @author tengchong
 * @date 2018/9/17
 */
public class KickOutSessionFilter extends AccessControlFilter {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 表示是否允许访问;
     * 如果允许访问返回true,否则false
     *
     * @param servletRequest
     * @param servletResponse
     * @param o [urls]配置中拦截器参数部分
     * @return
     * @throws Exception
     */
    @Override
    protected boolean isAccessAllowed(ServletRequest servletRequest, ServletResponse servletResponse, Object o) throws Exception {
        return false;
    }

    /**
     *  表示当访问拒绝时是否已经处理了
     *  如果返回true表示需要继续处理,如果返回false表示该拦截器实例已经处理了
     *
     * @param servletRequest
     * @param servletResponse
     * @return
     * @throws Exception
     */
    @Override
    protected boolean onAccessDenied(ServletRequest servletRequest, ServletResponse servletResponse) throws Exception {
        Subject subject = getSubject(servletRequest, servletResponse);
        //未登录
        if (!subject.isAuthenticated() && !subject.isRemembered()) {
            // 重定向到登录
            redirectToLogin(servletRequest, servletResponse);
            return false;
        }
        Session session = (Session) RedisUtil.get(RedisPrefix.SHIRO_SESSION + subject.getSession().getId());
        // 判断是否被踢出
        if (session.getAttribute(SessionConst.FORCE_LOGOUT) != null && (boolean) session.getAttribute(SessionConst.FORCE_LOGOUT)) {
            RedisUtil.del(RedisPrefix.SHIRO_SESSION + session.getId());
            String loginUrl = getLoginUrl() + (getLoginUrl().contains("?") ? "&" : "?") + SessionConst.FORCE_LOGOUT + "=1";
            // 重定向到登录
            WebUtils.issueRedirect(servletRequest, servletResponse, loginUrl);
            return false;
        }
        // 判断是否在他处登录

        if (session.getAttribute(SessionConst.LOGIN_ELSEWHERE) != null && (boolean) session.getAttribute(SessionConst.LOGIN_ELSEWHERE)) {
            RedisUtil.del(RedisPrefix.SHIRO_SESSION + session.getId());
            String loginUrl = getLoginUrl() + (getLoginUrl().contains("?") ? "&" : "?") + SessionConst.LOGIN_ELSEWHERE + "=1";
            // 重定向到登录
            WebUtils.issueRedirect(servletRequest, servletResponse, loginUrl);
            return false;
        }

        return true;
    }

}
