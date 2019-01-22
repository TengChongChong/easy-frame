package com.frame.easy.modular.sys.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.frame.easy.common.page.Page;
import com.frame.easy.modular.sys.model.SysUser;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户管理
 *
 * @author tengchong
 * @date 2018/12/6
 */
public interface SysUserMapper extends BaseMapper<SysUser> {
    /**
     * 获取列表数据
     *
     * @param page 分页
     * @param queryWrapper 查询条件
     * @return
     */
    List<SysUser> select(Page page, @Param("ew") QueryWrapper<SysUser> queryWrapper);

    /**
     * 获取详情信息
     *
     * @param id 权限id
     * @return
     */
    SysUser selectInfo(@Param("id") Long id);

    /**
     * 更新用户状态
     *
     * @param status 状态
     * @param queryWrapper 条件
     * @return int
     */
    int updateUserStatus(@Param("status") int status, @Param("ew") QueryWrapper<SysUser> queryWrapper);

    /**
     * 重置密码
     *
     * @param password 密码
     * @param salt 盐
     * @param queryWrapper 条件
     * @return int
     */
    int resetPassword(@Param("password") String password, @Param("salt") String salt, @Param("ew") QueryWrapper<SysUser> queryWrapper);

}