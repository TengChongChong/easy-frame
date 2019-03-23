package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.common.constant.SysConfigConst;
import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.common.status.CommonStatus;
import com.frame.easy.common.status.UserStatus;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.core.web.Servlets;
import com.frame.easy.exception.BusinessException;
import com.frame.easy.exception.EasyException;
import com.frame.easy.core.shiro.session.RedisSessionDAO;
import com.frame.easy.util.PasswordUtil;
import com.frame.easy.util.RedisUtil;
import com.frame.easy.modular.sys.dao.SysDepartmentMapper;
import com.frame.easy.modular.sys.dao.SysUserMapper;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.ShiroService;
import com.frame.easy.modular.sys.service.SysUserRoleService;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.SysConfigUtil;
import com.frame.easy.util.file.ImageUtil;
import org.apache.shiro.session.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
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
     * 如知道原因希望告知 tengchongchongz@foxmail.com
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

    @Autowired
    private ProjectProperties projectProperties;

    /**
     * 获取用户剩余尝试次数
     *
     * @param username 用户名
     * @return true/false
     */
    private int getRetryCount(String username) {
        String isLockKey = RedisPrefix.ACCOUNT + "is_lock_" + username;
        // 检查是否已被锁定
        if (checkIsLock(username)) {
            throw new EasyException("帐号[" + username + "]已被锁定！请" + RedisUtil.getExpire(isLockKey) / 60 + "分钟后重试");
        }
        // 累加尝试次数
        int loginCount = getTrialFrequency(username, true);
        return projectProperties.getLoginAttempts() - loginCount;
    }

    /**
     * 检查用户是否因多次密码错误被锁定
     *
     * @param username 用户名
     * @return true/false
     */
    private boolean checkIsLock(String username) {
        String isLockKey = RedisPrefix.ACCOUNT + "is_lock_" + username;
        return RedisUtil.hasKey(isLockKey);
    }

    /**
     * 锁定账号
     *
     * @param username 用户名
     * @return true/false
     */
    private boolean lockUser(String username) {
        String loginCountKey = RedisPrefix.ACCOUNT + "login_count_" + username;
        String isLockKey = RedisPrefix.ACCOUNT + "is_lock_" + username;
        RedisUtil.set(isLockKey, "lock", projectProperties.getLoginLockLength());
        RedisUtil.setExpire(loginCountKey, projectProperties.getLoginLockLength());
        throw new EasyException("由于密码输入错误次数过多，帐号[" + username + "]已被锁定" + projectProperties.getLoginLockLength() / 60 + "分钟！");
    }

    /**
     * 获取尝试登录次数
     *
     * @param username   用户名
     * @param cumulative 是否累加
     * @return 当前第*次尝试登录
     */
    private int getTrialFrequency(String username, boolean cumulative) {
        String loginCountKey = RedisPrefix.ACCOUNT + "login_count_" + username;
        // 登录尝试次数
        return getRedisValue(cumulative, loginCountKey);
    }

    /**
     * 获取尝试登录次数
     *
     * @param sessionId  用户名
     * @param cumulative 是否累加
     * @return 当前第*次尝试登录
     */
    private int getClientTrialFrequency(String sessionId, boolean cumulative) {
        String loginCountKey = RedisPrefix.SESSION + "login_count_" + sessionId;
        // 登录尝试次数
        return getRedisValue(cumulative, loginCountKey);
    }

    /**
     * 从redis中获取值
     *
     * @param cumulative    是否累加
     * @param loginCountKey key
     * @return value
     */
    private int getRedisValue(boolean cumulative, String loginCountKey) {
        int loginCount = 0;
        if (RedisUtil.hasKey(loginCountKey)) {
            loginCount = Integer.parseInt(String.valueOf(RedisUtil.get(loginCountKey)));
        }
        if (cumulative) {
            loginCount++;
        }
        RedisUtil.set(loginCountKey, loginCount);
        return loginCount;
    }

    /**
     * 检查验证码
     *
     * @return true/false
     */
    private boolean checkVerificationCode() {
        boolean adoptVerificationCode = true;
        // 如果开启了验证码验证,用户尝试登录次数已超出最大免验证码登录次数
        if (projectProperties.getLoginVerificationCode() &&
                getClientTrialFrequency(ShiroUtil.getSession().getId().toString(), true) > (Integer) SysConfigUtil.get(SysConfigConst.LOGIN_ATTEMPTS_VERIFICATION_CODE)) {
            // 检查验证码
            String code = (String) ShiroUtil.getAttribute(SessionConst.VERIFICATION_CODE);
            HttpServletRequest request = Servlets.getRequest();
            if (request != null) {
                String receivedCode = request.getParameter("code");
                if (StrUtil.isNotBlank(receivedCode)) {
                    if (!receivedCode.toLowerCase().equals(code.toLowerCase())) {
                        throw new EasyException("验证码错误，请重新输入");
                    }
                } else {
                    throw new EasyException("请输入验证码");
                }
            } else {
                throw new EasyException("获取请求失败");
            }
        }
        return adoptVerificationCode;
    }

    @Override
    public SysUser validateUser(String username, String password) {
        // 检查验证码
        if (checkVerificationCode()) {
            int retryCount = getRetryCount(username);
            if (retryCount >= 0) {
                SysUser sysUser = getSysUserByUserName(username);
                // 用户不存在或密码错误
                if (sysUser == null || !PasswordUtil.encryptedPasswords(password, sysUser.getSalt()).equals(sysUser.getPassword())) {
                    if (retryCount > 0) {
                        throw new EasyException("用户名或密码错误，您还剩" + retryCount + "次重试的机会");
                    } else {
                        lockUser(username);
                    }
                    // 如果不需提示还有多少次机会使用下面提示
                    // throw new EasyException(BusinessException.INVALID_USERNAME_OR_PASSWORD);
                }
                // 账号被禁用
                if (sysUser.getStatus() == UserStatus.DISABLE.getCode()) {
                    throw new EasyException(BusinessException.USER_DISABLED);
                }
                // 查询用户部门信息并验证
                sysUser.setDepartment(departmentMapper.selectById(sysUser.getDeptId()));
                // 部门被删除
                if (sysUser.getDepartment() == null) {
                    throw new EasyException(BusinessException.DEPT_NON_EXISTENT);
                }
                // 部门被禁用
                if (sysUser.getDepartment().getStatus() == CommonStatus.DISABLE.getCode()) {
                    throw new EasyException(BusinessException.DEPT_DISABLED);
                }
                return sysUser;
            }
        }
        throw new EasyException("未知错误，请联系管理员");
    }

    @Override
    public SysUser getSysUserByUserName(String username) {
//        SysUser sysUser = sysUserService.getSysUserByUserName(username); // sysUserService 未注入
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return userMapper.selectOne(queryWrapper);
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
     * @return true/false
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
