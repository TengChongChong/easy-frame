package com.frame.easy.core.shiro.session;

import org.apache.shiro.session.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * session监听
 *
 * @author tengchong
 * @date 2018/9/11
 */
public class SessionListener implements org.apache.shiro.session.SessionListener {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    private final AtomicInteger sessionCount = new AtomicInteger(0);


    @Override
    public void onStart(Session session) {
        sessionCount.incrementAndGet();
        logger.debug("onStart->" + session.getId());
    }

    @Override
    public void onStop(Session session) {
        logger.debug("onStop->" + session.getId());
        sessionCount.decrementAndGet();

    }

    @Override
    public void onExpiration(Session session) {
        sessionCount.decrementAndGet();
        logger.debug("onExpiration->" + session.getId());
    }
}
