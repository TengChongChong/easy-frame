package com.frame.easy.core.shiro;

import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.ShiroService;
import com.frame.easy.util.ShiroUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 自定义 Realm
 *
 * @author tengchong
 * @date 2018/9/4
 */
public class ShiroRealm extends AuthorizingRealm {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ShiroService shiroService;

    /**
     * 认证
     *
     * @param authenticationToken token
     * @return AuthenticationInfo
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        logger.info("=============> 认证");
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        SysUser sysUser = shiroService.validateUser(token.getUsername(), String.valueOf(token.getPassword()));
        return new SimpleAuthenticationInfo(sysUser, sysUser.getPassword().toCharArray(), ByteSource.Util.bytes(sysUser.getSalt()), getName());
    }

    /**
     * 授权
     *
     * @param principalCollection principal
     * @return AuthorizationInfo
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        logger.info("=============> 授权");
        // 当前登录用户
        SysUser currentUser = (SysUser) principalCollection.getPrimaryPrincipal();
        if (SecurityUtils.getSubject().isRemembered()) {
            // 如果通过记住密码方式登录,从数据库中重新查询用户信息,防止用户信息变更cookie里保存的信息是旧的
            ShiroUtil.setCurrentUser(shiroService.getSysUserByUserName(currentUser.getUsername()));
        }

        // 由于修改用户角色或者修改角色权限导致权限变动,所以每次授权都要重新查询
        SysUser sysUser = shiroService.queryUserPermissions(currentUser);

        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        // 赋予权限
        simpleAuthorizationInfo.addStringPermissions(sysUser.getPermissionList());
        // 赋予角色
        simpleAuthorizationInfo.addRoles(sysUser.getRoleList());
        ShiroUtil.setCurrentUser(sysUser);
        return simpleAuthorizationInfo;
    }
}
