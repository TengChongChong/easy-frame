package com.frame.easy.modular.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.common.status.CommonStatus;
import com.frame.easy.common.status.UserStatus;
import com.frame.easy.config.properties.ProjectProperties;
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

    @Autowired
    private ProjectProperties projectProperties;

    /**
     * redis中前缀
     */
    private static final String ACCOUNT = "account:";

    /**
     * 检查用户尝试登录次数
     *
     * @param username 用户名
     * @return true/false
     */
    private int checkUser(String username) {
        String isLockKey = ACCOUNT + "is_lock_" + username;
        // 检查是否已被锁定
        if (checkIsLock(username)) {
            throw new EasyException("帐号[" + username + "]已被锁定！请" + RedisUtil.getExpire(isLockKey) / 60 + "分钟后重试");
        }
        // 累加尝试次数
        int loginCount = addTrialFrequency(username);

        // 计数大于 project.login.attempts 时，将账户锁定 project.login.lock-length 秒
        int retryCount = (projectProperties.getLoginAttempts() - loginCount);
        if (retryCount <= 0) {
            lockUser(username);
        }
        return retryCount;
    }

    /**
     * 检查用户是否因多次密码错误被锁定
     *
     * @param username 用户名
     * @return true/false
     */
    private boolean checkIsLock(String username) {
        String isLockKey = ACCOUNT + "is_lock_" + username;
        return RedisUtil.hasKey(isLockKey);
    }

    /**
     * 锁定账号
     *
     * @param username 用户名
     * @return true/false
     */
    private boolean lockUser(String username) {
        String loginCountKey = ACCOUNT + "login_count_" + username;
        String isLockKey = ACCOUNT + "is_lock_" + username;
        RedisUtil.set(isLockKey, "lock", projectProperties.getLoginLockLength());
        RedisUtil.setExpire(loginCountKey, projectProperties.getLoginLockLength());
        throw new EasyException("由于密码输入错误次数过多，帐号[" + username + "]已被锁定" + projectProperties.getLoginLockLength() / 60 + "分钟！");
    }

    /**
     * 累加尝试登录次数
     *
     * @param username 用户名
     * @return 当前第*次尝试登录
     */
    private int addTrialFrequency(String username) {
        String loginCountKey = ACCOUNT + "login_count_" + username;
        // 登录尝试次数
        int loginCount;
        if (RedisUtil.hasKey(loginCountKey)) {
            loginCount = Integer.parseInt(String.valueOf(RedisUtil.get(loginCountKey)));
            loginCount++;
            RedisUtil.set(loginCountKey, loginCount);
        } else {
            loginCount = 1;
            RedisUtil.set(loginCountKey, 1);
        }
        return loginCount;
    }

    @Override
    public SysUser validateUser(String username, String password) {
        int retryCount = checkUser(username);
        if (retryCount >= 0) {
            SysUser sysUser = getSysUserByUserName(username);
            // 账号不存在
            if (sysUser == null) {
                throw new EasyException(BusinessException.USER_NON_EXISTENT);
            }
            // 验证密码,防止下面异常提示暴漏用户名是否存在
            if (!PasswordUtil.encryptedPasswords(password, sysUser.getSalt()).equals(sysUser.getPassword())) {
                throw new EasyException("用户名或密码错误，您还剩" + retryCount + "次重试的机会");
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
        return null;
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
