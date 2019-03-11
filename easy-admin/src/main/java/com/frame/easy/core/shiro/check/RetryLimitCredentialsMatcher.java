package com.frame.easy.core.shiro.check;

import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.exception.EasyException;
import com.frame.easy.util.RedisUtil;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.ShiroService;
import com.frame.easy.util.file.ImageUtil;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 添加登录次数验证,防止暴力破解
 * 默认开启,连续输错5次后账号会被锁定10分钟
 * 可在 application.yml 中 修改 project.login.attempts/project.login.lock-length
 *
 * @author tengchong
 * @date 2018/9/6
 */
public class RetryLimitCredentialsMatcher extends CredentialsMatcher {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ProjectProperties projectProperties;

    @Autowired
    private ShiroService shiroService;

    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        SysUser sysUser = (SysUser) info.getPrincipals().getPrimaryPrincipal();
        String loginCountKey = RedisPrefix.ACCOUNT + "login_count_" + sysUser.getUsername();
        // 登录尝试次数
        int loginCount = Integer.parseInt(String.valueOf(RedisUtil.get(loginCountKey)));
        // 剩余尝试次数
        int retryCount = (projectProperties.getLoginAttempts() - loginCount);

        boolean matches = super.doCredentialsMatch(token, info);
        if (!matches) {
            String msg = retryCount <= 0 ? "您的账号被锁定" + projectProperties.getLoginLockLength() / 60 + "分钟！" : "您还剩" + retryCount + "次重试的机会";
            throw new EasyException("帐号或密码不正确！" + msg);
        }

        // 清空登录计数
        RedisUtil.del(loginCountKey);
        // 更新最后登录时间
        shiroService.updateUserLastLoginDate(sysUser.getId());
        // 检查是否允许用户在多处登录
        if (true) {
            shiroService.kickOutSession(sysUser);
        }
        // 用户信息放在session里
        // 设置头像缩略图
        sysUser.setAvatarLg(ImageUtil.getThumbnailUrlByUrl(sysUser.getAvatar(), ImageUtil.IMAGE_SIZE_LG));
        sysUser.setAvatarMd(ImageUtil.getThumbnailUrlByUrl(sysUser.getAvatar(), ImageUtil.IMAGE_SIZE_MD));
        sysUser.setAvatarSm(ImageUtil.getThumbnailUrlByUrl(sysUser.getAvatar(), ImageUtil.IMAGE_SIZE_SM));
        sysUser.setAvatarXs(ImageUtil.getThumbnailUrlByUrl(sysUser.getAvatar(), ImageUtil.IMAGE_SIZE_XS));
        ShiroUtil.setAttribute(SessionConst.USER_SESSION_KEY, sysUser);
        return true;
    }
}
