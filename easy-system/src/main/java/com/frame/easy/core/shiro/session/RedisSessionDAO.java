package com.frame.easy.core.shiro.session;

import cn.hutool.core.lang.Validator;
import com.alibaba.fastjson.JSON;
import com.frame.easy.common.constant.SysConst;
import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.util.RedisUtil;
import com.frame.easy.util.web.Servlets;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.UnknownSessionException;
import org.apache.shiro.session.mgt.eis.AbstractSessionDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;

/**
 * redis实现共享session
 *
 * @author tengchong
 * @date 2018/09/07
 */
@Repository("redisSessionDAO")
public class RedisSessionDAO extends AbstractSessionDAO {

    private Logger logger = LoggerFactory.getLogger(this.getClass());


    public String getKey(String originalKey) {
        return RedisPrefix.SHIRO_SESSION + originalKey;
    }

    /**
     * 请求不更新session最后访问时间
     */
    private static final String IGNORE = "1";

    /**
     * 创建会话
     *
     * @param session 会话
     * @return
     */
    @Override
    protected Serializable doCreate(Session session) {
        HttpServletRequest request = Servlets.getRequest();
        if (request != null) {
            String uri = request.getServletPath();
            // 如果是静态文件 不创建session
            if (Servlets.isStaticRequest(uri)) {
                return null;
            }
        }
        Serializable sessionId = this.generateSessionId(session);
        this.assignSessionId(session, sessionId);
        logger.debug("createSession:", sessionId.toString());
        System.out.println(JSON.toJSONString(session));
        RedisUtil.set(getKey(sessionId.toString()), session, SysConst.projectProperties.getSessionInvalidateTime());
        return sessionId;
    }

    /**
     * 根据会话id获取session
     *
     * @param sessionId 会话id
     * @return
     */
    @Override
    protected Session doReadSession(Serializable sessionId) {
        HttpServletRequest request = Servlets.getRequest();
        if (request != null) {
            String uri = request.getServletPath();
            // 如果是静态文件 不读取session
            if (Servlets.isStaticRequest(uri)) {
                return null;
            }
            logger.debug("readSession(" + request.getServletPath() + "):", sessionId.toString());
        }
        // 从缓存中获取session
        return (Session) RedisUtil.get(getKey(sessionId.toString()));
    }

    @Override
    public Session readSession(Serializable sessionId) throws UnknownSessionException {
        try {
            return super.readSession(sessionId);
        } catch (UnknownSessionException e) {
            return null;
        }
    }

    /**
     * 更新session的最后一次访问时间
     *
     * @param session 会话
     */
    @Override
    public void update(Session session) {
        if (checkSession(session)) {
            logger.debug("updateSession:", session.getId().toString());
            HttpServletRequest request = Servlets.getRequest();
            String ignore = null;
            if (request != null) {
                String uri = request.getServletPath();
                if (Servlets.isStaticRequest(uri)) {
                    return;
                }
                ignore = request.getParameter("ignore");
            }
            if (!IGNORE.equals(ignore)) {
                // 如请求必须要更新session会话有效期,请在url中传入ignore=1
                String key = getKey(session.getId().toString());
                RedisUtil.set(key, session, SysConst.projectProperties.getSessionInvalidateTime());
            }
        }
    }

    /**
     * 删除session
     *
     * @param session 会话
     */
    @Override
    public void delete(Session session) {
        if (checkSession(session)) {
            logger.debug("delSession:", session.getId());
            RedisUtil.del(getKey(session.getId().toString()));
        }
    }

    /**
     * 获取当前有效会话
     *
     * @return 有效会话列表
     */
    @Override
    public Collection<Session> getActiveSessions() {
        logger.debug("activeSession");
        Set<String> sessionKeys = RedisUtil.selectKeysByPrefix(RedisPrefix.SHIRO_SESSION);
        if (sessionKeys != null && sessionKeys.size() > 0) {
            Collection<Session> sessions = new ArrayList<>();
            for (String sessionKey : sessionKeys) {
                sessions.add((Session) RedisUtil.get(sessionKey));
            }
            return sessions;
        }
        return null;
    }

    private boolean checkSession(Session session) {
        return session != null && Validator.isNotEmpty(session.getId());
    }
}

