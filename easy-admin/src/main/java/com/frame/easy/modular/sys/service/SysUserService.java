package com.frame.easy.modular.sys.service;

import com.frame.easy.common.page.Page;
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
     * @param object 查询条件
     * @return Page
     */
    Page select(SysUser object);

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
     * @return true/false
     */
    boolean delete(String ids);

    /**
     * 保存
     *
     * @param object 表单内容
     * @param updateAuthorization 是否更新授权
     * @return SysUser
     */
    SysUser saveData(SysUser object, boolean updateAuthorization);

    /**
     * 重置密码
     *
     * @param ids 用户ids
     * @return true/false
     */
    boolean resetPassword(String ids);

    /**
     * 禁用用户
     *
     * @param ids 用户ids
     * @return true/false
     */
    boolean disableUser(String ids);

    /**
     * 启用用户
     *
     * @param ids 用户ids
     * @return true/false
     */
    boolean enableUser(String ids);

    /**
     * 根据用户名查询用户
     *
     * @param username 用户名
     * @return SysUser
     */
    SysUser getSysUserByUserName(String username);

    /**
     * 更新用户最后登录时间
     *
     * @param userId 用户id
     * @return true/false
     */
    boolean updateUserLastLoginDate(Long userId);

    /**
     * 获取当前登录用户
     *
     * @return SysUser
     */
    SysUser getCurrentUser();

    /**
     * 根据机构id查询用户数量
     * @param deptIds 机构ids
     * @return int
     */
    int countUser(String deptIds);

    /**
     * 更新头像
     *
     * @param url 访问地址
     * @return true/false
     */
    boolean updateAvatar(String url);

    /**
     * 设置用户邮箱
     *
     * @param userId 用户id
     * @param mail 邮箱
     * @return true/false
     */
    boolean setUserMail(Long userId, String mail);

}