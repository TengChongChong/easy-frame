package com.frame.easy.modular.sys.service.impl;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.frame.easy.exception.EasyException;
import com.frame.easy.modular.sys.model.SysUser;
import com.frame.easy.modular.sys.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.frame.easy.modular.sys.model.SysMailVerifies;
import com.frame.easy.modular.sys.dao.SysMailVerifiesMapper;
import com.frame.easy.modular.sys.service.SysMailVerifiesService;

import java.util.Date;

/**
 * 邮箱验证
 *
 * @author TengChong
 * @date 2019-03-24
 */
@Service
public class SysMailVerifiesServiceImpl extends ServiceImpl<SysMailVerifiesMapper, SysMailVerifies> implements SysMailVerifiesService {

    @Autowired
    private SysMailVerifiesMapper mapper;

    @Autowired
    private SysUserService sysUserService;


    @Override
    public boolean verifies(String code) {
        if (StrUtil.isNotBlank(code)) {
            QueryWrapper<SysMailVerifies> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("code", code);
            SysMailVerifies sysMailVerifies = getOne(queryWrapper);
            if (sysMailVerifies != null) {
                if (sysMailVerifies.getExpired().getTime() > System.currentTimeMillis()) {
                    // 校验码未过期
                    SysUser sysUser = sysUserService.input(sysMailVerifies.getUserId());
                    if (sysUser != null) {
                        // 更新用户表中的邮箱
                        if (sysUserService.setUserMail(sysUser.getId(), sysMailVerifies.getMail())) {
                            remove(queryWrapper);
                        } else {
                            throw new EasyException("更新用户信息失败，请重试");
                        }
                        return true;
                    } else {
                        remove(queryWrapper);
                        throw new EasyException("获取用户信息失败，请重新发送验证邮件");
                    }
                } else {
                    // 删除过期校验信息
                    remove(queryWrapper);
                    throw new EasyException("校验码已过期，请重新发送验证邮件");
                }
            }
        }
        throw new EasyException("校验码无效或已过期，请重新发送验证邮件");
    }

    @Override
    public SysMailVerifies save(Long userId, String email) {
        QueryWrapper<SysMailVerifies> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        remove(queryWrapper);
        SysMailVerifies sysMailVerifies = new SysMailVerifies();
        sysMailVerifies.setUserId(userId);
        sysMailVerifies.setMail(email);
        sysMailVerifies.setExpired(DateUtil.offsetDay(new Date(), 1));
        sysMailVerifies.setCode(RandomUtil.randomString(255));
        save(sysMailVerifies);
        return sysMailVerifies;
    }
}