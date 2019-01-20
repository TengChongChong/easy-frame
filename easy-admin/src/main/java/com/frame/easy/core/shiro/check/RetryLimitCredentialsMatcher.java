package com.frame.easy.core.shiro.check;

import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.core.util.RedisUtil;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.ShiroService;
import org.apache.shiro.authc.AccountException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 添加登录次数验证,防止暴力破解
 * 默认开启,连续输错5次后账号会被锁定10分钟
 * 可在 application.yml 中 修改 project.login.attempts/project.login.lock-length
 *
 * @Author tengchong
 * @Date 2018/9/6
 */
public class RetryLimitCredentialsMatcher extends CredentialsMatcher {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ProjectProperties projectProperties;

    @Autowired
    private ShiroService shiroService;

    /**
     * redis中前缀
     */
    private static final String ACCOUNT_PREFIX = "account:";

    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        SysUser user = (SysUser) info.getPrincipals().getPrimaryPrincipal();
        String loginCountKey = ACCOUNT_PREFIX + "login_count_" + user.getUsername();
        String isLockKey = ACCOUNT_PREFIX + "is_lock_" + user.getUsername();
        // 检查是否已被锁定
        if (RedisUtil.hasKey(isLockKey)) {
            throw new ExcessiveAttemptsException("帐号[" + user.getUsername() + "]已被锁定！请" + RedisUtil.getExpire(isLockKey) / 60 + "分钟后重试");
        }

        // 登录尝试次数
        Integer loginCount = null;
        if (RedisUtil.hasKey(loginCountKey)) {
            loginCount = Integer.parseInt(String.valueOf(RedisUtil.get(loginCountKey)));
            loginCount++;
            RedisUtil.set(loginCountKey, loginCount);
        } else {
            loginCount = 1;
            RedisUtil.set(loginCountKey, 1);
        }

        // 计数大于 project.login.attempts 时，将账户锁定 project.login.lock-length 秒
        int retryCount = (projectProperties.getLoginAttempts() - loginCount);
        if (retryCount <= 0) {
            // 将已锁定状态放到redis中
            RedisUtil.set(isLockKey, "lock", projectProperties.getLoginLockLength());
            RedisUtil.setExpire(loginCountKey, projectProperties.getLoginLockLength());
            logger.info("由于密码输入错误次数过多，帐号[" + user.getUsername() + "]已被锁定" + projectProperties.getLoginLockLength() / 60 + "分钟！");
            throw new ExcessiveAttemptsException("由于密码输入错误次数过多，帐号[" + user.getUsername() + "]已被锁定" + projectProperties.getLoginLockLength() / 60 + "分钟！");
        }

        boolean matches = super.doCredentialsMatch(token, info);
        if (!matches) {
            String msg = retryCount <= 0 ? "您的账号被锁定" + projectProperties.getLoginLockLength() / 60 + "分钟！" : "您还剩" + retryCount + "次重试的机会";
            throw new AccountException("帐号或密码不正确！" + msg);
        }

        // 清空登录计数
        RedisUtil.del(loginCountKey);
        // 更新最后登录时间
        shiroService.updateUserLastLoginDate(user.getId());
        // 检查是否允许用户在多处登录
        if(true){
            shiroService.kickOutSession(user);
        }
        // 用户信息放在session里
        ShiroUtil.setAttribute(SessionConst.USER_SESSION_KEY, user);
        return true;
    }
}
