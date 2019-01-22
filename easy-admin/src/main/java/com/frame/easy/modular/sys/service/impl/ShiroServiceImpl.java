package com.frame.easy.modular.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.common.constant.status.CommonStatus;
import com.frame.easy.common.constant.status.UserStatus;
import com.frame.easy.core.shiro.session.RedisSessionDAO;
import com.frame.easy.modular.sys.dao.SysDepartmentMapper;
import com.frame.easy.modular.sys.dao.SysUserMapper;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.ShiroService;
import com.frame.easy.modular.sys.service.SysUserRoleService;
import org.apache.shiro.authc.DisabledAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.session.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;


/**
 * Shiro 相关接口
 *
 * @author tengchong
 * @date 2018/9/4
 */
@Service
public class ShiroServiceImpl implements ShiroService {

    /**
     * 注入到这个class的service会导致被注入class(SysUserService)事务失效,原因未知;
     * 暂时使用注入SysUserMapper方式使用
     * 如发现原因希望告知作者 tengchongchongz@foxmail.com
     */
//    @Autowired
//    private SysUserService sysUserService;

    @Autowired
    private SysUserMapper userMapper;

    @Autowired
    private SysDepartmentMapper departmentMapper;

    @Autowired
    private SysUserRoleService sysUserRoleService;

    @Autowired
    private RedisSessionDAO sessionDAO;

    @Override
    public SysUser getSysUserByUserName(String username) {
//        SysUser sysUser = sysUserService.getSysUserByUserName(username); // sysUserService 未注入
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        SysUser sysUser = userMapper.selectOne(queryWrapper);
        // 账号不存在
        if (sysUser == null) {
            throw new UnknownAccountException("账号或密码不正确！");
        } else {
            sysUser.setDepartment(departmentMapper.selectById(sysUser.getDeptId()));
        }
        // 账号被禁用
        if (sysUser.getStatus() == UserStatus.DISABLE.getCode()) {
            throw new DisabledAccountException("账号被禁用，请联系管理员！");
        }
        // 部门被移除
        if (sysUser.getDepartment() == null) {
            throw new DisabledAccountException("部门不存在，请联系管理员！");
        }
        // 部门被禁用
        if (sysUser.getDepartment().getStatus() == CommonStatus.DISABLE.getCode()) {
            throw new DisabledAccountException("部门被禁用，请联系管理员！");
        }
        return sysUser;
    }

    @Override
    public SysUser queryUserPermissions(SysUser sysUser) {
        List<String> permissions = sysUserRoleService.selectPermissionsByUserId(sysUser.getId());

        // str: 添加一些默认权限
        permissions.add("sys:current:user");
        permissions.add("sys:index");
        // end: 添加一些默认权限

        // 设置权限
        sysUser.setPermissionList(permissions);
        // 设置角色
        sysUser.setRoleList(sysUserRoleService.selectRoleByUserId(sysUser.getId()));
        // 设置菜单
        sysUser.setMenus(sysUserRoleService.selectMenusByUserId(sysUser.getId()));
        return sysUser;
    }

    @Override
    public void updateUserLastLoginDate(Long userId) {
//        sysUserService.updateUserLastLoginDate(userId); // sysUserService 未注入
        SysUser sysUser = new SysUser();
        sysUser.setId(userId);
        sysUser.setLastLogin(new Date());
        userMapper.updateById(sysUser);
    }

    /**
     * 根据会话获取相同账号会话
     *
     * @param user 正在登录的用户
     * @return List<Session>
     */
    @Override
    public List<Session> getLoginedSession(SysUser user) {
        Collection<Session> sessions = sessionDAO.getActiveSessions();
        if (sessions != null && sessions.size() > 0) {
            List<Session> loginedSession = new ArrayList<>();
            for (Session session : sessions) {
                // 有效session
                if (checkSessionEffective(session)) {
                    SysUser sysUser = (SysUser) session.getAttribute(SessionConst.USER_SESSION_KEY);
                    if (sysUser != null && sysUser.getUsername().equals(user.getUsername())) {
                        loginedSession.add(session);
                    }
                }
            }
            return loginedSession;
        }
        return null;
    }

    /**
     * 根据会话踢出相同账号其他会话
     *
     * @param user 正在登录的用户
     * @return
     */
    @Override
    public boolean kickOutSession(SysUser user) {
        List<Session> loginedSession = getLoginedSession(user);
        if (loginedSession != null && loginedSession.size() > 0) {
            for (Session session : loginedSession) {
                session.setAttribute(SessionConst.LOGIN_ELSEWHERE, true);
                sessionDAO.update(session);
            }
            return true;
        }
        return false;
    }

    /**
     * 检查session有效性
     *
     * @param session
     * @return
     */
    private boolean checkSessionEffective(Session session) {
        return session.getAttribute(SessionConst.FORCE_LOGOUT) == null && session.getAttribute(SessionConst.LOGIN_ELSEWHERE) == null;
    }
}
