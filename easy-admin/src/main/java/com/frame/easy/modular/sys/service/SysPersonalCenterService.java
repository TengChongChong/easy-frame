package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.model.SysUserSecuritySetting;
import com.frame.easy.modular.sys.model.SysUserSetting;

/**
 * 个人中心
 *
 * @author tengchong
 * @date 2019-03-04
 */
public interface SysPersonalCenterService {
    /**
     * 保存头像
     *
     * @param path 文件路径
     * @return url
     */
    String saveAvatar(String path);

    /**
     * 保存当前用户信息
     *
     * @param sysUser 用户信息
     * @return true/false
     */
    boolean saveUserInfo(SysUser sysUser);
    /**
     * 保存安全设置
     *
     * @param securitySetting 安全设置
     * @return true/false
     */
    boolean saveSecuritySetting(SysUserSecuritySetting securitySetting);

    /**
     * 保存偏好设置
     *
     * @param setting 偏好设置
     * @return true/false
     */
    boolean saveSetting(SysUserSetting setting);
}
