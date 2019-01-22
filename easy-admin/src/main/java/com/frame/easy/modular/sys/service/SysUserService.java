package com.frame.easy.modular.sys.service;

import com.frame.easy.modular.sys.model.SysUser;

/**
 * 用户管理
 *
 * @author tengchong
 * @date 2018/12/25
 */
public interface SysUserService {
    /**
     * 列表
     *
     * @param object
     * @return
     */
    Object select(SysUser object);

    /**
     * 详情
     *
     * @param id id
     * @return SysUser
     */
    SysUser input(Long id);

    /**
     * 新增
     *
     * @param deptId 机构id
     * @return SysUser
     */
    SysUser add(Long deptId);

    /**
     * 删除
     *
     * @param ids 要删除的id 1,2,3 或 1
     * @return
     */
    boolean delete(String ids);


    /**
     * 保存
     *
     * @param object 表单内容
     * @return SysUser
     */
    SysUser saveData(SysUser object);

    /**
     * 重置密码
     *
     * @param ids 用户ids
     * @return
     */
    boolean resetPassword(String ids);

    /**
     * 禁用用户
     *
     * @param ids 用户ids
     * @return
     */
    boolean disableUser(String ids);

    /**
     * 启用用户
     *
     * @param ids 用户ids
     * @return
     */
    boolean enableUser(String ids);

    /**
     * 根据用户名查询用户
     *
     * @param username 用户名
     * @return
     */
    SysUser getSysUserByUserName(String username);

    /**
     * 更新用户最后登录时间
     *
     * @param userId 用户id
     * @return
     */
    boolean updateUserLastLoginDate(Long userId);

    /**
     * 获取当前登录用户
     *
     * @return
     */
    SysUser getCurrentUser();
}