package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.common.constant.CommonConst;
import com.frame.easy.common.constant.SessionConst;
import com.frame.easy.common.constant.SysConst;
import com.frame.easy.common.redis.RedisPrefix;
import com.frame.easy.common.status.UserStatus;
import com.frame.easy.common.page.Page;
import com.frame.easy.config.properties.ProjectProperties;
import com.frame.easy.exception.EasyException;
import com.frame.easy.util.PasswordUtil;
import com.frame.easy.util.RedisUtil;
import com.frame.easy.util.ShiroUtil;
import com.frame.easy.util.ToolUtil;
import com.frame.easy.modular.sys.dao.SysUserMapper;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.ShiroService;
import com.frame.easy.modular.sys.service.SysUserRoleService;
import com.frame.easy.modular.sys.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 用户管理
 *
 * @author tengchong
 * @date 2018/12/25
 */
@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {

    @Autowired
    private SysUserRoleService sysUserRoleService;

    @Autowired
    private ShiroService shiroService;


    @Override
    public Page select(SysUser sysUser) {
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        if (sysUser != null) {
            if (Validator.isNotEmpty(sysUser.getUsername())) {
                queryWrapper.like("username", sysUser.getUsername());
            }
            if (Validator.isNotEmpty(sysUser.getNickname())) {
                queryWrapper.like("nickname", sysUser.getNickname());
            }
            if (Validator.isNotEmpty(sysUser.getSex())) {
                queryWrapper.eq("sex", sysUser.getSex());
            }
            if (Validator.isNotEmpty(sysUser.getStatus())) {
                queryWrapper.eq("status", sysUser.getStatus());
            }
            if (Validator.isNotEmpty(sysUser.getPhone())) {
                queryWrapper.like("phone", sysUser.getPhone());
            }
            if (Validator.isNotEmpty(sysUser.getSource())) {
                queryWrapper.eq("source", sysUser.getSource());
            }
            if (Validator.isNotEmpty(sysUser.getDeptId())) {
                queryWrapper.eq("dept_id", sysUser.getDeptId());
            }
        }
        return (Page) page(ToolUtil.getPage(sysUser), queryWrapper);
    }

    @Override
    public SysUser input(Long id) {
        ToolUtil.checkParams(id);
        return getBaseMapper().selectInfo(id);
    }

    @Override
    public SysUser add(Long deptId) {
        ToolUtil.checkParams(deptId);
        SysUser sysUser = new SysUser();
        sysUser.setDeptId(deptId);
        sysUser.setPassword(SysConst.projectProperties.getDefaultPassword());
        sysUser.setStatus(UserStatus.ENABLE.getCode());
        return sysUser;
    }

    @Transactional(rollbackFor = RuntimeException.class)
    @Override
    public boolean delete(String ids) {
        ToolUtil.checkParams(ids);
        List<String> idList = Arrays.asList(ids.split(CommonConst.SPLIT));
        boolean isSuccess = removeByIds(idList);
        if (isSuccess) {
            // 删除分配给用户的权限
            sysUserRoleService.deleteUserRoleByUserIds(ids);
        }
        return isSuccess;
    }

    @Override
    public SysUser saveData(SysUser object, boolean updateAuthorization) {
        ToolUtil.checkParams(object);
        // 用户名不能重复
        if (Validator.isNotEmpty(object.getUsername())) {
            QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("username", object.getUsername());
            if (object.getId() != null) {
                queryWrapper.ne("id", object.getId());
            }
            int count = getBaseMapper().selectCount(queryWrapper);
            if (count > 0) {
                throw new EasyException("已存在用户名为[" + object.getUsername() + "]的用户，请修改后重试！");
            }
        }
        // 新增时密码如果为空,则使用默认密码
        if (object.getId() == null && Validator.isEmpty(object.getPassword())) {
            // 生成随机的盐
            object.setSalt(RandomUtil.randomString(10));
            object.setPassword(PasswordUtil.generatingPasswords(SysConst.projectProperties.getDefaultPassword(), object.getSalt()));
        } else if (Validator.isNotEmpty(object.getPassword())) {
            // 生成随机的盐
            object.setSalt(RandomUtil.randomString(10));
            object.setPassword(PasswordUtil.generatingPasswords(object.getPassword(), object.getSalt()));
        }
        if (Validator.isEmpty(object.getNickname())) {
            object.setNickname(object.getUsername());
        }

        boolean isSuccess = saveOrUpdate(object);
        if (isSuccess && updateAuthorization) {
            sysUserRoleService.saveUserRole(object.getId(), object.getRoles());
            // 删除授权信息,下次请求资源重新授权
            RedisUtil.del(RedisPrefix.SHIRO_AUTHORIZATION + object.toString());
        }
        return (SysUser) ToolUtil.checkResult(isSuccess, object);
    }

    @Override
    public boolean resetPassword(String ids) {
        ToolUtil.checkParams(ids);
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        // 生成随机的盐
        String salt = RandomUtil.randomString(10);
        String password = PasswordUtil.generatingPasswords(SysConst.projectProperties.getDefaultPassword(), salt);
        queryWrapper.in("id", ids.split(CommonConst.SPLIT));
        return getBaseMapper().resetPassword(password, salt, queryWrapper) > 0;
    }

    @Override
    public boolean resetPassword(String username, String password) {
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        // 生成随机的盐
        String salt = RandomUtil.randomString(10);
        if (StrUtil.isBlank(password)) {
            password = PasswordUtil.generatingPasswords(SysConst.projectProperties.getDefaultPassword(), salt);
        } else {
            password = PasswordUtil.encryptedPasswords(password, salt);
        }
        queryWrapper.eq("username", username);
        return getBaseMapper().resetPassword(password, salt, queryWrapper) > 0;
    }

    @Override
    public boolean disableUser(String ids) {
        ToolUtil.checkParams(ids);
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("id", ids.split(CommonConst.SPLIT));
        int count = getBaseMapper().updateUserStatus(UserStatus.DISABLE.getCode(), queryWrapper);
        return ToolUtil.checkResult(count > 0);
    }

    @Override
    public boolean enableUser(String ids) {
        ToolUtil.checkParams(ids);
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("id", ids.split(CommonConst.SPLIT));
        int count = getBaseMapper().updateUserStatus(UserStatus.ENABLE.getCode(), queryWrapper);
        return ToolUtil.checkResult(count > 0);
    }

    @Override
    public SysUser getSysUserByUserName(String username) {
        if (Validator.isNotEmpty(username)) {
            QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("username", username);
            return getBaseMapper().selectOne(queryWrapper);
        }
        return null;
    }

    @Override
    public String getSysUserMailByUserName(String username) {
        if (Validator.isNotEmpty(username)) {
            QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
            queryWrapper.select("email");
            queryWrapper.eq("username", username);
            SysUser sysUser = getBaseMapper().selectOne(queryWrapper);
            if (sysUser != null) {
                return sysUser.getEmail();
            } else {
                return null;
            }
        }
        return null;
    }

    @Override
    public boolean updateUserLastLoginDate(Long userId) {
        SysUser sysUser = new SysUser();
        sysUser.setId(userId);
        sysUser.setLastLogin(new Date());
        return getBaseMapper().updateById(sysUser) > 0;
    }

    @Override
    public SysUser getCurrentUser() {
        SysUser sysUser = ShiroUtil.getCurrentUser();
        sysUser.setPassword(null);
        sysUser.setSalt(null);
        // 如果没有授权,从数据库查询权限
        if (sysUser.getPermissionList() == null) {
            sysUser = shiroService.queryUserPermissions(sysUser);
            ShiroUtil.setAttribute(SessionConst.USER_SESSION_KEY, sysUser);
        }
        return sysUser;
    }

    @Override
    public int countUser(String deptIds) {
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("dept_id", deptIds.split(CommonConst.SPLIT));
        return getBaseMapper().selectCount(queryWrapper);
    }

    @Override
    public boolean updateAvatar(String url) {
        UpdateWrapper<SysUser> updateWrapper = new UpdateWrapper<>();
        SysUser sysUser = ShiroUtil.getCurrentUser();
        updateWrapper.set("avatar", url);
        updateWrapper.eq("id", sysUser.getId());
        return update(updateWrapper);
    }

    @Override
    @Transactional(rollbackFor = RuntimeException.class)
    public boolean setUserMail(Long userId, String mail) {
        // 解绑该邮箱以前绑定的账号
        UpdateWrapper<SysUser> untyingMail = new UpdateWrapper<>();
        untyingMail.eq("email", mail);
        untyingMail.set("email", null);
        update(untyingMail);

        // 绑定新账号
        UpdateWrapper<SysUser> updateWrapper = new UpdateWrapper<>();
        updateWrapper.set("email", mail);
        updateWrapper.eq("id", userId);
        return update(updateWrapper);
    }
}
