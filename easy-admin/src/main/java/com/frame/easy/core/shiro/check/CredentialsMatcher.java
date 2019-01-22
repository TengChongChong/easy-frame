package com.frame.easy.core.shiro.check;

import cn.hutool.crypto.SecureUtil;
import com.frame.easy.core.util.PasswordUtil;
import com.frame.easy.modular.sys.model.SysUser;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;

/**
 * 验证密码有效性
 *
 * @author tengchong
 * @date 2018/9/4
 */
public class CredentialsMatcher extends SimpleCredentialsMatcher {

    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        UsernamePasswordToken utoken = (UsernamePasswordToken) token;
        SysUser sysUser = (SysUser) info.getPrincipals().getPrimaryPrincipal();
        //获得用户输入的密码:(可以采用加盐(salt)的方式去检验)
        String inPassword = new String(utoken.getPassword());
        inPassword = SecureUtil.md5(inPassword);
        inPassword = PasswordUtil.encryptedPasswords(inPassword, sysUser.getSalt());
        //获得数据库中的密码
        String dbPassword = sysUser.getPassword();
        //进行密码的比对
        return this.equals(inPassword, dbPassword);
    }
}
