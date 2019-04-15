package com.frame.easy.core.shiro.check;

import cn.hutool.core.util.StrUtil;
import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.common.constant.SysConst;
import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.ShiroService;
import com.frame.easy.util.RedisUtil;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.file.ImageUtil;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 凭证匹配器
 *
 * @author tengchong
 * @date 2018/9/6
 */
public class RetryLimitCredentialsMatcher extends SimpleCredentialsMatcher {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ShiroService shiroService;

    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        SysUser sysUser = (SysUser) info.getPrincipals().getPrimaryPrincipal();
        // 清空登录计数
        RedisUtil.del(RedisPrefix.ACCOUNT + "login_count_" + sysUser.getUsername());
        RedisUtil.del(RedisPrefix.ACCOUNT + "login_count_" + sysUser.getEmail());
        RedisUtil.del(RedisPrefix.ACCOUNT + "login_count_" + sysUser.getPhone());
        RedisUtil.del(RedisPrefix.SESSION + "login_count_" + ShiroUtil.getSession().getId().toString());
        // 更新最后登录时间
        shiroService.updateUserLastLoginDate(sysUser.getId());
        // 检查是否允许用户在多处登录
        if (SysConst.projectProperties.getLoginMultipoint()) {
            shiroService.kickOutSession(sysUser);
        }
        // 用户信息放在session里
        // 设置头像缩略图
        if (StrUtil.isNotBlank(sysUser.getAvatar())) {
            sysUser.setAvatarLg(ImageUtil.getThumbnailUrlByUrl(sysUser.getAvatar(), ImageUtil.IMAGE_SIZE_LG));
            sysUser.setAvatarMd(ImageUtil.getThumbnailUrlByUrl(sysUser.getAvatar(), ImageUtil.IMAGE_SIZE_MD));
            sysUser.setAvatarSm(ImageUtil.getThumbnailUrlByUrl(sysUser.getAvatar(), ImageUtil.IMAGE_SIZE_SM));
            sysUser.setAvatarXs(ImageUtil.getThumbnailUrlByUrl(sysUser.getAvatar(), ImageUtil.IMAGE_SIZE_XS));
        }
        ShiroUtil.setAttribute(SessionConst.USER_SESSION_KEY, sysUser);
        return true;
    }
}
