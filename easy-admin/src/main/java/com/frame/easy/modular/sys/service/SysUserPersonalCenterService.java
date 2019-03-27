package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.model.SysUserSetting;

/**
 * 个人中心
 *
 * @author tengchong
 * @date 2019-03-04
 */
public interface SysUserPersonalCenterService {
    /**
     * 保存头像
     *
     * @param path 文件路径
     * @return url
     */
    String saveUserAvatar(String path);

    /**
     * 保存当前用户信息
     *
     * @param sysUser 用户信息
     * @return true/false
     */
    boolean saveUserInfo(SysUser sysUser);

    /**
     * 申请绑定密保邮箱
     *
     * @param mail 邮箱地址
     * @return true/false
     */
    boolean applicationBindingMail(String mail);

    /**
     * 保存偏好设置
     *
     * @param setting 偏好设置
     * @return true/false
     */
    boolean saveUserSetting(SysUserSetting setting);
}
