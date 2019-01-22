package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysUserOnline;

import java.util.List;

/**
 * 会话管理
 *
 * @author tengchong
 * @date 2018/9/12
 */
public interface SysUserOnlineService {
    /**
     * 查看在线用户列表
     * @return
     */
    List<SysUserOnline> select();

    /**
     * 根据sessionid提出用户
     * @param sessionId
     * @return
     */
    boolean forceLogout(String sessionId);
}
