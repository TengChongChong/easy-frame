package com.frame.easy.core.shiro;

import com.frame.easy.util.ShiroUtil;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.ShiroService;
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
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        logger.info("=============> 认证");
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        SysUser sysUser = shiroService.getSysUserByUserName(token.getUsername());
        return new SimpleAuthenticationInfo(sysUser, sysUser.getPassword().toCharArray(), ByteSource.Util.bytes(sysUser.getSalt()), getName());
    }

    /**
     * 授权
     *
     * @param principalCollection
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        logger.info("=============> 授权");

        // 由于修改用户角色或者修改角色权限导致权限变动,所以每次授权都要重新查询 2018-12-17 改
        SysUser sysUser = shiroService.queryUserPermissions((SysUser) principalCollection.getPrimaryPrincipal());

        // 会导致用户在线时,修改权限无法立即生效
//        SysUser sysUser = (SysUser) principalCollection.getPrimaryPrincipal();

        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        // 赋予权限
        simpleAuthorizationInfo.addStringPermissions(sysUser.getPermissionList());
        // 赋予角色
        simpleAuthorizationInfo.addRoles(sysUser.getRoleList());
        ShiroUtil.setCurrentUser(sysUser);
        return simpleAuthorizationInfo;
    }
}
