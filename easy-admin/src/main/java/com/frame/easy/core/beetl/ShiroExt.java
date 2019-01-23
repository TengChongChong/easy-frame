package com.frame.easy.core.beetl;

import cn.hutool.core.util.StrUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.frame.easy.common.CommonConst;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.util.ShiroUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

/**
 * shiro 工具类
 * @author tengchong
 */
public class ShiroExt {

    /**
     * 获取当前 subject
     * @return
     */
    protected Subject getSubject(){
        return SecurityUtils.getSubject();
    }

    /**
     * 获取当前登录用户
     * @return
     */
    public SysUser getUser(){
        return (SysUser)getSubject().getPrincipals().getPrimaryPrincipal();
    }

    /**
     * 获取当前登录用户菜单
     *
     * @return jsonarray 数组
     */
    public String getUserMenus(){
        SysUser sysUser = ShiroUtil.getCurrentUser();
        return JSON.toJSONString(sysUser.getMenus());
    }

    /**
     * 用户是否属于指定角色标识
     *
     * @param code 角色标识
     * @return
     */
    public boolean hasRole(String code){
        Subject subject = getSubject();
        if(subject != null && StrUtil.isNotBlank(code)){
            return subject.hasRole(code);
        }
        return false;
    }

    /**
     * 用户是否不属于指定角色标识
     *
     * @param code 角色标识
     * @return
     */
    public boolean notHasRole(String code){
        return !hasRole(code);
    }

    /**
     * 用户是否属于指定角色标识的任意一个
     *
     * @param codes (示例: role1,role2)
     * @return
     */
    public boolean hasAnyRole(String codes){
        Subject subject = getSubject();
        if(subject != null && StrUtil.isNotBlank(codes)){
            for(String code: codes.split(CommonConst.SPLIT)){
                if(subject.hasRole(code)){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 用户是否不属于指定角色标识的任意一个
     *
     * @param codes (示例: role1,role2)
     * @return
     */
    public boolean notHasAnyRole(String codes){
        return !hasAnyRole(codes);
    }

    /**
     * 用户是否拥有指定权限标识
     *
     * @param code 权限标识
     * @return
     */
    public boolean hasPermission(String code){
        Subject subject = getSubject();
        if(subject != null && StrUtil.isNotBlank(code)){
            return subject.isPermitted(code);
        }
        return false;
    }

    /**
     * 用户是否没有指定权限标识
     *
     * @param code 权限标识
     * @return
     */
    public boolean notHasPermission(String code){
        return !hasPermission(code);
    }

    /**
     * 用户是否拥有指定权限标识的任意一个
     *
     * @param codes (示例: role1,role2)
     * @return
     */
    public boolean hasAnyPermission(String codes){
        Subject subject = getSubject();
        if(subject != null && StrUtil.isNotBlank(codes)){
            for(String code: codes.split(CommonConst.SPLIT)){
                if(subject.isPermitted(code)){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 用户是否没有指定权限标识的任意一个
     *
     * @param codes (示例: role1,role2)
     * @return
     */
    public boolean notHasAnyPermission(String codes){
        return !hasAnyPermission(codes);
    }

    /**
     * 已认证通过的用户
     * 不包含已记住的用户
     *
     * @return 通过身份验证：true，否则false
     */
    public boolean authenticated() {
        return getSubject() != null && getSubject().isAuthenticated();
    }

    public JSONObject getAllPermission(){
        Subject subject = getSubject();
        return null;
    }

}
